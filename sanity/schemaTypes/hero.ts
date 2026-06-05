import { defineField, defineType } from 'sanity';

export const heroType = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({ name: 'badge', type: 'string', title: 'Badge' }),
    defineField({ name: 'headline', type: 'array', title: 'Headline', of: [{ type: 'string' }] }),
    defineField({ name: 'subheadline', type: 'text', title: 'Subheadline' }),
    defineField({
      name: 'cta',
      title: 'Call to Actions',
      type: 'object',
      fields: [
        defineField({ name: 'primary', type: 'object', fields: [{name: 'label', type: 'string'}, {name: 'href', type: 'string'}] }),
        defineField({ name: 'secondary', type: 'object', fields: [{name: 'label', type: 'string'}, {name: 'href', type: 'string'}] }),
      ]
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'object', fields: [{name: 'value', type: 'string'}, {name: 'label', type: 'string'}] }]
    }),
    defineField({ name: 'services', type: 'array', of: [{ type: 'string' }], title: 'Services' }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
    }),
  ],
});
