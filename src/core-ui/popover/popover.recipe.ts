import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Popover slot recipe.
 *
 * grammar 上の位置:click で開く、補足情報や軽い操作を載せる浮く面。
 * Tooltip の transient chip と違い、明るい raised surface(紙が一枚浮く)。
 * 輪郭は lift shadow のみで定義する(枠線は持たない)。矢印も持たない。
 *
 * Slots:
 *   - popup: 浮く本体(Base UI Popover.Popup)
 *   - title: 見出し
 *   - description: 補足文
 */
export const popoverRecipe = defineSlotRecipe({
  className: "otibo-popover",
  jsx: ["Popover"],
  slots: ["popup", "title", "description"],
  base: {
    popup: {
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      fontSize: "base",
      lineHeight: "body",
      padding: "5",
      borderRadius: "lg",
      boxShadow: "lift",
      maxWidth: "20rem",
      outline: "none",
      // popover も snap が残った:title+本文でも一つの焦点ブロックとして読まれ、select の
      // list ほど attention が散らないため、instant-opacity でも scale settle が焦点に乗る。
      // よって tooltip と同じく scale を捨て opacity フェードのみに(snap は構造的に起きない)。
      // trigger 隣接で出るので空間の手がかりは位置で足り、scale は無くてよい。
      opacity: "1",
      transition: "opacity var(--durations-quick) var(--easings-decelerate)",
      "&[data-starting-style]": { opacity: "0" },
      "&[data-ending-style]": {
        opacity: "0",
        transition: "opacity var(--durations-quick) var(--easings-standard)",
      },
    },
    title: {
      fontSize: "base",
      fontWeight: "semibold",
      lineHeight: "tight",
      color: "fg.strong",
      marginBottom: "1",
    },
    description: {
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
    },
  },
})
