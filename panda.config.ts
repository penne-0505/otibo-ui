import { defineConfig } from "@pandacss/dev"

import { otiboPreset } from "./preset"

/**
 * otibo-ui Panda CSS configuration(internal repo 用).
 *
 * design system の値(token / recipe / globalCss)は `preset.ts` に集約する。
 * 0.3.0 以降、Panda は repository 内の authoring / static CSS generation 専用であり、
 * consumer は生成済み `@otibo/ui/styles.css` を import する。
 */
export default defineConfig({
  preflight: true,
  presets: ["@pandacss/preset-base", otiboPreset],
  jsxFramework: "react",
  outdir: "styled-system",
  importMap: "@otibo/ui/styled-system",
  include: ["./src/**/*.{ts,tsx}", "./.ladle/**/*.{ts,tsx}"],
  exclude: [],

  // Compiled CSS は source usage に依存せず public component の全 variant を保証する。
  // recipe を追加した場合はここにも必ず追加し、package verification で対応を検査する。
  staticCss: {
    recipes: {
      accordion: ["*"],
      avatar: ["*"],
      badge: ["*"],
      breadcrumb: ["*"],
      button: ["*"],
      card: ["*"],
      checkbox: ["*"],
      chip: ["*"],
      combobox: ["*"],
      dialog: ["*"],
      field: ["*"],
      inlineEdit: ["*"],
      input: ["*"],
      link: ["*"],
      logoFrame: ["*"],
      mediaFrame: ["*"],
      menu: ["*"],
      meter: ["*"],
      navigationMenu: ["*"],
      numberField: ["*"],
      pagination: ["*"],
      popover: ["*"],
      previewCard: ["*"],
      progress: ["*"],
      prose: ["*"],
      radio: ["*"],
      scrollArea: ["*"],
      segmentedControl: ["*"],
      select: ["*"],
      separator: ["*"],
      skeleton: ["*"],
      slider: ["*"],
      spinner: ["*"],
      switchRecipe: ["*"],
      table: ["*"],
      tableScroll: ["*"],
      tabs: ["*"],
      toast: ["*"],
      toggle: ["*"],
      tooltip: ["*"],
    },
    css: [
      {
        properties: {
          textStyle: [
            "display",
            "heading",
            "heading.sm",
            "heading.md",
            "heading.lg",
            "body",
            "eyebrow",
            "caption",
          ],
        },
      },
    ],
  },

  // Cascade layers — written in the order they should resolve.
  // Recipe styles win over base, but user className overrides recipe.
  layers: {
    reset: "otibo-reset",
    base: "otibo-base",
    tokens: "otibo-tokens",
    recipes: "otibo-recipes",
    utilities: "otibo-utilities",
  },
})
