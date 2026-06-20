---
title: Switch
status: active
component: src/core-ui/switch/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**永続的な設定の on/off**(通知の有効化、ダークモード切替 等)。track 上を thumb が**横断する** ── これが checkbox / radio との motion 上の grain 差を生む。**track の塗りだけで off/on を読ませる**(輪郭線なし)。off = `surface.muted`、on = **単一 accent**。「**switch trick**(track の color を 80ms だけ thumb glide に連れ添わせる)」を採用する唯一の component ── motion-grammar §Staged Motion の **例外**。

## API

slot recipe(Panda)+ Base UI Switch 委譲。slot は `root`(track)/ `thumb`(2 slot)。

```tsx
<Field.Root>
  <Field.Label>通知を受け取る</Field.Label>
  <Switch>
    <Switch.Thumb />
  </Switch>
</Field.Root>
```

**注意**:slotRecipes の key を `switch`(JS 予約語)にできないため、Panda の usage 検出が効かない ── `jsx: ["Switch"]` を明示して `<Switch>` 使用で CSS が emit される(これが無いと CSS が生成されない)。

## Variants

なし(単一形)。size variant は持たない(設定切替の grain で固定、40×24 px)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root rest(off)** | `40×24px`(整数 px) + `padding: 4px` + `borderRadius: full` + `bg: surface.muted`(輪郭線なし) |
| **root `data-checked`(on)** | `bg: accent`(track の塗りだけで on を読ませる) |
| **root focus-visible** | `outline: 2px solid accent` + `outlineOffset: 2px` |
| **root disabled** | `opacity: disabled` + `cursor: not-allowed` |
| **thumb rest(off)** | `16×16px` + `borderRadius: full` + `bg: surface`(白) + contact shadow(`0 1px 2px fg.strong 8%`)、`transform: translateX(0)` |
| **thumb `data-checked`(on)** | `transform: translateX(16px)`(内寸 32px − thumb 16px = 16px 移動、**整数**) |

**整数 px geometry の理由**:18px root では rem が半端ピクセルになり、thumb が縦に微妙にずれて見える。**track 40×24 / padding 4 → 内寸 32×16、thumb 16 で縦 gap 4px(整数)中央化、横 off 左 4 / on 右 4 の整数対称**。sizes scale 不在ゆえの妥協。

**輪郭線を持たない理由**:track の塗り(`surface.muted` ↔ `accent`)が off/on を**面の色だけで**語る ── 線で囲うと「線」という装飾が状態 signal に上乗せされて noise になる(原則 1 余白 grain と整合)。

## a11y

- **primitive** ── `@base-ui-components/react/switch`(Root / Thumb)。
- **role** ── `switch`(WAI-ARIA Switch、`aria-checked` で状態)。
- **keyboard** ── Space で toggle。
- **focus ring** ── `outline: 2px solid accent` + `outlineOffset: 2px`。
- **label との接続** ── Field 経由で自動配線(`aria-labelledby`)。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| **root color**(off→on / on→off) | **80ms**(thumb glide に連れ添う、switch trick) |
| **thumb off→on(到着)** | `medium`(240ms)+ **`expressive`**(glide して着地) |
| **thumb on→off(離脱)** | `quick`(120ms)+ **`accelerate`**(速い retract) |

**switch trick(段階的 motion 例外)** ── `motion-grammar.md` §Staged Motion / §Exception: Moving Part Crossing Its Primary Color Signal:

- switch は **track 上を thumb が横断**するため、track と thumb が同じ「状態」を二重に語る。
- color を **瞬時(0ms)** にすると ── track が即 accent になり、**thumb がまだ off 位置にいるのに track だけ「ON」と言い切る**。色が物理を追い越して**先走り**「二分された動き」に見える。
- 解決:**track の accent 化を 80ms だけ animate** して、thumb の glide(240ms)に連れ添わせ「一つの協調動作」にする。

**他の直接操作 control(checkbox / radio)はこの trick が不要**:可動部が色域を横断しないため(check/dot は色の上に**載る**だけ)、color を瞬時にしても破綻しない。

**slider / segmented control は trick 不要**(2026-06-19 検証で確定、`motion-grammar.md` §Two-Axis):「横断する色が**主たる** state signal」のときだけ trick が要る ── switch だけが特殊だった。

reduced-motion:thumb / root の transition を `none`(travel を抜き、状態は即時)。

## Use when

- **永続的な on/off 設定**(通知有効化、ダークモード、機能フラグ等)。
- 「いつでも切り替えられる、即時反映」性質の設定。
- form を submit せずに反映する設定行。

## Use instead

- **フォームの複数選択肢**(submit して値を送る) → **Checkbox**。
- **排他一択** → **Radio**。
- **toolbar の押し込み(単体)** → **Toggle**(設定 vs アクションの grain 差)。
- **二択の設定で「選んだ感」を強調** → **SegmentedControl**(密に並ぶ三択以上向きだが二択も可)。

詳細は `component-selection-map.md` §選択。

## Avoid

- **track に輪郭線を足す**(線 noise、塗りだけで off/on を読ませる grain を破る)。
- **track の color transition を 0ms にする**(先走りで二分された動きになる、switch trick の意義喪失) → 80ms 維持。
- **thumb の到着 motion を quick / accelerate に下げる**(glide の質感が消え「カチッ」と切替に見える) → medium / expressive 維持。
- **integer px を rem 化**(thumb が縦に滲む) → px 固定。
- **設定でないものに Switch**(form submit を介する複数選択肢に Switch を使うと、即時反映の期待と乖離) → Checkbox。

## Decisions(本セッションの確定事項)

- **switch trick(track color 80ms)** ── `motion-grammar.md` §Staged Motion の唯一の例外。可動部が **主たる state signal の color** を横断する場面で先走りを止める。
- **輪郭線を持たない、track の塗りだけで off/on**(原則 1 余白 grain) ── 線で囲わない、面の色差だけで状態を語る。
- **整数 px geometry(40×24 / padding 4 / thumb 16 / 移動 16)** ── 18px root の半端ピクセル滲み回避、sizes scale の例外。
- **on→off 非対称**(到着 medium expressive / 離脱 quick accelerate) ── 直接操作家系の共通文法(checkbox / radio とも共有)。
- **`jsx: ["Switch"]` 明示が必須**(JS 予約語 `switch` を slot key にできないため、Panda usage 検出補助) ── 設計上の注意点。

## Related

- 上位:`principles.md` §1(構造区切りは余白、輪郭線最小)、§4(白 on 色、thumb 白 on track accent)、§5(accent precious、on で accent)、§7(motion = 状態の証言、switch trick)、§14(Base UI 一本)
- 兄弟(直接操作家系):Checkbox / Radio
- 親 wrapper:Field(label / description / error)
- 住み分け:`component-selection-map.md` §選択
- 詳細:`src/core-ui/switch/switch.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/switch`
- motion 文法:`motion-grammar.md` §Staged Motion / §Exception(switch trick の正典)
- memory:[[otibo-ds-progress]](Switch の決定全般)
