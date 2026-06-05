import { defineRecipe } from "@pandacss/dev"

/**
 * Button recipe.
 *
 * Anchored to otibo's "Affordance" boundary intent and the
 * "気づけば終わる / 予測可能" principles. The base affordance must be
 * legible at rest — hover/focus only *strengthens* it, never reveals it.
 *
 * Minimal prototype variants:
 *   - intent: "primary"   → the single dominant action of its surface
 *             "secondary" → supporting action (read as control, but quieter)
 *             "ghost"     → low-affordance helper (toolbar / nav)
 *   - size:   sm / md
 *
 * Selected / destructive / loading は最初の試金石では除外。これらは
 * base affordance が成立してから乗せる。
 */
export const buttonRecipe = defineRecipe({
  className: "otibo-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    fontFamily: "body",
    fontWeight: "medium",
    lineHeight: "tight",
    letterSpacing: "normal",
    // radius は md (12px) から sm (8px) に下げて、CSS 円弧 radius の
    // 「突き当たり感」を抑える。Apple iOS 風の squircle は CSS 標準で
    // 描けないため、radius を短く取ることで違和感を最小化する。
    // 将来 superellipse library を導入する場合は radius scale を再評価する。
    borderRadius: "sm",
    cursor: "pointer",
    userSelect: "none",
    outline: "none",
    transitionProperty: "background-color, color, box-shadow, transform",
    transitionDuration: "quick",
    transitionTimingFunction: "standard",
    _disabled: {
      cursor: "not-allowed",
      // disabled は intent 横断で opacity 0.55 に戻す。intent specific に
      // bg / color を変える試みは「secondary disabled が secondary に見える」
      // 問題を解消できなかった(既存 token の組み合わせでは disabled 専用色を
      // 表現しきれない)。disabled 専用 token は token 第一原理導出フェーズの
      // 宿題として保留。
      opacity: 0.55,
    },
    _focusVisible: {
      boxShadow: "focus",
    },
  },
  variants: {
    intent: {
      primary: {
        bg: "fg.strong",
        color: "surface",
        _hover: { bg: "fg" },
        _active: { transform: "translateY(0.5px)" },
      },
      secondary: {
        bg: "surface.muted",
        color: "fg.strong",
        _hover: { bg: "bg.subtle" },
        _active: { transform: "translateY(0.5px)" },
      },
      ghost: {
        // 本文 18px と Button 16px の size 差で operable と本文の区別が出る
        // ようになったため、ghost の color を fg.secondary に戻す
        // (Button md fontSize を base に戻したことで成立した判断)。
        bg: "transparent",
        color: "fg.secondary",
        _hover: { bg: "surface.muted", color: "fg.strong" },
        _active: { transform: "translateY(0.5px)" },
      },
    },
    size: {
      sm: {
        // 13px(0.8125rem hardcode)。14px から更に一段下げて、サイズ階層を
        // 明確化。これでまだ大きいなら 12px(xs)に下げる。
        fontSize: "0.8125rem",
        paddingInline: "3",      // 12px
        paddingBlock: "1.5",
        minHeight: "8",          // 32px
      },
      md: {
        // body 18px に対して 16px。Button が本文より一段引いた声色で
        // 「強調しすぎない」UI を作る。
        fontSize: "base",        // 16px
        paddingInline: "5",      // 20px(height 40 × 0.5 比率)
        paddingBlock: "2",
        minHeight: "10",         // 40px
      },
    },
  },
  defaultVariants: {
    intent: "secondary",
    size: "md",
  },
})
