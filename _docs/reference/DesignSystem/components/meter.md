---
title: Meter
status: active
component: src/core-ui/meter/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**現在値の度合いを示すバー**(measure)。容量・強度・電池残量・評価など、**時間軸でない静的な値**の度合い。**Progress と視覚言語を完全共有**(同じ凹み track + accent fill、同じ slot 構造、同じ motion)── 違いは **semantic** で、`<meter>` 要素 + SR で「42/100」と読み上げる(Progress は「読み込み中、42%」)。判定の一行ルール:**「終わりがある」= Progress、「現在地」= Meter**。

## API

slot recipe(Panda)+ Base UI Meter 委譲。slot は `root` / `label` / `value` / `track` / `indicator`(5 slot、Progress と完全同構造)。

```tsx
<Meter.Root value={42} min={0} max={100}>
  <div className={meterLayout()}>
    <Meter.Label>ストレージ使用量</Meter.Label>
    <Meter.Value>42 GB / 100 GB</Meter.Value>
  </div>
  <Meter.Track>
    <Meter.Indicator />
  </Meter.Track>
</Meter.Root>
```

## Variants

なし(単一形)。Progress と同じく size variant 無し、高さ 6px 固定。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | flex column + gap 2 + width 100% |
| **label** | `sm` + tight + `fg` |
| **value** | `sm` + tight + `fg.muted` + `tabular-nums` |
| **track** | `position: relative` + `width: 100%` + `height: 6px` + `borderRadius: full` + `overflow: hidden` + `bg: surface.muted` + 凹み inset shadow(`inset 0 1px 2px color-mix shadow.depth 9%`) |
| **indicator** | `height: 100%` + `borderRadius: full` + **`bg: accent`** + width は Base UI が値%で inline 設定 |

**Progress との視覚的差は無い**(意図的に共有)── 画面上は同じに見えて、a11y と semantic のレベルでだけ違いが現れる。

## a11y

- **primitive** ── `@base-ui-components/react/meter`(Root / Label / Value / Track / Indicator)。
- **role** ── `meter`(`aria-valuenow` / `aria-valuemin` / `aria-valuemax` 自動配線)。
- **SR 読み上げ** ── 「42/100」(Progress の「読み込み中、42%」と区別される)。
- **HTML 要素** ── `<meter>` 要素を内部で使う(`<progress>` とは別)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `medium`(240ms) |
| Register | **`expressive`**(値変化の settle) |
| 対象 property | `width`(indicator) |

Progress と同じ。reduced-motion で `transitionProperty: none`。

## Use when

- **静的な値の度合い**(ストレージ使用量、パスワード強度、電池残量、評価スコア)。
- 「最大値に対して現在いくらか」を示したい(時間軸でない)。
- ユーザーに **現在地を伝える**(進捗ではない)。

## Use instead

- **時間軸の作業完了率**(ダウンロード、同期) → **Progress**(視覚共有、semantic で「読み込み中」と読まれる)。
- **不定の wait** → **Spinner**。
- **段階的な評価**(★★★☆☆ の 5 段階) → 専用 Rating component(otibo 未着手、消費側で組む)。

詳細は `component-selection-map.md` §feedback(Progress vs Meter の一行ルール)。

## Avoid

- **静的な値表示に Progress**(SR が「読み込み中」と読み、ユーザーに「作業中」と誤解させる) → Meter。
- **fill 上に値文字を重ねる**(color-on-color、原則 2 違反) → label / value は track の外。
- **強度別に hue を変える**(low/mid/high で緑/琥珀/赤)── 原則 3 emphasis ladder の grain(success / warning の新 hue は作らない方針)を破る → 単一 accent 維持。
- **track 高さを変える**(grain の 6px 固定) → 維持。
- **Progress と意図的に視覚を変える**(視覚共有 grain を破る、消費側が「同じに見えて中身が違う」便利さを失う) → 共有維持。

## Decisions(本セッションの確定事項)

- **Progress と視覚言語完全共有**(同 recipe 構造、同 motion、同 token) ── 「画面上は同じ、a11y / semantic でだけ違う」grain の正典。消費側で「Progress / Meter どっち?」と迷ったら **一行ルール**(終わりがある = Progress、現在地 = Meter)で判定。
- **HTML `<meter>` 要素 + SR 「42/100」読み上げ** ── Base UI 担保、Progress との明確な分離。
- **強度別 hue 化しない**(原則 3 emphasis ladder) ── 単一 accent fill、low/mid/high の色分けは grain 違反。値が low の時の警告は文脈(label / 補足 text)で伝える。
- **motion = medium expressive**(値変化の settle、Progress と同じ) ── 値が動いた = feedback。
- **size variant 持たない、高さ 6px**(Progress と grain 統一) ── 段を増やさない。

## Related

- 上位:`principles.md` §2(色は土台、fill が accent)、§3(emphasis ladder、強度別 hue 作らない)、§5(accent precious、fill だけ accent)、§6(影の規範、凹み inset)、§14(Base UI 一本)
- 兄弟(視覚言語共有):Progress(semantic 別)
- 別 feedback:Spinner / Skeleton / Toast
- 隣接:Slider(同 track grain、対話 control 版)
- 住み分け:`component-selection-map.md` §feedback(Progress vs Meter の一行ルール)
- 詳細:`src/core-ui/meter/meter.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/meter`
- memory:[[otibo-ds-progress]](Meter の決定全般)
