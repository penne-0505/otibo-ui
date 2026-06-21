import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Callout slot recipe ─ 本文の流れに割り込む箱。
 *
 * Aside(本文の脇、背景なし)との対比。Callout は本文を一度止めて
 * 「ここを見てくれ」と告げる箱 ─ 補足ではなく強調。tone は default / accent。
 *
 * 構造:
 *   <Callout>
 *     <Callout.Title>タイトル(任意)</Callout.Title>
 *     <Callout.Body>本文</Callout.Body>
 *   </Callout>
 *
 * 影は持たない ─ 紙面の「枠」であって浮かせない(figure と差別化)。
 */
export const calloutRecipe = defineSlotRecipe({
  className: "otibo-callout",
  slots: ["root", "title", "body"],
  jsx: ["Callout"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "2",
      padding: "5",
      borderRadius: "md",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "border",
      bg: "surface.muted",
      maxWidth: "prose",
    },
    title: {
      fontFamily: "body",
      fontWeight: "semibold",
      fontSize: "base",
      lineHeight: "tight",
      color: "fg.strong",
      margin: "0",
    },
    body: {
      fontFamily: "body",
      fontSize: "base",
      lineHeight: "body",
      color: "fg.secondary",
      margin: "0",
    },
  },
  variants: {
    tone: {
      default: {},
      accent: {
        root: {
          borderColor: "accent",
          bg: "accent.muted",
        },
        title: { color: "accent" },
      },
      muted: {
        root: { borderColor: "border.subtle", bg: "bg.subtle" },
        title: { color: "fg.secondary" },
      },
    },
  },
  defaultVariants: {
    tone: "default",
  },
})
