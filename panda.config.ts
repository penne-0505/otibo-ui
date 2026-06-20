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
  importMap: "@otibo/ui/styled-system",
  include: ["./src/**/*.{ts,tsx}", "./.ladle/**/*.{ts,tsx}"],
  exclude: [],

  // Toast は manager 経由で runtime に動的描画されるため、静的 usage 解析では
  // recipe 使用が検出されない。styling は toast を使う限り必ず要るので常時 emit する。
  staticCss: {
    recipes: {
      toast: ["*"],
      // active(現在ページ)は runtime boolean なので静的検出されない。全 variant を常時 emit。
      pagination: ["*"],
      // recipe を wrapper component 内でのみ呼ぶ型(JSX タグから直接 recipe を辿れない)で
      // usage 検出漏れ → 常時 emit。
      numberField: ["*"],
      toggle: ["*"],
      chip: ["*"],
      // wrapper 内呼び出し + Viewport の Portal で usage 検出が不安定なので常時 emit。
      navigationMenu: ["*"],
    },
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
