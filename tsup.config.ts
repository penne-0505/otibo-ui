import path from "node:path"
import { fileURLToPath } from "node:url"
import { type Options, defineConfig } from "tsup"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * tsup build configuration for @otibo/ui.
 *
 * 2 build configs (array form):
 *   1. component bundle  — `src/index.ts` → `dist/index.{js,cjs,d.ts}`
 *      `banner: { js: '"use client"' }` を付ける。React component の多くは Base UI の
 *      hook(useRender / useState 等)を使うため、Next.js App Router 等の RSC bundler が
 *      Server Component から safe に import できるよう、dist 全体に directive を機械的に
 *      prepend する(Radix UI / Mantine / shadcn-ui と同じ library publish 慣習)。
 *      Server / Client 境界の判断は library 側で担保し、consumer に "use client" の
 *      wrapping を強いない。
 *
 *   2. preset bundle     — `preset.ts` → `dist/preset.{js,cjs,d.ts}`
 *      `banner` は付けない。preset は Panda の build-time config(`definePreset()` で
 *      theme / recipe を返す純粋 module)であり、React renderer は触らない。"use client"
 *      を付けると意味的におかしいので明確に分ける。
 *
 * external dependencies は consumer が持つ前提で bundle に含めない:
 *   - react / react-dom         (peer、hook 共有のため同 instance 必須)
 *   - @base-ui-components/react (peer、hook 共有のため同 instance 必須)
 *   - @pandacss/dev             (peer、preset が runtime で definePreset を呼ぶ)
 *
 * alias:
 *   - "@otibo/ui/styled-system" → ./styled-system
 *     library code 内の named import(`from "@otibo/ui/styled-system/recipes"` 等、
 *     Panda library publish の Approach 4 の前提 ── decision.md §I)を、tsup の build 時に
 *     library 内の Panda codegen 出力に解決する。consumer 側では consumer の panda.config
 *     の importMap 経由で別途解決される(Panda の magic)。
 *
 *   preset.ts は内部で `./src/core-ui/<name>/<name>.recipe` を relative import
 *   しているため、build しないと consumer 側で依存が解決できない
 *   (`_docs/intent/Pkg/initial-public-publish/decision.md` §E 参照)。
 */

const shared: Options = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2020",
  external: ["react", "react-dom", "@base-ui-components/react", "@pandacss/dev"],
  esbuildOptions(options) {
    options.alias = {
      ...(options.alias ?? {}),
      "@otibo/ui/styled-system": path.resolve(__dirname, "styled-system"),
    }
    // Panda codegen 出力は .mjs(esbuild default は .ts/.tsx/.js/.jsx のみ)、
    // alias 経由で resolve するために .mjs を resolveExtensions に追加。
    options.resolveExtensions = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".css", ".json"]
  },
}

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts" },
    // intent: Pkg-Bug-6 — RSC bundler 向けの client directive を全 component dist の先頭に
    // 機械的に prepend する。Server Component から直接 import 可能にするための library-side
    // 担保。preset には付けない(別 config)。
    banner: { js: '"use client"' },
    clean: true,
  },
  {
    ...shared,
    entry: { preset: "preset.ts" },
    // clean は 1 つ目で済んでいる。ここで clean: true を入れると index の dist が消える。
  },
])
