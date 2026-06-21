import { defineRecipe } from "@pandacss/dev"

/**
 * Eyebrow recipe ─ display の頭に置く小型 kicker。
 *
 * 「これから何の話をするか」を一言で告げる短い印。本文より小さく、字間を意図的に広げ、
 * 必要なら caps(英字)で組む。和文では caps できないので tracking で代替する。
 *
 * 色は fg.muted を default(節度)、accent / fg.strong は強調時のみ。
 * size は sm/md の二段。md は section 頭、sm は SectionMark 内部や Hero 補助。
 */
export const eyebrowRecipe = defineRecipe({
  className: "otibo-eyebrow",
  jsx: ["Eyebrow"],
  base: {
    display: "inline-block",
    fontFamily: "body",
    fontWeight: "medium",
    color: "fg.muted",
    margin: "0",
  },
  variants: {
    size: {
      sm: { fontSize: "xs", lineHeight: "tight" }, // 12px
      md: { fontSize: "sm", lineHeight: "tight" }, // 14px
    },
    tone: {
      muted: { color: "fg.muted" },
      strong: { color: "fg.strong" },
      accent: { color: "accent" },
    },
    // caps ── upper(default)は eyebrow 標準の caps + tracking 拡張。
    // literal はブランドマーク(otibo は小文字絶対)や固有名詞のため、case を保つ。
    // tracking も literal では normal に戻す ─ 小文字に caps 用の tracking は不要。
    caps: {
      upper: {
        textTransform: "uppercase",
        letterSpacing: "eyebrow",
      },
      literal: {
        textTransform: "none",
        letterSpacing: "wide",
      },
    },
  },
  defaultVariants: {
    size: "md",
    tone: "muted",
    caps: "upper",
  },
})
