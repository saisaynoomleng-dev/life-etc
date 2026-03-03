import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSKU = () => {
  return `${Math.random().toString(36).slice(2).toUpperCase()}`;
};
