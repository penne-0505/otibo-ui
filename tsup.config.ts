import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, type Options } from "tsup"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * tsup build configuration for @otibo/ui.
 *
 * component bundle — `src/index.ts` → `dist/index.{js,cjs,d.ts}`
 *      `banner: { js: '"use client"' }` を付ける。React component の多くは Base UI の
 *      hook(useRender / useState 等)を使うため、Next.js App Router 等の RSC bundler が
 *      Server Component から safe に import できるよう、dist 全体に directive を機械的に
 *      prepend する(Radix UI / Mantine / shadcn-ui と同じ library publish 慣習)。
 *      Server / Client 境界の判断は library 側で担保し、consumer に "use client" の
 *      wrapping を強いない。
 *
 * external dependencies は bundle に含めない:
 *   - react / react-dom         (peer、hook 共有のため同 instance 必須)
 *   - @base-ui/react            (通常 dependency、package manager が consumer へ導入)
 *
 * alias:
 *   - "@otibo/ui/styled-system" → ./styled-system
 *     library code 内の named import(`from "@otibo/ui/styled-system/recipes"` 等)を、
 *     tsup build 時に repository 内の Panda codegen 出力へ解決する。Panda と preset は
 *     0.3.0 から consumer contract ではなく internal authoring concern。
 */

const shared: Options = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2020",
  external: ["react", "react-dom", "@base-ui/react"],
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

export default defineConfig({
  ...shared,
  entry: { index: "src/index.ts" },
  // intent: Pkg-Bug-6 — RSC bundler 向けの client directive を全 component dist の先頭に
  // 機械的に prepend する。Server Component から直接 import 可能にするための library-side
  // 担保。
  banner: { js: '"use client"' },
  clean: true,
})
