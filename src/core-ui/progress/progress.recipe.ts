import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Progress slot recipe — 進捗の表示(非対話)。
 *
 * grammar 上の位置:slider と track 言語を共有する。凹んだ surface.muted の track に accent の
 * fill が満ちる ── ここで accent は「面/土台」として置かれ、その上に文字を重ねない(color
 * layering の正しい側:色は土台が持つ)。slider との違いは thumb が無く非対話なこと。
 *
 * motion:fill の width 変化を medium・expressive で滑らかに(値更新=feedback の settle)。
 * 自走 animation(indeterminate の流れる bar)は持たない ── 現状は determinate 専用
 * (otibo の no-self-running-animation 方針。必要になれば別途)。
 *
 * Slots: root / label / value / track(凹んだ rail)/ indicator(accent fill)。
 */
export const progressRecipe = defineSlotRecipe({
  className: "otibo-progress",
  jsx: ["Progress"],
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
      // slider rail と同じ凹み(depth source = shadow.depth の cool-dark)。
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
