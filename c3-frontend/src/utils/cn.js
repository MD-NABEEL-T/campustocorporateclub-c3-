/**
 * Utility function to merge conditional CSS class names cleanly.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
