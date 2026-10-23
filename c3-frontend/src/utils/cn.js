import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge conditional CSS class names cleanly and
 * properly resolve conflicting Tailwind CSS classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

