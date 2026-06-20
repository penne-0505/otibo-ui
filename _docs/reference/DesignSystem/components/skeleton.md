---
title: Skeleton
status: active
component: src/core-ui/skeleton/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**content 到着前の neutral な placeholder**。完全 neutral(色を持たない)、motion は **穏やかな opacity の呼吸(pulse breathe)** で「中身が来る」を静かに告げる loading 証言(原則 8 自走例外)。trendy な **shimmer sweep(斜めに光が走る gradient)は no-trendy なので採らない**。spinner との差:**reduced-motion では脈動を止めてよい**(静的な gray block でも placeholder と読めるため、spinner は travel が message そのものなので止めない)。形は consumer が `width / height / style` で与え、`circle` variant だけ用意(avatar 等の丸)。

## API

純 otibo(Base UI 不要、単一 div + CSS animation)。

```tsx
<Skeleton style={{ width: "100%", height: "1.5rem" }} />
<Skeleton circle style={{ width: "2.5rem", height: "2.5rem" }} />

{/* card のローディング状態 */}
<Card.Root>
  <Skeleton style={{ width: "60%", height: "1.5rem", marginBottom: "0.5rem" }} />
  <Skeleton style={{ width: "100%", height: "1rem" }} />
  <Skeleton style={{ width: "85%", height: "1rem" }} />
</Card.Root>
```

形(width / height)は **消費側で与える**(text 行 / paragraph / image 枠 / avatar 円、etc)── content の形を skeleton で模倣する設計。

## Variants

| Variant | 値 | 用途 |
| --- | --- | --- |
| `circle` | `true` | avatar / circular icon の placeholder(`borderRadius: full`) |

`circle` 以外は consumer が style で形を与える(rectangle 既定で sm radius)。

## States

| State | 視覚 |
| --- | --- |
| **rest(脈動中)** | `bg: border.subtle`(hairline と同系の warm.200 quiet gray、placeholder と読める明度) + `borderRadius: sm`(circle なら full) + `animationName: pulse` + duration `1.6s` + `ease-in-out` + `infinite` |

**warm.200 quiet gray の grain**:hairline / border.subtle と同系の明度差で「ここに何かが来る」を静かに告げる。 darker にすると目立ちすぎ、lighter にすると消える ── placeholder としての acceptable な明度帯。

## a11y

- **role** ── 装飾的 placeholder なら `aria-hidden="true"`(消費側で付与)。**意味のある loading** なら親要素に `aria-busy="true"` で SR に「読み込み中」を伝える。
- **screen reader** ── skeleton 自体は無音(`aria-hidden`)、loading 状態は親要素の `aria-busy` や別途 status text で伝える。
- **focus** ── 持たない(静的な block)。

## Motion

| 軸 | 値 |
| --- | --- |
| Animation | `pulse`(opacity の穏やかな呼吸) |
| Duration | **`1.6s`**(spinner の 0.7s より遅い、穏やかな呼吸) |
| Timing function | **`ease-in-out`**(呼吸の自然なリズム) |
| Iteration | `infinite`(自走) |

**reduced-motion で `animationName: none`**(脈動を止める) ── spinner と違い、**静的な gray block でも placeholder と読める**ため止めて良い。spinner は travel が message そのもの(止めると意味喪失)、skeleton は形 + 色だけで placeholder grain が成立する。

**no-trendy 原則の grain**:shimmer sweep(斜めに光が走る gradient pattern)は「最近流行りの placeholder」だが、装飾の生命感が grain 違い ── opacity 呼吸 = 「中身が来る」の最小限の証言。

## Use when

- **content 到着前の placeholder**(API 応答待ち、image load 待ち、長 list の paint 前)。
- **content の形を予告したい**場面(layout shift を防ぐ、card の見出し / 本文の長さを再現する)。
- 数百 ms〜数秒の不定 wait(spinner より長い、または content の形が伝えられる場面)。

## Use instead

- **不定の短い wait**(button 内の処理中) → **Spinner**(回転、color 文脈追従)。
- **進捗が分かる** → **Progress**(determinate bar)。
- **作業結果の通知** → **Toast**。
- **エラー状態 / empty state** → 適切な text / icon + Card(skeleton は「来る予定」、empty は「来ない / 無い」)。

詳細は `component-selection-map.md` §feedback(Spinner vs Skeleton vs Progress)。

## Avoid

- **shimmer sweep を実装する**(trendy / 装飾、grain 違反) → opacity 呼吸維持。
- **bg を accent / 色付きに**(neutral grain を破る、color layering 違反) → border.subtle / warm 系 gray 維持。
- **content が無いのに置きっぱなし**(永久 skeleton はユーザーが「壊れた?」と思う) → タイムアウト時は error state / empty state に切り替える(消費側責務)。
- **形を consumer で与えず recipe で固定**(text/paragraph/image の形が再現できない) → width/height は消費側、recipe は behavior と base style だけ。
- **reduced-motion で止めない**(脈動を「気が散る」と感じるユーザーの grain) → animationName: none で止めて OK(spinner との差)。

## Decisions(本セッションの確定事項)

- **opacity 呼吸(pulse、1.6s ease-in-out)、shimmer sweep は採らない** ── no-trendy 原則(原則 8 自走 animation の grain と整合)。
- **bg = `border.subtle`(quiet warm gray)** ── hairline と同系の明度、placeholder grain で acceptable。
- **`circle` 以外の形は consumer に委ねる** ── text / paragraph / image / 何でも、recipe は behavior + base style のみ。
- **reduced-motion で animationName: none**(脈動を止めて良い) ── spinner との明示的な差(spinner は止めない、travel が message)。
- **長 wait 時の対応は consumer 責務**(タイムアウト → error/empty state) ── skeleton は「content が来る予定」を告げるだけ、来ない / 失敗の signaling は別 grain。

## Related

- 上位:`principles.md` §8(自走 animation は loading のみ)、§2(色は土台、skeleton は完全 neutral)
- 兄弟(loading 例外):Spinner(回転、travel = message)
- 別 feedback:Progress(determinate)、Toast(通知)
- 住み分け:`component-selection-map.md` §feedback
- 詳細:`src/core-ui/skeleton/skeleton.recipe.ts`(canonical コメント)
- motion 文法:`motion-grammar.md` §Loading(loading 例外、no-trendy grain)
- memory:[[otibo-ds-progress]](Skeleton の決定全般)
