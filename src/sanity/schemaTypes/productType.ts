import { generateSKU } from '@/lib/utils';
import { FaTshirt } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';
import { defaultSlugify } from './components/defaultSlugify';
import { formatPrice, formatTitle } from '@/lib/formatters';

export const productType = defineType({
  name: 'product',
  title: 'Products',
  icon: FaTshirt,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      initialValue: generateSKU(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.name}-${doc.sku}`,
        slugify: defaultSlugify,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'basePrice',
      title: 'Product Price',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availableColor',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'productColor' }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Product Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImages',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'blockImage' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'numberInStock',
      title: 'Number In Stock',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured Product',
      type: 'boolean',
      validation: (rule) => rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Product Description',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      price: 'basePrice',
      image: 'mainImages.0.asset',
      numberInStock: 'numberInStock',
    },
    prepare({ name, price, image, numberInStock }) {
      const nameFormatted = name ? formatTitle(name) : 'name not provided';
      const priceFormatted = price ? formatPrice(price) : 'price not provided';

      return {
        title: nameFormatted,
        subtitle: `Price: ${priceFormatted} | In Stock: ${numberInStock}`,
        media: image || FaTshirt,
      };
    },
  },
});
