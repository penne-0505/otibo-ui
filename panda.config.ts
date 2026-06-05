import { defineConfig } from "@pandacss/dev"
import { buttonRecipe } from "./src/core-ui/button/button.recipe"
import { cardRecipe } from "./src/core-ui/card/card.recipe"
import { fieldRecipe } from "./src/core-ui/field/field.recipe"
import { inputRecipe } from "./src/core-ui/input/input.recipe"

/**
 * otibo Design System — Panda CSS configuration.
 *
 * Bottom-up policy: tokens defined here are seeded from the preview phase
 * (H≈65 warm-neutral scale) and intentionally minimal. Values are validated
 * by Card implementation first, then expanded as Button / Input / Field
 * surface required additions.
 *
 * Guardrails (from grammar-audit.md):
 *   - Token names follow Panda semanticTokens convention (category.role.state).
 *   - Inset shadow is reserved for Input affordance and baked into the recipe.
 *   - Paper shadow lives under `shadow.paper.*` as the prototype for the
 *     "surface treatment" category. Whether it stays as an exception to
 *     the shadow principle or graduates to its own grammar category is
 *     deferred to post-prototype review.
 *   - Typography weight is bootstrapped at 400 / 500 / 600.
 */
export default defineConfig({
  preflight: true,
  presets: ["@pandacss/preset-base"],
  jsxFramework: "react",
  outdir: "styled-system",
  importMap: "@/styled-system",
  include: ["./src/**/*.{ts,tsx}", "./.ladle/**/*.{ts,tsx}"],
  exclude: [],

  // Cascade layers — written in the order they should resolve.
  // Recipe styles win over base, but user className overrides recipe.
  layers: {
    reset: "otibo-reset",
    base: "otibo-base",
    tokens: "otibo-tokens",
    recipes: "otibo-recipes",
    utilities: "otibo-utilities",
  },

  theme: {
    extend: {
      tokens: {
        colors: {
          // Primitive warm scale, H≈65, derived from concept visual sampling.
          // Chroma stays in [0.009, 0.019] to keep the "barely tinted neutral"
          // character the brand calls for.
          warm: {
            "0": { value: "oklch(1 0 0)" }, // pure white, top surface only
            "50": { value: "oklch(0.97 0.011 65)" }, // page bg
            "100": { value: "oklch(0.94 0.013 65)" }, // subtle band
            "200": { value: "oklch(0.88 0.015 65)" }, // hairline / muted surface
            "300": { value: "oklch(0.78 0.017 65)" }, // border default
            "400": { value: "oklch(0.68 0.018 65)" }, // disabled fg
            "500": { value: "oklch(0.58 0.018 65)" }, // subtle fg
            "600": { value: "oklch(0.48 0.016 65)" }, // muted fg
            "700": { value: "oklch(0.38 0.014 65)" }, // secondary fg
            "800": { value: "oklch(0.30 0.013 65)" }, // primary fg
            "900": { value: "oklch(0.20 0.010 65)" }, // strongest fg
          },
        },
        radii: {
          xs: { value: "0.25rem" },
          sm: { value: "0.5rem" },
          md: { value: "0.75rem" },
          lg: { value: "1rem" },
          xl: { value: "1.5rem" },
          "2xl": { value: "2rem" },
          full: { value: "9999px" },
        },
        spacing: {
          // Slightly looser than Tailwind defaults. Reflects the brand's
          // "ゆったり余白" stance (理念.md §3) without committing to a final scale yet.
          "0": { value: "0" },
          "0.5": { value: "0.125rem" },
          "1": { value: "0.25rem" },
          "1.5": { value: "0.375rem" },
          "2": { value: "0.5rem" },
          "3": { value: "0.75rem" },
          "4": { value: "1rem" },
          "5": { value: "1.25rem" },
          "6": { value: "1.5rem" },
          "7": { value: "1.75rem" },
          "8": { value: "2rem" },
          "10": { value: "2.5rem" },
          "12": { value: "3rem" },
          "16": { value: "4rem" },
          "20": { value: "5rem" },
          "24": { value: "6rem" },
        },
        fontSizes: {
          // hierarchy gap from md (body 18px) to xl (title 28px) ≈ 1.55×。
          // 20px は editorial / brand surface 用の領域で、app の core-ui Card
          // 本文としては大きすぎたため 18px に戻した(目視判定)。
          xs: { value: "0.75rem" },     // 12px
          sm: { value: "0.875rem" },    // 14px
          base: { value: "1rem" },      // 16px — description / lead
          md: { value: "1.125rem" },    // 18px — body
          lg: { value: "1.5rem" },      // 24px — secondary heading
          xl: { value: "1.75rem" },     // 28px — card title
          "2xl": { value: "2.25rem" },  // 36px — section heading
          "3xl": { value: "3rem" },     // 48px — display heading
        },
        fontWeights: {
          regular: { value: "400" },
          medium: { value: "500" }, // bootstrapped from preview's warm structure; reviewed post-prototype
          semibold: { value: "600" },
        },
        lineHeights: {
          tight: { value: "1.25" },     // headings(card title 等)
          snug: { value: "1.4" },       // description / dense text
          body: { value: "1.49" },      // body / prose。
                                        // 1.45-1.55 を 0.02 刻み 6 段階で目視
                                        // 比較し 1.49 に確定。Anthropic 1.40 と
                                        // iA Writer 1.65 の中間、AAA(1.5 以上)
                                        // は意図的に外す。Gen Interface JP の
                                        // 漢字行は Latin 単体より縦に詰まって
                                        // 見える傾向に合わせ、Inter 慣習値より
                                        // やや tight 寄り。WCAG 1.4.12 は user
                                        // override を妨げなければ満たす。
          normal: { value: "1.55" },    // 汎用
          relaxed: { value: "1.7" },    // 余白を取りたい場面(未使用)
        },
        letterSpacings: {
          tight: { value: "-0.01em" },
          normal: { value: "0" },
          wide: { value: "0.005em" }, // warm-structure microadjustment
          wider: { value: "0.02em" },
        },
        fonts: {
          // Gen Interface JP (山戸飯塚氏作, SIL OFL 1.1) を本文・display 共通で使う。
          // Inter × Noto Sans JP の混植調整済みなので、JP/Latin を別 family で渡す
          // 必要がない。display と body を分ける動機は今のところない(prototype 後に
          // 必要が出たら別 family を導入する)。
          body: {
            value:
              '"Gen Interface JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          },
          display: {
            value:
              '"Gen Interface JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          },
          mono: {
            value:
              '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          },
        },
        durations: {
          quick: { value: "120ms" },
          base: { value: "180ms" },
          calm: { value: "260ms" },
        },
        easings: {
          standard: { value: "cubic-bezier(0.2, 0, 0, 1)" },
          decelerate: { value: "cubic-bezier(0, 0, 0, 1)" },
          accelerate: { value: "cubic-bezier(0.3, 0, 1, 1)" },
        },
      },

      semanticTokens: {
        colors: {
          // Background = the "air" of the canvas (per Depth Law / Surface Grammar).
          bg: {
            DEFAULT: { value: "{colors.warm.50}" },
            subtle: { value: "{colors.warm.100}" },
            sunken: { value: "{colors.warm.200}" },
          },
          // Surface = the face where reading / input / operation happens.
          // Note: using `surface` does NOT prove Surface role — that is decided
          // by diagnosis (see token-semantic-usage-map.md §Token Is Not Role).
          surface: {
            DEFAULT: { value: "{colors.warm.0}" }, // pure white as top face
            muted: { value: "{colors.warm.100}" },
            raised: { value: "{colors.warm.0}" },
          },
          fg: {
            DEFAULT: { value: "{colors.warm.800}" },
            secondary: { value: "{colors.warm.700}" },
            muted: { value: "{colors.warm.500}" },
            subtle: { value: "{colors.warm.400}" },
            disabled: { value: "{colors.warm.400}" },
            strong: { value: "{colors.warm.900}" },
          },
          border: {
            subtle: { value: "{colors.warm.200}" },
            DEFAULT: { value: "{colors.warm.300}" },
            strong: { value: "{colors.warm.400}" },
          },
        },
        shadows: {
          // The shadow principle says shadow is only for things that actually float.
          // `paper` is a PROTOTYPE category for the surface-treatment problem
          // we deferred from grammar-audit. Whether it stays here or becomes
          // its own grammar category is decided after Card / Button land.
          paper: {
            sm: {
              value:
                "0 0 0 1px color-mix(in oklch, {colors.fg.strong} 5%, transparent), 0 1px 0 0 color-mix(in oklch, {colors.fg.strong} 3%, transparent), 0 8px 20px -14px color-mix(in oklch, {colors.fg.strong} 12%, transparent)",
            },
            md: {
              value:
                "0 0 0 1px color-mix(in oklch, {colors.fg.strong} 5%, transparent), 0 1px 0 0 color-mix(in oklch, {colors.fg.strong} 3%, transparent), 0 12px 28px -16px color-mix(in oklch, {colors.fg.strong} 14%, transparent)",
            },
          },
          lift: {
            sm: {
              value:
                "0 1px 2px color-mix(in oklch, {colors.fg.strong} 8%, transparent)",
            },
            md: {
              value:
                "0 4px 12px -2px color-mix(in oklch, {colors.fg.strong} 12%, transparent)",
            },
            lg: {
              value:
                "0 12px 32px -8px color-mix(in oklch, {colors.fg.strong} 18%, transparent)",
            },
          },
          focus: {
            // Reserved for focused affordance; tuned during Button / Input.
            DEFAULT: {
              value:
                "0 0 0 3px color-mix(in oklch, {colors.fg.strong} 12%, transparent)",
            },
          },
          // inset field shadow: Input affordance を border ではなく inset で
          // 示す(grammar audit 確定方針)。3 段で rest / focus / error を表す。
          field: {
            DEFAULT: {
              value:
                "inset 0 0 0 1px {colors.border.subtle}, inset 0 1px 2px color-mix(in oklch, {colors.fg.strong} 5%, transparent)",
            },
            focus: {
              value:
                "inset 0 0 0 2px {colors.fg.strong}",
            },
            error: {
              value:
                "inset 0 0 0 2px oklch(0.58 0.13 30)",
            },
          },
        },
      },

      recipes: {
        button: buttonRecipe,
        input: inputRecipe,
      },
      slotRecipes: {
        card: cardRecipe,
        field: fieldRecipe,
      },
    },
  },

  // Generate global stylesheet target (consumed by Ladle entrypoint).
  globalCss: {
    "html, body, #root": {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
      fontSize: "md",
      lineHeight: "body",
      // Reference observation: iA Writer / Anthropic 共に letter-spacing は
      // normal(0)。preview の 0.005em は trendy 微温化に過ぎず、Gen Interface JP
      // の metrics をそのまま信用するほうが結果として honest になる。
      letterSpacing: "normal",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    body: {
      margin: "0",
      minHeight: "100dvh",
    },
  },
})
