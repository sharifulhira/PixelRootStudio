import { defineField, defineType } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Project Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      description: 'Short description for project cards and SEO meta description.',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Project Details',
      description: 'Rich text content with images, headings, lists, and more.',
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Gallery',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'team',
      type: 'array',
      title: 'Team Members',
      description: 'Team members who worked on this project.',
      of: [{ type: 'reference', to: [{ type: 'team' }] }],
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'Project Date',
    }),
    defineField({
      name: 'client',
      type: 'string',
      title: 'Client Name',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured on Homepage',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO Overrides',
      description: 'Leave blank to use auto-generated values from title and summary.',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', title: 'Meta Title' }),
        defineField({ name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 3 }),
      ],
    }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
      media: 'coverImage',
      date: 'date',
    },
    prepare({ title, category, media, date }) {
      return {
        title,
        subtitle: [category, date].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
