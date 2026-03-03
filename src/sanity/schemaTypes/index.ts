import { type SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './components/blockContentType';
import { blockImageType } from './components/blockImageType';
import { productColorType } from './productColorType';
import { productCategoryType } from './productCategoryType';
import { productType } from './productType';
import { journalCategory } from './journalCategory';
import { journalType } from './journalType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    blockImageType,
    productColorType,
    productCategoryType,
    productType,
    journalCategory,
    journalType,
  ],
};
