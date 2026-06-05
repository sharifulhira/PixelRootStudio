import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
