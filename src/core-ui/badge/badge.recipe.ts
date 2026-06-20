import { defineRecipe } from "@pandacss/dev"

/**
 * Badge recipe.
 *
 * grammar 上の位置:小さな identity / metadata チップ。badge は CTA ではないため、
 * 塗りつぶし(アテンション誘導が過剰)を避け、**透明背景 + 1px の細線 + tone テキスト**
 * で軽く示す(「細めで軽やかな線」「accent は precious / 彩度で叫ばない」と整合)。
 *
 * tone は accent / neutral / danger のみ(semantic family は作らない)。
 * 線色:accent / danger は token から color-mix(40%)で派生 → token 変更に追従。
 *       neutral は border token。
 */
export const badgeRecipe = defineRecipe({
  className: "otibo-badge",
  jsx: ["Badge"],
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "1",
    fontFamily: "body",
    fontSize: "xs",
    fontWeight: "medium",
    lineHeight: "tight",
    letterSpacing: "normal",
    // 文字と細線が接して見えないよう padding に余裕を持たせる(縦が詰まりやすい)。
    // token scale に無い中間値のため literal。
    paddingInline: "0.5625rem",
    paddingBlock: "0.1875rem",
    // ピルにせず「角丸の小さな札」に留める(token xs 0.25 と sm 0.5 の中間)。
    borderRadius: "0.375rem",
    whiteSpace: "nowrap",
    bg: "transparent",
  },
  variants: {
    tone: {
      accent: {
        color: "accent",
        boxShadow: "inset 0 0 0 1px color-mix(in oklch, {colors.accent} 40%, transparent)",
      },
      neutral: {
        color: "fg.secondary",
        boxShadow: "inset 0 0 0 1px {colors.border}",
      },
      // danger も塗らず線で(form callout の塗り tint とは役割が違う=ここは identity)
      danger: {
        color: "danger",
        boxShadow: "inset 0 0 0 1px color-mix(in oklch, {colors.danger} 40%, transparent)",
      },
    },
  },
  defaultVariants: {
    tone: "accent",
  },
})
