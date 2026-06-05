import { defineRecipe } from "@pandacss/dev"

/**
 * Input recipe.
 *
 * Affordance を border ではなく inset shadow で示す(grammar audit 確定方針)。
 * input は「受け皿」として読まれる必要があるため、surface に薄い inset shadow
 * を焼き込んで、focus / error 時に強度を上げる三段構成。
 *
 * Variants:
 *   - size: sm / md
 *
 * State:
 *   - _focus / _focusVisible:focused affordance(inset shadow が濃くなる)
 *   - _disabled:opacity 一括(disabled 専用 token は別フェーズで判断)
 *   - aria-invalid="true":error affordance(inset shadow が赤系に)
 */
export const inputRecipe = defineRecipe({
  className: "otibo-input",
  base: {
    display: "block",
    width: "100%",
    fontFamily: "body",
    fontWeight: "regular",
    lineHeight: "tight",
    letterSpacing: "normal",
    color: "fg",
    bg: "surface",
    border: "none",
    borderRadius: "sm",
    outline: "none",
    boxShadow: "field",
    transitionProperty: "box-shadow, background-color",
    transitionDuration: "quick",
    transitionTimingFunction: "standard",
    appearance: "none",
    _placeholder: {
      color: "fg.subtle",
    },
    _focus: {
      boxShadow: "field.focus",
    },
    _focusVisible: {
      boxShadow: "field.focus",
    },
    "&[aria-invalid='true']": {
      boxShadow: "field.error",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.55,
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        paddingInline: "3",
        paddingBlock: "1.5",
        minHeight: "8",
      },
      md: {
        fontSize: "md",
        paddingInline: "4",
        paddingBlock: "2",
        minHeight: "10",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
