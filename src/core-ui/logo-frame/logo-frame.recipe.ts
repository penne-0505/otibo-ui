import { defineSlotRecipe } from "@pandacss/dev"

/**
 * LogoFrame — ブランド / マークの像。構成は Avatar と同型だが見た目は異なる。
 *
 * - 角丸矩形（円ではない）
 * - image は contain（透過余白を潰さない）
 * - fallback 地は surface.muted（accent 円は人の identity 用に残す）
 * - load fade は Avatar と同じ処方
 *
 * shape:
 *   square — アイコン / モノグラム（1:1 枠）。fallback 頭文字もここに収まる
 *   auto   — 横長ワードマーク。高さを size で固定し、幅はロゴ比率に追従させる
 *
 * image の寸法は root の shape から `& img` で駆動する（子コンポーネントは shape を
 * 受け取らないため、slot 側で分岐させない）。
 *
 * Slots: root / image / fallback。
 */
export const logoFrameRecipe = defineSlotRecipe({
  className: "otibo-logo-frame",
  jsx: ["LogoFrame"],
  slots: ["root", "image", "fallback"],
  base: {
    root: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      borderRadius: "md",
      overflow: "hidden",
      bg: "surface.muted",
      color: "fg.muted",
      fontFamily: "body",
      fontWeight: "medium",
      lineHeight: "1",
      userSelect: "none",
      verticalAlign: "middle",
    },
    image: {
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
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
      textStyle: "caption",
      color: "fg.muted",
    },
  },
  variants: {
    size: {
      sm: { root: { height: "8", fontSize: "0.6875rem" } },
      md: { root: { height: "10", fontSize: "0.75rem" } },
      lg: { root: { height: "16", fontSize: "0.875rem" } },
    },
    shape: {
      square: {
        root: {
          aspectRatio: "1 / 1",
          "& img": { width: "100%", height: "100%", padding: "1.5" },
        },
      },
      auto: {
        root: {
          width: "auto",
          maxWidth: "100%",
          paddingInline: "3",
          "& img": { height: "100%", width: "auto", maxWidth: "100%", paddingBlock: "1.5" },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    shape: "square",
  },
})
