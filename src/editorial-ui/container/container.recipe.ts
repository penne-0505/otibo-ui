import { defineRecipe } from "@pandacss/dev"

/**
 * Container recipe ─ editorial layout の基底枠。
 *
 * 役割は「中央寄せの maxWidth と、画面端からの呼吸(paddingInline)」だけ。色も border も持たない。
 * 横の枠線は別 component(Section / Hairline)が担う。垂直 padding も別(Section が担う)。
 *
 * width の選び方 ─ どれも sizes token を参照する(値の意味は preset.ts §sizes 参照)。
 *   narrow  = 単独で読ませる editorial 章(本文 + 図版 + pull)。40rem 程度の手紙的密度。
 *   default = 一般的な section。container = 64rem。複数 column を許す上限。
 *   wide    = 図版や横並びの密度を持たせたい時。80rem。
 *   bleed   = max-width を外す(全幅)。Hero の背景や 6xl/7xl の overscale 表示で必要。
 *
 * paddingInline は viewport に応じて段階。最小 16px(mobile)/ 中 24px / 大 40px。
 * 数値は body 18px に対する「指の幅」基準で目視確定。
 */
export const pageContainerRecipe = defineRecipe({
  className: "otibo-container",
  jsx: ["Container"],
  base: {
    marginInline: "auto",
    width: "full",
    // base レベル(variant の外)では responsive object が正しく展開される。
    paddingInline: { base: "4", md: "6", lg: "10" },
  },
  variants: {
    width: {
      narrow: { maxWidth: "narrow" },
      default: { maxWidth: "container" },
      wide: { maxWidth: "wide" },
      bleed: { maxWidth: "none", paddingInline: "0" },
    },
  },
  defaultVariants: {
    width: "default",
  },
})
