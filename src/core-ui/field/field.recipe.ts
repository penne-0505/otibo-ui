import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Field slot recipe.
 *
 * Field は Label / Control(Input)/ Description / Error を「同じ作業単位」
 * として束ねる Internal boundary。Base UI Field primitive を経由することで
 * aria-labelledby / aria-describedby / aria-invalid を自動配線する。
 *
 * Variants:
 *   - density: comfortable(default) / compact
 *     compact は Settings sheet 等の dense surface 用に gap を詰める。
 */
export const fieldRecipe = defineSlotRecipe({
  className: "otibo-field",
  slots: ["root", "label", "description", "error"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5",
    },
    label: {
      fontSize: "base",
      fontWeight: "medium",
      lineHeight: "snug",
      color: "fg.strong",
      letterSpacing: "normal",
    },
    description: {
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
      letterSpacing: "normal",
    },
    error: {
      // destructive 専用 token は token 第一原理導出フェーズで確定する。
      // 暫定で hardcode のwarm red。
      fontSize: "sm",
      lineHeight: "snug",
      color: "oklch(0.58 0.13 30)",
      letterSpacing: "normal",
    },
  },
  variants: {
    density: {
      comfortable: {
        root: { gap: "1.5" },
      },
      compact: {
        root: { gap: "1" },
      },
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
})
