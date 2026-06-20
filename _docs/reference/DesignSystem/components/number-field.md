---
title: NumberField
status: active
component: src/core-ui/number-field/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**stepper つき数値入力**(`[−] 値 [＋]` の横並び)。Input の **field 言語を踏襲**(group = 白い受け皿 + field inset shadow、`:focus-within` で `field.focus`)── 受け皿 grain は Input と完全に一貫。値は **tabular-nums で中央揃え**、stepper は ghost(`fg.muted` → hover `surface.muted`、色は使わない in-grain)。Base UI NumberField primitive が **clamp / stepper / キーボード ↑↓ / wheel scrub / drag scrub** を提供。

## API

slot recipe(Panda)+ Base UI NumberField 委譲。slot は `group` / `input` / `button`(±共通)(3 slot)。

```tsx
<Field.Root>
  <Field.Label>個数</Field.Label>
  <NumberField.Root min={1} max={99} defaultValue={1}>
    <NumberField.Group>
      <NumberField.Decrement>−</NumberField.Decrement>
      <NumberField.Input />
      <NumberField.Increment>＋</NumberField.Increment>
    </NumberField.Group>
  </NumberField.Root>
</Field.Root>
```

`min` / `max` / `step` / `smallStep` / `largeStep` 等の clamp / step prop は Base UI Root が握る。

## Variants

なし(単一形)。size variant は持たない(form control 列で Input と同じ高さに揃える grain)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **group rest** | `bg: surface` + `boxShadow: field` + `borderRadius: sm` + `overflow: hidden`(button の hover 塗りを角丸で clip) |
| **group hover** | `boxShadow: field.hover` |
| **group `:focus-within`**(入力中 / button focus 中) | `boxShadow: field.focus` |
| **group `:has(input:disabled)`** | `opacity: disabled` + `cursor: not-allowed` |
| **input rest** | `bg: transparent` + `textAlign: center` + `tabular-nums` + `md` + paddingBlock/Inline 2 |
| **button rest** | `bg: transparent` + `color: fg.muted` + paddingInline 3 |
| **button hover** | `bg: surface.muted` + `color: fg.strong` |
| **button focus-visible** | `outline: 2px solid accent` + **`outlineOffset: -2px`**(受け皿が `overflow: hidden` なので **内側に**出す) |
| **button disabled** | `opacity: disabled` + `cursor: not-allowed` |

**Input との grain 共通**:`field` / `field.hover` / `field.focus` の三段 inset shadow を group が持ち、Input と完全に同じ受け皿。NumberField を form 列に並べたとき Input / Select / Combobox と高さ・affordance が揃う。

**stepper の色は使わない**(in-grain):accent や色付き ghost を当てると stepper が前に出すぎる ── 主役は **値そのもの**、stepper は補助。

## a11y

- **primitive** ── `@base-ui-components/react/number-field`(Root / Group / Input / Increment / Decrement / ScrubArea)。
- **role** ── input は `spinbutton`(WAI-ARIA、`aria-valuenow` / `aria-valuemin` / `aria-valuemax` で状態)。
- **keyboard** ── ↑↓ で step、PageUp/Down で largeStep、Home/End で min/max(Base UI 担保)。
- **wheel scrub** ── input にホイールを当てて値を上下(Base UI 機能)。
- **drag scrub** ── ScrubArea(±アイコンや label に対応)で left/right ドラッグで値を動かす(Base UI 機能)。
- **clamp** ── min/max を超える値は自動で範囲内に戻る(Base UI 担保)。
- **Field との接続** ── label / description / error は Field 経由で自動配線。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard) |
| 対象 property | `box-shadow, background-color, color`(transform / 値の transition は持たない) |

quiet 領域(Input と同じ家系)。値の変化(数字が増減する)は **瞬時に切替**(transition しない) ── 数値の transient な変化を animate すると認知負荷が上がる(数字が動いて読みにくい)。stepper の hover / focus / disabled だけ quick で feedback。

## Use when

- **数値の入力**(個数、年齢、金額、量)。
- 値が **離散的でステップ単位**で動く場面(step={1} / step={0.5} 等)。
- 範囲 clamp が要る場面(min/max で値を制限)。

## Use instead

- **連続値の直接操作**(0〜100 のスライド) → **Slider**(数値だけでは粒度が荒い場面)。
- **テキスト入力(数字以外含む)** → **Input**(`type="number"` の素 Input は使わない、NumberField で clamp + scrub が無料)。
- **値選択(離散・短 list)** → **Select** / **Combobox**(数字でも候補が決まっているなら listbox の方が grain)。

詳細は `component-selection-map.md` §form 値入力(NumberField / Input / Slider)。

## Avoid

- **`type="number"` の素 Input で代替**(clamp も stepper も scrub も無いまま) → NumberField。
- **stepper を accent 化 / 色塗り**(主役の値を後ろに押す、in-grain 違反) → ghost(fg.muted → hover surface.muted)維持。
- **値の変化を transition**(数字が animate して読みにくい) → 瞬時。
- **button の focus ring を outside offset**(group の overflow:hidden で clip されて見えない) → `outlineOffset: -2px`(内側)。
- **連続値の直接操作で NumberField**(スライドの方が直感的な場面) → Slider。

## Decisions(本セッションの確定事項)

- **Input の field 言語を踏襲**(group = surface + field inset shadow 三段) ── form control 列の一貫性、`:focus-within` で受け皿全体に focus affordance。
- **`overflow: hidden` + button focus は内側 outline**(`outlineOffset: -2px`) ── 角丸で button の hover 塗りを clip する代償、focus ring も受け皿内に出す。
- **textAlign: center + tabular-nums** ── 数値は中央揃え、桁が変わっても幅がぴくつかない(Pagination の number と同じ tabular-nums grain)。
- **stepper は ghost、色を使わない**(in-grain) ── 主役は値、stepper は補助。
- **値の transition なし**(数字の transient 変化を animate しない) ── 認知負荷を上げない。
- **Base UI primitive に clamp / scrub / step を委譲** ── 自前で組まない、a11y も Base UI 担保。

## Related

- 上位:`principles.md` §1(構造区切りは余白、stepper も色なし)、§5(accent precious、stepper は accent 化しない)、§13(control floor 自然高さ)、§14(Base UI 一本)
- 兄弟(同 field 言語):Input / Select / Combobox(受け皿 grain 共有)
- 親 wrapper:Field(label / description / error)
- 住み分け:`component-selection-map.md` §form 値入力
- 詳細:`src/core-ui/number-field/number-field.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/number-field`
- memory:[[otibo-ds-progress]](NumberField の決定全般)
