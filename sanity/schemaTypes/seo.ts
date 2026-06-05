import { defineField, defineType } from 'sanity';

export const seoType = defineType({
  name: 'seo',
  title: 'Global SEO Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string', title: 'Site Name' }),
    defineField({ name: 'siteUrl', type: 'url', title: 'Site URL' }),
    defineField({ name: 'title', type: 'string', title: 'Home Page Title' }),
    defineField({ name: 'description', type: 'text', title: 'Home Page Description' }),
    defineField({ name: 'locale', type: 'string', title: 'Locale', initialValue: 'en_US' }),
    defineField({ name: 'twitterHandle', type: 'string', title: 'Twitter Handle' }),
    defineField({ name: 'keywords', type: 'array', title: 'Keywords', of: [{ type: 'string' }] }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'object',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Organization Name' }),
        defineField({ name: 'email', type: 'string', title: 'Email' }),
        defineField({ name: 'telephone', type: 'string', title: 'Telephone' })
      ]
    }),
  ],
});
