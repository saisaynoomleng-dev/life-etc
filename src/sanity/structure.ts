import { FaNewspaper, FaTshirt } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';
import { MdCategory } from 'react-icons/md';
import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Life Etc by Haru Commerce')
    .items([
      S.divider().title('Operation'),
      S.documentTypeListItem('product').title('Products').icon(FaTshirt),
      S.documentTypeListItem('productColor')
        .title('Product Colors')
        .icon(IoMdColorPalette),
      S.documentTypeListItem('productCategory')
        .title('Product Categories')
        .icon(MdCategory),
      S.documentTypeListItem('journal').title('Journals').icon(FaNewspaper),
      S.documentTypeListItem('journalCategory')
        .title('Journal Categories')
        .icon(MdCategory),
    ]);
