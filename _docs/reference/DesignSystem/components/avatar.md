---
title: Avatar
status: active
component: src/core-ui/avatar/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**人 / 主体を表す円形の像**(image + fallback)。image があれば載せ、無い / 読み込み中は fallback(イニシャル or icon)を出す。fallback の地は **`accent.subtle` + `accent` 文字**(header の手書き円と同じ扱いを正式化)。image の load 時 **fade(`fadeIn` medium decelerate)** を持ち、async decode による「ポン」表示を **40ms delay + `fill-mode: backwards`** で吸収 ── `motion-grammar.md` §Image Load Fade の処方を内蔵。

## API

slot recipe(Panda)+ Base UI Avatar 委譲。slot は `root` / `image` / `fallback`(3 slot)。

```tsx
<Avatar.Root size="md">
  <Avatar.Image src="/users/123.jpg" alt="山田太郎" />
  <Avatar.Fallback>YT</Avatar.Fallback>
</Avatar.Root>
```

Base UI Avatar が **Image を loaded のときだけマウント**する(load 失敗 / pending では fallback を出す)── consumer は両方並べて書き、表示制御は primitive に任せる。

## Variants

| Variant | 値 | 既定 | width / height | fontSize |
| --- | --- | --- | --- | --- |
| `size` | `sm` | | `8`(2rem) | `0.8125rem` |
| `size` | `md` | ✓ | `10`(2.5rem) | `0.9375rem` |
| `size` | `lg` | | `12`(3rem) | `1.125rem` |

寸法は sizes トークン(8 / 10 / 12 = 2 / 2.5 / 3rem)。fontSize は専用値で rem 直書き(scale の中間値が要るため token を当てない)。image / fallback は 100% で root に追従。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | `borderRadius: full` + `overflow: hidden` + `bg: accent.subtle` + `color: accent`(fallback の地 + 文字色) + `inline-flex center` + `verticalAlign: middle` |
| **image rest** | `width/height: 100%` + `objectFit: cover` + `display: block` |
| **image load 時** | `animationName: fadeIn` + duration `medium`(240ms) + `decelerate` + delay **40ms** + `fillMode: backwards` |
| **fallback** | `width/height: 100%` + center + `textTransform: uppercase` + `letterSpacing: wide`(イニシャルや icon が読みやすい) |

**fallback の地が accent.subtle + accent 文字**:イニシャル(YT / 山 等)が地味な surface 上で映えるよう、accent の **subtle tint + accent 文字** の組み合わせ(blessed pattern の親戚、「白 on 色」ではなく「accent on accent.subtle」だが acceptable な色 layering)── これを「**header の手書き円と同じ扱いを正式化**」した。

## a11y

- **primitive** ── `@base-ui-components/react/avatar`(Root / Image / Fallback)。
- **image alt** ── 必須(消費側で人物名や説明を渡す、装飾的 avatar なら alt=""を avoid して fallback に任せる)。
- **fallback として icon を入れる時** ── icon は `aria-hidden`(SR には alt が読まれる、または前後の context で人物が伝わる)。
- **list の中の avatar** ── 文脈で「ユーザー名 + avatar」と読まれるよう、消費側で order を組む。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `medium`(240ms) |
| Register | `decelerate`(置かれる尾) |
| delay | **40ms**(decode/paint を待つ) |
| fill-mode | **backwards**(delay 中 opacity 0 を保持) |

**image load fade の処方**(`motion-grammar.md` §Image Load Fade):

- img の bitmap は **async decode** の後に描画される ── マウント即時の短い fade は bitmap が出る頃には終わって「ポン」と出る(fade が知覚されない)。
- 処方:**`animation-delay: 40ms`** で decode/paint を待ち、**`fill-mode: backwards`** で delay 中 opacity 0 を保持 → bitmap が現れる頃に opacity 0 から始まる fade が走る。
- duration は `medium`(240ms) を最低線に(quick=120 では decode 遅延に飲まれて見えなかった)。
- easing は `decelerate`(置かれる尾)。

**装飾の pulse ではなく「loading → loaded」という本物の状態遷移** ── motion grammar「動きは状態の証言」に適う(原則 8 自走 animation 例外の grain と整合、これは自走でなく一回 fade で grammar OK)。

reduced-motion:`animationName: none`(opacity 即時)。

## Use when

- **ユーザー / 主体の image 表示**(profile、avatar grid、comment author)。
- 「人 / 物の identity を像で示したい」場面(name だけより visual 認知が速い)。
- header の **大きな user 表示**(account-settings header での経験で「Avatar に正規化することで image load fade も乗る」とわかった ── 手で円を描かず Avatar を使う)。

## Use instead

- **小さな identity マーカー(text のみ)** → **Badge**(Pro / Free 等)。
- **inline icon** → **Icon**(意味の凡例、人 / 物の像ではない)。
- **clickable な thumbnail card** → **Card interactive**(image + meta + click)。
- **avatar grid + interaction** → 消費側で Card + Avatar の組み合わせを組む。

詳細は `component-selection-map.md` §identity / §data。

## Avoid

- **handwritten circle で大きな user 表示**(Avatar の image load fade / fallback grammar が乗らない) → Avatar を使う(grain として確立済み)。
- **size を中間値で散らす**(grain として固定の 3 段)── 必要なら専用変種を recipe に追加、ad hoc に変えない。
- **fallback 地を accent 以外に**(grain 違反、`accent.subtle + accent` 文字の組み合わせが正典) → 既定維持。
- **image fade を quick に下げる**(decode 遅延に飲まれ「ポン」と出る) → medium 維持。
- **delay 0 で fade**(同上、decode 完了前に fade が終わる) → 40ms + backwards 維持。

## Decisions(本セッションの確定事項)

- **image load fade(medium / decelerate / 40ms delay / backwards fill-mode)** ── async decode 待ちの正典処方、`motion-grammar.md` §Image Load Fade。
- **fallback 地 = `accent.subtle`、文字色 = `accent`** ── header の手書き円を正式化した grain。「accent on accent.subtle」は acceptable な色 layering の境界例。
- **size 3 段(sm/md/lg = 2/2.5/3rem)、fontSize は専用値** ── grain として固定、中間値で散らさない。
- **image / fallback は 100% width/height で root に追従** ── size variant は root のみに乗る、内部要素は relative 寸法。
- **Base UI Avatar の load 判定に委譲** ── 「Image が loaded のときだけマウントされる」grain を活かす(マウント = fade trigger、これで一回だけ fade が流れる)。
- **reduced-motion で animationName: none**(自走でも一回 fade でもなく、状態遷移として持つので travel 抜き) ── opacity 即時。

## Related

- 上位:`principles.md` §5(accent precious、fallback 地に accent.subtle を許容する境界)、§7(motion = 状態の証言、load fade)、§9(描画パイプライン罠、image decode timing)、§14(Base UI 一本)
- 兄弟(identity):Badge / Icon
- 隣接:Card(avatar を含む list / grid)
- 住み分け:`component-selection-map.md` §identity / §data
- 詳細:`src/core-ui/avatar/avatar.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/avatar`
- motion 文法:`motion-grammar.md` §Image Load Fade(decode 待ちの処方)
- memory:[[otibo-ds-progress]](Avatar の決定全般)
