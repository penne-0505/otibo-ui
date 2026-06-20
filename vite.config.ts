import { defineConfig } from "vite"

/**
 * Ladle 用 Vite 設定(.ladle/config.mjs の viteConfig から参照)。
 *
 * 目的:Base UI のサブパスを boot 時に一括 pre-bundle させる。
 * これを include しないと、story を初訪問した時点で Vite が当該サブパスを
 * 遅延最適化し、既にロード済みの React とは別 optimize パス(別 ?v= ハッシュ)に
 * なって React が二重ロードされ、"Invalid hook call / more than one copy of React"
 * を起こす(dev のみの artifact)。全サブパスを先に列挙して揃える。
 */
export default defineConfig({
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@base-ui-components/react/checkbox",
      "@base-ui-components/react/dialog",
      "@base-ui-components/react/field",
      "@base-ui-components/react/merge-props",
      "@base-ui-components/react/popover",
      "@base-ui-components/react/radio",
      "@base-ui-components/react/radio-group",
      "@base-ui-components/react/select",
      "@base-ui-components/react/switch",
      "@base-ui-components/react/tabs",
      "@base-ui-components/react/tooltip",
      "@base-ui-components/react/use-render",
    ],
  },
})
