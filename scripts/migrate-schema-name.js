require('dotenv').config();
const { createClient } = require('@sanity/client');
const parseArgs = require('./parse-args');

const GENERIC_ERROR =
  "\nPlease provide 'oldType', 'newType' and 'dataset'.\nexample execution: node migrate-schema-name.js -- --oldType post --newType article --dataset staging";
const TYPE_GENERIC_ERROR =
  '\n1) If your trying to run this before deployment, first run "npm run deploy" and then do it again.\n2) If your schema never had a document, just create one, run this script and delete it later.';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const token = process.env.SANITY_STUDIO_ADMIN_SCRIPTS_TOKEN;
const { oldType, newType, dataset } = parseArgs();
const apiVersion = '2023-06-11';

const client = createClient({
  apiVersion,
  projectId,
  dataset,
  token,
  useCdn: false,
});

const OLD_TYPE = oldType;
const NEW_TYPE = newType;

const fetchDocuments = () =>
  client.fetch(
    `*[_type == $oldType][0...10] {..., "incomingReferences": *[references(^._id)]{...}}`,
    { oldType: OLD_TYPE }
  );

const buildMutations = (docs) => {
  const mutations = [];

  docs.forEach((doc) => {
    console.log(oldType, doc._id);
    // Updating an document _type field isn't allowed, we have to create a new and delete the old
    const newDocId = `${doc._id}-migrated-from-${OLD_TYPE}`;
    const newDocument = { ...doc, ...{ _id: newDocId, _type: NEW_TYPE } };
    delete newDocument.incomingReferences;
    delete newDocument._rev;

    mutations.push({ create: newDocument });
    if (!doc.incomingReferences) {
      return;
    }
    // Patch each of the incoming references
    doc.incomingReferences.forEach((referencingDocument) => {
      console.log('ref', referencingDocument._id);
      // ⚠️ We're assuming the field is named the same as the type!
      // There might be another structure involved, perhaps an array, that needs patching
      const updatedReference = {
        [NEW_TYPE]: {
          _ref: newDocId,
          _type: 'reference',
        },
      };
      mutations.push({
        id: referencingDocument._id,
        patch: {
          set: updatedReference,
          unset: [OLD_TYPE],
          ifRevisionID: referencingDocument._rev,
        },
      });
    });

    // Apply the delete mutation after references have been changed
    mutations.push({ delete: doc._id });
  });
  return mutations.filter(Boolean);
};

const createTransaction = (mutations) => {
  return mutations.reduce((tx, mutation) => {
    if (mutation.patch) {
      return tx.patch(mutation.id, mutation.patch);
    }
    if (mutation.delete) {
      return tx.delete(mutation.delete);
    }
    if (mutation.create) {
      return tx.createIfNotExists(mutation.create);
    }
  }, client.transaction());
};

const migrateNextBatch = async () => {
  const documents = await fetchDocuments();
  if (documents.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }
  const mutations = buildMutations(documents);
  const transaction = createTransaction(mutations);
  await transaction.commit();
  return migrateNextBatch();
};

const inputIsValid = async () => {
  if (!dataset) {
    console.log(GENERIC_ERROR);
    return false;
  }
  const types = await client.fetch('array::unique(*._type)');
  if (!OLD_TYPE || !NEW_TYPE) {
    console.log(GENERIC_ERROR);
    return false;
  }

  if (!types.includes(OLD_TYPE)) {
    console.log(
      `oldType: ${OLD_TYPE} is not a valid type found on Sanity Studio. ${TYPE_GENERIC_ERROR}`
    );
    return false;
  }

  if (!types.includes(NEW_TYPE)) {
    console.log(
      `newType: ${NEW_TYPE} is not a valid type found on Sanity Studio. ${TYPE_GENERIC_ERROR}`
    );
    return false;
  }
  return true;
};
(async () => {
  if (await inputIsValid()) {
    migrateNextBatch().catch((err) => {
      console.error(JSON.stringify(err, null, 2));
      process.exit(1);
    });
  }
})();
