import { defineConfig } from "@pandacss/dev"

import { otiboPreset } from "./preset"

/**
 * otibo-ui Panda CSS configuration(internal repo 用).
 *
 * design system の値(token / recipe / globalCss)は `preset.ts` に切り出して
 * 外部 consumer(otibo-dev 等)と共有する。この config は internal repo の
 * bundler 設定(include / outdir / layers 等)を担当するだけのシェルとなる。
 */
export default defineConfig({
  preflight: true,
  presets: ["@pandacss/preset-base", otiboPreset],
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
})
