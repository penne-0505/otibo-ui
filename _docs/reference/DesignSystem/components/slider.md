---
title: Slider
status: active
component: src/core-ui/slider/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**連続値の直接操作 control**(音量、明度、範囲指定)。checkbox / radio / switch と同じ直接操作家系の **連続値版** ── rail(track)= `surface.muted` の凹んだ軌道 + 値の塗り(indicator)= accent + つまみ(thumb)= **accent の円**。**switch trick(色を thumb に連れ添わせる)は不要**(fill は thumb の位置で終わる = 構造的に連動、先走り不可能) ── motion-grammar §Two-Axis の検証で確定した例外。drag 中は transition を切って pointer 追従、keyboard step では glide。

## API

slot recipe(Panda)+ Base UI Slider 委譲。slot は `root` / `value` / `control` / `track` / `indicator` / `thumb`(6 slot)。

```tsx
<Slider.Root defaultValue={50} min={0} max={100}>
  <div className={sliderLayout()}>
    <Slider.Value />
  </div>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

## Variants

なし(単一形)。size variant は持たない(rail 6px / thumb 18px / 操作域 20px 固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root rest** | flex column + gap 2 + width 100% |
| **root disabled** | `cursor: not-allowed` + `opacity: disabled` |
| **value** | `sm` + tight + `fg.muted` + `tabular-nums` |
| **control** | flex center + width 100% + **`height: 20px`**(rail 6px に対し touch target を広く取る) |
| **track** | `width: 100%` + `height: 6px` + radius full + `bg: surface.muted` + 凹み inset shadow(progress / meter と同系の shadow.depth) |
| **indicator(値の塗り)** | radius full + **`bg: accent`** + width は Base UI が値%で inline 設定 |
| **thumb rest** | `width/height: 18px` + radius full + **`bg: accent`** + soft drop shadow + `cursor: grab` |
| **thumb engaged**(hover / drag / focus) | `transform: scale(1.15)` + 濃い lift shadow |
| **thumb focus-visible** | scale(1.15) + accent ring(`0 0 0 3px color-mix accent 30%`) |
| **thumb `data-dragging`** | `cursor: grabbing` + transition 切る(pointer 追従、transition があると thumb が遅れる) |

**thumb が accent な理由**(白でない):白いつまみは白いカード上で上縁が溶ける ── **彩度で視認性を構造的に確保**。card(白) / rail(muted)に対し accent の彩度で立ち、左の fill(同 accent)とは「太い円が thin な fill bar から張り出す」ことで分離される。**affordance(操作の点)= accent** の grain。

**engaged 時の lift = `scale(1.15)`**:小さなつまみで「影だけの変化」は知覚しづらいので、**scale を主たる lift 合図**にする。影と scale が両方変わって「掴める」が伝わる。

## a11y

- **primitive** ── `@base-ui-components/react/slider`(Root / Value / Control / Track / Indicator / Thumb)。
- **role** ── thumb は `slider`(`aria-valuenow` / `aria-valuemin` / `aria-valuemax` 自動配線)。
- **keyboard** ── ↑↓ ←→ で step、PageUp/Down で largeStep、Home / End で min/max(Base UI ネイティブ)。
- **focus management** ── thumb が tab-stop、focus visible で scale + accent ring。
- **touch / pointer** ── control 全体が grab 領域(touch target 20px)、drag で thumb 追従。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| **indicator(fill width)** Tier | `quick`(120ms) |
| **indicator** Register | **`expressive`** |
| **indicator** `data-dragging` | transition **none**(pointer 追従) |
| **thumb position(inset-inline-start)** Tier | `quick` |
| **thumb position** Register | `expressive` |
| **thumb position** `data-dragging` | transition **none** |
| **thumb scale / shadow** | `quick` / `expressive`(hover / focus / dragging) |

**switch trick は不要**(2026-06-19 検証で確定、`motion-grammar.md` §Two-Axis):
- slider の fill は thumb の位置で終わる ── **色と可動部が同じ縁を共有**(構造的連動)。
- switch では track 全体が即色変わりするが、slider は fill 端 = thumb 位置で常に一致。**先走りは構造的に起き得ず、trick 不要**。
- 当初「つまみが軌道を横断する系は switch と同じ扱い」と予言したが、実機で外れた例外(slider / segmented control とも)。

reduced-motion:fill / thumb position の transition を `none`(travel 抜き、scale / shadow は残す)。

## Use when

- **連続値の調整**(音量、明度、範囲、フィルタ強度)。
- **直接操作で「動かして見せる」値設定**(数値入力より直感的な場面)。
- 視覚的な範囲(0-100)が明示できる値。

## Use instead

- **離散値・stepper** → **NumberField**(stepper + キーボード ↑↓ + scrub、数値が主の入力)。
- **range from-to の両端** → 別 component(range slider、現状未着手)。
- **進捗の表示(非対話)** → **Progress**(同 track grain、対話なし)。
- **静的な値の度合い** → **Meter**(同 track grain、対話なし)。

詳細は `component-selection-map.md` §form 値入力 / §選択。

## Avoid

- **thumb を白に**(card 白の上で溶ける) → accent 維持で彩度視認。
- **drag 中に transition を残す**(thumb が pointer に遅れて気持ち悪い) → `data-dragging` で切る。
- **switch trick(色連れ添わせ)を slider に適用**(構造的に不要、複雑さの追加) → 既定維持。
- **rail / thumb の size を変える**(touch target / 視認性の grain) → 固定。
- **離散値で slider**(stepper の方が grain) → NumberField。

## Decisions(本セッションの確定事項)

- **thumb = accent**(白でない) ── 白いカード上で白い thumb が溶ける問題、彩度で視認性を構造的に確保する grain。
- **engaged の lift = scale(1.15)**(影だけでなく scale で「掴める」を伝える) ── 小さなつまみでの認知補強。
- **switch trick 不要**(構造的連動、fill と thumb が同じ縁を共有) ── motion-grammar §Two-Axis の予言検証で外れた例外(slider / segmented control とも)。
- **`data-dragging` で transition 切る**(pointer 追従、glide は keyboard step 専用) ── 直接操作の grain。
- **control = `height: 20px`**(rail 6px に対し touch target を広く)── 触りやすさ + rail の細さを両立。
- **track 凹み = shadow.depth 由来**(progress / meter と同系 grain) ── 「物理的な溝に値が満ち、円盤が乗る」表現。

## Related

- 上位:`principles.md` §2(色は土台、fill が accent)、§5(accent precious、fill + thumb が accent)、§6(影の規範、凹み inset)、§7(motion = 状態の証言、switch trick の検証)、§14(Base UI 一本)
- 兄弟(直接操作家系):Checkbox / Radio / Switch(段階的 motion 共有、slider は連続値版)
- 隣接(同 track grain):Progress / Meter
- 別 form 入力:NumberField(離散値 / stepper)
- 住み分け:`component-selection-map.md` §form 値入力 / §選択
- 詳細:`src/core-ui/slider/slider.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/slider`
- motion 文法:`motion-grammar.md` §Two-Axis(switch trick 不要の検証)
- memory:[[otibo-ds-progress]](Slider の決定全般)
