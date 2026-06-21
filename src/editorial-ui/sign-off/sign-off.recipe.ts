import { defineSlotRecipe } from "@pandacss/dev"

/**
 * SignOff slot recipe ─ editorial の終わりに置く著者サイン。
 *
 * 「ここで読了」を告げる小さな印。著者名・年・credit などを caps tracking で短く組む。
 * 章間の閉じや footer の前に挿す。装飾的なシンボル(◆ や ─)は付けず、文字組だけで締める。
 *
 * 構造:
 *   <SignOff>
 *     <SignOff.Mark>otibo</SignOff.Mark>
 *     <SignOff.Detail>2026 · penne</SignOff.Detail>
 *   </SignOff>
 *
 * align:
 *   left   = 章の終わりに置く時(本文の流れに沿う)
 *   center = 編集物全体の終わりに置く時(完成された印)
 *   right  = 印鑑風の隅付き
 */
export const signOffRecipe = defineSlotRecipe({
  className: "otibo-sign-off",
  slots: ["root", "mark", "detail"],
  jsx: ["SignOff"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1",
      paddingTop: "5",
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderColor: "border.subtle",
      width: "fit-content",
    },
    mark: {
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      color: "fg.strong",
      lineHeight: "tight",
      // default は literal(otibo brand mark = 小文字絶対 を念頭)
      textTransform: "none",
      letterSpacing: "wide",
      // panda slot recipe の variant は別 slot へ伝播しないため、Root に data-caps を
      // 立てて descendant selector で切り替える(context 不要の構造解)。
      "[data-caps='upper'] &": {
        textTransform: "uppercase",
        letterSpacing: "eyebrow",
      },
    },
    detail: {
      fontFamily: "mono",
      fontSize: "xs",
      letterSpacing: "wide",
      color: "fg.muted",
      lineHeight: "tight",
      fontVariantNumeric: "tabular-nums",
    },
  },
  variants: {
    align: {
      left: { root: { alignItems: "flex-start", marginInline: "0" } },
      center: { root: { alignItems: "center", marginInline: "auto" } },
      right: { root: { alignItems: "flex-end", marginInlineStart: "auto" } },
    },
  },
  defaultVariants: {
    align: "left",
  },
})
