---
title: Radio / RadioGroup
status: active
component: src/core-ui/radio/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**フォームの排他一択**(複数から一つを選ぶ form 値)。circle ring + 内側の **dot を bloom**(scale 0→1 で「咲かせる」)。ring は checked で accent に切替(瞬時応答)、dot が **medium / expressive で scale up**(段階的 motion の feedback)。native の見た目に依存せず custom 描画(checkbox と同じ理由)。SegmentedControl(設定の一択)/ Select(値を一つ選ぶ listbox)とは form value vs 設定 / listbox で住み分け。

## API

slot recipe(Panda)+ Base UI Radio / RadioGroup 委譲。slot は `root` / `indicator`(2 slot)。

```tsx
<Field.Root>
  <Field.Label>支払いプラン</Field.Label>
  <RadioGroup defaultValue="monthly">
    <Radio.Root value="monthly">
      <Radio.Indicator />
    </Radio.Root>
    月額
    <Radio.Root value="annual">
      <Radio.Indicator />
    </Radio.Root>
    年額
  </RadioGroup>
</Field.Root>
```

## Variants

なし(単一形)。size variant は持たない(form control 列で揃える grain、22px 固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root rest(unchecked)** | `22×22px`(偶数 px) + `borderRadius: full` + `bg: surface` + `boxShadow: inset 0 0 0 1.5px border.strong` |
| **root `data-checked`** | `boxShadow: inset 0 0 0 1.5px accent`(ring の accent 化は **瞬時、0ms**)、bg は変えない(checkbox との grain 差) |
| **root focus-visible** | `outline: 2px solid accent` + `outlineOffset: 2px` |
| **root disabled** | `opacity: disabled` + `cursor: not-allowed` |
| **indicator rest(unchecked)** | `8×8px` + `borderRadius: full` + `bg: accent` + `transform: scale(0)` |
| **indicator `data-checked`** | `transform: scale(1)`、duration **`medium`(240ms)** + register **`expressive`** |
| **indicator(off に戻る)** | duration **90ms** + register **`accelerate`**(速い払いで萎む) |

**8px dot の中央化**:箱 22px 内で `(22-8)/2 = 7px` → 中心が整数 px に乗りクリスプに中央化される(checkbox と同じ偶数 px の grain)。

**checkbox との違い**:checkbox は **box の bg ごと accent に切替**(箱が塗りつぶされる)、radio は **ring だけ accent + 内側に dot bloom**(箱の bg は surface のまま)。同じ accent でも 「面で意思を示す(checkbox)」 vs 「点で意思を示す(radio)」 の表現分岐。

## a11y

- **primitive** ── `@base-ui-components/react/radio` + `@base-ui-components/react/radio-group`。
- **role** ── `radio` / `radiogroup`。
- **keyboard** ── ↑↓ / ←→ で radio 間移動、Space で select(Base UI 担保)。
- **focus management** ── group 内で focus は **checked radio**(または先頭)に着く(WAI-ARIA Radio Group ネイティブ)。
- **Field との接続** ── label / description / error は Field 経由で自動配線。
- **focus ring** ── `outline: 2px solid accent` + `outlineOffset: 2px`(inset shadow と layering 干渉しない)。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| **root**(ring の color) Tier | **0ms**(即時、応答 channel) |
| **indicator(scale 0→1、bloom)** Tier | **`medium`(240ms)** |
| **indicator(bloom)** Register | **`expressive`** |
| **indicator(scale 1→0、萎む)** Tier | **90ms** + `accelerate` |

**段階的 motion**(checkbox と同型):
- **応答**:ring の accent 化は 0ms ── 「効いた」を即返す。
- **feedback**:dot の scale up は 240ms ── 「咲く」を見せる。
- 別 radio を選ぶと前の dot は 90ms accelerate で素早く萎み、新しい dot が bloom する(描く / 消すの非対称)。

**checkbox 320ms との差**:checkbox は「線を描く」最も濃い presence で heavy、radio は「点を咲かせる」軽い feedback で medium。両者とも expressive register で「直接操作の到着」を表現するが、tier の重みで意図的に階層化(checkbox は signature motion、radio は標準的な選択)。

reduced-motion:transition `none`(travel を抜き、状態は即時)。

## Use when

- **フォームの排他一択**(プラン:月額 / 年額、配送方法、性別、等)。
- 選択肢が **2〜5 個程度**で全部を**一望できる**場面(縦に並べて読める)。
- フォーム値として送信する(submit を介する)。

## Use instead

- **密に並ぶ三択以上の設定**(外観:ライト / ダーク / システム) → **SegmentedControl**(横幅効率)。
- **値を一つ選ぶ + 検索 / 長い list** → **Select** / **Combobox**(listbox role)。
- **複数選択** → **Checkbox**。
- **toolbar の一択 group** → **Toggle**(ToggleGroup、grain 違い)。

詳細は `component-selection-map.md` §選択。

## Avoid

- **ring の color に transition**(0ms 即時応答の grain を破る) → 0ms 維持。
- **dot の bloom を quick に下げる**(咲く質感が消えて「カチッ」と切替に見える) → medium expressive 維持。
- **dot の bg を accent 以外に**(原則 4 と 5 を破る、blessed pattern が崩れる) → accent。
- **設定の即時反映に Radio**(submit を介さない grain 違い) → SegmentedControl / Switch。
- **size を rem 化**(半端ピクセルで dot が右上に寄って見える) → 22px 固定。

## Decisions(本セッションの確定事項)

- **bg は変えない、ring + dot で表現**(checkbox との grain 差) ── checkbox は面(箱の bg)で意思、radio は点(dot)で意思。同じ accent でも表現が分岐。
- **段階的 motion**(ring 0ms 応答 + dot medium expressive bloom) ── checkbox と同型、direct-manipulation signature。
- **dot 萎みは 90ms accelerate**(描く / 消すの非対称) ── 直接操作家系の共通文法。
- **22px / 8px 偶数 px 固定**(中央化を整数 px に乗せる) ── 18px root の半端ピクセル問題回避、sizes scale の例外。
- **focus = outline + offset**(inset shadow と layering 干渉しない) ── 各 form control 共通。

## Related

- 上位:`principles.md` §4(白 on 色、checked dot = accent)、§5(accent precious、interaction 時に accent)、§7(motion = 状態の証言)、§14(Base UI 一本)
- 兄弟(直接操作家系):Checkbox / Switch(段階的 motion 共有)
- 親 wrapper:Field(label / description / error)
- 住み分け:`component-selection-map.md` §選択
- 詳細:`src/core-ui/radio/radio.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/radio` / `radio-group`
- motion 文法:`motion-grammar.md` §Staged Motion(段階的 motion の家系)
- memory:[[otibo-ds-progress]](Radio の決定全般)
