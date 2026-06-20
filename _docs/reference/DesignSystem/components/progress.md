---
title: Progress
status: active
component: src/core-ui/progress/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**進捗の表示(非対話、determinate)**。時間軸の作業完了率(ダウンロード、同期、保存)を示す。**slider と track 言語を共有** ── 凹んだ `surface.muted` の track + accent fill。Meter と**視覚言語を完全共有**(同じ recipe 構造)するが、**semantic で別 component**(`<progress>` 要素 + 「進捗」の SR 読み上げ)。**自走 animation(indeterminate の流れる bar)は持たない** ── 原則 8 自走例外は loading(Spinner / Skeleton)のみ、進捗が分かるなら determinate を使う。

## API

slot recipe(Panda)+ Base UI Progress 委譲。slot は `root` / `label` / `value` / `track` / `indicator`(5 slot)。

```tsx
<Progress.Root value={42}>
  <div className={progressLayout()}>
    <Progress.Label>同期中...</Progress.Label>
    <Progress.Value>42 / 100</Progress.Value>
  </div>
  <Progress.Track>
    <Progress.Indicator />
  </Progress.Track>
</Progress.Root>
```

`value` を渡せば determinate(値%で fill)。indeterminate モードは現状未実装(必要になれば別途)。

## Variants

なし(単一形)。size variant は持たない(grain として固定の高さ 6px)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | flex column + gap 2 + width 100% |
| **label** | `sm` + tight + `fg` |
| **value** | `sm` + tight + `fg.muted` + `tabular-nums`(桁が変わっても幅ぴくつかない) |
| **track** | `position: relative` + `width: 100%` + `height: 6px` + `borderRadius: full` + `overflow: hidden` + `bg: surface.muted` + 凹み inset shadow(`inset 0 1px 2px color-mix shadow.depth 9%`) |
| **indicator** | `height: 100%` + `borderRadius: full` + **`bg: accent`** + width は Base UI が値%で inline 設定 |

**track の凹み**:slider rail / segmented control の track と同じ **shadow.depth(cool-dark)由来**の inset。「物理的な溝に accent fill が満ちる」 grain。

**accent は土台として置く**(color layering 正しい側、原則 2):fill は accent 面、その上に文字を重ねない ── 「色は面 / 土台」の grammar に従う。

## a11y

- **primitive** ── `@base-ui-components/react/progress`(Root / Label / Value / Track / Indicator)。
- **role** ── `progressbar`(`aria-valuenow` / `aria-valuemin` / `aria-valuemax` / `aria-valuetext` 自動配線)。
- **SR 読み上げ** ── 「読み込み中、42%」など progressbar の標準読み上げ。
- **Label と Value の関連付け** ── Progress.Root の `aria-labelledby` 自動配線。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `medium`(240ms) |
| Register | **`expressive`**(値更新の settle) |
| 対象 property | `width`(indicator) |

**fill の width 変化を medium / expressive で滑らかに settle** ── 値更新 = feedback として、瞬時でなく「動いた」を見せる(`motion-grammar.md` のスライダー / segmented と同じ「動かして見せる」grain)。

**自走 animation は持たない**(原則 8、`motion-grammar.md` §Loading):
- indeterminate の流れる bar(infinite gradient sweep)は loading の自走例外を Progress に拡張することになる ── 採らない。
- 不定の wait は **Spinner / Skeleton** に振る。Progress は **determinate 専用**。

reduced-motion:`transitionProperty: none`(値更新は瞬時で切替、travel 抜き)。

## Use when

- **進捗が明確に分かる作業の表示**(ダウンロード:50/100MB、同期:42/100 件、保存:90%)。
- 時間軸の完了率を見せたい場面(終わりが見える)。

## Use instead

- **進捗が不明 / 不定の待ち** → **Spinner**(自走、travel が message)。
- **content 到着前の placeholder** → **Skeleton**(opacity 呼吸)。
- **静的な値の度合い**(容量 / 強度 / 評価) → **Meter**(視覚共有、semantic 別)。
- **作業結果の通知** → **Toast**。

詳細は `component-selection-map.md` §feedback(Progress vs Meter)。

## Avoid

- **進捗が不明なものに Progress**(0% で止まって見える、フリーズと誤解) → Spinner / Skeleton。
- **indeterminate の流れる bar を実装する**(原則 8 自走例外を Progress に拡張)→ Spinner に振る。
- **fill 上に文字を重ねる**(color-on-color、原則 2 違反) → label / value は track の外。
- **track 高さを変える**(6px が grain の固定値) → 維持。
- **静的な値表示で Progress**(SR が「読み込み中」と読む、grain 違い) → Meter。

## Decisions(本セッションの確定事項)

- **determinate 専用**(indeterminate なし) ── 原則 8 自走例外を loading だけに保つ。indeterminate は Spinner に振る。
- **視覚言語は Meter と完全共有、semantic で別 component** ── 同じ凹み track + accent fill、SR 読み上げと HTML 要素(`<progress>` / `<meter>`)で意味を分ける。**「終わりがある = Progress、現在地 = Meter」の一行ルール**で判定。
- **track 凹み = `shadow.depth` 由来 inset shadow** ── slider / segmented control と同じ凹み grain(「物理的な溝」)。
- **fill = accent**(原則 4 白 on 色は使わない、accent は面として置く ── 文字は重ねない) ── color layering 正しい側。
- **motion = medium expressive**(値更新の settle) ── slider / segmented control と同じ「値が動いた」grain。
- **size variant 持たない**(高さ 6px 固定) ── grain として段を増やさない。

## Related

- 上位:`principles.md` §2(色は土台、fill が accent、上に文字載せない)、§5(accent precious、fill だけ accent)、§6(影の規範、凹み inset)、§8(自走 animation は loading のみ)、§14(Base UI 一本)
- 兄弟(視覚言語共有):Meter(semantic 別)
- 別 feedback:Spinner(不定 wait)、Skeleton(content 到着前)
- 隣接:Slider(同 track grain、対話 control 版)
- 住み分け:`component-selection-map.md` §feedback(Progress vs Meter の一行ルール)
- 詳細:`src/core-ui/progress/progress.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/progress`
- memory:[[otibo-ds-progress]](Progress の決定全般)
