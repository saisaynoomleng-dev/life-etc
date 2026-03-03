import type { SlugifierFn } from 'sanity';

export const defaultSlugify: SlugifierFn = (input) =>
  input
    .toLowerCase()
    .replace(/^\w\s-/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
