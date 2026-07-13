/** Public typography roles backed by the named textStyles in `text-styles.ts`. */
export type TypographyRole =
  | "display"
  | "heading"
  | "heading.sm"
  | "heading.md"
  | "heading.lg"
  | "body"
  | "eyebrow"
  | "caption"

/**
 * Returns the stable class emitted for an otibo typography role.
 *
 * Consumer-side Panda is intentionally not required. The class definitions are
 * included in `@otibo/ui/styles.css`.
 */
export function textStyle(role: TypographyRole): string {
  return `textStyle_${role}`
}
