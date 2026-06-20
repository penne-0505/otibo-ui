---
title: Chip / ChipGroup
status: active
component: src/core-ui/chip/
references:
  - "../principles.md"
  - "../component-selection-map.md"
  - "../motion-grammar.md"
---

## Overview

**フィルタ・タグ用の角丸ピル**(複数選択 toggle)。Toggle と同じ primitive(Base UI Toggle)を使いつつ、**用途と見た目で別 component に分けた**:Chip は丸ピル(`borderRadius: full`)で**フィルタ / タグ / 絞り込み文脈**、Toggle は四角ボタンで toolbar 文脈。on(`data-pressed`)は他の選択表現と同じ「白 on 色」。Badge(押せない静的)とも明確に分かれる ── **Chip は押せる**。

## API

slot recipe(Panda)+ Base UI Toggle 委譲。slot は `group` / `chip`。

```tsx
<ChipGroup>
  <Chip pressed={hasFilter("oil")} onPressedChange={...}>油彩</Chip>
  <Chip pressed={hasFilter("ink")} onPressedChange={...}>水墨</Chip>
  <Chip pressed={hasFilter("ceramic")} onPressedChange={...}>陶芸</Chip>
</ChipGroup>
```

ChipGroup は **`flex-wrap: wrap`** の `inline-flex` 行 ── 項目数が多くて 1 行に収まらない場面で**自然に折り返す**(フィルタの常識的な振る舞い)。

## Variants

なし。size variant は持たない(フィルタ文脈で揃えるのが grain、段を増やさない方針)。

## States

| State | 視覚 |
| --- | --- |
| **off rest** | `bg: surface.raised` + 極小影(`0 1px 1px fg.strong 6%`) + `color: fg.secondary` |
| **off hover** | `bg: surface.muted` + `color: fg.strong`(地を一段沈めて feedback、影は触らない) |
| **on(`data-pressed`)** | `bg: accent` + `color: surface`(白 on 色、影なし) |
| **on hover** | `bg: accent.hover` + `color: surface` |
| **focus(keyboard)** | `outline: 2px solid accent` + `outlineOffset: 1px` |
| **disabled(`data-disabled`)** | `opacity: disabled` + `cursor: not-allowed` |

**off の極小影**:warm.50 ページ地と white(`surface.raised`)の明度差は 0.97→1.00 とごく僅か。これだけだと chip が「平らに沈む」ので、**紙が乗っている物理感だけを伝える最小の影**を足す(装飾の浮きではない、原則 6 の「物理表現の小影」)。**tight blur + srgb** で諧調を出さない([[shadow-banding-fix]] の処方)。

## a11y

- **primitive** ── `@base-ui-components/react/toggle`(Toggle と同じ)。
- **role** ── `button` + `aria-pressed`。複数の Chip は独立に on/off できる(ChipGroup は単なる layout、排他 group ではない)。
- **keyboard** ── Space / Enter で toggle、Tab で次の chip(group 内で arrow nav はしない、ChipGroup は単なる flex container)。
- **focus ring** ── `outline` 採用(Toggle と同じ理由、inline-flex の line-break 跨ぎ対応)。
- **icon / count を入れる** ── chip 内に icon や count(「(12)」)を入れる場合、SR が連続で読むので**意味のある順序**で配置(label icon count、または icon label count)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard easing) |
| 対象 property | `color, background-color`(影は静的、変化させない) |

quiet 領域。on/off の切替は色だけで、translate / scale / 影の遷移はしない。

## Use when

- **ギャラリーのフィルタ**(媒体 / 年代 / カテゴリの複数選択)。
- **タグの選択 / 入力 token**(blog post の tag 等)。
- **絞り込みの状態**(複数を独立に on/off できる文脈)。

## Use instead

- **toolbar の押し込み(一択 or 単体)** → **Toggle**(四角)。
- **密に並ぶ三択設定** → **SegmentedControl**(連結 pill)。
- **静的な metadata 表示(Pro / 新規)** → **Badge**(押せない、細線小札)。
- **フォームの複数選択肢** → **Checkbox**(フォーム値の入れ物として grain が違う)。

詳細は `component-selection-map.md` §選択(Toggle vs Chip vs SegmentedControl)、§data(Badge vs Chip vs Toggle)。

## Avoid

- **静的表示に Chip**(押せるべきでないものに interaction affordance を出す)→ Badge。
- **toolbar アクションに Chip**(用途違い、四角の Toggle を選ぶ)。
- **on の色を accent 以外に**(原則 4 を破る、blessed pattern を崩す)。
- **影を hover で動かす**(装飾の浮きになる、原則 6 の「単一非階層 lift」を破る)── 影は静的、interaction は色で。
- **off の影を消す**(warm.50 と white の明度差が足りず chip が「沈む」)── 物理感の極小影は装飾でなく affordance の一部。

## Decisions(本セッションの確定事項)

- **同 primitive(Base UI Toggle)、別 component**(Toggle と Chip の二本立て) ── 「同じ機能を別見た目に」ではなく、**用途で住み分け**た結果。primitive 共有の cost より、消費側が「フィルタは Chip、toolbar は Toggle」と即決できる benefit を取る。
- **on = accent + 白、影なし**(blessed pattern、原則 4)── Toggle / pagination active / switch on と完全同系。on で影を消すのは「accent が前に出ている時に影で深さを足すと色が濁る」の grain。
- **off = surface.raised + 極小影**(物理感の最小影、装飾でない) ── warm.50 ページ地との明度差を補う affordance。`shadow-banding-fix` 処方の tight blur + srgb で諧調を出さない。
- **borderRadius: full**(角丸ピル) ── フィルタ文脈の定型。Toggle の `borderRadius: sm`(四角)とは見た目の signal が明確に違う。
- **ChipGroup は `flex-wrap: wrap`** ── フィルタは項目数が増えがちで、wrap が常識的な振る舞い。Toggle の group は wrap しない(toolbar は wrap させない)。

## Related

- 上位:`principles.md` §4(白 on 色)、§5(accent precious)、§6(影の規範、物理表現の小影)、§14(Base UI 一本)
- 兄弟:Toggle(同 primitive 別見た目)、Badge(押せない静的版)、SegmentedControl(連結 pill 一択)、Checkbox(フォーム複数選択)
- 住み分け:`component-selection-map.md` §選択(三役の表)、§data(Badge vs Chip vs Toggle)
- 詳細:`src/core-ui/chip/chip.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/toggle`
- memory:[[otibo-ds-progress]](Chip の決定全般)、[[shadow-banding-fix]](off の極小影 処方)
