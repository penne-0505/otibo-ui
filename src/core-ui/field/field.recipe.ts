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
      // error state という affordance 表現の専用 token を参照する。
      // grammar §Danger Is A State, Not A Semantic Family 参照。
      //
      // weight は description(regular)より一段上げて medium。同じ sm size /
      // snug lineHeight の中で「これは error、これは description」を icon に
      // 頼らず typography で disambiguate する(grammar §Danger Is A State の
      // 「彩度で訴える代わりに配置と文言で伝える」を weight 軸に拡張)。
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "snug",
      color: "danger",
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
