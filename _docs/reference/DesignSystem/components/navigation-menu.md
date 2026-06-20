---
title: NavigationMenu
status: active
component: src/core-ui/navigation-menu/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**top nav 専用の dropdown 付きヘッダー nav**(portfolio header の主導線)。Menu(action 群)/ Tabs(panel 切替)/ Link(prose)とは別の grain で、**Viewport が共有 box / Content がその中身として swap** という Base UI のモデルを採用 ── 開いた item ごとに中身が入れ替わり、Viewport は寸法を滑らかに animate する(これが nav menu の見どころ)。Trigger は treatment B(下線なし fg.muted → hover/open で accent)。

## API

slot recipe(Panda)+ Base UI NavigationMenu 委譲。slot は `list` / `item` / `trigger` / `icon` / `link` / `viewport` / `content` / `grid`(8 slot)。

```tsx
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>
        作品 <NavigationMenu.Icon><Icon name="chevron-down" /></NavigationMenu.Icon>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Grid>
          <NavigationMenu.Link href="/works/oil">油彩</NavigationMenu.Link>
          <NavigationMenu.Link href="/works/ink">水墨</NavigationMenu.Link>
        </NavigationMenu.Grid>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Portal>
    <NavigationMenu.Positioner>
      <NavigationMenu.Viewport />
    </NavigationMenu.Positioner>
  </NavigationMenu.Portal>
</NavigationMenu.Root>
```

trigger 付き item は dropdown を持ち、trigger なし item は直リンクとして使う。

## Variants

なし(単一形)。dropdown 系 nav は形が固定。

## States

| Slot / State | 視覚 |
| --- | --- |
| **trigger rest** | `color: fg.muted` + `fontSize: sm` + 下線なし(treatment B) |
| **trigger hover** | `color: fg.strong`(背景は触らない) |
| **trigger `data-popup-open`** | `color: accent`(open 中は accent、interaction 時の precious 出現) |
| **trigger focus-visible** | `outline: 2px solid accent` + `outlineOffset: 1px` |
| **icon `data-popup-open`** | `transform: rotate(180deg)`(chevron 反転) |
| **viewport** | `bg: surface.raised` + `boxShadow: lift` + `borderRadius: md` + `overflow: hidden`(共有 box) |
| **viewport open/close** | opacity quick fade(scale や slide は持たない、共有 box の質量感に合わせる) |
| **viewport 寸法 transition** | `width, height` を `medium` / `expressive`(item 切替で箱がスーッとリサイズ) |
| **content** | 普通の block(`padding: 3`)+ swap 時 crossfade(`opacity` quick / standard) |
| **grid** | `grid-template-columns: repeat(2, 1fr)` + `gap: 1` + `min-width: 20rem` |
| **link rest** | `color: fg` + `text-decoration: none` |
| **link hover** | `bg: accent.subtle` + `color: fg.strong`(リンクリスト内 hover の active 表現) |
| **link focus-visible** | `outline: 2px solid accent` + `outlineOffset: -2px`(item 内側に焦点) |

## a11y

- **primitive** ── `@base-ui-components/react/navigation-menu`(Root / List / Item / Trigger / Icon / Content / Portal / Positioner / Viewport / Link)。
- **role** ── List は `menubar`、Item は `menuitem`、dropdown 内は WAI-ARIA Navigation Menu pattern に従う(Base UI 担保)。
- **keyboard** ── tab で trigger 間移動、Enter / Space で open、↑↓ で content 内 link 移動、Esc で close。Base UI ネイティブ。
- **focus management** ── open で content 先頭 link に focus 移動、close で trigger に戻る。
- **モバイル** ── hover が無いタッチ環境では tap で open / close ── Base UI が自動分岐。

## Motion

| 軸 | 値 |
| --- | --- |
| **viewport opacity(開閉)** | `quick` / standard / opacity フェードのみ |
| **viewport 寸法**(width / height) | `medium` / **expressive**(箱が滑らかにリサイズ) |
| **content swap** | `quick` / standard / opacity crossfade(slide なし) |
| **trigger color, icon transform** | `quick` / standard |

**viewport は opacity fade のみ(scale / slide なし)** ── 共有 box の質量感に合わせる(scale すると「軽い popover」に見えて grain が違う、slide は「移動」の嘘)。**寸法は medium で滑らかにリサイズ**するのが nav menu の主たる feedback。

**content の swap は crossfade**(slide なし、初版方針) ── slide で「左右に動いた」嘘を付かず、寸法変化に focus を集める。

reduced-motion:viewport / content の transition を切る(opacity だけ瞬時に切替、寸法 transition も止める)。

## Use when

- **portfolio / site の top nav**(作品 / ブログ / About の主導線)。
- 各 trigger の下に **複数の link を grid で並べたい**(media: 油彩 / 水墨 / 陶芸、blog: tag / archive / featured 等)。
- **ページ遷移**が主目的(同一画面の content 切替ではない)。

## Use instead

- **action のリスト**(プロフィール / ログアウト) → **Menu**(role が違う、action 群)。
- **同一画面の content 切替** → **Tabs**(URL 変えない、panel を持つ)。
- **prose 内 / footer の単独リンク** → **Link**(top nav ではない場面)。
- **値の選択 listbox** → **Select** / **Combobox**。

詳細は `component-selection-map.md` §navigation / §overlay。

## Avoid

- **viewport を absolute にしない**(現状は positioner 配下に普通配置)── overlay モデル上は portal/positioner 経由が前提。
- **content を `position: absolute` で組む**(中身の実寸が Popup に伝わらず、Viewport が依存する `--positioner-width/height` が 0 に縮んで何も見えなくなる) ── 圧縮前に発覚したバグの修正点、**普通の block で組む**。
- **viewport に scale / slide animation**(共有 box の質量感が崩れる)── opacity fade + 寸法 transition のみ。
- **content swap で slide motion**(「移動」の嘘) → crossfade。
- **action リストに NavigationMenu**(role 違い) → Menu。

## Decisions(本セッションの確定事項)

- **モデル = 共有 Viewport + Content swap**(Base UI NavigationMenu のネイティブモデル採用) ── item 切替で箱が滑らかにリサイズするのが nav menu の見どころ。
- **content は普通の block で組む(absolute にしない)** ── 中身の実寸が Popup に伝わって `--positioner-width/height` が解決される必要があるため。**`position: absolute` にすると Viewport が 0 寸法に縮んでドロップダウンの中身が消えるバグ**(圧縮前に発覚し修正)。
- **trigger = treatment B**(下線なし、fg.muted → hover で fg.strong → open で accent)── Link / Breadcrumb / PreviewCard Trigger と同文法。「平常は静か、interaction で accent」。
- **viewport の motion = opacity fade のみ + 寸法 medium expressive**(scale / slide なし) ── 共有 box の質量感を優先、寸法 transition が主役。
- **content swap = crossfade**(slide なし、初版方針) ── 寸法変化に focus を集める、「左右に動いた」嘘を avoid。
- **grid = `repeat(2, 1fr)` + min-width 20rem** ── 既定の dropdown 内リンク並べ、消費側で gridTemplate を上書き可能。

## Related

- 上位:`principles.md` §5(accent precious、open で accent)、§10(overlay 出現 motion 分岐 ── Viewport は単一焦点 box で opacity-only 側)、§11(hover trigger 予見、treatment B)、§14(Base UI 一本)
- 兄弟(treatment B 同文法):Link / Breadcrumb crumb / PreviewCard Trigger
- 別 grain:Menu(action 群、role 違い)、Tabs(同一画面 content 切替)
- 住み分け:`component-selection-map.md` §navigation、§overlay
- 詳細:`src/core-ui/navigation-menu/navigation-menu.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/navigation-menu`
- memory:[[otibo-ds-progress]](NavigationMenu の決定全般)
