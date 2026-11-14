/**
 * Joins conditional class names. Intentionally small: the library only needs
 * string composition and should not depend on a utility package for it.
 */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
