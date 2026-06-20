import { defineRecipe } from "@pandacss/dev"

/**
 * Link recipe — テキストリンク(styled anchor)。
 *
 * grammar 上の位置(treatment B):**平常は fg + 控えめな下線、hover/focus で accent**。下線が
 * 「リンクである」affordance を常時担い(色に依存しない a11y)、accent は interaction の時だけ
 * precious に出す。otibo の「accent は撒かない」と整合 ── prose にリンクが増えても青が散らない。
 * color layering 的にも neutral 地の上の前景色変化(単一アクセント側)で安全。
 *
 * 色は明示(fg)だが font は inherit(inline で周囲の文に馴染ませる)。
 */
export const linkRecipe = defineRecipe({
  className: "otibo-link",
  jsx: ["Link"],
  base: {
    color: "fg",
    textDecorationLine: "underline",
    // 平常の下線は控えめ(fg を薄めた線)。hover で accent に立ち上がる。
    textDecorationColor: "color-mix(in oklch, {colors.fg} 35%, transparent)",
    textUnderlineOffset: "0.18em",
    textDecorationThickness: "1px",
    borderRadius: "xs",
    cursor: "pointer",
    transitionProperty: "color, text-decoration-color",
    transitionDuration: "quick",
    transitionTimingFunction: "standard",
    _hover: {
      color: "accent",
      textDecorationColor: "{colors.accent}",
    },
    _focusVisible: {
      color: "accent",
      outline: "2px solid {colors.accent}",
      outlineOffset: "2px",
    },
  },
})
