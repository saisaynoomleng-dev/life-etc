import { MdCategory } from 'react-icons/md';
import { defineField, defineType } from 'sanity';
import { defaultSlugify } from './components/defaultSlugify';

export const productCategoryType = defineType({
  name: 'productCategory',
  title: 'Product Categories',
  icon: MdCategory,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.name}-product-category`,
        slugify: defaultSlugify,
      },
    }),
  ],
});
