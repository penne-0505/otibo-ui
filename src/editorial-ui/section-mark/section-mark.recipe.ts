import { defineSlotRecipe } from "@pandacss/dev"

/**
 * SectionMark slot recipe ─ 章番号 + 短い罫線 + 章名(eyebrow 風)。
 *
 * 章の頭に置く印。番号は数字単独で organic に置きたいので「03」のような 2 桁ゼロ詰めの
 * 文字列を caller が渡す前提(prop で number を渡すが、表示は意図的に文字列スルー)。
 *
 * align は left / center / right。center は Hero 直下や interstitial で。
 *   ・left は本文章の頭に置く時の default。
 *   ・center は scroll-linked で「画面が一拍止まる」場所に。
 */
export const sectionMarkRecipe = defineSlotRecipe({
  className: "otibo-section-mark",
  slots: ["root", "number", "rule", "title"],
  jsx: ["SectionMark"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "3",
      color: "fg.muted",
    },
    number: {
      fontFamily: "mono",
      fontSize: "sm",
      fontWeight: "regular",
      letterSpacing: "wide",
      lineHeight: "tight",
      // 数字は意図的に mono ─ 章の「目次性」を匂わせる。色は fg.muted で控えめに。
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
    },
    rule: {
      width: "10",
      height: "1px",
      bg: "border.strong",
      flexShrink: "0",
    },
    title: {
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      letterSpacing: "eyebrow",
      textTransform: "uppercase",
      lineHeight: "tight",
      color: "fg.strong",
    },
  },
  variants: {
    align: {
      left: { root: { justifyContent: "flex-start" } },
      center: { root: { justifyContent: "center" } },
      right: { root: { justifyContent: "flex-end" } },
    },
  },
  defaultVariants: {
    align: "left",
  },
})
