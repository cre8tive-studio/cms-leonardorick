import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      text: 'text',
    },
    prepare({ title, text }) {
      return {
        title,
        subtitle: text[0].value,
      };
    },
  },
});
