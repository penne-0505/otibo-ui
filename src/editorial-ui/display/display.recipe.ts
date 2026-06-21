import { defineRecipe } from "@pandacss/dev"

/**
 * Display recipe ─ editorial の大型タイポ(2xl 以上)。
 *
 * 「魅せる」の主役。同じ書体(Gen Interface JP)で 36px から 168px まで貫通させる。
 * 派手さは weight や装飾でなく、size と leading と letterSpacing の三点だけで作る。
 *
 * size 帯と用途:
 *   2xl = 36px ─ section 見出し(本文に最も近い display)
 *   3xl = 48px ─ chapter 見出し / SectionMark タイトル
 *   4xl = 64px ─ editorial section title
 *   5xl = 88px ─ Hero タイトル(default 推奨)
 *   6xl = 120px ─ overscale Hero(1-2 行)
 *   7xl = 168px ─ 1 字 / 1 word の刻印(画面を奪う)
 *
 * weight は medium 固定。Gen Interface JP は 400/500/600 のみで、display では 500(medium)が
 * 「黙って強い」── 600 だと印象が広告的に傾き、400 では 6xl 以上で痩せる。
 *
 * leading は size に追従:
 *   2xl/3xl = tight(1.25)
 *   4xl/5xl = displaySnug(1.08)
 *   6xl/7xl = display(1.0)
 *
 * letterSpacing は size 連動で詰める:
 *   2xl/3xl = tight(-0.01em)
 *   4xl 以上 = display(-0.02em)
 */
export const displayRecipe = defineRecipe({
  className: "otibo-display",
  jsx: ["Display"],
  base: {
    fontFamily: "display",
    fontWeight: "medium",
    color: "fg.strong",
    margin: "0",
    // 大型タイポは「字面が箱からはみ出す」感覚を許す ── trim を弱める。
    textWrap: "balance",
  },
  variants: {
    // size ── 4xl 以上は clamp() で fluid scaling。breakpoint jump より滑らかで、
    // 「Awwwards 級」の display で標準的に使われる手法。Panda の recipe variant 内では
    // { base, md } の responsive object が正しく展開されないため、clamp に統一する。
    // 値は @18px root を前提 ─ html font-size: md(=18px)。
    //   min = mobile での下限、preferred = vw 基準のスムーズ scale、max = desktop での天井。
    size: {
      "2xl": {
        fontSize: "2xl",
        lineHeight: "tight",
        letterSpacing: "tight",
      },
      "3xl": {
        fontSize: "3xl",
        lineHeight: "tight",
        letterSpacing: "tight",
      },
      "4xl": {
        // 64-72px(static)。card / chapter 用は固定で安定させる。
        fontSize: "4xl",
        lineHeight: "displaySnug",
        letterSpacing: "display",
      },
      "5xl": {
        // 56px(360vw) → 99px(1440vw)。section title 帯の fluid。
        fontSize: "clamp(3.5rem, 4vw + 2rem, 5.5rem)",
        lineHeight: "displaySnug",
        letterSpacing: "display",
      },
      "6xl": {
        // 90px → 162px。hero 帯 ─ 本タグラインを 2 行で組ませる主役サイズ。
        // 旧 6xl 上限 7.5rem は 7xl との差が広すぎたため引き上げ(2026-06-22)。
        // editorial-ui の Display 上限はここ。これより大きい overscale は使わない(2026-06-22 確定)。
        // 理由:プロトタイプ駆動で「本番の見やすさ」を優先 ─ overscale は装飾的・お上品に滑る。
        // fontSizes トークンの 7xl は他用途(印刷物・大型ポスター等の派生)のために残置。
        fontSize: "clamp(5rem, 7vw + 2.5rem, 9rem)",
        lineHeight: "display",
        letterSpacing: "display",
      },
    },
    tone: {
      strong: { color: "fg.strong" },
      DEFAULT: { color: "fg" },
      muted: { color: "fg.muted" },
      accent: { color: "accent" },
    },
  },
  defaultVariants: {
    size: "5xl",
    tone: "strong",
  },
})
