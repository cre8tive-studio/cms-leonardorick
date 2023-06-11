import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'peroson'},
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'blockContent',
    }),
  ],
})
