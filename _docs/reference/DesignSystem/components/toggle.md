---
title: Toggle / ToggleGroup
status: active
component: src/core-ui/toggle/
references:
  - "../principles.md"
  - "../component-selection-map.md"
  - "../motion-grammar.md"
---

## Overview

**toolbar の押し込みトグル**(四角ボタン)。on / off の二状態を持ち、on(`data-pressed`)は otibo の選択表現に統一 = **accent 塗り + 白**(checkbox checked / switch on / pagination active と同系の「白 on 色」)。Chip(角丸ピルのフィルタ)/ SegmentedControl(連結 pill の設定)とは見た目と用途で住み分け ── Toggle は **toolbar の独立した四角ボタン**。

## API

slot recipe(Panda)+ Base UI Toggle / ToggleGroup 委譲。slot は `group` / `button`。

```tsx
{/* 単体押し込み(★お気に入り、ミュート、ピン留め) */}
<Toggle pressed={pinned} onPressedChange={setPinned}>
  <Icon name="pin" />
</Toggle>

{/* ToggleGroup(排他、表示モード切替 ⊞/☰) */}
<ToggleGroup value={view} onValueChange={setView}>
  <Toggle value="grid"><Icon name="grid" /></Toggle>
  <Toggle value="list"><Icon name="list" /></Toggle>
</ToggleGroup>
```

ToggleGroup は `gap: 1` の `inline-flex` 行。Toggle 本体は icon-only でも text でも入る(`<Toggle><Icon /></Toggle>` / `<Toggle>表示</Toggle>`)。

## Variants

なし(単一形)。size variant は持たず、icon-only と text の両方が同じ `fontSize: sm` + `paddingInline: 2 / paddingBlock: 2` で収まる。

## States

| State | 視覚 |
| --- | --- |
| **off rest** | `bg: transparent` + `color: fg.muted`(ghost、最も静か) |
| **off hover** | `bg: surface.muted` + `color: fg.strong` |
| **on(`data-pressed`)** | `bg: accent` + `color: surface`(白 on 色) |
| **on hover** | `bg: accent.hover` + `color: surface`(色は固定、bg だけ濃く) |
| **focus(keyboard)** | `outline: 2px solid accent` + `outlineOffset: 1px` |
| **disabled(`data-disabled`)** | `opacity: disabled` + `cursor: not-allowed`、hover を無効化 |

**minWidth: 2.25rem** を持つ ── 「control の最低高さは自然高さ」(原則 13)は **height** の話で、Toggle は icon-only で極端に細くなるのを防ぐため **width** に floor を持つ(これは grain として妥当な例外)。

## a11y

- **primitive** ── `@base-ui-components/react/toggle`(単体)/ `@base-ui-components/react/toggle-group`(group)。
- **role** ── Toggle 単体は `button` + `aria-pressed`(押し込み状態)、ToggleGroup は role を持たず内側の Toggle が `aria-checked` 相当を担う(Base UI の実装)。
- **keyboard** ── Space / Enter で toggle、ToggleGroup 排他モードでは ↑↓ で移動も可。
- **focus ring** ── `outline: 2px solid accent`(box-shadow ではない、inline-flex 要素なので outline で安全)。
- **icon-only Toggle** ── `aria-label` 必須(SR が読む文言を消費側で付ける)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard easing、段階化なし) |
| 対象 property | `color, background-color`(transform / press 動作なし) |

quiet 領域(`motion-grammar.md` §Two-Axis)。on/off の切替は色だけで、`translateY` の press も持たない(Button の `translateY(0.5px)` も Toggle には乗せない ── on/off の状態切替が主たる feedback なので press 物理感は冗長)。

## Use when

- **toolbar の押し込み**(★お気に入り、ミュート、ピン留め、太字 B 等の単体)。
- **表示モード切替**(grid ⊞ / list ☰ の二択を ToggleGroup 排他で)。
- **複数 on を独立に重ねる整形 toolbar**(B / I / U)── `multiple` prop で opt-in(primitive 能力として残す、ただし otibo 標準は排他)。

## Use instead

- **フィルタ / タグ選択(複数)** → **Chip**(角丸ピル、`flexWrap` で複数行)。Toggle の四角はフィルタの定型ではない。
- **密に並ぶ三択設定**(外観:ライト/ダーク/システム) → **SegmentedControl**(連結 pill、片手で選べる)。
- **設定の永続 on/off**(通知有効化) → **Switch**(thumb の物理感が永続切替に合う)。
- **フォームの複数選択肢**(製品アップデート受信) → **Checkbox**(フォーム値の入れ物)。
- **action のリスト**(プロフィール / ログアウト) → **Menu**。

詳細は `component-selection-map.md` §選択 の「Toggle vs Chip vs SegmentedControl」表。

## Avoid

- **フィルタに Toggle**(→ Chip):フィルタの定型は角丸ピル、Toggle の四角は toolbar の領分。
- **フォーム複数選択に Toggle**(→ Checkbox):form value の入れ物としては Checkbox が定型(`<input type="checkbox">`)。
- **press 物理感(`translateY`)を Toggle に乗せる**:on/off の色切替が主たる feedback、translate は冗長。
- **icon-only Toggle に `aria-label` を付け忘れる**(SR が「button」としか読まない)。
- **focus ring を box-shadow で出す**:inline-flex なので outline 採用(line-break 跨ぎの fragment 化を避ける)。

## Decisions(本セッションの確定事項)

- **on = accent + 白**(blessed pattern、原則 4)── checkbox checked / switch on / pagination active と完全に同系。これを破ると DS の「選択は白 on 色」grammar が崩れる。
- **off = ghost(透明 + fg.muted)** ── 平常時は最も静か。toolbar に並べても色を撒かない(原則 5 accent precious)。
- **multiple prop は primitive で残す、otibo 標準は排他** ── 整形 toolbar の B/I/U は正当な非排他用途として opt-in を認めるが、otibo の組み込み例は排他で揃える(positioning の明示)。
- **minWidth: 2.25rem を持つ**(原則 13 の例外) ── icon-only で極端に細くなるのを防ぐ。height の floor は持たないが width は持つ ── grain として妥当。
- **focus ring = outline** ── inline-flex の line-break 跨ぎを考慮(Link と同じ理由)。Button(block 要素 + box-shadow)とは別物。

## Related

- 上位:`principles.md` §4(白 on 色)、§5(accent precious)、§13(control floor の例外)、§14(Base UI 一本)
- 兄弟:Chip(同 primitive 別見た目)、SegmentedControl(同分類 連結 pill)、Switch(永続 on/off)、Checkbox(フォーム複数選択)、Badge(押せない静的版)
- 住み分け:`component-selection-map.md` §選択(三役の表)、§data(Badge との対比)
- 詳細:`src/core-ui/toggle/toggle.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/toggle` / `toggle-group`
- memory:[[otibo-ds-progress]](Toggle の決定全般)
