---
title: Input
status: active
component: src/core-ui/input/
references:
  - "../principles.md"
  - "../token-semantic-usage-map.md"
  - "../component-selection-map.md"
---

## Overview

短いテキスト入力の**受け皿**(`<input>` の styled 版)。otibo の form control の中核で、Select / Combobox / NumberField の見た目はこの Input に揃えてある(虫眼鏡や chevron を付け足した派生形)。affordance は **border ではなく inset shadow** で示す ── otibo の「構造区切りは余白」(原則 1)と整合させた grammar 確定方針。

## API

純 otibo(Base UI 非依存、styled `<input>`)。`React.InputHTMLAttributes<HTMLInputElement>` をそのまま受ける。

```tsx
<Input type="email" placeholder="you@otibo.dev" />
<Input size="sm" aria-invalid={hasError} />
```

slot は無し。leading / trailing icon を入れたい場合は、Field 側で `position: relative` の wrapper を作って overlay する(Combobox の検索 icon が canonical 実装)。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `size` | `sm` / `md` | `md` | dense panel(sm)/ 通常 form(md) |

- **md** ── `fontSize: md`(18px)、padding `inline 4 / block 2`。
- **sm** ── `fontSize: sm`(14px)、padding `inline 3 / block 1.5`。

minHeight floor は持たない(原則 13)。control の高さは padding + 文字の自然高さで決まる。

## States

| State | 視覚 |
| --- | --- |
| **rest** | `bg: surface` + `boxShadow: field`(薄い inset)── 「受け皿」として読まれる |
| **hover**(non-focused / non-disabled) | `boxShadow: field.hover` ── inset を一段弱めて浮き上がる feedback |
| **focus / focus-visible** | `boxShadow: field.focus` ── inset が濃くなる(三段の最上位) |
| **aria-invalid="true"** | `boxShadow: field.error` ── inset が danger tint に |
| **disabled** | `opacity: disabled` + `cursor: not-allowed`(grammar §Disabled As Quiet Surface) |

**state 順序の重要点**:`:hover` セレクタは `:not(:focus)` 修飾で focus 中の hover を切る(source order の優先順位処理)── focus 中は focus signal を優先する。

`placeholder` は `color: fg.subtle`(rest 文字 fg より沈ませる)。

## a11y

- **role** ── `<input>` ネイティブ(`type` 属性で role 派生)。
- **keyboard** ── ネイティブ(tab / 文字入力 / arrow)。
- **focus ring** ── `box-shadow: field.focus` で表現(別途 outline は出さない)。kb 操作だけで出すなら `_focusVisible` 側のみ採用、ただし otibo 既定は `_focus` も同値(マウス click でも affordance が立ち上がる方が「触れた」感が出るため)。
- **error の伝達** ── `aria-invalid="true"` で視覚と SR の両方に伝える。error message 文言の関連付けは **Field 側で `aria-describedby` を自動配線**(Base UI Field 経由)。
- **disabled** ── ネイティブ `disabled` 属性。click も textbox role も無効化される。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) ── hover / focus / error / disabled の遷移 |
| Register | **quiet**(standard easing、段階化なし) |
| 対象 property | `box-shadow, background-color`(transform 持たない) |

quiet 領域(`motion-grammar.md` §Two-Axis)。応答も feedback も瞬時に近い inset shadow swap で、無口に保つ。

## Use when

- 短い文字列 / メール / URL / パスワードの入力。
- form の中で **値の入れ物** として読まれる場面。
- Select / Combobox / NumberField の派生形が見た目を継承する **基準形** として(direct 使用以外でも grammar 上の起点)。

## Use instead

- **数値入力** → **NumberField**(stepper・clamp・wheel scrub が無料で乗る)。`type="number"` の素 Input は使わない。
- **複数行のテキスト** → `<textarea>`(otibo の component 化はまだ。直接 textarea を使う)。
- **同じ場所で読み↔編集** → **InlineEdit**(header の name 編集 等)。
- **選択肢から一つ** → **Select** / **Combobox**(虫眼鏡の有無で住み分け)。

詳細は `component-selection-map.md` §form 値入力 / §text 入力。

## Avoid

- `border: 1px solid` を手で足す(otibo の form affordance は **inset shadow 一本**、線で囲うと grain が崩れる)。
- `type="number"` で素の Input(→ NumberField)。
- error 表示を Input の border 色変えで済ます(→ `aria-invalid` + Field の error slot)。
- focus 時に `outline` を別途出す(box-shadow と二重になる、box-shadow 単独で完結)。
- minHeight floor を勝手に足す(原則 13、自然高さに任せる)。

## Decisions(本セッションの確定事項)

- **affordance = inset shadow、border なし** ── 「受け皿」を線で囲うのではなく面の凹みで表現する grammar audit 確定方針。これにより:
  - 原則 1(構造区切りは余白)と整合
  - hover/focus/error の三段が**同じ property(box-shadow)の強度違い**で表現でき、grammar が一貫する
  - field stack(label / control / help / error)で control の四角が控えめになり、label と本文の typography が前に出る
- **field shadow の三段**(rest=field / hover=field.hover / focus=field.focus / error=field.error)── `token-semantic-usage-map.md` §Field Inset で token 定義。
- **transition は box-shadow + background-color のみ**(transform 持たない) ── form control は quiet 領域で動きを足さない。
- **size = sm / md のみ**(lg は持たない) ── form control は段を増やさない。dense panel が sm、通常 form が md で十分。「もっと大きい」と思ったら Field の余白で吸収する方が grain が保たれる。
- **placeholder = fg.subtle** ── 入力値より沈める。「これは仮の例」を typography だけで伝える(色アイコン等を足さない)。

## Related

- 上位:`principles.md` §1(構造区切りは余白、border 引かない)、§13(control floor 自然高さ)
- 派生形:Select / Combobox / NumberField(全部 Input の見た目を継承)
- 親 wrapper:Field(label / description / error と組む)
- 住み分け:`component-selection-map.md` §form 値入力、§text 入力
- 詳細:`src/core-ui/input/input.recipe.ts`(canonical コメント)
- token:`token-semantic-usage-map.md` §Field Inset(三段 shadow の token 定義)
- memory:[[otibo-ds-progress]](Input の決定全般)
