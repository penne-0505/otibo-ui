---
title: Menu
status: active
component: src/core-ui/menu/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**trigger から開く action リスト**(dropdown menu)。Select(値を一つ選ぶ listbox)に対し、Menu は**動作を起こす** action 群。**選択状態を持たない**(check indicator なし)。a11y / positioning / keyboard / typeahead は Base UI Menu に委譲、見た目は Popover / Select と同じ raised panel。motion は list 型なので Select と完全同式(opacity 即時 + scale medium expressive、`motion-grammar.md` §Overlay Appearance の予言検証で確定)。

## API

slot recipe(Panda)+ Base UI Menu 委譲。slot は `popup` / `item` / `separator` / `groupLabel`。

```tsx
<Menu.Root>
  <Menu.Trigger render={<Button intent="ghost"><Icon name="more" /></Button>} />
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.GroupLabel>アカウント</Menu.GroupLabel>
        <Menu.Item onClick={...}>プロフィール</Menu.Item>
        <Menu.Item onClick={...}>設定</Menu.Item>
        <Menu.Separator />
        <Menu.Item onClick={...}>ログアウト</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

## Variants

なし(単一形)。size variant は持たない(action リストの形は固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **popup** | `surface.raised` + `boxShadow: lift` + `borderRadius: md` + `padding: 1` + `minWidth: 9rem` + `maxHeight: var(--available-height)` + `overflowY: auto` |
| **item rest** | `display: flex` + `gap: 2`(先頭 icon 用) + `paddingInline: 3 / Block: 2` + `fontSize: md` + `color: fg` + `borderRadius: xs` |
| **item `data-highlighted`**(キーボード/ポインタの居場所) | `bg: accent.subtle` + `color: fg.strong` ── 最強の手がかり |
| **item `data-disabled`** | `opacity: disabled` + `cursor: not-allowed` |
| **separator** | `height: 1px` + `bg: border.subtle` + `marginBlock: 1` + **`marginInline: 3`**(item の paddingInline と同値で内側端揃え) |
| **groupLabel** | `xs` + `medium` + `letterSpacing: wide` + `color: fg.muted`、`paddingInline: 3 / Block: 1`、`userSelect: none` |

**check indicator なし** ── Select との明確な分離(action は「選んだ」状態を持たない)。先頭の icon は `gap: 2` で配置可能。

**separator は full-bleed にしない**:`marginInline: 3` で item の paddingInline 3 と同値、**線の左右端が各行の文字に揃う**。「行群をまとめる内側の線」として読まれ、popup の外枠 hairline と混同しない。

## a11y

- **primitive** ── `@base-ui-components/react/menu`(Root / Trigger / Portal / Positioner / Popup / Item / Separator / Group / GroupLabel)。
- **role** ── popup が `menu` role、item が `menuitem`(Select の `listbox` / `option` とは別)。
- **keyboard** ── ↑↓ で highlight 移動、Enter で activate、Esc で close、type-ahead で先頭一致 jump(Base UI が担保)。
- **focus management** ── open で先頭 item に highlight、close で trigger に戻る。
- **scrollMarginBlock: 1** ── item に明示し、kb 移動で highlight が popup 端ぴったりに来た時に少し余白を確保(Select と同じ grain)。

## Motion

Select / Combobox と完全同式:

| 軸 | 値 |
| --- | --- |
| Tier(enter) | `medium`(240ms)── scale settle |
| Tier(exit) | `quick`(120ms)── fade + scale |
| Register | **expressive** |
| 段階化 | opacity = **即時(0s)**、scale = medium |

**list 型なので scale-on-text snap が非焦点化される**(複数 item で attention が散る) ── `motion-grammar.md` §Overlay Appearance の **「list 型 overlay は select 側」予言の検証台**だった Menu は、実機検証(2026-06-19)で予言通り select 側に倒れた:opacity 即時 + scale medium で **3 項目程度の少ない Menu でも snap が前景化せず**、tooltip / popover の opacity-only に倒す必要はなかった。

`transformOrigin: var(--transform-origin)` で trigger の対角点を起点に scale ── settle が「trigger に紐付いて」見える。

reduced-motion:travel(scale)を抜く ── 通常が opacity 即時なので scale を切れば全て即時化。

## Use when

- **action のリスト**(プロフィール、設定、ログアウト、コピー、共有、削除)。
- **「もっと」ボタン**から開く overflow menu(toolbar の余り action)。
- **right-click context menu**(右クリックの代替 / 補完)。

## Use instead

- **値を一つ選ぶ listbox**(タイムゾーン、国) → **Select**(role が違う、check indicator もあり)。
- **値を一つ選ぶ + 検索** → **Combobox**。
- **top nav の dropdown**(ページ遷移リンク群) → **NavigationMenu**(共有 Viewport モデル、遷移 link 群)。
- **画面を奪う action**(削除確認) → Menu item から **Dialog** を起動するパターン。

詳細は `component-selection-map.md` §overlay(Menu vs Select、Menu vs NavigationMenu)。

## Avoid

- **check indicator を Menu に足す**(Select の役割を侵食、role 違い)── 選択状態が要るなら Select。
- **action と value 選択を混ぜる**(役割が不明瞭)── action なら Menu、value なら Select。
- **NavigationMenu の代わりに Menu**(top nav の遷移 link を Menu に置くと role / keyboard nav が違う) → NavigationMenu。
- **separator を full-bleed に**(外枠 hairline と混同) → marginInline 3 で内側端揃え。
- **scale を抜いて opacity-only に**(list 型は scale 可、snap 非焦点化が grain) → 同 motion 文法を保つ。

## Decisions(本セッションの確定事項)

- **check indicator を持たない** ── Select との明確な分離。action は「選んだ」状態を持たない、毎回起動するもの。
- **motion = Select / Combobox と完全同式**(opacity 即時 + scale medium expressive、exit quick fade+scale) ── list 型 overlay grammar の一貫性。予言検証(2026-06-19、`motion-grammar.md` Deferred #2)で select 側に倒した結果。
- **separator は内側端揃え**(`marginInline: 3` = item の paddingInline 3) ── 行群を内側で区切る、外枠 hairline と混同しない。full-bleed にしない。
- **groupLabel = `letterSpacing: wide` + `fontSize: xs` + `fg.muted`** ── section 見出しとして他 item と階層差を明示、SR でも独立 group として読まれる。
- **trigger 起点 scale**(`transformOrigin: var(--transform-origin)`) ── 「trigger から開いた」を物理的に示す。Select / Combobox と同じ。

## Related

- 上位:`principles.md` §5(accent precious、highlight だけが accent.subtle)、§10(overlay 出現 motion 分岐 ── list 型 + scale)、§14(Base UI 一本)
- 兄弟(同 motion 文法):Select / Combobox(list 型 overlay)
- 別 overlay:Popover(単一焦点 opacity-only)、Dialog(scrim + heavy)、NavigationMenu(遷移 link、別 role)、Tooltip(hover transient)
- 住み分け:`component-selection-map.md` §overlay(Menu vs Select、Menu vs NavigationMenu)
- 詳細:`src/core-ui/menu/menu.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/menu`
- motion 文法:`motion-grammar.md` §Overlay Appearance、§Deferred Decisions(Menu の予言検証)
- memory:[[otibo-ds-progress]](Menu の決定全般)
