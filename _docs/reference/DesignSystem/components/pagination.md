---
title: Pagination
status: active
component: src/core-ui/pagination/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**リスト送りの navigation**(同一 list の窓を切り替える)。現在ページ(`active=true`)は **accent 塗り + 白文字** ── 単一の小さな chip なので色は散らない(color layering の正しい側)。他ページ / prev / next は ghost(透明 + `fg.muted`、hover で `surface.muted`)で、active だけが accent で立ち上がる。tabs(下線)/ segmented(白 pill)と並ぶ「選択」表現の一種だが、pagination は number の格子なので **塗りつぶし chip が最も読みやすい**。

## API

slot recipe(Panda)+ 純 otibo(Base UI 不要、`<button>` を並べる)。slot は `root` / `item` / `ellipsis`。`active` variant が item に乗る。

```tsx
<Pagination.Root>
  <Pagination.Item disabled>‹</Pagination.Item>
  <Pagination.Item>1</Pagination.Item>
  <Pagination.Ellipsis />
  <Pagination.Item>5</Pagination.Item>
  <Pagination.Item active>6</Pagination.Item>
  <Pagination.Item>7</Pagination.Item>
  <Pagination.Ellipsis />
  <Pagination.Item>20</Pagination.Item>
  <Pagination.Item>›</Pagination.Item>
</Pagination.Root>
```

**windowing(`1 ... 現在±1 ... last`)は消費側で組む** ── component 内蔵にしない方針(柔軟性のため)。Item / Ellipsis を並べる primitive 単位の出し方を採用。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `active` | `true` | (none) | 現在ページの item に乗せる |

active 単一の variant のみ(size は持たない)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **item rest(inactive)** | `bg: transparent` + `color: fg.muted` + `fontWeight: medium` + `fontVariantNumeric: tabular-nums` |
| **item hover** | `bg: surface.muted` + `color: fg.strong` |
| **item `active=true`** | `bg: accent` + `color: surface`(白 on 色、blessed pattern) |
| **item active hover** | `bg: accent.hover` + `color: surface` |
| **item focus-visible** | `outline: 2px solid accent` + `outlineOffset: 1px` |
| **item disabled** | `opacity: disabled` + `cursor: not-allowed`、hover 無効化(prev/next の端で利用) |
| **ellipsis** | `color: fg.subtle`、押せない(`<span>`) |

**寸法固定**(`minWidth: 2rem` + `height: 2rem`) ── 2 桁(例 10)が収まる幅を既定にし、1 桁もこの幅の中央に置く。**窓移動時の width 揺れを防ぐ**(ページ 9 → 10 で item が伸びる現象を avoid)。

**`fontVariantNumeric: tabular-nums`** ── 桁幅を等幅化、数字が変わっても幅がぴくつかない(同様の窓揺れ防止)。

## a11y

- **structure** ── `<nav aria-label="Pagination">` ラッパ(消費側で付ける)。
- **active item** ── `aria-current="page"` を消費側で付ける(`active=true` と並行 ── component は CSS だけ握り、aria は消費側で組む)。
- **prev/next** ── 端で disabled になる時はネイティブ `<button disabled>` か `aria-disabled="true"`。`disabled` 推奨(click を完全に止める)。
- **ellipsis** ── `<span>`(focus 不可)。SR には文脈で「省略」と伝わる(content `…`)。
- **keyboard** ── 各 button が tab-stop、Enter / Space で activate(ネイティブ)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard) |
| 対象 property | `color, background-color` |

quiet 領域。active 切替は瞬時に近い色 swap で、translate / scale は持たない。

## Use when

- **長い list を窓で切る**(blog index、検索結果、テーブルの行)。
- ページ番号で navigate したい場面(URL に `?page=N` が乗る形)。
- 30 ページ以上で windowing(`1 ... 現在±1 ... last`)が要る場面。

## Use instead

- **無限スクロール / "もっと見る" ボタン** → Pagination ではなく独自ボタン(grain は別、ここでは扱わない)。
- **同一画面の content 切替**(URL を変えない) → **Tabs**。
- **階層 nav** → **Breadcrumb**。

詳細は `component-selection-map.md` §navigation。

## Avoid

- **30 ページ以上をベタに並べる**(UI 破綻、line-break で割れる) → windowing を消費側で組む。
- **active item の色を accent 以外に**(blessed pattern を破る、checkbox/switch/pagination の選択表現一貫性が崩れる)。
- **prev/next の disabled を見せず click 可能のまま**(端で何も起きない噛み合わせ) → `disabled` 属性 or `aria-disabled`。
- **item の `minWidth: 2rem` を消す**(ページ 9 → 10 で item が伸びる窓揺れ) → 固定幅 + tabular-nums。
- **active の hover でさらに濃くする以外の動き**(scale / shadow / translate)── quiet 領域、accent.hover で十分。

## Decisions(本セッションの確定事項)

- **active = accent + 白(blessed pattern、原則 4)** ── checkbox checked / switch on / toggle pressed / chip pressed と完全同系。number の格子なので塗りつぶし chip が最も読みやすい(下線では弱い、pill では幅揺れ)。
- **windowing は消費側で組む** ── component 内蔵にしない方針。Item / Ellipsis を並べる primitive 単位で、消費側が UI に合わせて窓ロジックを書く。
- **`minWidth: 2rem` + `height: 2rem` + `tabular-nums`** ── 2 桁固定幅 + 等幅数字で**窓揺れを完全に止める**。
- **prev / next もただの Item**(別 component に分けない) ── 全部同じ formatting に乗る、active variant が active を表現、disabled で端を表現。最小の primitive 構成。
- **ellipsis は `<span>`、focus 不可** ── 押せないものに interaction affordance を出さない(原則 11 の裏返し:hover trigger でなければ静かに)。

## Related

- 上位:`principles.md` §4(白 on 色、blessed pattern)、§5(accent precious、active のみ accent)
- 兄弟(同 active 表現):Toggle / Chip / SegmentedControl(active = accent + 白の同系)
- 住み分け:`component-selection-map.md` §navigation
- 詳細:`src/core-ui/pagination/pagination.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](Pagination の決定全般)
