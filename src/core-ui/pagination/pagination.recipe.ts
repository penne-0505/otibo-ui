import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Pagination slot recipe — リスト送りの navigation。
 *
 * grammar 上の位置:現在ページ(active)は **accent 塗り + 白文字**(= 白 on 色の blessed pattern、
 * 単一の小さな chip なので色は散らない=color layering の正しい側)。他ページ/prev/next は ghost
 * (透明・fg.muted、hover で surface.muted)。tabs(下線)や segmented(白 pill)と並ぶ「選択」表現の
 * 一種だが、pagination は number の格子なので塗りつぶし chip が最も読みやすい。
 *
 * Slots: root(nav の flex 行)/ item(ページ番号・prev/next 共通の button)/ ellipsis(…)。
 */
export const paginationRecipe = defineSlotRecipe({
  className: "otibo-pagination",
  jsx: ["Pagination"],
  slots: ["root", "item", "ellipsis"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "1",
      fontFamily: "body",
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      // 2 桁(例 10)が収まる幅を一定の既定に。1 桁もこの幅の中央に置き、窓移動時の width 揺れを防ぐ。
      // tabular-nums(下記)で桁幅も揃え、paddingInline は 2 桁が minWidth を超えないよう詰める。
      minWidth: "2rem",
      height: "2rem",
      paddingInline: "1",
      border: "none",
      bg: "transparent",
      color: "fg.muted",
      fontSize: "sm",
      fontWeight: "medium",
      fontVariantNumeric: "tabular-nums",
      lineHeight: "1",
      borderRadius: "sm",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { bg: "surface.muted", color: "fg.strong" },
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "1px",
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: "disabled",
        _hover: { bg: "transparent", color: "fg.muted" },
      },
    },
    ellipsis: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      minWidth: "2rem",
      height: "2rem",
      color: "fg.subtle",
      userSelect: "none",
    },
  },
  variants: {
    active: {
      true: {
        // 現在ページ = accent 塗り + 白文字(白 on 色)。
        item: {
          bg: "accent",
          color: "surface",
          _hover: { bg: "accent.hover", color: "surface" },
        },
      },
    },
  },
})
