// Utility for conditional class name building

type ClassValue = string | boolean | null | undefined;

/**
 * Combines class names, filtering out falsy values.
 *
 * @example
 * cn('base', isActive && 'active', disabled && 'disabled')
 * // => 'base active' (if isActive is true, disabled is false)
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
