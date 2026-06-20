---
title: InlineEdit
status: active
component: src/core-ui/inline-edit/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**同じ場所で読み↔編集を切り替えるテキスト**(header の name 編集、title 編集、設定値の inline 編集など)。Input が「ここは form field です」と inset shadow で明示するのに対し、InlineEdit は **「ここは text だが触ると編集できる」を bg-tint shift で signature** ── shadow は持たない。read↔edit の切替で文頭が動かないよう **bleed pattern**(負 margin で hover bg を左右にはみ出させる + 周囲文と文頭を揃える)を採用。**font-size / weight / color すべて `inherit`** で周囲文に完全同化。

## API

slot recipe(Panda)+ Base UI 不要(自前の state 切替)。slot は `root` / `read` / `edit`(3 slot)。

```tsx
<InlineEdit.Root value={name} onChange={setName}>
  <InlineEdit.Read>{name || "未設定"}</InlineEdit.Read>
  <InlineEdit.Edit />
</InlineEdit.Root>
```

read は `<button>` でレンダリング、edit は `<input>` でレンダリング(同じ wrapper 内で state によって切り替わる)。

## Variants

なし(単一形)。size variant は持たない(周囲文に完全同化する grain、サイズも周囲から継承)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | `display: block` + `width: 100%`(layout 安定のための wrapper) |
| **read rest** | 周囲 text と完全同化(font 等すべて inherit) + `bg: transparent` + `border: none` + `padding: 1/2` + 負 margin で bleed |
| **read hover** | `bg: bg.subtle` ── **「ギリギリ告知する」強度**で触れる領域を示す |
| **read focus-visible** | `bg: bg.subtle` + `boxShadow: focus`(accent ring) |
| **read `data-empty='true'`** | `color: fg.subtle`(「未設定」を placeholder 強度で弱く提示) |
| **edit** | 周囲文同化 + `bg: transparent` + **`boxShadow: inset 0 -2px 0 0 fg.strong`(bottom underline)** + `borderRadius: 0`(underline 端を sharp に) |
| **edit placeholder** | `color: fg.subtle` |

**signature の三者分離**:
- **Input** = inset shadow(受け皿、field)
- **Field** = border / wrapper(form 行構造)
- **InlineEdit** = **bottom underline**(編集中のみ、edit signature)

edit mode は **常に focused** なので、underline が focus 表現も兼ねる(box-shadow ring を別途出さない、underline の方が「編集している場所」を直接示す)。

**bleed pattern の数値**:`marginInline: -2`(`-0.5rem × 2`) + `paddingInline: 2` + `width: calc(100% + 1rem)`(負 margin 分を足し戻して row を満たす)── 「文字の開始位置が親の content 端と一致 + hover bg が左右 1 段はみ出す」を実現。

## a11y

- **read = `<button>`** ── click / Enter / Space で edit mode へ移行(button のネイティブ activation)。
- **edit = `<input>`** ── 通常の text input、Enter で save、Esc で cancel(自前で組む)。
- **focus management** ── edit mode 移行で input に focus、save / cancel で button に戻る(消費側の state 管理 + autoFocus)。
- **空値表現** ── `data-empty='true'` で `fg.subtle` 表示(視覚で「placeholder」grain)。SR には button の text(「未設定」等)が読まれる。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) |
| Register | **quiet**(standard) |
| 対象 property | `background-color, box-shadow` |

quiet 領域。read↔edit の切替は瞬時(state 切替で要素が swap、transition は hover / focus / underline appearance のみ)。

## Use when

- **header / title の name 編集**(account header、document title、project name)。
- **同じ場所で読み↔編集が頻繁に往復する場面**(設定値の inline 編集、tag の rename)。
- **編集モードでも周囲文と grain が揃ってほしい**場面(prose に埋め込まれた編集可能 text)。

## Use instead

- **永続的な form field**(label 付き、submit を介する) → **Input + Field**。
- **複数行 text の編集** → `<textarea>` + 適切な wrapper(現状未着手)。
- **値選択** → **Select** / **Combobox**。
- **数値の inline 編集** → **NumberField**(stepper も載る)。

詳細は `component-selection-map.md` §text 入力。

## Avoid

- **read 状態で常時 hover bg を出す**(「常に編集可能」が露出しすぎ、grain が崩れる) → hover で初めて bg.subtle が出る。
- **font 等を継承から外す**(周囲文との完全同化が崩れる) → すべて inherit 維持。
- **edit mode で inset shadow(Input 風)** ── Input / Field / InlineEdit の signature 三者分離を壊す → underline 維持。
- **bleed pattern を外す**(read↔edit で文頭が動く / hover bg が padding 内に閉じ込められる) → 負 margin + 足し戻し維持。
- **永続的な form field を InlineEdit で組む**(往復が前提でない場面) → Input。

## Decisions(本セッションの確定事項)

- **signature 三者分離**(Input = inset shadow / Field = wrapper / InlineEdit = bottom underline) ── form 関連の affordance を grammar 上で明確に分けた。consumer が「これは何の field か」を見た目で即判定できる。
- **font 等すべて `inherit`** ── 周囲文との完全同化、size variant を持たないことの理由。
- **bleed pattern**(`marginInline: -2` + `paddingInline: 2` + `width: calc(100% + 1rem)`) ── read↔edit で文頭固定 + hover bg を左右にはみ出させる。
- **edit signature = `boxShadow: inset 0 -2px 0 0 fg.strong`(bottom underline)** ── edit mode は常に focused、underline が「ここを編集中」を直接示す(focus ring を別途出さない)。
- **`data-empty='true'` で fg.subtle**(placeholder semantics) ── 「未設定」を absent content として弱く提示、support text とは別の grain。

## Related

- 上位:`principles.md` §1(構造区切りは余白、underline 一本だけで十分)、§5(accent precious、focus ring の accent)
- 兄弟(form 関連):Input / Field / NumberField
- 住み分け:`component-selection-map.md` §text 入力
- 詳細:`src/core-ui/inline-edit/inline-edit.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](InlineEdit の決定全般)
