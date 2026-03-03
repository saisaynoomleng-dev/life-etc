import { MdCategory } from 'react-icons/md';
import { defineField, defineType } from 'sanity';
import { defaultSlugify } from './components/defaultSlugify';

export const journalCategory = defineType({
  name: 'journalCategory',
  title: 'Journal Categories',
  type: 'document',
  icon: MdCategory,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.name}-journal-category`,
        slugify: defaultSlugify,
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
