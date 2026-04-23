/**
 * Converts camelCase identifiers to kebab-case for CSS classes.
 * Examples: `richTextBlock` → `rich-text-block`, `whatWeDoCards` →
 * `what-we-do-cards`, `hero` → `hero`, `imageBlock` → `image-block`.
 */
export function camelCaseToKebabCase(value: string): string {
  return value
    .replace(/[\s_]+/g, "-")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
