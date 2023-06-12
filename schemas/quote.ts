import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'person' },
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      media: 'author.image',
      title: 'author.name',
      text: 'text',
    },
    prepare({ title, text, media }) {
      return {
        title,
        subtitle: text[0].value,
        media,
      };
    },
  },
});
