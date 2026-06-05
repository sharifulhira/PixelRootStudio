import { defineField, defineType } from 'sanity';

export const teamType = defineType({
  name: 'team',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'role', type: 'string', title: 'Role' }),
    defineField({ name: 'bio', type: 'text', title: 'Bio' }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'isFounder', type: 'boolean', title: 'Is Founder', initialValue: false }),
  ],
});
