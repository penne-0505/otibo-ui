import { defineRecipe } from "@pandacss/dev"

/**
 * Separator recipe — section/inline の hairline 区切り(構造のみ、in-grain)。
 *
 * grammar 上の位置:純構造の primitive(色なし、hairline=border.subtle だけ)。otibo はこれまで
 * 各 component 内で hairline を使ってきたが(menu の divider、accordion の項目間、table の行間)
 * 公開 API としての Separator は無かった ── その空白を埋める。a11y(role="separator")は Base UI。
 *
 * **余白は持たない**(置く側=layout が決める)。区切りは要素間関係の表現なので、separator 単体に
 * margin を bake すると流用が利かない。
 */
export const separatorRecipe = defineRecipe({
  className: "otibo-separator",
  jsx: ["Separator"],
  base: {
    bg: "border.subtle",
    border: "none",
    flexShrink: "0",
  },
  variants: {
    orientation: {
      horizontal: {
        height: "1px",
        width: "100%",
      },
      vertical: {
        width: "1px",
        // inline で使うとき自然に文字行の高さに合うよう em で。
        height: "1em",
        alignSelf: "center",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})
