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
 *   - _disabled:opacity 一括(grammar §Disabled As Quiet Surface)
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
    // otibo_ds パターン:input bg は surface(白)に置き、page 側の bg が
    // 暗いことで「白い紙が暗いページに沈んでいる」構図を作る。凹みは
    // bg-color の差ではなく shadow が担う(field shadow 参照)。
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
    // hover ── inset を弱めて浮き上がる feedback。focus が source order で勝つよう前に置く。
    "&:hover:not(:disabled):not(:focus)": {
      boxShadow: "field.hover",
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
      opacity: "disabled",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        paddingInline: "3",
        paddingBlock: "1.5",
      },
      md: {
        fontSize: "md",
        paddingInline: "4",
        paddingBlock: "2",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
