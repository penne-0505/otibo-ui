---
title: Tabs
status: active
component: src/core-ui/tabs/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**同一 viewport で content を切替える nav**。active タブを accent の **静的下線**で示す(滑る indicator は使わない、otibo の簡素志向)。content 切替は snap tier の crossfade で、**「移動」の嘘**(slide)を付かない ── tab は同じ場所の中身が替わっただけ。NavigationMenu(ページ遷移)/ SegmentedControl(設定の一択、同 primitive 別 positioning)とは目的が違う。

## API

slot recipe(Panda)+ Base UI Tabs 委譲。slot は `root` / `list` / `tab` / `panel`。

```tsx
<Tabs.Root defaultValue="inbox">
  <Tabs.List>
    <Tabs.Tab value="inbox">受信箱</Tabs.Tab>
    <Tabs.Tab value="sent">送信済み</Tabs.Tab>
    <Tabs.Tab value="archive">アーカイブ</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="inbox">...</Tabs.Panel>
  <Tabs.Panel value="sent">...</Tabs.Panel>
  <Tabs.Panel value="archive">...</Tabs.Panel>
</Tabs.Root>
```

list 下端に `border.subtle` の hairline が引かれ、tab の 2px 下線がその上に乗る。

## Variants

なし(単一形)。size variant は持たない(viewport 切替の grain として固定)。orientation は Base UI primitive が持つが、otibo の組み込み例は horizontal のみ。

## States

| Slot / State | 視覚 |
| --- | --- |
| **list** | 下端 `border-bottom: 1px solid border.subtle` |
| **tab rest(inactive)** | `color: fg.secondary` + **透明の 2px 下線で高さ予約**(active 時のジャンプを防ぐ) + `marginBottom: -1px`(list の 1px 線に乗せる) |
| **tab hover** | `color: fg.strong`(下線は触らない) |
| **tab `aria-selected='true'`(active)** | `color: fg.strong` + `borderBottomColor: accent` |
| **tab focus-visible** | `outline: 2px solid accent` + `outlineOffset: 2px` + `borderRadius: xs` |
| **tab disabled** | `opacity: disabled` + `cursor: not-allowed` |
| **panel** | `fadeIn` animation(snap / expressive) |

**inactive の透明下線**:active 時に下線が出現してレイアウトがジャンプしないよう、高さを常時予約。`marginBottom: -1px` で list の hairline(1px)に「乗る」── 線同士が衝突しない。

## a11y

- **primitive** ── `@base-ui-components/react/tabs`(Tabs.Root / Tabs.List / Tabs.Tab / Tabs.Panel)。
- **role** ── `tablist` / `tab` / `tabpanel`(WAI-ARIA Authoring Practices)。
- **keyboard** ── ←→ で tab 移動、Home / End で先頭 / 末尾、Enter / Space で activate(Base UI 既定)。`activationMode='manual'` で focus と activate を分離可能。
- **focus ring** ── `outline: 2px solid accent`(box-shadow ではない、tab 行が overflow したときの fragment 化を避ける)。

## Motion

| 軸 | 値 |
| --- | --- |
| **tab(下線 / 色)** Tier | `quick`(120ms) |
| **tab** Register | **quiet**(standard) |
| **tab** 対象 property | `color, border-color` |
| **panel** Tier | `snap`(90ms)── content 切替の fade-in |
| **panel** Register | **expressive**(`easings.expressive`) |
| **panel** 動作 | `fadeIn` keyframe(opacity 0→1)、slide なし |

**panel は snap(90ms)** ── light(120ms)でも「読みに行ったのにまだ読めない」阻害が出たため、最軽の snap 枠に置いた(navigate した content は **gate しない** が grain)。crossfade のみで slide しない理由は **「移動」の嘘**を付かないため ── tab は同じ場所の中身が替わっただけで、横に動いて来たわけではない。

reduced-motion:panel の `animationName: none`(opacity 即時、内容だけ替わる)。

## Use when

- **同一画面の中で content を切替えたい**(受信箱 / 送信済み / アーカイブ、一覧 / 詳細 / 履歴)。
- URL を**基本変えない**(変えてもよいが主目的は表示切替)。
- 並ぶ section が **2〜5 個程度**(それ以上はスクロールするか別 nav に倒す)。

## Use instead

- **ページ遷移**(URL を変えて別 view へ) → **NavigationMenu**(top nav)/ **Link**(prose / footer)。
- **設定の一択**(外観:ライト/ダーク/システム) → **SegmentedControl**(同 primitive 別 positioning、滑る pill)。
- **階層内の現在地表示** → **Breadcrumb**(目的が違う、現在地 vs 切替)。
- **長 list の送り** → **Pagination**(同一 list の窓を切る)。

詳細は `component-selection-map.md` §navigation(Tabs vs NavigationMenu vs Breadcrumb の境界)。

## Avoid

- **panel に slide animation**(「移動」の嘘 / 視線が無駄に飛ぶ)── crossfade のみ。
- **滑る indicator を Tabs に足す**(SegmentedControl の役割、Tabs は静的下線で簡素 ── 同 primitive を使い分ける positioning)。
- **inactive の下線高さを 0 にする**(active 時にレイアウトジャンプ)── 透明下線で予約。
- **panel の tier を medium / heavy に上げる**(content 阻害が出る)── snap が grain。
- **階層表示や URL 遷移に Tabs を使う**(目的違い、Breadcrumb / Link / NavigationMenu に倒す)。

## Decisions(本セッションの確定事項)

- **active = 静的下線(滑る indicator なし)** ── otibo の簡素志向。滑る pill は SegmentedControl で使うので、Tabs と分離(同 primitive を別見た目で使い分ける)。
- **inactive の透明下線で高さ予約 + `marginBottom: -1px`** ── ジャンプ防止 + list の hairline と二重線にしない。
- **panel = snap(90ms)+ crossfade** ── content 切替を gate しない、slide で「移動」の嘘を付かない。light(120)では阻害が出たので最軽の snap に下げた。
- **滑る motion を avoid、静的下線で簡素** ── Tabs と SegmentedControl の見た目差を明確化(同 primitive 別 positioning の意図)。
- **focus ring = outline**(tab の box-shadow は overflow 時に fragment 化するリスク、outline で安全)。

## Related

- 上位:`principles.md` §5(accent precious、active 時のみ accent)、§7(motion = 状態の証言、slide の嘘を避ける)、§14(Base UI 一本)
- 兄弟:SegmentedControl(同 primitive 別 positioning、滑る pill)、NavigationMenu(ページ遷移版)、Breadcrumb(現在地表示)
- 住み分け:`component-selection-map.md` §navigation
- 詳細:`src/core-ui/tabs/tabs.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/tabs`
- memory:[[otibo-ds-progress]](Tabs の決定全般)
