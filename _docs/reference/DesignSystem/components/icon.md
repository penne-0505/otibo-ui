---
title: Icon
status: active
component: src/core-ui/icon/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**汎用 stroke icon**(viewBox 16、registry pattern)。`<Icon name="check" />` で引く。**recipe を持たない純 React component**(SVG 直接出力)── 色は `currentColor` 継承で**置いた文脈の color がそのまま乗る**(checkbox の白、accent、fg.muted、何でも)。`round cap / join` で otibo の柔らかい線質に揃え、size 既定は `1em`(文脈の font-size 追従)。新規 icon は `REGISTRY` に body + strokeWidth を足すだけ。

## API

```tsx
<Icon name="check" />
<Icon name="search" size={18} />
<Icon name="chevron-down" strokeWidth={1.5} />
```

```ts
interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName              // REGISTRY の key、type-safe
  size?: string | number      // 既定 1em(文脈追従)
}
```

`strokeWidth` は registry に icon ごとの最適値が登録されているが、prop で上書き可能。

## Variants

**recipe variant は持たない**(純コンポーネント)。事実上の variant は `name`(icon の種類)と `size`(寸法):

- **size** ── 既定 `1em`(文脈の font-size 追従)。px や em / rem を直接渡せる。
- **strokeWidth** ── 既定は registry の per-icon 値(check=2 / chevron=1.75 / star=1.2 等)、prop で上書き可。

## States

なし(静的 SVG)。

## Icon registry(canonical 一覧)

現状 REGISTRY に登録されている icon(`src/core-ui/icon/icon.tsx`):

| name | 用途 | strokeWidth |
| --- | --- | --- |
| `check` | checkbox の checked indicator(`pathLength={1}` 正規化) | 2 |
| `dash` | checkbox の indeterminate indicator(`pathLength={1}`) | 2 |
| `plus` | NumberField の increment、追加 action | 1.5 |
| `minus` | NumberField の decrement、削除 action | 1.5 |
| `grid` | view モード切替(grid 表示) | 1.3 |
| `list` | view モード切替(list 表示) | 1.5 |
| `star` | お気に入り(Toggle 等) | 1.2 |
| `chevron-down` | Select / Combobox / NavigationMenu の icon | 1.75 |
| `chevron-left` / `chevron-right` | Pagination の prev/next、Breadcrumb 派生 | 1.75 |
| `search` | Combobox の searchIcon | 1.5 |
| `close` | Toast の close、Dialog の close 派生 | 1.5 |
| `more` | overflow メニューの trigger(dots、塗りつぶし circle) | 0 |
| `user` | Avatar fallback、profile menu | 1.4 |
| `help` | tooltip / popover の trigger アイコン | 1.5 |

新規追加は **REGISTRY に body(path / rect / circle 等)+ strokeWidth を足す**だけ ── consumer 側で type-safe(`IconName` が REGISTRY の key を join した union)。

## a11y

- **`aria-hidden="true"` が既定**(decorative icon が SR で読まれない、Icon の標準的扱い)。
- **意味のある icon**(text 無しの button 等)では消費側で **親要素に `aria-label`** を付ける(例:`<Button aria-label="閉じる"><Icon name="close" /></Button>`)。
- **`aria-label` を Icon に直接付ける** こともできる(SVG props がそのまま渡る)が、`role="img"` も付ける必要があり grain として親要素 label を推奨。

## Motion

なし(静的)。Icon 自体は state を持たず動かない。ただし **`pathLength={1}` 正規化**により checkbox の「描く」animation(`stroke-dasharray: 1` / `offset: 1→0`)が **stroke の実長に依らず描画完了が末尾でぴたり揃う** ── これは Icon の役割(描画 ready の幾何)、motion は checkbox 側が持つ。

## Use when

- form control / button / nav の **意味の凡例** として icon を載せる場面。
- text と並んだ identity マーカー(label の前 / 後ろ)。
- 装飾でない、**機能を補強する**場面(close、search、chevron、check 等)。

## Use instead

- **人 / 主体の像** → **Avatar**(circle + image + fallback、grain が違う)。
- **identity ラベル** → **Badge**(text + 細線、icon ではない identity)。
- **複雑な illustration** → SVG を直接書く(Icon は 16 viewbox の小さな symbol 専用)。
- **emoji** → 文脈次第(`<span>` で直接入れる、Icon registry には入れない)。

詳細は `component-selection-map.md` §identity。

## Avoid

- **REGISTRY 外の icon を ad hoc に SVG で書く**(consumer 側に散らばる、grain が崩れる) → REGISTRY に追加する。
- **size を `1em` 以外で散発的に指定**(文脈追従 grain を破る、合わせるべき font-size から外れる) → 専用寸法が要る時だけ明示。
- **`stroke` を変えて icon を装飾的に**(currentColor 継承の grain を破る、文脈の color から外れる) → currentColor 維持。
- **意味のある icon で `aria-hidden` のまま**(SR が機能を読めない) → 親要素 / Icon に label。
- **`pathLength={1}` を削る**(checkbox の描画 animation が壊れる) → check / dash は維持。

## Decisions(本セッションの確定事項)

- **viewBox 16 統一、stroke ベース、currentColor 継承** ── otibo の柔らかい線質、文脈追従の色。fill ベースの icon は採らない(stroke の方が小さい寸法で読みやすい + 文脈追従しやすい)。
- **`round cap / round join`** ── 線の端点・接点を丸める、otibo の柔らかい線質の grain。
- **registry pattern**(`REGISTRY` object) ── consumer 側で type-safe(`IconName` union)、新規追加は body + strokeWidth を足すだけ、recipe を増やさない。
- **size 既定 `1em`、文脈追従** ── font-size に合わせて自然に scale、消費側で明示的指定不要(text と並んだとき自然に揃う)。
- **`pathLength={1}` 正規化(check / dash)** ── checkbox の描画 animation が stroke 実長に依らず末尾でぴたり揃う、Icon と Checkbox の grain 連動。
- **`aria-hidden="true"` 既定**(decorative 扱い) ── 意味のある icon は消費側で親に label。

## Related

- 上位:`principles.md` §1(構造区切りは余白、線は最小 + 柔らかい)、§5(accent precious、currentColor 継承で文脈の color に従う)
- 兄弟(identity):Avatar / Badge
- 連動(描画 animation):Checkbox(`pathLength={1}` + `stroke-dasharray`)
- 住み分け:`component-selection-map.md` §identity
- 詳細:`src/core-ui/icon/icon.tsx`(canonical 実装、REGISTRY も)
- memory:[[otibo-ds-progress]](Icon の決定全般)
