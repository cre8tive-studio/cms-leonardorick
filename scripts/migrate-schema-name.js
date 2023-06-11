require('dotenv').config()
const {createClient} = require('@sanity/client')
const parseArgs = require('./parse-args')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const token = process.env.SANITY_STUDIO_ADMIN_SCRIPTS_TOKEN
const {oldType, newType, dataset} = parseArgs()

const apiVersion = '2023-06-11'

const client = createClient({
  apiVersion,
  projectId,
  dataset,
  token,
  useCdn: false,
})

const OLD_TYPE = oldType
const NEW_TYPE = newType

const fetchDocuments = () =>
  client.fetch(
    `*[_type == $oldType][0...10] {..., "incomingReferences": *[references(^._id)]{...}}`,
    {oldType: OLD_TYPE}
  )

const buildMutations = (docs) => {
  const mutations = []

  docs.forEach((doc) => {
    console.log(oldType, doc._id)
    // Updating an document _type field isn't allowed, we have to create a new and delete the old
    const newDocId = `${doc._id}-migrated-from-${OLD_TYPE}`
    const newDocument = {...doc, ...{_id: newDocId, _type: NEW_TYPE}}
    delete newDocument.incomingReferences
    delete newDocument._rev

    mutations.push({create: newDocument})
    if (!doc.incomingReferences) {
      return
    }
    // Patch each of the incoming references
    doc.incomingReferences.forEach((referencingDocument) => {
      console.log('ref', referencingDocument._id)
      // ⚠️ We're assuming the field is named the same as the type!
      // There might be another structure involved, perhaps an array, that needs patching
      const updatedReference = {
        [NEW_TYPE]: {
          _ref: newDocId,
          _type: 'reference',
        },
      }
      mutations.push({
        id: referencingDocument._id,
        patch: {
          set: updatedReference,
          unset: [OLD_TYPE],
          ifRevisionID: referencingDocument._rev,
        },
      })
    })

    // Apply the delete mutation after references have been changed
    mutations.push({delete: doc._id})
  })
  return mutations.filter(Boolean)
}

const createTransaction = (mutations) => {
  return mutations.reduce((tx, mutation) => {
    if (mutation.patch) {
      return tx.patch(mutation.id, mutation.patch)
    }
    if (mutation.delete) {
      return tx.delete(mutation.delete)
    }
    if (mutation.create) {
      return tx.createIfNotExists(mutation.create)
    }
  }, client.transaction())
}

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  if (documents.length === 0) {
    console.log('No more documents to migrate!')
    return null
  }
  const mutations = buildMutations(documents)
  const transaction = createTransaction(mutations)
  await transaction.commit()
  return migrateNextBatch()
}

;(async () => {
  // todo fecth schema names  and compare with oldType and newType. If they don't exist, thorow error
  if (!OLD_TYPE || !NEW_TYPE || !dataset) {
    // finish node application
    console.log('Please provide oldType and newType and dataset.')
    console.log(
      'example execution: node migrate-schema-name.js --oldType post --newType article --dataset=production'
    )
    process.exit(1)
  }
  migrateNextBatch().catch((err) => {
    console.error(JSON.stringify(err, null, 2))
    process.exit(1)
  })
})()
