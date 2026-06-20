---
title: Toast
status: active
component: src/core-ui/toast/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**操作結果を自発的に告げる feedback overlay**。trigger に紐づかず**コードから提示される**(Popover / Dialog と違って「自分で開く」のではなく、系から系へ告げる)。`surface.raised` の小さな paper が画面隅(既定 bottom-right)に **stack** として積み上がる ── collapsed では後ろの toast が薄く重なって見え、hover / focus で **expanded(縦列に開く)**。motion は **scale を使わず slide + opacity 一本**(scale-on-text snap 回避、`motion-grammar.md` §Overlay Appearance の grain を slide 文脈に適用)。

## API

slot recipe(Panda)+ Base UI Toast 委譲。slot は `viewport` / `root` / `content` / `title` / `description` / `close`(6 slot)。

```tsx
{/* ルートに Toaster を一回置く */}
<Toast.Viewport />

{/* 任意の場所からコードで toast() を呼ぶ */}
toast.add({
  title: "保存しました",
  description: "変更は反映済みです",
  duration: 4000,
})
```

`<Toast.Root>` は Base UI が manager から runtime 描画するため、**Panda の usage 検出が効かない**(consumer の source code に現れない)── 後述の Decisions 参照(**`staticCss` での常時 emit が必須**、`[[panda-dynamic-component-staticcss]]`)。

## Variants

なし(単一形)。size variant は持たない(画面隅 stack の grain として `width: min(360px, calc(100vw - 2rem))` で固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **viewport** | `position: fixed` + bottom 4 right 4 + zIndex 60(dialog 50 より上) + `width: min(360px, calc(100vw - 2rem))` |
| **root rest(collapsed)** | `surface.raised` + `boxShadow: lift` + radius lg + padding 4 + 後ろの toast は **`translateY(index × -14px)`** + `opacity: 1 - index × 0.28` |
| **root `data-expanded`(hover / focus)** | `translateY(-toast-offset-y - index × 12px)` + `opacity: 1`(縦列に開く) |
| **root `data-starting-style`** | `translateY(150%)` + `opacity: 0`(下から slide up + fade) |
| **root `data-ending-style`** | 同上(下へ slide down + fade、quick / standard で素早く) |
| **root `data-swiping`** | `translate(swipe-x, swipe-y)` + `transition: none`(指追従) |
| **content** | flex column + gap 1 + flex 1 + `min-width: 0`(text の overflow を許容) |
| **title** | `base` + `semibold` + `tight` + `fg.strong` |
| **description** | `sm` + `snug` + `fg.muted` |
| **close** | 24px tap target(sizes 6 = 1.5rem) + ghost(`bg: transparent` → hover で `surface.muted`) + radius sm |

**stack の数値**:
- collapsed の重なり量 = **14px(`-14px × index`)** ── 上の toast が見える程度の覗き。
- expanded のギャップ = **12px(`-12px × index`)** + `--toast-offset-y`(高さ累積) ── toast 同士が密着しない縦列。
- collapsed の淡化 = **`1 - 0.28 × index`**(index 1 で 0.72、2 で 0.44、3 で 0.16…) ── 後ろほど淡く、奥行きを示す。

## a11y

- **primitive** ── `@base-ui-components/react/toast`(Provider / Viewport / Root / Title / Description / Close など)。
- **role** ── viewport は `region`(SR が「toast region」と読む)、root は `status` / `alert`(優先度で分岐、Base UI が握る)。
- **focus management** ── 通常は focus を奪わない(transient な通知の grain)。hover / focus(Tab で viewport に入る)で expanded、Esc で close 可能。
- **swipe-to-dismiss** ── touch / pointer で横スワイプして dismiss(Base UI が `data-swiping` 供給、CSS は transition を切って指追従)。

## Motion

| 軸 | 値 |
| --- | --- |
| **stack 遷移 / hover expanded** Tier | `medium`(240ms)decelerate |
| **enter(下から slide-up)** Tier | `medium`(default) |
| **exit(下へ slide-down)** Tier | `quick`(120ms)standard |
| 動作 | **opacity + translateY のみ**(scale 一切なし) |

**scale を使わない理由**:toast はテキスト(title + description)を持つので、scale=1 終端の再ラスタライズ snap が出る(`motion-grammar.md` §scale-on-text)。**slide ならサイズ不変で snap が起きない** ── overlay 出現 motion の中で「動かしたいがテキストがある」場面の正解が slide。

**stack も scale でなく translateY + opacity**:後ろの toast を縮小(scale)で奥行き表現する流派もあるが、テキスト snap が出るので採らない。**index 比例の淡化と translateY**で奥行きを示す(scale なしでも `opacity: 1 - 0.28 × index` で十分に「奥にある」が読める)。

reduced-motion:`transitionProperty: opacity` だけ残す(translateY 含む全 transform を抜く、位置は瞬時)。Honest の grain。

## Use when

- **操作結果の通知**(保存しました、コピーしました、エラー)。
- **作業中の進捗報告**(同期完了、アップロード済み)。
- **取り消し可能な action の undo**(削除しました → 「元に戻す」ボタン付き、duration を長めに)。

## Use instead

- **取り消し不可性が高い確認** → **Dialog**(scrim + heavy、消えない modal)。
- **永続的な notice**(メール未確認) → **Field.Description** に inline、または **Card** で囲む(toast は消える)。
- **trigger 隣接の補足** → **Popover** / **Tooltip**。
- **常設の警告 banner** → 現状未着手(Alert は不在、Card か Dialog に倒す)。

詳細は `component-selection-map.md` §feedback。

## Avoid

- **「取り消し不可」確認を toast に**(消えてしまう、ユーザーが見逃す) → Dialog。
- **永続情報を toast に**(消えるべきでない情報を transient overlay に置かない) → Card / Field.Description。
- **scale animation を root に足す**(text snap が出る) → translateY 一本。
- **stack を scale で組む**(同上、text snap) → translateY + opacity で奥行き。
- **viewport zIndex を 50 以下に**(dialog より下に潜って見えなくなる) → 60(dialog 50 + 10)。
- **長文 / 重い content を toast に詰める**(transient の役割を超える) → Dialog / Popover。

## Decisions(本セッションの確定事項)

- **motion = slide + opacity 一本(scale なし)** ── テキスト snap 回避、`motion-grammar.md` §scale-on-text の grain を slide 文脈に適用。stack も translateY + opacity で奥行き。
- **stack 数値:collapsed -14px / 0.28 比例淡化、expanded -12px ギャップ + offset-y** ── 14px の覗きで「後ろにも toast がある」が読める、淡化が奥行きを示す。expanded は高さ累積で密着回避。
- **viewport zIndex = 60** ── dialog(50)より上に置く(dialog 中に toast が出る場面で見えなくなることを avoid)。
- **swipe-to-dismiss 対応**(Base UI 供給の `data-swiping` で transition を切って指追従) ── touch device で自然な操作。
- **`Panda staticCss` での常時 emit が必須** ── Toast は Base UI manager から **runtime 描画**されるため、consumer の source code に Toast component の usage が現れない。Panda が「使われている」を検出できず CSS が出ない → ボタンを押しても表示が崩れる。`panda.config.ts` の `staticCss` で Toast の slot を**常時 emit**することで解決(同様の dynamic 描画 component 全般の罠、[[panda-dynamic-component-staticcss]] memory に記録)。
- **stack を scale で組まない** ── テキスト snap 回避(scale だけが原因ではないが、scale を採用すると stack の中の toast すべてで snap リスクが出る)。

## Related

- 上位:`principles.md` §6(影の規範、lift 単一)、§7(motion = 状態の証言)、§9(描画パイプライン罠、scale-on-text)、§14(Base UI 一本)
- 別 overlay:Dialog(scrim + 中央 fix)、Popover(trigger 隣接 click)、Tooltip(hover transient)
- 住み分け:`component-selection-map.md` §feedback、§overlay(Toast vs Dialog)
- 詳細:`src/core-ui/toast/toast.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/toast`
- Panda 罠:[[panda-dynamic-component-staticcss]](runtime 描画 component の staticCss 必須)
- motion 文法:`motion-grammar.md` §Overlay Appearance(scale-on-text snap)、§Reduced Motion
- memory:[[otibo-ds-progress]](Toast の決定全般)
