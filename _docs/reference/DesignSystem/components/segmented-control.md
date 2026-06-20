---
title: SegmentedControl
status: active
component: src/core-ui/segmented-control/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**密に並ぶ「一つだけ選ぶ」設定**(連結 pill + 滑る indicator)。radio / select と同じ「一つ選ぶ」だが、選択肢が少なく(2〜4 個)即時に切替える設定向け。実装は **Base UI Tabs を primitive に流用** ──「凹んだ溝に白い pill が滑る」表現で、active 位置の追従を Tabs.Indicator に委譲する。Toggle(四角・toolbar)/ Chip(角丸・フィルタ複数)とは見た目と用途で住み分け。

## API

slot recipe(Panda)+ Base UI Tabs 委譲。slot は `root` / `list` / `indicator` / `item`。

```tsx
<SegmentedControl.Root value={theme} onValueChange={setTheme}>
  <SegmentedControl.List>
    <SegmentedControl.Indicator />
    <SegmentedControl.Item value="light">ライト</SegmentedControl.Item>
    <SegmentedControl.Item value="dark">ダーク</SegmentedControl.Item>
    <SegmentedControl.Item value="system">システム</SegmentedControl.Item>
  </SegmentedControl.List>
</SegmentedControl.Root>
```

Tabs primitive を借りるが、UX は **設定の一択**(Tabs のような viewport 切替ではない)。tabpanel は持たない、`onValueChange` で値を握る。

## Variants

なし(単一形)。size variant は持たない(密に並ぶ設定としての形が固定、段を増やさない)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **list** | `bg: surface.muted` + **inset shadow**(`inset 0 1px 1.5px shadow.depth 6%`)── 凹んだ溝 |
| **indicator** | `bg: surface.raised`(白い pill) + `paper.sm` 相当の小影 + `borderRadius: sm` |
| **item rest(inactive)** | `bg: transparent` + `color: fg.muted` |
| **item hover**(non-selected) | `color: fg.strong`(背景は触らず文字だけ濃く) |
| **item `aria-selected='true'`** | `color: fg.strong`(pill が下に滑り込む) |
| **item focus-visible** | `outline: 2px solid accent` + `outlineOffset: 1px` |
| **item disabled** | `opacity: disabled` + `cursor: not-allowed` |

**list の `isolation: isolate`**: pill(zIndex 0)と item(zIndex 1)の z-index を **list 内に閉じる**。これが無いとルートの stacking context に漏れて、**z-index を持たない portal popup(Select / Combobox の popup 等)を突き抜ける**バグが発生する。圧縮前の検証で確定した必須スタイル。

## a11y

- **primitive** ── `@base-ui-components/react/tabs`(Tabs.Root / Tabs.List / Tabs.Indicator / Tabs.Tab)を流用。
- **role** ── Tabs primitive 由来で `tablist` / `tab` role が付く。**設定の一択** という意味では完璧な ARIA 表現ではないが(`radiogroup` がより正確)、Base UI Tabs の indicator 自動追従 + keyboard nav が grain として勝るためこの妥協を取った。**SR は「tab」と読む**が、選択 → 即時反映の挙動が radio と同じなので致命的な不整合は出ない。
- **keyboard** ── ↑↓ / ←→ で item 移動、Space / Enter で select(Base UI Tabs ネイティブ)。
- **focus ring** ── item で `outline: 2px solid accent`(native OS focus ring を `outline: none` で抑止した上で `_focusVisible` で出す)。

## Motion

| 軸 | 値 |
| --- | --- |
| **indicator(pill)** Tier | `medium`(240ms)── left / width transition で滑る |
| **indicator** Register | **expressive**(`easings.expressive`) |
| **item** Tier | `quick`(120ms)── color / bg の hover/選択 feedback |
| **item** Register | **quiet**(standard) |

**色の trick は不要**(motion-grammar §Two-Axis の検証で確定、2026-06-19):
- 当初「可動部が軌道を横断する control(switch 系)なら色を pill に連れ添わせる trick が要る」と予言したが、**実機検証で外れ**。
- **pill が主たる選択 signal で label 色は脇役** ── label 色を瞬時に変えても先走って見えない。slider と同じ例外(switch 特殊だった = 横断する色が状態そのもの)。
- 結果:item の color は `quick / standard` で素朴に置く。

reduced-motion:indicator の `transitionProperty: none`(travel を抜く)。色は残る(opacity / 色は reduced-motion でも止めない)。

## Use when

- **2〜4 個程度の設定の一択**(外観:ライト/ダーク/システム / 表示密度:疎/普通/密)。
- 即時に切替えたい(form submit を介さない)設定。
- **密に並べたい**(間隔で見せず、連結で「グループの中の一つ」を強調したい)。

## Use instead

- **長い list / 検索したい** → **Select** / **Combobox**(横が破綻する)。
- **toolbar の一択 or 単体** → **Toggle**(四角)。
- **フィルタの複数選択** → **Chip**(角丸ピル、複数)。
- **viewport の content 切替**(本物の Tabs 用途) → **Tabs**(同 primitive だが positioning が違う ── tabpanel を持って content を切替える)。
- **form の一択(プラン:月額/年額)** → **Radio**(form 値の入れ物)。

詳細は `component-selection-map.md` §選択(Toggle vs Chip vs SegmentedControl)、§navigation(Tabs との対比)。

## Avoid

- **長い list を SegmentedControl で**(横が破綻、文字が割れる)→ Select。
- **viewport content 切替に SegmentedControl**(tabpanel を持たないので役割不一致)→ Tabs。
- **list の `isolation: isolate` を消す**(z-index が portal popup を突き抜けるバグ再発)。
- **indicator の motion を quiet に下げる**(pill の滑りが「答えの主役」なので expressive で settle すべき)。
- **item の color を pill と同尺で transition する**(switch trick の誤適用、不要な複雑さ)。

## Decisions(本セッションの確定事項)

- **primitive = Base UI Tabs を流用**(radio / select でなく) ── Tabs.Indicator の **active 位置自動追従** が「滑る pill」の実装の核。radiogroup primitive を使うと indicator 自動追従が無く、CSS で位置計算を手で組む必要がある。a11y は妥協(tab role が読まれる)を許容して grain を取った。
- **list = `bg: surface.muted` + 凹み inset shadow** ── 「pill が浮く」の対として「track が凹む」を物理的に示す(slider track と同じ shadow.depth、薄め)。
- **indicator = surface.raised + 小影 + radius sm** ── 白い pill が滑る blessed treatment。
- **list の `isolation: isolate` 必須** ── z-index が portal popup(Select / Combobox)を突き抜けるバグ修正。圧縮前の現物検証で確定。
- **色の trick(switch 流連れ添わせ)は不要** ── motion-grammar §Two-Axis の予言検証で外れ、label 色は脇役なので瞬時で OK(2026-06-19 確定)。
- **size variant は持たない**(段を増やさない方針、密に並ぶ設定の形は固定)。

## Related

- 上位:`principles.md` §6(影の規範、物理表現の凹み)、§7(motion = 状態の証言)、§14(Base UI 一本)
- 兄弟:Toggle(四角 toolbar)、Chip(角丸 フィルタ)、Radio(form 一択)、Tabs(同 primitive 別 positioning)
- 住み分け:`component-selection-map.md` §選択(三役の表)、§navigation(Tabs との対比)
- 詳細:`src/core-ui/segmented-control/segmented-control.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/tabs`
- motion 文法:`motion-grammar.md` §Two-Axis(色 trick 不要の検証)、§Reduced Motion
- memory:[[otibo-ds-progress]](SegmentedControl の決定全般)
