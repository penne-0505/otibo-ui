import { defineRecipe } from "@pandacss/dev"

/**
 * Lede recipe ─ Display 直後の導入文。
 *
 * 本文(18px)より一段大きく、display(64px+)より小さい。間を埋める「降り場」として
 * 機能する。lineHeight は body より tight(snug)に取り、塊として読ませる。
 *
 * 幅は lede(28rem ≒ 26-30 字)に絞る ─ それ以上広げると本文に紛れる。
 * 通常は Container の中で自前に maxWidth を持つ(content の上限と分離する)。
 *
 * size:
 *   md = 20px (1.25rem)。section 内の lede。
 *   lg = 24px (1.5rem = lg token)。Hero 直下の lede。
 *   xl = 28px (1.75rem = xl token)。大きく取りたい場面。
 */
export const ledeRecipe = defineRecipe({
  className: "otibo-lede",
  jsx: ["Lede"],
  base: {
    fontFamily: "body",
    fontWeight: "regular",
    color: "fg.secondary",
    maxWidth: "lede",
    margin: "0",
    textWrap: "pretty",
  },
  variants: {
    size: {
      md: {
        fontSize: "1.25rem", // 20px
        lineHeight: "snug",
        letterSpacing: "tight",
      },
      lg: {
        fontSize: "lg", // 24px
        lineHeight: "snug",
        letterSpacing: "tight",
      },
      xl: {
        fontSize: "xl", // 28px
        lineHeight: "snug",
        letterSpacing: "tight",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
