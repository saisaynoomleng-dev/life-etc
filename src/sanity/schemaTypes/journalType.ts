import { FaNewspaper } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';
import { defaultSlugify } from './components/defaultSlugify';
import { formatDate, formatTitle } from '@/lib/formatters';

export const journalType = defineType({
  name: 'journal',
  title: 'Journals',
  type: 'document',
  icon: FaNewspaper,
  fields: [
    defineField({
      name: 'name',
      title: 'Journal Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.name}-journal`,
        slugify: defaultSlugify,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Title',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Journal Cover Photo',
      type: 'blockImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'minRead',
      title: 'Duration',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Journal Category',
      type: 'reference',
      to: [{ type: 'journalCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      category: 'category.name',
      publishedDate: 'publishedAt',
      image: 'mainImage',
    },
    prepare({ name, category, publishedDate, image }) {
      const nameFormatted = name ? formatTitle(name) : 'Title not provided';
      const publish = publishedDate
        ? formatDate(publishedDate)
        : 'No published date';

      return {
        title: nameFormatted,
        subtitle: `Published: ${publish} || Category: ${category}`,
        media: image || FaNewspaper,
      };
    },
  },
});
