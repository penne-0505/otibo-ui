import { defineRecipe } from "@pandacss/dev"

/**
 * Aside recipe ─ 本文の脇に並走する補足。
 *
 * Callout(背景持ちの箱)との違いは「背景なし、左の縦線だけ」。書類風の脇注。
 * 本文と同じ baseline で読ませる ─ 読者は寄り道できる、ただし戻れる。
 *
 * tone:
 *   default = 線も文字も muted。最も静か。
 *   accent  = 左線が accent。「ここから本題に絡む」合図。
 */
export const asideRecipe = defineRecipe({
  className: "otibo-aside",
  jsx: ["Aside"],
  base: {
    paddingLeft: "5",
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderColor: "border",
    color: "fg.secondary",
    fontFamily: "body",
    fontSize: "base", // 16px ─ 本文 18px より一段小さい
    lineHeight: "body",
    maxWidth: "prose",
    margin: "0",
  },
  variants: {
    tone: {
      default: { borderColor: "border", color: "fg.secondary" },
      accent: { borderColor: "accent", color: "fg.secondary" },
      muted: { borderColor: "border.subtle", color: "fg.muted" },
    },
  },
  defaultVariants: {
    tone: "default",
  },
})
