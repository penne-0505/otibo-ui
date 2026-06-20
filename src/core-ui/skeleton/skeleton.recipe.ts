import { defineRecipe } from "@pandacss/dev"

/**
 * Skeleton recipe — content 到着前の neutral な placeholder。
 *
 * grammar 上の位置:完全 neutral(色を持たない)。motion は穏やかな opacity の呼吸(breathe)で
 * 「中身が来る」を静かに告げる loading 証言(§Loading の自走例外)。trendy な shimmer sweep
 * (斜めに光が走る gradient)は no-trendy なので採らない。
 *
 * spinner との差:reduced-motion では脈動を止めてよい ── 静的な gray block でも placeholder と
 * 読めるため(spinner は回転が message そのものなので止めない)。
 *
 * 形は consumer が width/height/style で与える。circle variant だけ用意(avatar 等の丸)。
 */
export const skeletonRecipe = defineRecipe({
  className: "otibo-skeleton",
  jsx: ["Skeleton"],
  base: {
    display: "block",
    // hairline と同系の quiet な gray(warm.200)= placeholder と読める明度。
    bg: "border.subtle",
    borderRadius: "sm",
    animationName: "pulse",
    animationDuration: "1.6s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    "@media (prefers-reduced-motion: reduce)": {
      animationName: "none",
    },
  },
  variants: {
    circle: {
      true: { borderRadius: "full" },
    },
  },
})
