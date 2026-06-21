import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Pull slot recipe ─ 本文より一段「引き上がる」引用。Awwwards 級の「キメ」候補の一つ。
 *
 * 雑誌の中央段で大きく抜き出された一文。Display ほど押し付けがましくなく、本文より
 * 圧倒的に大きく、文字単体で空間を支配する。size は md(本文の 2 倍)/ lg(本文の 3 倍)/
 * xl(画面を奪う)の三段。tone は default(fg.strong)/ accent(一点強調)。
 *
 * 構造:
 *   <Pull>
 *     <Pull.Body>「本文を一段引き上げる引用」</Pull.Body>
 *     <Pull.Attribution>── 出典 / 章番号 / 著者</Pull.Attribution>
 *   </Pull>
 *
 * Attribution は短い credit。空でも構わない(その場合 spacing を吸う)。
 */
export const pullRecipe = defineSlotRecipe({
  className: "otibo-pull",
  slots: ["root", "body", "attribution"],
  jsx: ["Pull"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "4",
      margin: "0",
      maxWidth: "container",
    },
    body: {
      fontFamily: "display",
      fontWeight: "medium",
      color: "fg.strong",
      margin: "0",
      textWrap: "balance",
      // 「」を装飾的に出すのではなく、本文として組む(過剰な装飾なし)。
      // hanging-punctuation を allow すると左肩がきれいに揃う。
      hangingPunctuation: "first allow-end",
      // default(size=lg)。panda slot recipe の variant は別 slot へ伝播しないため、
      // Root の data-size を descendant selector で拾って切り替える(SignOff §mark と同様)。
      fontSize: "clamp(2rem, 3vw + 1rem, 3rem)",
      lineHeight: "tight",
      letterSpacing: "tight",
      "[data-size='md'] &": {
        fontSize: "clamp(1.5rem, 2vw + 1rem, 2.25rem)",
      },
      "[data-size='xl'] &": {
        fontSize: "clamp(2.5rem, 4vw + 1.5rem, 4rem)",
        lineHeight: "displaySnug",
        letterSpacing: "display",
      },
      // tone も body の color に効く ─ 同じ data-attribute パターン
      "[data-tone='accent'] &": { color: "accent" },
      "[data-tone='muted'] &": { color: "fg.secondary" },
    },
    attribution: {
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "regular",
      lineHeight: "snug",
      letterSpacing: "wide",
      color: "fg.muted",
      "&:not(:empty)::before": {
        content: '"── "',
        color: "fg.subtle",
      },
    },
  },
  variants: {
    // align のみ root に効くので variant のまま。size と tone は body slot に効くため
    // recipe base 内の data-attribute descendant selector で表現する(sign-off と同様)。
    align: {
      left: { root: { alignItems: "flex-start", textAlign: "left" } },
      center: { root: { alignItems: "center", textAlign: "center" } },
    },
  },
  defaultVariants: {
    align: "left",
  },
})
