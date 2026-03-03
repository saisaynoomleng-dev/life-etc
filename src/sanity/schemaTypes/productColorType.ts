import { IoMdColorPalette } from 'react-icons/io';
import { defineField, defineType } from 'sanity';
import { defaultSlugify } from './components/defaultSlugify';

export const productColorType = defineType({
  name: 'productColor',
  icon: IoMdColorPalette,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Color Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.name}-product-color`,
        slugify: defaultSlugify,
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
