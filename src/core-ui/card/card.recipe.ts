import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Card slot recipe.
 *
 * Anchored to `_docs/reference/DesignSystem/components/card.md` (otibo_ds spec).
 * Card is NOT automatically Surface role or Object composition — variants
 * exist so the recipe can be tuned per context (Object placement vs
 * Internal region vs Embedded support).
 *
 * Variants exposed for the prototype:
 *   - surface: "paper"   → Object role / Placement boundary  (default)
 *             "flat"    → Internal region inside an object   (no shadow)
 *             "muted"   → recessed Internal surface          (surface-muted face)
 *   - padding: sm / md / lg — controls breathing room
 *   - interactive: true  → primes the recipe for Control role
 *                          (focus ring + hover lift; selection state is
 *                          composed separately because selected must
 *                          carry a base boundary, per boundary-intent.md)
 *
 * Paper shadow is the prototype "surface treatment" (grammar-audit §5.4).
 * If it survives Card + Button, it graduates into the grammar; if it
 * starts producing frame smell, it gets demoted to a one-off override.
 */
export const cardRecipe = defineSlotRecipe({
  className: "otibo-card",
  slots: ["root", "header", "title", "description", "body", "footer"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      // Padding は variants で全 size を定義するため base には置かない。
      // base が variants を奪うレイヤリングを避ける。
      bg: "surface",
      color: "fg",
      borderRadius: "lg",
      // quiet register(standard・段階化なし)だが tier=medium:card は大きな object が
      // 物理的に浮く(hover lift)ため、button/input の light より一段重い尺で substantial に。
      transitionProperty: "box-shadow, transform, background-color",
      transitionDuration: "medium",
      transitionTimingFunction: "standard",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      // title と description を「一塊」として強く読ませるため gap を詰める。
      // 上(0.5rem)→ 1.5(0.375rem)。これと root.gap の拡大(後述)で
      // 「タイトル組 → 余白 → 本文」のリズムを作る。
      gap: "1.5",
    },
    title: {
      // Reference の heading scale jump(body 20-22 → h2 24-95)に合わせて、
      // body 20px に対して 24px(1.2× factor)を起点に置く。line-height は
      // 大きい size には更に詰める(reference は heading 1.1-1.2)。
      fontSize: "xl",
      fontWeight: "semibold",
      lineHeight: "tight",
      letterSpacing: "tight",
      color: "fg.strong",
    },
    description: {
      // title の lead / subtitle。base (16px) で title (28px) と body (18px)
      // を muted 色 + snug line-height で繋ぐ。body との 2px 差は color と
      // lineHeight で補強する(Anthropic editorial パターン)。
      fontSize: "base",
      lineHeight: "snug",
      letterSpacing: "normal",
      color: "fg.muted",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: "4",
      fontSize: "md",
      lineHeight: "body",
      color: "fg.secondary",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      // text-only Button が並ぶ場面では視覚的に余白が大きく見えるため、
      // gap を詰める。3(0.75rem)→ 2(0.5rem)。
      gap: "2",
      paddingTop: "2",
    },
  },
  variants: {
    surface: {
      // Default は flat。Reference 観察(iA Writer / Anthropic)は Card 的単位を
      // type と spacing だけで成立させており、shadow を持つのは「実際に浮く」
      // ものに限る(grammar core-grammar.md §Shadow と整合)。paper は明示的に
      // 「ここは canvas から浮いた object である」と書く場面でだけ opt-in する。
      flat: {
        root: {
          bg: "surface",
          boxShadow: "none",
        },
      },
      paper: {
        root: {
          bg: "surface",
          boxShadow: "paper.sm",
        },
      },
      muted: {
        root: {
          bg: "surface.muted",
          boxShadow: "none",
        },
      },
    },
    padding: {
      // 余白:ゆったり(理念.md §3)。padding と gap を size variant で動かす。
      // 当初 padding と gap を同値で揃えていたが、AccountForm(Card 内 Field
      // 複数)で header → body の境目が「もう一本の Field 間 gap」と読まれて
      // 視覚階層が崩れた:
      //   - md gap=1.75rem は Field 間 gap=1.5rem との差が 0.25rem しかなく、
      //     title 組と body 組が「同じカテゴリの連続」に見えてしまう
      // 2026-06-12: md gap を 2.5rem(Field 間 gap の 1.67×)に逃がして、
      // title 組と body 組を別カテゴリとして明示する。lg も同様に 2.5rem。
      sm: { root: { padding: "5", gap: "5" } }, // 1.25rem
      md: { root: { padding: "6", gap: "10" } }, // padding 1.5rem / gap 2.5rem
      lg: { root: { padding: "8", gap: "10" } }, // padding 2rem / gap 2.5rem
    },
    interactive: {
      true: {
        root: {
          cursor: "pointer",
          outline: "none",
          _hover: {
            boxShadow: "paper.md",
            transform: "translateY(-1px)",
          },
          _active: {
            transform: "translateY(0)",
          },
          _focusVisible: {
            boxShadow: "focus",
          },
        },
      },
    },
  },
  defaultVariants: {
    surface: "flat",
    padding: "md",
  },
})
