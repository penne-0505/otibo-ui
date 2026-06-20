import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Table slot recipe — データ表示の表。Base UI に Table は無いので native の table 要素を styled する。
 *
 * grammar 上の位置:色を使わず、**hairline(border.subtle)・余白・タイポgrafi**だけで構造を語る、
 * otibo が最も得意な純構造 component。zebra 縞や太枠は持たない(restraint)。行 hover にだけ
 * quiet な surface.muted を敷く(色でなく明度差の feedback)。header は fg.muted の小さな見出し。
 *
 * Card 内での収まり:端の cell は paddingInline を落として表を card 本文の縁に揃える(title と
 * 左端が揃う)。これで行 hover の塗りも card 幅いっぱいに伸びる。
 *
 * Slots: root(table)/ row(tr)/ head(th)/ cell(td)。thead/tbody は素の要素で描く(row の
 * hover/最終行は `tbody &` で scope)。
 */
export const tableRecipe = defineSlotRecipe({
  className: "otibo-table",
  jsx: ["Table"],
  slots: ["root", "row", "head", "cell"],
  base: {
    root: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "body",
      textAlign: "start",
    },
    row: {
      // 行間は uniform な hairline。
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "border.subtle",
      // body 行だけ quiet な hover(明度差)。header 行(thead 内)には掛けない。
      "tbody &": {
        transitionProperty: "background-color",
        transitionDuration: "quick",
        transitionTimingFunction: "standard",
      },
      "tbody &:hover": { bg: "surface.muted" },
      // 最終 body 行の trailing hairline は引かない(浮いた下線に見えるため)。
      "tbody &:last-of-type": { borderBottomWidth: "0" },
    },
    head: {
      textAlign: "start",
      paddingInline: "3",
      paddingBlock: "2",
      fontSize: "xs",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "wide",
      color: "fg.muted",
      whiteSpace: "nowrap",
      // 表を card 本文の縁に揃える。
      "&:first-of-type": { paddingInlineStart: "0" },
      "&:last-of-type": { paddingInlineEnd: "0" },
    },
    cell: {
      paddingInline: "3",
      paddingBlock: "3",
      fontSize: "sm",
      lineHeight: "tight",
      color: "fg",
      verticalAlign: "middle",
      "&:first-of-type": { paddingInlineStart: "0" },
      "&:last-of-type": { paddingInlineEnd: "0" },
    },
  },
})
