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
    // disabled は intent 横断で `opacity: disabled`(= 0.55)。
    // grammar §Disabled As Quiet Surface ── 個別 token shift ではなく
    // surface 全体を quiet 化することで warm-neutral voice を保つ。
    //
    // aria-disabled="true" も同じ視覚処理にする(Disabled Reveals Reason
    // On Attempt パターン:button は visually disabled だが click event は
    // 受けて attempt を検出可能にする ─ Form 側で「試したが通らなかった」を
    // 教える)。
    "&:is(:disabled, [aria-disabled='true'])": {
      cursor: "not-allowed",
      opacity: "disabled",
    },
    _focusVisible: {
      boxShadow: "focus",
    },
  },
  variants: {
    // hover / active は intent 別 ── ただし grammar §Disabled Suspends
    // Pointer Feedback により、disabled / aria-disabled の時は発火させない。
    // 「押せる」signal は disabled の自己矛盾になるため。
    intent: {
      primary: {
        bg: "fg.strong",
        color: "surface",
        "&:not(:disabled):not([aria-disabled='true']):hover": { bg: "fg" },
        "&:not(:disabled):not([aria-disabled='true']):active": {
          transform: "translateY(0.5px)",
        },
      },
      secondary: {
        bg: "surface.muted",
        color: "fg.strong",
        "&:not(:disabled):not([aria-disabled='true']):hover": { bg: "bg.subtle" },
        "&:not(:disabled):not([aria-disabled='true']):active": {
          transform: "translateY(0.5px)",
        },
      },
      ghost: {
        // 本文 18px と Button 16px の size 差で operable と本文の区別が出る
        // ようになったため、ghost の color を fg.secondary に戻す。
        bg: "transparent",
        color: "fg.secondary",
        "&:not(:disabled):not([aria-disabled='true']):hover": {
          bg: "surface.muted",
          color: "fg.strong",
        },
        "&:not(:disabled):not([aria-disabled='true']):active": {
          transform: "translateY(0.5px)",
        },
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
