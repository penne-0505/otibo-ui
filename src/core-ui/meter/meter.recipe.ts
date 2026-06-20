import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Meter slot recipe — 現在値の度合い(measure)を示すバー。
 *
 * grammar 上の位置:Progress と**視覚言語を完全共有**(凹んだ surface.muted track + accent fill)。
 * 違いは **semantic** ── Progress は「進捗(時間軸の作業完了)」、Meter は「現在値の度合い(容量・強度・
 * 評価)」。Base UI が `<meter>` 要素 + 適切な a11y を出す。視覚を共有しつつ意味で分ける運用。
 *
 * motion:Progress と同じく fill の width 変化を medium・expressive で滑らかに。自走 animation なし。
 *
 * Slots: root / label / value / track(凹んだ rail)/ indicator(accent fill)。
 */
export const meterRecipe = defineSlotRecipe({
  className: "otibo-meter",
  jsx: ["Meter"],
  slots: ["root", "label", "value", "track", "indicator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "2",
      width: "100%",
    },
    label: {
      fontSize: "sm",
      lineHeight: "tight",
      color: "fg",
    },
    value: {
      fontSize: "sm",
      lineHeight: "tight",
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
    },
    track: {
      position: "relative",
      width: "100%",
      height: "6px",
      borderRadius: "full",
      overflow: "hidden",
      bg: "surface.muted",
      // Progress / slider rail と同じ凹み(depth source = shadow.depth の cool-dark)。
      boxShadow: "inset 0 1px 2px color-mix(in oklch, {colors.shadow.depth} 9%, transparent)",
    },
    indicator: {
      // 値の塗り = accent(width は Base UI が値%で inline 設定)。
      height: "100%",
      borderRadius: "full",
      bg: "accent",
      transitionProperty: "width",
      transitionDuration: "medium",
      transitionTimingFunction: "expressive",
      "@media (prefers-reduced-motion: reduce)": { transitionProperty: "none" },
    },
  },
})
