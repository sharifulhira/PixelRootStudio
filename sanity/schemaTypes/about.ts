import { defineField, defineType } from 'sanity';

export const aboutType = defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'shortName', type: 'string', title: 'Short Name' }),
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'tagline', type: 'string', title: 'Tagline' }),
    defineField({ name: 'bio', type: 'array', title: 'Bio', of: [{ type: 'text' }] }),
    defineField({ name: 'vision', type: 'text', title: 'Vision' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'object', fields: [{name: 'value', type: 'string'}, {name: 'label', type: 'string'}] }]
    }),
    defineField({ name: 'skills', type: 'array', title: 'Skills', of: [{ type: 'string' }] }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [{ type: 'object', fields: [{name: 'company', type: 'string'}, {name: 'role', type: 'string'}, {name: 'period', type: 'string'}] }]
    }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'bannerImage', type: 'image', title: 'Banner Image', options: { hotspot: true } }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({ name: 'phones', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'emails', type: 'array', of: [{ type: 'string' }] })
      ]
    }),
  ],
});
