import { defineRecipe } from "@pandacss/dev"

/**
 * Section recipe ─ 縦の章を司る。
 *
 * 担うのは「上下の呼吸」と「tone(背景色帯)」の二点だけ。横幅は Container が担い、
 * 罫線は Hairline が担う。section 単体は構造的中立を保つ ─ Container と組み合わせて使う。
 *
 * tone の使い方:
 *   default = bg(warm.50)。全 section の基底。
 *   sunken  = bg.sunken(warm.200)。章境で「画面が一段沈む」表現。連続して使わない。
 *   muted   = surface.muted(warm.100)。subtle な band。広告枠的にならない節度で。
 *
 * padding tier:
 *   sm = 32 / 32 ─ 章の途中の subsection
 *   md = 64 / 64 ─ 一般 section の標準
 *   lg = 96 / 96 ─ Hero / SectionMark 隣接の章
 *   xl = 144 / 144 ─ display 単独で「呼吸」を作る overscale 章
 * viewport により sm→md, md→lg と一段ずつ上がる(mobile では同じだと窮屈)。
 */
export const sectionRecipe = defineRecipe({
  className: "otibo-section",
  jsx: ["Section"],
  base: {
    width: "full",
    position: "relative",
    // 紙の質感を ::before で overlay(Phase 2A、preset.ts §editorial 視覚言語)。
    //
    // mix-blend-mode: multiply で、下にある bg/surface tone(default / sunken / muted)
    // のいずれに対しても自動的に「節度ある暗化」が生じる ─ tone 別に grain 強度を
    // 切り替える必要がない。opacity は 0.05 が目視 sweet spot(0.03=見えない、0.08=
    // texture を意識する=過剰)。
    //
    // pointerEvents: none で interaction を一切奪わない。子要素は relative + zIndex 1
    // で grain の上に座る。
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "var(--paper-grain)",
      backgroundRepeat: "repeat",
      // 0.05 → 0.065(2026-06-22 目視で詰めた値)。0.05 は控えめすぎ、0.08 は texture を
      // 意識しすぎる ─ 0.065 が「居るけど主張しない」帯。
      opacity: 0.065,
      mixBlendMode: "multiply",
      zIndex: 0,
    },
    "& > *": {
      position: "relative",
      zIndex: 1,
    },
  },
  variants: {
    tone: {
      default: { bg: "bg" },
      sunken: { bg: "bg.sunken" },
      muted: { bg: "surface.muted" },
      transparent: { bg: "transparent" },
    },
    // padding ── recipe variant 内で responsive object が展開されない panda の制限により、
    // ここは静的値で組む。viewport scaling は Section の上位レイヤで Container と組み合わせて
    // 調整する想定(mobile では sm / md、desktop では lg / xl と caller が選び分ける)。
    padding: {
      none: { paddingBlock: "0" },
      sm: { paddingBlock: "8" }, // 32px
      md: { paddingBlock: "16" }, // 64px
      lg: { paddingBlock: "24" }, // 96px
      xl: { paddingBlock: "24", paddingBlockEnd: "24" }, // 96/96 ─ 章境の overscale 用
    },
  },
  defaultVariants: {
    tone: "default",
    padding: "md",
  },
})
