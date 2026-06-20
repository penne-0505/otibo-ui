import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Avatar slot recipe — 人/主体を表す円形の像。
 *
 * 構成:image(あれば)を載せ、無い/読み込み中は fallback(イニシャル or icon)を出す。
 * load 判定・swap は Base UI Avatar に委譲(Image は loaded のときだけ DOM にマウントされる)。
 *
 * motion:image の load 時 fade(fadeIn・quick)。装飾の pulse ではなく「loading → loaded」
 * という本物の状態遷移なので、motion 文法「動きは状態の証言」に適う(Image は load 後に
 * マウントされるので、現れる瞬間に一度だけ流れる)。reduced-motion では止める。
 *
 * fallback の地は accent.subtle + accent text/icon(header の手書き円と同じ扱いを正式化)。
 * size は root のみに効く(image/fallback は 100% 追従、fontSize は root から継承)。
 *
 * Slots: root(円・fallback 地)/ image / fallback。
 */
export const avatarRecipe = defineSlotRecipe({
  className: "otibo-avatar",
  jsx: ["Avatar"],
  slots: ["root", "image", "fallback"],
  base: {
    root: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      borderRadius: "full",
      overflow: "hidden",
      bg: "accent.subtle",
      color: "accent",
      fontFamily: "body",
      fontWeight: "medium",
      lineHeight: "1",
      userSelect: "none",
      verticalAlign: "middle",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      // Image は loaded のときだけマウントされる → 現れる瞬間に一度だけ fade。
      // ただし img の bitmap は decode(既定 async)後に描画されるので、マウント即時の短い fade は
      // 「bitmap が出る頃には終わっている」=ポンと出る。delay で decode/paint を待ち(backwards で
      // その間 opacity 0 を保持)、その後に medium で「スッと」見える fade を流す。decelerate=置かれる尾。
      animationName: "fadeIn",
      animationDuration: "medium",
      animationTimingFunction: "decelerate",
      animationDelay: "40ms",
      animationFillMode: "backwards",
      "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
    },
    fallback: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      textTransform: "uppercase",
      letterSpacing: "wide",
    },
  },
  variants: {
    // 寸法は sizes トークン(8=2rem / 10=2.5rem / 12=3rem)。fontSize は専用値なので rem 直書き。
    size: {
      sm: { root: { width: "8", height: "8", fontSize: "0.8125rem" } },
      md: { root: { width: "10", height: "10", fontSize: "0.9375rem" } },
      lg: { root: { width: "12", height: "12", fontSize: "1.125rem" } },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
