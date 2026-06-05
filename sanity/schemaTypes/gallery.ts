import { defineField, defineType } from 'sanity';

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'category', type: 'string', title: 'Category' }),
    defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
    defineField({ name: 'src', type: 'image', title: 'Image Source', options: { hotspot: true } }),
    defineField({
      name: 'aspect',
      type: 'string',
      title: 'Aspect Ratio',
      options: { list: ['portrait', 'landscape', 'square'] },
      initialValue: 'portrait'
    }),
  ],
});
