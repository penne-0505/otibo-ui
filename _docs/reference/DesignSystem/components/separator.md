---
title: Separator
status: active
component: src/core-ui/separator/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**section / inline の hairline 区切り**(純構造の primitive)。色なし、`border.subtle` の hairline だけ。otibo はこれまで各 component 内で hairline を使ってきたが(menu の divider、accordion の項目間、table の行間)、**公開 API としての Separator は無かった ── その空白を埋める**。**余白は持たない**(置く側 = layout が決める、separator 単体に margin を bake しない)── **原則 1「構造区切りは余白」の補助役**、narrow な救援としてのみ使う(迷ったら使わず余白で)。

## API

純 otibo + Base UI Separator 委譲(role 担保)。slot なし(単一 element)。

```tsx
{/* horizontal(既定):section 間 */}
<Separator />

{/* vertical:inline 文字列の縦 hairline */}
<span>項目A</span>
<Separator orientation="vertical" />
<span>項目B</span>
```

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `orientation` | `horizontal` / `vertical` | `horizontal` | section 区切り(horizontal)/ inline 縦 hairline(vertical) |

- **horizontal** ── `height: 1px` + `width: 100%`
- **vertical** ── `width: 1px` + **`height: 1em`**(inline の文字行高さに自然に合う) + `alignSelf: center`

## States

| State | 視覚 |
| --- | --- |
| **rest** | `bg: border.subtle` + `border: none` + `flexShrink: 0` |

state を持たない静的構造。

## a11y

- **primitive** ── `@base-ui-components/react/separator`(role 担保)。
- **role** ── `separator`(decorative なら `aria-hidden`、消費側で判断)。
- **orientation 属性** ── Base UI が `aria-orientation="horizontal/vertical"` 自動配線。

## Motion

なし(静的)。Separator は state を持たず動かない。

## Use when

- **どうしても余白で分節できない密集領域での hairline**(余白 grain を破らずに narrow に救援)。
- **inline 文字列の縦 hairline**(`A | B | C` の `|`、ただし 2026-06-21 の判断で account-settings footer ですらこれは外し「余白だけで分ける」に倒した ── 使う場面は限定的)。

## Use instead

- **section 間 / card 間 / row 間の区切り** → **余白(gap / margin)**(otibo の grain、原則 1)。Separator を打たない。
- **領域の地の切替** → `surface.muted` / `surface.raised` で背景を切り替える(輪郭でなく地の差で示す)。
- **column の区切り** → grid / flex の gap(線でなく余白で)。

詳細は `component-selection-map.md` §structure(Separator の使い時)。

## Avoid

- **構造区切りで毎回 Separator を打つ**(原則 1「構造区切りは余白」の grain を破る) → 余白で分節を試みる。
- **Separator に margin / padding を bake**(置く側のレイアウトが上書きしにくくなる、流用が利かない) → 余白は layout で。
- **Separator を装飾的に色付きに**(色なし grain を破る) → border.subtle 維持。
- **table の行間 / accordion の項目間 / menu の divider に Separator を打ち直す**(各 component 内で hairline を持っているので二重) → recipe 内蔵の hairline を使う。
- **見た目を強調したくて太く / 濃く**(grain として最小) → hairline 維持。

## Decisions(本セッションの確定事項)

- **公開 API として薄く保つ**(各 component 内 hairline を一本化しない) ── menu / accordion / table はそれぞれ内蔵 hairline を持つ(余白規則と一体になった decision)、Separator は **未着手領域での hairline 救援**として独立。
- **余白を持たない**(margin / padding なし) ── 流用性のため、layout 側に委ねる。「区切りは要素間関係の表現」grain。
- **vertical の高さ = `1em`** ── inline で使うとき自然に文字行の高さに合う(数値固定でなく文脈追従)。
- **色なし、`border.subtle` 一色** ── 装飾性を持たない、純構造 primitive。
- **`narrow な救援`位置付け**(原則 1「構造区切りは余白」の補助役) ── 迷ったら余白で、どうしても余白で分節できない時だけ使う。

## Related

- 上位:`principles.md` §1(構造区切りは余白、Separator は narrow 救援) ── Separator 撤去判断が principles §1 に格上げされた経緯と整合(Phase 1 で決着)。
- 別構造:ScrollArea(scroll、純構造の別役)
- 内蔵 hairline を持つ component(Separator を打ち直さない):Menu(divider)、Accordion(項目間)、Table(行間)、Tabs(list 下端)、Breadcrumb(item separator は `::before` で別途)
- 住み分け:`component-selection-map.md` §structure
- 詳細:`src/core-ui/separator/separator.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/separator`
- memory:[[otibo-ds-progress]](Separator の決定全般)
