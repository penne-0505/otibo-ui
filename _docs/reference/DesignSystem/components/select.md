---
title: Select
status: active
component: src/core-ui/select/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../token-semantic-usage-map.md"
  - "../component-selection-map.md"
---

## Overview

**値を一つ選ぶ listbox**(短い list、検索なし)。trigger は Input と同じ「受け皿」表現で form control 列に馴染み、popup は Popover / Combobox と同じ raised panel。a11y / positioning / keyboard は Base UI Select に委譲、見た目は完全自前。Combobox との視覚言語は意図的に共有 ── 「使い分けは aria-haspopup ではなく **形** で示す」(検索アイコンの有無)。

## API

slot recipe(Panda)+ Base UI Select 委譲。slot は `trigger` / `icon` / `popup` / `item` / `itemIndicator`。

```tsx
<Select.Root defaultValue="jst">
  <Select.Trigger>
    <Select.Value placeholder="タイムゾーン" />
    <Select.Icon><Icon name="chevron-down" /></Select.Icon>
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="jst">日本標準時(JST)</Select.Item>
        <Select.Item value="utc">UTC</Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

Trigger wrapper で `alignItemWithTrigger=false` を既定として渡している(Base UI 既定の true は popup が trigger に重なる挙動なので、popup を trigger の**下**に置く otibo 既定に倒した)。

## Variants

なし(slot ごとの styling は state で分岐)。size は持たない ── form control としては Input と同じ高さに揃え、dense panel 用の sm 派生は現状未着手(Field 側の density で吸収する想定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **trigger rest** | `bg: surface` + `boxShadow: field`(Input と同じ受け皿) |
| **trigger hover**(non-open) | `boxShadow: field.hover` |
| **trigger focus-visible / `data-popup-open`** | `boxShadow: field.focus` ── open 中も focus 相当の affordance |
| **trigger `data-placeholder`** | `color: fg.subtle`(未選択時は値を沈める) |
| **trigger disabled** | `opacity: disabled` + `cursor: not-allowed` |
| **icon `data-popup-open`** | `transform: rotate(180deg)`(chevron 反転) |
| **item `data-highlighted`** | `bg: accent.subtle` + `color: fg.strong` ── **キーボード/ポインタの居場所**、最も強い手がかり |
| **item `data-selected`** | `color: fg.strong` + `fontWeight: medium` + check indicator(`accent` 色) |

**active vs selected の二段運用** ── active(キーボード focus 位置)は accent.subtle 塗りで強く、selected(現在値)は check + weight で静かに永続表示。重なれば accent.subtle 塗り + check が両立して見える。

## a11y

- **primitive** ── `@base-ui-components/react/select`(Root / Trigger / Value / Icon / Portal / Positioner / Popup / Item / ItemIndicator)。
- **role** ── trigger は `combobox` role(WAI-ARIA Authoring Practices)、popup は `listbox`、item は `option`。
- **keyboard** ── ネイティブ(↑↓ で highlight 移動、Enter で select、Esc で close、type-ahead で先頭一致 jump)── すべて Base UI が担保。
- **focus management** ── open 時に highlight が selected(または先頭)に着く、close で trigger に戻る ── Base UI 既定。
- **scrollMarginBlock: 1** ── item に明示し、kb 移動で highlight が popup 端ぴったりに来た時に少し余白を確保(視覚の窒息を避ける)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier(enter) | `medium`(240ms)── scale settle |
| Tier(exit) | `quick`(120ms)── fade + scale |
| Register | **expressive**(`easings.expressive`) |
| 段階化 | opacity = **即時(0s)**、scale = medium |

**「もう在る、今ちょうど trigger から開きつつある」** ── opacity を gate しないことで content が瞬時に提示され、scale settle が feedback として「今 trigger から開いた」を物理的に示す。`transformOrigin: var(--transform-origin)` で trigger の対角点を起点に scale するため、settle が「trigger に紐付いて」見える。

list 型なので scale-on-text snap が**非焦点化**される(`motion-grammar.md` §Overlay Appearance):複数 item で attention が散り、scale=1 着地のテキスト snap が知覚から外れる。これが Tooltip / Popover の opacity-only との分岐基準。

icon の chevron 反転は別 transition(`transform`、`quick` / `standard`)。

reduced-motion:travel(scale)を抜く ── 通常が opacity 即時なので、scale を切れば全て即時になる。

## Use when

- 値を一つ選ぶ、**4〜6 項目程度で一望できる**選択肢(例:タイムゾーン)。
- 検索が**不要**(項目数が少ない / 一望できる)。
- form の中で **Input と並ぶ列**(同じ受け皿表現で揃う)。

## Use instead

- **数十項目 / 検索したい** → **Combobox**(虫眼鏡で「打てる」を予見させる)。
- **toolbar の密な三択** → **SegmentedControl**(連結 pill、片手で選べる)。
- **action のリスト**(プロフィール / ログアウト) → **Menu**(check indicator も role も別)。
- **設定の永続 on/off** → **Switch**。

詳細は `component-selection-map.md` §form 値入力(Select vs Combobox)、§overlay(Menu vs Select)。

## Avoid

- **数十項目を Select で並べる**(scan が苦痛 / popup が長い)→ Combobox。
- **action のリストを Select で組む**(Menu と Select の role / a11y が違う)→ Menu。
- **alignItemWithTrigger=true**(Base UI 既定)を採用する(popup が trigger に重なり、選択前後で位置が変わって視線が飛ぶ)── otibo wrapper で `false` 固定。
- popup の `maxHeight` を `var(--available-height)` 単独に戻す(flip 時に上側の広い空きが返り popup が巨大化する)── `min(var(--available-height), 18rem)` で cap。
- Tooltip / Popover と同じ「opacity フェードのみ」motion を当てる(list 型は scale 可、scale snap が非焦点化される)。

## Decisions(本セッションの確定事項)

- **trigger = Input と同じ受け皿表現**(field inset shadow 三段:rest / hover / focus + open) ── form control 列で揃うため、grain として強い。「Select は input の派生形」の見せ方。
- **popup motion = opacity 即時 + scale medium expressive、exit quick fade+scale** ── list 型の出現規約(`motion-grammar.md` §Overlay Appearance)。menu / combobox と同式。
- **active = accent.subtle 塗り(強)、selected = check + fg.strong + medium(静)** の二段運用 ── キーボード focus を最も強く、現在値は静かに永続表示。
- **alignItemWithTrigger=false** を wrapper 既定に(Base UI 既定の true は overlap 挙動で otibo の手触りに合わない)。
- **maxHeight = min(var(--available-height), 18rem)** ── flip 時の巨大化を cap。Combobox と揃える。
- **size variant は持たない**(現状) ── form control 列で Input と同高さ、dense は Field density で吸収。lg は持たない方針(原則:段を増やさない)。

## Related

- 上位:`principles.md` §5(accent precious、active は interaction 時の accent)、§10(overlay 出現 motion 分岐)、§14(Base UI 一本)
- 兄弟:Input(同じ受け皿)、Combobox(同じ視覚言語 + 検索)、Menu(同じ popup motion、別 role)
- 親 wrapper:Field(label / description / error と組む)
- 住み分け:`component-selection-map.md` §form 値入力、§overlay
- 詳細:`src/core-ui/select/select.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/select`
- memory:[[otibo-ds-progress]](Select の決定全般)
