import { defineRecipe } from "@pandacss/dev"

/**
 * Spinner recipe — loading の自走インジケータ(回転する弧)。
 *
 * grammar 上の位置:otibo は「自走 animation / decorative pulse を持たない」が、loading の回転は
 * **装飾でなく「作業が継続している」という正直な証言**なので、その例外として認める(motion-grammar
 * §Loading)。色は currentColor(文脈に追従)── button 内なら白、単体なら置いた文脈の色。これで
 * 「白on色」にも「neutral 面の単一アクセント」にも素直に乗る(色を内蔵しない=color layering 非依存)。
 *
 * 実装:細いリング(currentColor を薄めた全周)+ 一点だけ currentColor の頭、を等速回転。
 */
export const spinnerRecipe = defineRecipe({
  className: "otibo-spinner",
  jsx: ["Spinner"],
  base: {
    display: "inline-block",
    flexShrink: "0",
    borderRadius: "full",
    borderStyle: "solid",
    // 全周は currentColor を薄めた track、頭(top)だけ currentColor。
    borderColor: "color-mix(in oklch, currentColor 18%, transparent)",
    borderTopColor: "currentColor",
    animationName: "spin",
    animationDuration: "0.7s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    // 回転は essential(止めると loading の意味が消える)ので reduced-motion でも止めない。
    // ただし速度は落として控えめに。travel を抜く一般則の、明示された例外。
    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "1.3s",
    },
  },
  variants: {
    size: {
      sm: { width: "0.875rem", height: "0.875rem", borderWidth: "1.5px" },
      md: { width: "1.125rem", height: "1.125rem", borderWidth: "2px" },
      lg: { width: "1.5rem", height: "1.5rem", borderWidth: "2px" },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
