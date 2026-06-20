---
title: ScrollArea
status: active
component: src/core-ui/scroll-area/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**カスタムスクロール領域**(細い hairline scrollbar)。ブラウザ既定の太い scrollbar を、otibo の **細い 0.5rem hairline** に置き換える ── 色なし、thumb は通常 `fg 15%` の薄い線(地と馴染む)、scrollbar 軌道に**直接 hover** で `fg.muted` へ濃く。scroll は機能であり装飾ではないので、自走の脈動は持たない。**ページ全体の scroll は wrap しない**(ネイティブ kinetic scroll が損なわれる) ── 領域内の overflow に限る(dialog body / long list panel など)。

## API

slot recipe(Panda)+ Base UI ScrollArea 委譲。slot は `root` / `viewport` / `scrollbar` / `thumb`(4 slot)。

```tsx
<ScrollArea.Root style={{ height: "20rem" }}>
  <ScrollArea.Viewport>
    {/* 長い content */}
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

固定高さの領域(`Root` 側で `style` / `className` で size を与える)に長い content を内蔵するとき使う。

## Variants

なし(単一形)。size variant は持たない(scrollbar の太さは grain として `0.5rem` 固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | `position: relative` + `overflow: hidden`(scrollbar を overlay できるよう) |
| **viewport** | `width/height: 100%` + `overflow: auto` + **ネイティブ scrollbar 非表示**(`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) |
| **scrollbar(vertical)** | `width: 0.5rem`、padding なし(端で thumb が短く見える問題を回避) |
| **scrollbar(horizontal)** | `height: 0.5rem`、flex column |
| **scrollbar rest** | `--scroll-thumb: color-mix(in oklch, fg 15%, transparent)`(地と馴染む薄線) |
| **scrollbar hover**(scrollbar 軌道に**直接** pointer) | `--scroll-thumb: fg.muted`(濃く) |
| **thumb** | `flex: 1` + `borderRadius: full` + `bg: var(--scroll-thumb)` + quick transition |

**padding なしの理由**(0.5rem 軌道):内側 padding を入れると **端で thumb の上下が詰まって「最上部 / 最下部で thumb が短く見える」=端の表示が不自然**になる ── 圧縮前の検証で発覚した修正点(圧縮前 ScrollArea 修正:`paddingBlock/paddingInline: 1` を 0 に)。

**scrollbar 軌道 hover の grain**:Base UI の `data-hovering` は **Root の pointer 状態**(コンテナ全体 hover で true)= overlay scrollbar 風の挙動 ── otibo の意図(scrollbar 自体に pointer が乗った時に濃くなる)と違う。代わりに **scrollbar 自身の `:hover` で CSS 変数を切り替える**(クラス名 hardcode 回避)── これも圧縮前の検証で発覚した修正点。

## a11y

- **primitive** ── `@base-ui-components/react/scroll-area`(Root / Viewport / Scrollbar / Thumb)。
- **role** ── ネイティブ scrollbar の機能を保持(Base UI が viewport の overflow を維持、SR は通常の overflow 領域として扱う)。
- **keyboard** ── ネイティブ(↑↓ / PageUp/Down / Home/End)、focus 可能要素を viewport 内に置けば tab で移動。
- **touch** ── viewport の overflow が auto なので touch scroll はネイティブ(scrollbar は overlay 装飾)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard) |
| 対象 property | `background-color, opacity` |

quiet 領域。thumb 色の hover transition だけが motion。自走の脈動は無い(scroll は機能、装飾ではない)。

## Use when

- **固定高さの領域**に長い content を内蔵する場面(dialog body、settings panel 内 list、code block)。
- **ブラウザ既定の太い scrollbar を otibo の細 grain に統一したい**場面。

## Use instead

- **ページ全体の scroll** → ネイティブ scroll(ScrollArea で wrap しない、kinetic scroll が損なわれる、accessibility にも影響)。
- **領域が短くて scroll が要らない場面** → 素の `<div>`(scrollbar 表示の grain を持ち込まない)。
- **無限スクロール / 仮想 list** → 専用 library(react-window / TanStack Virtual 等、otibo の領分外)。

詳細は `component-selection-map.md` §structure。

## Avoid

- **ページ全体の scroll を ScrollArea で wrap**(モバイル kinetic scroll が損なわれる、a11y にも影響) → 領域内の overflow に限る。
- **scrollbar に padding を足す**(端で thumb が短く見える問題が再発) → 0 維持。
- **`data-hovering` で thumb を濃くする**(Base UI は Root pointer 状態で = コンテナ全体 hover で発火、overlay 風挙動が otibo の grain と違う) → scrollbar 自身の `:hover` + CSS 変数で切替維持。
- **scrollbar 太さを変える**(grain の 0.5rem 固定) → 維持。
- **scrollbar 色を accent / 強調色に**(scroll は機能、accent 撒かない、原則 5) → fg 系の地と馴染む grain。

## Decisions(本セッションの確定事項)

- **scrollbar 太さ 0.5rem 固定**、padding なし ── 細 hairline grain + 端で thumb が短く見えるバグ回避。
- **scrollbar hover は scrollbar 自身の `:hover` + CSS 変数** ── Base UI `data-hovering` は Root pointer 状態で overlay 風挙動、otibo の意図(scrollbar 軌道に直接 pointer が乗った時)と違うため自前で組む。
- **thumb 色 = `fg 15%`(rest)→ `fg.muted`(hover)** ── 地と馴染む薄線で平常時は静か、scrollbar に触れた時だけ濃くなる(原則 5 accent precious と整合)。
- **ネイティブ scrollbar 非表示**(`scrollbar-width: none` + `::-webkit-scrollbar`) ── Base UI が overlay の細 scrollbar を別途描く。
- **ページ全体 scroll を wrap しない**(grain として明示) ── 領域内の overflow 専用、ネイティブ scroll を尊重。

## Related

- 上位:`principles.md` §1(構造区切りは余白 / hairline、scrollbar も最小)、§5(accent precious、scrollbar に accent 使わない)、§14(Base UI 一本)
- 隣接:Dialog(body 内 scroll)、Menu / Select / Combobox(popup 内 scroll、ただし overflow auto で十分な場合は ScrollArea を使わない)
- 別構造:Separator(純構造)
- 住み分け:`component-selection-map.md` §structure
- 詳細:`src/core-ui/scroll-area/scroll-area.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/scroll-area`
- memory:[[otibo-ds-progress]](ScrollArea の決定全般)
