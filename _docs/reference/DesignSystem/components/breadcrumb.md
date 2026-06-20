---
title: Breadcrumb
status: active
component: src/core-ui/breadcrumb/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**階層内の現在地を示す navigation**。otibo らしい **純構造**(色を塗らず text と separator で語る in-grain)、separator は専用部品を増やさず CSS `::before` で自動挿入。crumb は **下線なし** ── prose Link の常時下線とは別の grain で、breadcrumb 行に全項目下線が並ぶと noisy になる。最終要素は current(`fg.strong` + `aria-current`)、それ以外は link(`fg.muted` → hover/focus で accent、treatment B 文法)。

## API

slot recipe(Panda)+ 純 otibo(Base UI 不要、semantic HTML `<nav>` + `<ol>` で組む)。slot は `root` / `item` / `link` / `current`。

```tsx
<Breadcrumb.Root>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">ホーム</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/works">作品</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Current>2026 春</Breadcrumb.Current>
  </Breadcrumb.Item>
</Breadcrumb.Root>
```

`root` は `<ol>`(`list-style: none`)、`item` は `<li>`、最終 item は `current` を持ち link を持たない(遷移できない)。

## Variants

なし(単一形)。size は持たない(`fontSize: sm` 固定、navigation 文脈で揃える)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | `flex` + `flex-wrap: wrap` + `align-items: center` + `font-size: sm` + `line-height: tight` |
| **item separator**(2 番目以降の前) | `::before` で `"/"` を `fg.subtle` + `marginInline: 2`(構造として自動挿入) |
| **link rest** | `color: fg.muted` + `text-decoration: none`(下線なし) |
| **link hover** | `color: accent` |
| **link focus-visible** | `color: accent` + `outline: 2px solid accent` + `outlineOffset: 2px` |
| **current** | `color: fg.strong` + `fontWeight: medium`(遷移しない、最終要素のマーカー) |

**下線なしの理由**:Link(prose)は常時下線で「これはリンク」を affordance するが、breadcrumb は **行全体が nav** で並ぶ link が多く、全項目下線は noisy。形(separator で区切られた行)と hover で accent に立ち上がる treatment B の組み合わせで「nav である」を示す。

## a11y

- **structure** ── `<nav aria-label="Breadcrumb">` ラッパ(消費側で付ける)+ `<ol>`(順序ありリスト)が WAI-ARIA Breadcrumb pattern の定型。
- **current の伝達** ── 最終要素に `aria-current="page"` を付ける(`Breadcrumb.Current` が自動付与)。
- **separator は SR から hide** ── `::before` の `"/"` は **content として SR が読む可能性**がある(ブラウザ実装による)。気になる場合は `aria-hidden="true"` 相当を contents に出さないよう、消費側で separator を別要素で組む選択肢もある(現状は `::before` を許容、grain を取った)。
- **keyboard** ── 各 link が tab-stop、Enter で遷移(ネイティブ `<a>`)。current は tab-stop ではない。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard) |
| 対象 property | `color`(下線も border-color も無いので color のみ) |

quiet 領域。Link / NavigationMenu Trigger / PreviewCard Trigger と同じ treatment B の文法に揃う(平常は静か、hover で accent が立ち上がる)。

## Use when

- **階層 nav が必要なページ**(設定 > プロフィール > アバター、作品 > 個展 > 個別作品 等)。
- ユーザーが「今どこにいるか」と「**上の階層に戻れる**」を同時に伝えたい時。

## Use instead

- **同一画面の content 切替** → **Tabs**(階層情報が消える、目的違い)。
- **トップへの導線** → **NavigationMenu** / **Link**(階層なしの単独遷移)。
- **長 list の送り** → **Pagination**(階層ではなく同一 list の窓)。

詳細は `component-selection-map.md` §navigation。

## Avoid

- **link に下線を足す**(prose Link の grain で breadcrumb を組むと行が noisy になる) ── 下線なし + 形 + hover accent で十分。
- **current を link にする**(`aria-current="page"` の要素を click できる link にすると、自ページへの再 navigation で「何も起きない」噛み合わせ)── current は遷移しない。
- **separator に独自記号(`>` / `›` / `→`)を散らす** ── `"/"` 一本に揃える(grain として一本化、迷ったら別 component で表現する)。
- **階層の代わりに Tabs**(階層情報が消える) → Breadcrumb。
- **長すぎる階層をベタに全部出す**(7 階層を全部行に並べると line-break で破綻)── 中間を `…` で省略する処理を消費側で組む(component 内蔵にしない)。

## Decisions(本セッションの確定事項)

- **separator は CSS `::before` で自動挿入** ── 専用 `Breadcrumb.Separator` 部品を増やさない方針(structure を recipe が握り切る)。消費側で「separator を入れる入れない」を気にしなくて済む。
- **crumb link は下線なし**(prose Link との分離) ── breadcrumb は行全体が nav で、全項目下線は noisy。形と treatment B で affordance を示す。
- **最終要素 = current(`aria-current="page"` + fg.strong + medium)、link ではない** ── 自ページへの再 navigation を avoid + SR に「現在地」を伝達。
- **separator は `"/"` 固定**(`>` `›` `→` を散らさない) ── grain の一本化。
- **`<ol>` 採用**(`<ul>` ではない) ── 階層に**順序がある**(上→下)ので `<ol>`(WAI-ARIA Breadcrumb の慣例)。

## Related

- 上位:`principles.md` §1(構造区切りは余白、最小限の hairline)、§5(accent precious、interaction 時の accent)、§11(hover trigger は予見、treatment B)
- 兄弟(treatment B 同文法):Link / NavigationMenu Trigger / PreviewCard Trigger
- 住み分け:`component-selection-map.md` §navigation(Tabs vs NavigationMenu vs Breadcrumb)
- 詳細:`src/core-ui/breadcrumb/breadcrumb.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](Breadcrumb の決定全般)
