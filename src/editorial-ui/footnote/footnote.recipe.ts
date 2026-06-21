import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Footnote slot recipe ─ ページ末尾の番号付き注。
 *
 * 構造:
 *   <Footnote>
 *     <Footnote.Item index="1">注 1 の本文</Footnote.Item>
 *     <Footnote.Item index="2">注 2 の本文</Footnote.Item>
 *   </Footnote>
 *
 * 本文より小さく、上に hairline を持つ。番号は monospaced で baseline 揃え。
 * editorial の終わりに置く ─ 「読み終わってここに来る」場所。
 */
export const footnoteRecipe = defineSlotRecipe({
  className: "otibo-footnote",
  slots: ["root", "item", "marker", "body"],
  jsx: ["Footnote"],
  base: {
    root: {
      paddingTop: "5",
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderColor: "border.subtle",
      display: "flex",
      flexDirection: "column",
      gap: "2",
      fontFamily: "body",
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
      maxWidth: "prose",
    },
    item: {
      display: "flex",
      alignItems: "baseline",
      gap: "3",
      margin: "0",
    },
    marker: {
      fontFamily: "mono",
      fontSize: "xs",
      letterSpacing: "wide",
      color: "fg.subtle",
      fontVariantNumeric: "tabular-nums",
      flexShrink: "0",
      // 番号は上付きで「注」感を出す ─ ただしやり過ぎない。
      lineHeight: "1",
      paddingTop: "0.5",
    },
    body: {
      margin: "0",
      flex: "1",
    },
  },
})
