# @otibo/ui

otibo Design System ── Base UI(headless primitive)+ Panda CSS で組まれた、React 用 UI library。

## Install

```bash
npm install @otibo/ui
# peer dependencies(consumer 側に必要)
npm install @base-ui-components/react @pandacss/dev react react-dom
```

## Usage

### Component

```tsx
import { Button, Field, Link } from "@otibo/ui"

export function Example() {
  return (
    <Field>
      <Field.Label>メールアドレス</Field.Label>
      <Field.Input type="email" />
      <Field.Description>仕事用のアドレスをご利用ください</Field.Description>
    </Field>
  )
}
```

提供 component の一覧は `dist/index.d.ts` の export を参照(button / link / input / field / card / select / combobox / toggle / chip / segmented-control / tabs / breadcrumb / pagination / navigation-menu / dialog / popover / menu / tooltip / preview-card / table / toast / checkbox / switch / radio / number-field / badge / avatar / icon / accordion / inline-edit / spinner / skeleton / progress / meter / slider / scroll-area / separator)。

### Panda preset

consumer の `panda.config.ts` で otibo preset を extend し、Panda の codegen を実行します。

```ts
import { defineConfig } from "@pandacss/dev"
import { otiboPreset } from "@otibo/ui/preset"

export default defineConfig({
  presets: [otiboPreset],
  include: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@otibo/ui/dist/**/*.{js,cjs}",
  ],
  // 重要: runtime / manager 描画される component は static usage 検出されないため、
  // staticCss で常時 emit する必要がある(toast / pagination / combobox 等)。
  staticCss: {
    recipes: {
      toast: ["*"],
      pagination: ["*"],
      combobox: ["*"],
      navigationMenu: ["*"],
      numberField: ["*"],
      toggle: ["*"],
      chip: ["*"],
    },
  },
  outdir: "styled-system",
  jsxFramework: "react",
})
```

その後、consumer の build pipeline で `panda codegen` を実行(`prepare` script や `predev` で hook):

```jsonc
// consumer の package.json
{
  "scripts": {
    "prepare": "panda codegen"
  }
}
```

## Requirements

- **Panda CSS が必須**。Tailwind / CSS modules 等との併用は想定外。
- **React 18+**(React 19 は未検証)。
- **TypeScript 5+** 推奨。

## License

[MIT](LICENSE.txt) © penne / ぺんね
