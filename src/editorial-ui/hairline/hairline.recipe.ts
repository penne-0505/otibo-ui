import { defineRecipe } from "@pandacss/dev"

/**
 * Hairline recipe ─ editorial の意図ある線。
 *
 * core-ui の Separator(in-grain な構造区切り)とは別の役。editorial では線が「読み」の
 * 一部 ── 章境を示す、引用の上下を縁取る、figure の下に caption を支える、等。
 * weight は token の border スケール(subtle/DEFAULT/strong)に揃え、線の声色を切り替える。
 *
 * accent variant は「ここから本題」の合図に限定して使う ─ 多用するとアプリ的になる。
 */
export const hairlineRecipe = defineRecipe({
  className: "otibo-hairline",
  jsx: ["Hairline"],
  base: {
    border: "none",
    flexShrink: "0",
    margin: "0",
  },
  variants: {
    weight: {
      faint: { bg: "border.subtle" },
      DEFAULT: { bg: "border" },
      strong: { bg: "border.strong" },
      accent: { bg: "accent" },
    },
    orientation: {
      horizontal: { height: "1px", width: "full" },
      vertical: { width: "1px", height: "1em", alignSelf: "center" },
    },
    length: {
      full: {},
      // 短い hairline ── 章タイトル隣に短く置く(SectionMark の rule 用)。
      short: { width: "8" },
    },
  },
  defaultVariants: {
    weight: "DEFAULT",
    orientation: "horizontal",
    length: "full",
  },
})
