# @otibo/ui

otibo Design Systemの既定の見た目を、複数のReact app / pageへそのまま配るUI libraryです。

component、reset、design tokens、Gen Interface JPをpackage内に収録しています。Panda CSSの導入や設定は必要ありません。

## Install

```bash
npm install @otibo/ui
# appに未導入の場合のみ
npm install react react-dom
```

## Usage

appのroot entryまたはlayoutで、CSSを一度だけ読み込みます。

```tsx
import "@otibo/ui/styles.css"
```

その後は必要なcomponentをimportします。

```tsx
import { FieldDescription, FieldInput, FieldLabel, FieldRoot } from "@otibo/ui"

export function Example() {
  return (
    <FieldRoot>
      <FieldLabel>メールアドレス</FieldLabel>
      <FieldInput type="email" />
      <FieldDescription>仕事用のアドレスをご利用ください</FieldDescription>
    </FieldRoot>
  )
}
```

compound componentを含め、公開APIはflat named exportに統一されています。React、Vite、Next.js App Routerで同じimport形式を使います。

提供 component の一覧は `dist/index.d.ts` の export を参照(button / link / input / field / card / select / combobox / toggle / chip / segmented-control / tabs / breadcrumb / pagination / navigation-menu / dialog / popover / menu / tooltip / preview-card / table / table-scroll / toast / checkbox / switch / radio / number-field / badge / avatar / logo-frame / media-frame / prose / icon / accordion / inline-edit / spinner / skeleton / progress / meter / slider / scroll-area / separator)。

## Global styles

`@otibo/ui/styles.css`はcomponent stylesだけでなく、otibo app baselineとして次をdocument全体へ適用します。

- browser reset / preflight
- page background、text color、typography
- design tokensと全component variant
- Gen Interface JP 400 / 500 / 600

既存siteへ部分的に追加する場合は、既存のglobal CSSとcascadeが競合しないか確認してください。resetなしのentrypointは提供していません。

fontはUnicode rangeごとのsubsetに分かれており、browserは表示する文字に必要なfileだけを取得します。3ウェイトを自己完結して配布するため、0.3.0のnpm tarballは約10.45 MBです。

## Migrating from 0.2.x

0.3.0ではconsumer-side Panda codegenを廃止しました。

1. consumerの`panda.config.ts`から`@otibo/ui/preset`と`panda.buildinfo.json`の設定を外します。
2. `@pandacss/dev`をotibo-uiのためだけに導入していた場合は削除できます。
3. app rootで`@otibo/ui/styles.css`を一度importします。
4. namespace形式をflat named exportへ移行します。0.3.0では旧namespace exportを直接削除しているため、両形式の併用期間はありません。

```tsx
// 0.2.x
import { Field } from "@otibo/ui"
<Field.Root><Field.Label>名前</Field.Label></Field.Root>

// 0.3.x
import { FieldLabel, FieldRoot } from "@otibo/ui"
<FieldRoot><FieldLabel>名前</FieldLabel></FieldRoot>
```

token / recipe / themeの深いカスタマイズは0.3.0の公開互換性保証に含まれません。

## Requirements

- **Node.js 22+**(開発 baseline は Node.js 24 LTS)。
- **React 18 / 19**。
- **TypeScript 5.9** 推奨。

## Development

ドキュメント駆動の作業規約は [Quickstart](QUICKSTART.md) と
[_docs/documentation_guide.md](_docs/documentation_guide.md) を参照してください。
ローカルの正典となる docs gate は `npm run docs:check`、package/release gate は
`npm run release:check` です。template provenance は
`docs-template.lock.json` に固定します。

## License

[MIT](LICENSE.txt) © penne / ぺんね

同梱するGen Interface JPはSIL Open Font License 1.1です。font licenseはpackage内の`dist/fonts/OFL.txt`に収録しています。
