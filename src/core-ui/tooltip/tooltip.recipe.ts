import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Tooltip slot recipe.
 *
 * grammar 上の位置:transient な補足。暖色の濃い chip(fg.strong 地 + 白文字)で
 * 一瞬で読める contrast を確保しつつ、純黒ではなく warm dark に留める。
 * 浮きは lift shadow。矢印は持たない(配置 noise を避ける)。
 *
 * Slots:
 *   - popup: 浮く本体(Base UI Tooltip.Popup、Positioner 内)
 */
export const tooltipRecipe = defineSlotRecipe({
  className: "otibo-tooltip",
  jsx: ["Tooltip"],
  slots: ["popup"],
  base: {
    popup: {
      bg: "fg.strong",
      color: "surface",
      fontFamily: "body",
      fontSize: "xs",
      fontWeight: "regular",
      lineHeight: "snug",
      letterSpacing: "normal",
      paddingInline: "2",
      paddingBlock: "1",
      borderRadius: "sm",
      boxShadow: "lift",
      maxWidth: "16rem",
      // tooltip は単一行の hint=最も焦点的で、視線の逃げ場が無い。scale を入れると scale=1
      // 終端のテキスト再ラスタライズ snap が必ず焦点に乗る(list の select・複数行の popover と
      // 違い、attention を別の場所に移して隠すことができない)。よって scale を捨て opacity の
      // みのフェードにする。hint は「現れる」だけでよく、trigger からの空間の手がかりは不要。
      opacity: "1",
      transition: "opacity var(--durations-quick) var(--easings-decelerate)",
      "&[data-starting-style]": { opacity: "0" },
      "&[data-ending-style]": {
        opacity: "0",
        transition: "opacity var(--durations-quick) var(--easings-standard)",
      },
    },
  },
})
