---
title: Popover
status: active
component: src/core-ui/popover/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**click で開く、補足情報や軽い操作を載せる浮く面**。Tooltip(transient chip)と違い、明るい raised surface(紙が一枚浮く)。**輪郭は lift shadow のみで定義**(枠線なし、矢印なし、原則 1 余白 grain と整合)。Dialog との違いは **scrim 無し / 背景を奪わない**こと ── trigger 隣接で出て、外側 click で閉じる。

## API

slot recipe(Panda)+ Base UI Popover 委譲。slot は `popup` / `title` / `description`。

```tsx
<Popover.Root>
  <Popover.Trigger render={<Button intent="ghost">情報</Button>} />
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup>
        <Popover.Title>タイムゾーンについて</Popover.Title>
        <Popover.Description>表示は端末の設定を使用します。</Popover.Description>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

trigger 隣接で表示位置(top / bottom / left / right)は Base UI が自動 flip。

## Variants

なし(単一形)。size variant は持たない(`maxWidth: 20rem` で中型固定、それより大きい場面は Dialog に倒すか別 component)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **popup rest** | `bg: surface.raised` + `boxShadow: lift` + `borderRadius: lg` + `padding: 5` + `maxWidth: 20rem` |
| **popup `data-starting-style`** | `opacity: 0`(scale なし) |
| **popup `data-ending-style`** | `opacity: 0`(scale なし) |
| **title** | `base` + `semibold` + `tight` + `fg.strong` + `marginBottom: 1` |
| **description** | `sm` + `snug` + `fg.muted` |

**枠線も矢印も持たない**:輪郭は **lift shadow が単独で定義**する。矢印(arrow / caret)は trigger との接続感を補強するが、shadow と矢印は noise になりがち ── otibo は shadow だけで「trigger の近くから出てきた」を表現する(Base UI Arrow を当てない)。

## a11y

- **primitive** ── `@base-ui-components/react/popover`(Root / Trigger / Portal / Positioner / Popup / Title / Description / Close)。
- **role** ── `dialog`(modal=false、focus-trap 無し)。**Popup 内で focus を握る**が、外側 click や Esc で close できる(scroll-lock もしない、modal でないため)。
- **outside-dismiss / Esc** ── 外側 click / Esc で close(Base UI 既定)。
- **title / description の ARIA 関連付け** ── `aria-labelledby` / `aria-describedby` が自動接続。
- **keyboard** ── Tab で popup 内を移動、Esc で close。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier(enter) | `quick`(120ms) |
| Tier(exit) | `quick`(120ms) |
| Register(enter) | `decelerate` |
| Register(exit) | `standard` |
| 動作 | **opacity フェードのみ**(scale 撤去済) |

**scale を撤去した理由**:popover は title + 本文でも **一つの焦点ブロック**として読まれ、Select / Menu の list ほど attention が散らない ── instant-opacity でも scale settle が焦点に乗ってしまい、`motion-grammar.md` §Overlay Appearance の **scale-on-text snap**(GPU レイヤ解除でテキストが 1px ずれる)が知覚される。

`tooltip` と同じく opacity-only に倒した。trigger 隣接で出るので **空間の手がかりは位置で足り**、scale は無くてよい。

reduced-motion:そもそも opacity だけなので travel を抜く必要なし(opacity 即時に近い quick で、reduced-motion でも自然に収まる)。

## Use when

- **補足情報の表示**(用語の説明、ヘルプ、コンテキスト)。
- **軽い操作 / 短 form**(1〜2 行の入力、選択)。
- **trigger の近くに紐づけた追加情報**(scrim で画面を奪うほどではない場面)。

## Use instead

- **画面を奪う重み**(削除確認、長 form) → **Dialog**(scrim + 中央 fix)。
- **hover で出る一行 hint** → **Tooltip**(transient chip、明示的に開かない)。
- **hover で出るリンクプレビュー(media + meta)** → **PreviewCard**(treatment B trigger + 非対称 delay)。
- **action のリスト**(プロフィール / ログアウト) → **Menu**(role が違う、check も無い)。
- **値の選択** → **Select** / **Combobox**(listbox role)。

詳細は `component-selection-map.md` §overlay。

## Avoid

- **scale animation を popup に足す**(scale-on-text snap で title / 本文が 1px ずれる) → opacity-only。
- **矢印 / 枠線を足す**(lift shadow の輪郭が崩れる、noise) → shadow 単独で輪郭定義。
- **scrim を popup の下に敷く**(scrim を持つのは Dialog の grain、Popover は背景を奪わない) → Dialog に倒すか scrim 無しのまま。
- **長 content を popup に詰める**(`maxWidth: 20rem` を超える content) → Dialog や sheet を検討。
- **hover で popover を open する**(click が grain、hover overlay は Tooltip / PreviewCard / NavigationMenu hover に限定) → Tooltip / PreviewCard。

## Decisions(本セッションの確定事項)

- **scale 撤去、opacity-only**(2026-06-19 確定) ── title+本文でも単一焦点ブロックとして読まれ、scale-on-text snap が知覚される。tooltip と同じ側に倒した(`motion-grammar.md` §Overlay Appearance の単一焦点 overlay 側)。
- **枠線・矢印を持たない** ── shadow 単独で輪郭を定義(原則 1 余白 grain + 原則 6 単一非階層 lift)。trigger との接続感は位置(隣接)で十分。
- **影 = lift 単一**(原則 6 の影の規範) ── 段を増やさない、HDR OFF で判定。
- **maxWidth: 20rem 固定** ── popover の役割を「短い補足」に絞る。それより大きい content は Dialog や別 component に倒す方が grain が保たれる。
- **scrim 無し、scroll-lock 無し、focus-trap 無し**(modal=false 既定) ── 背景を奪わない overlay として grain。

## Related

- 上位:`principles.md` §1(構造区切りは余白、枠線最小)、§6(影の規範、lift 単一)、§10(overlay 出現 motion 分岐 ── 単一焦点は opacity-only)、§14(Base UI 一本)
- 兄弟(別 overlay):Tooltip(同 motion 文法、hover transient)、Dialog(scrim + heavy)、Menu(list 型 scale)、PreviewCard(hover + treatment B)
- 住み分け:`component-selection-map.md` §overlay
- 詳細:`src/core-ui/popover/popover.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/popover`
- motion 文法:`motion-grammar.md` §Overlay Appearance(scale-on-text snap の回避基準)
- memory:[[otibo-ds-progress]](Popover の決定全般)、[[shadow-banding-fix]](popover の影バンド調査の歴史)
