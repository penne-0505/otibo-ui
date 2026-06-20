---
title: Combobox
status: active
component: src/core-ui/combobox/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../token-semantic-usage-map.md"
  - "../component-selection-map.md"
---

## Overview

**値を一つ選ぶ + 検索で絞れる listbox**(長い list、自由入力可)。Select の上位互換として視覚言語を共有しつつ、**先頭の虫眼鏡アイコン**で「打てる」を **触る前に予見**させる(原則 11、treatment B の文法)。control は input 表現で、Base UI Combobox が「入力で list を filter」を担う。

## API

slot recipe(Panda)+ Base UI Combobox 委譲。slot は `control` / `searchIcon` / `input` / `icon` / `popup` / `list` / `item` / `itemIndicator` / `empty`(9 slot)。

```tsx
<Combobox.Root items={countries}>
  <Combobox.Control>
    <Combobox.SearchIcon><Icon name="search" /></Combobox.SearchIcon>
    <Combobox.Input placeholder="国を検索" />
    <Combobox.Icon><Icon name="chevron-down" /></Combobox.Icon>
  </Combobox.Control>
  <Combobox.Portal>
    <Combobox.Positioner>
      <Combobox.Popup>
        <Combobox.List>
          {items.map(item => (
            <Combobox.Item key={item.value} value={item}>{item.label}</Combobox.Item>
          ))}
          <Combobox.Empty>該当する項目がありません</Combobox.Empty>
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
</Combobox.Root>
```

**control は `position: relative` の wrapper**。中の input が全幅、searchIcon と chevron は absolute で重ねる。これで Base UI が anchor にする input = control 全体になり、popup の **横幅と出現位置が Select と完全に揃う**。

## Variants

なし。Select と同じく size variant を持たず、form control 列で Input と同じ高さに揃える。

## States

| Slot / State | 視覚 |
| --- | --- |
| **control rest** | `bg: surface` + `boxShadow: field`(Input/Select と同じ受け皿) |
| **control hover** | `boxShadow: field.hover` |
| **control `:focus-within`**(=入力中 / popup open 相当) | `boxShadow: field.focus` |
| **control 内 input disabled**(`:has(input:disabled)`) | `opacity: disabled` + `cursor: not-allowed` |
| **searchIcon** | 常時表示 `color: fg.muted`、`pointer-events: none`(input がイベントを受ける) |
| **icon `data-popup-open`** | `transform: translateY(-50%) rotate(180deg)` |
| **item `data-highlighted`** | `bg: accent.subtle` + `color: fg.strong` |
| **item `data-selected`** | `color: fg.strong` + `fontWeight: medium` + check indicator(accent 色) |
| **empty** | `color: fg.muted` + sm + 3 padding(該当なしのプレースホルダ) |

active / selected の二段運用は Select と完全に同じ。**searchIcon が常時表示**なのが Select との形の差。

## a11y

- **primitive** ── `@base-ui-components/react/combobox`(Root / Control / Input / Icon / Portal / Positioner / Popup / List / Item / ItemIndicator / Empty)。
- **role** ── control が `combobox` role、popup が `listbox`、item が `option`(WAI-ARIA Combobox Authoring Practices)。
- **keyboard** ── ネイティブ(↑↓ で highlight 移動、Enter で select、Esc で close、type to filter、Backspace で削除)── すべて Base UI が担保。
- **searchIcon `pointer-events: none`** ── icon が input の click をブロックしない(ユーザーは icon の上を click しても input が focus される)。
- **空状態** ── `Combobox.Empty` で「該当する項目がありません」等を表示、focus 不可だが視覚 / SR で「無い」が伝わる。

## Motion

Select と完全同式:

| 軸 | 値 |
| --- | --- |
| Tier(enter) | `medium`(240ms)── scale settle |
| Tier(exit) | `quick`(120ms)── fade + scale |
| Register | **expressive** |
| 段階化 | opacity = **即時(0s)**、scale = medium |

list 型なので scale-on-text snap が非焦点化(`motion-grammar.md` §Overlay Appearance、Menu / Select と同分岐)。reduced-motion で travel(scale)を抜く ── 通常が opacity 即時なので scale を切れば全て即時化。

icon の chevron 反転は別 transition(`transform`、`quick` / `standard`)── absolute 配置のため `translateY(-50%)` を保ったまま rotate を合成する。

## Use when

- 値を一つ選ぶ、**数十項目以上 or 検索で絞り込みたい**選択肢(例:国、タイムゾーン、tag)。
- 「打って探せる」を **触る前に予見** させたい場面(searchIcon が常時 affordance)。
- 自由入力を許容する場面(`<Combobox.Input>` は通常の input なので freeform value も渡せる、ただし Base UI 側の prop で制御)。

## Use instead

- **4〜6 項目で一望できる** → **Select**(検索 input が過剰)。
- **action のリスト** → **Menu**(value 選択ではないので role が違う)。
- **complex な search + list(autocomplete with grouping、recent searches)** → 現状未着手の autocomplete primitive 領域(必要になったら別 component 検討)。

詳細は `component-selection-map.md` §form 値入力(Select vs Combobox)。

## Avoid

- **searchIcon を隠す or hover で出す**(原則 11、hover trigger must be predictive の真逆) ── 常時表示で「打てる」を最初から示す。
- **control の構造を Select と変える**(popup の横幅・出現位置が Select と揃わなくなる) ── relative wrapper + absolute icon の構造が canonical。
- **searchIcon を `pointer-events: auto` にする**(icon の上を click した時に input が focus されず詰まる) ── `none` 固定。
- popup の `maxHeight` を `var(--available-height)` 単独に戻す(flip 時の巨大化) ── `min(var(--available-height), 18rem)`。
- 数十項目に Select を使う(Combobox の領分) / 数項目に Combobox を使う(Select の領分)── §form 値入力 の決定木に従う。

## Decisions(本セッションの確定事項)

- **searchIcon 常時表示** ── 「打てる」を予見的に示す(原則 11、treatment B 文法)。これが Select との見た目の唯一の差。「使い分けは aria-haspopup ではなく **形** で示す」設計。
- **control は relative wrapper、input 全幅、icon 二つを absolute で重ねる** ── Base UI が anchor にする要素 = control 全体になり、popup の横幅・出現位置が Select と揃う。**圧縮前の検証で「Select と Combobox で popup 幅 / 位置が違う」を解決した構造**(input が leading icon の inside padding 分 inset していると、popup が input にだけ anchor して narrow になっていた)。
- **9 slot 構成**(Select の 5 slot より多い) ── 検索 input / searchIcon / list flex container / empty(該当なし)が追加。recipe の構造的複雑さの対価。
- **active / selected / popup motion / maxHeight cap は Select と完全一致** ── 視覚言語の意図的共有(消費側にとって「Select と同じ手触り、検索が増えただけ」)。
- **size variant は持たない**(Select と同じ理由) ── form control 列で Input / Select と同高さ。

## Related

- 上位:`principles.md` §5(accent precious)、§10(overlay 出現 motion 分岐)、§11(hover trigger must be predictive ── searchIcon 常時表示)、§14(Base UI 一本)
- 兄弟:Select(視覚言語共有、検索なし版)、Input(同じ受け皿)、Menu(同じ popup motion)
- 親 wrapper:Field(label / description / error と組む)
- 住み分け:`component-selection-map.md` §form 値入力(Select vs Combobox)
- 詳細:`src/core-ui/combobox/combobox.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/combobox`
- memory:[[otibo-ds-progress]](Combobox の決定全般)
