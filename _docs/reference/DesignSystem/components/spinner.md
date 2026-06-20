---
title: Spinner
status: active
component: src/core-ui/spinner/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**loading の自走インジケータ**(回転する弧)。otibo は「自走 animation / decorative pulse を持たない」原則(原則 8)を持つが、**loading の回転は装飾でなく「作業が継続している」という正直な証言**なので、その例外として認める(`motion-grammar.md` §Loading)。色は **`currentColor` 継承**で文脈に追従(button 内なら白、単体なら置いた色)── color layering 非依存。reduced-motion でも止めず、**速度だけ落として控えめに**(travel が message なので travel を抜けない)。

## API

純 otibo(Base UI 不要、単一 div + CSS animation)。

```tsx
<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />

{/* Button 内 ── currentColor で button の text color に追従 */}
<Button intent="primary">
  <Spinner size="sm" />
  保存中...
</Button>
```

## Variants

| Variant | 値 | 既定 | width / height | borderWidth |
| --- | --- | --- | --- | --- |
| `size` | `sm` | | `0.875rem` | `1.5px` |
| `size` | `md` | ✓ | `1.125rem` | `2px` |
| `size` | `lg` | | `1.5rem` | `2px` |

3 段固定(段を増やさない grain)。

## States

| State | 視覚 |
| --- | --- |
| **rest(回転中)** | `borderRadius: full` + `borderStyle: solid` + 全周 `color-mix(in oklch, currentColor 18%, transparent)` + `borderTopColor: currentColor`(頭だけ濃い)、`animationName: spin` + duration `0.7s` + `linear` + `infinite` |

**linear 等速回転**:非線形 easing(`ease-in-out` 等)は「揺れて見える」── 等速で回ることで「機械的に回っている = 作業中」を直接示す。

**全周薄 + 頭濃い**:「弧の頭が回っている」を視覚的に表現。全周ベタ色だと回転が知覚できない、全周を消すと「弧」になるが otibo grain では細リング(track)の方が静か。

## a11y

- **role** ── 装飾的 spinner なら `aria-hidden="true"`(消費側で付与)。**意味のある loading** なら親要素に `role="status"` + `aria-label="読み込み中"` 等。
- **screen reader** ── spinner 自体は無音にして、loading 状態を伝える `aria-live="polite"` + text(「保存中...」等)を別途出す方が grain(SR で「読み込み中」を繰り返し読み上げない)。
- **focus** ── 持たない(静的な inline-block)。

## Motion

| 軸 | 値 |
| --- | --- |
| Animation | `spin`(0deg → 360deg) |
| Duration | **`0.7s`** |
| Timing function | **`linear`**(等速) |
| Iteration | `infinite`(自走) |

**reduced-motion の grain**:`animationDuration: 1.3s` ── **回転は essential(止めると loading の意味が消える)** ので止めず、**速度を落として控えめに**。これは otibo の「reduced-motion で travel を抜く」一般則の**明示された例外**(原則 8 + `motion-grammar.md` §Loading)。

**この例外が許される線引き**:「不定の待ち時間」を示すものに限る。進捗が分かるなら determinate(Progress bar)を使い自走させない(原則 8 確定)。

## Use when

- **不定の待ち時間**(API call、save / load の待ち、search 中)。
- ボタン内の処理中表示(`<Button>` 内に小さい spinner)。
- content の到着待ち(短時間、長くなりそうなら Skeleton に振る方が grain)。

## Use instead

- **content 到着前の placeholder** → **Skeleton**(opacity 呼吸、形が読める)。
- **進捗が分かる**(ダウンロード、同期、保存) → **Progress**(determinate bar、自走させない)。
- **作業結果の通知** → **Toast**(自発的な通知)。

詳細は `component-selection-map.md` §feedback(Spinner vs Skeleton vs Progress)。

## Avoid

- **進捗が分かるものに Spinner**(0% で止まって見える、ユーザーが「フリーズした?」と疑う) → Progress。
- **装飾的に Spinner を置く**(動きで賑やかしを足す、原則 8 違反) → Spinner は loading 状態の証言、装飾ではない。
- **非線形 easing(ease-in-out / expressive)**(揺れて見える) → linear 維持。
- **色を内蔵**(currentColor 継承の grain を破る、文脈の color から外れる) → currentColor 維持。
- **reduced-motion で止める**(travel が message そのものなので、止めると loading の意味が消える) → 速度落として継続。

## Decisions(本セッションの確定事項)

- **loading の自走は原則 8 の明示された例外** ── 「自走 animation を持たない」原則の唯一の例外(loading の動きは装飾でなく状態の証言)。
- **linear 等速回転** ── 機械的に回ることで「作業中」を直接示す。非線形 easing は揺れて見える。
- **`currentColor` 継承**(色を内蔵しない、color layering 非依存) ── button / card / 任意の文脈に素直に乗る。
- **reduced-motion で速度落として継続**(止めない) ── travel が message そのものの例外、「一般則の明示例外」として motion-grammar に記録。
- **全周薄 + 頭濃い(`color-mix 18%` + `currentColor`)** ── 弧の頭が回っているを視覚化、全周ベタや全周消しの両極端を避ける。

## Related

- 上位:`principles.md` §8(自走 animation は loading のみ)、§5(accent precious、currentColor で文脈追従)
- 兄弟(loading 例外):Skeleton(opacity 呼吸)
- 別 feedback:Progress(determinate)、Toast(通知)
- 住み分け:`component-selection-map.md` §feedback
- 詳細:`src/core-ui/spinner/spinner.recipe.ts`(canonical コメント)
- motion 文法:`motion-grammar.md` §Loading(loading 例外の grain)
- memory:[[otibo-ds-progress]](Spinner の決定全般)
