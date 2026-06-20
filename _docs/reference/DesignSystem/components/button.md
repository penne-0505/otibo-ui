---
title: Button
status: active
component: src/core-ui/button/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

主行動 / 補助行動の「押せる箱」。intent で強弱(`primary` / `secondary` / `ghost`)、size で大小(`sm` / `md`)。**動作の実行**(click で何かが起こる)を担う ── 場所の移動は `Link`。

## API

純 otibo(Base UI 非依存、styled `<button>`)。

```tsx
<Button intent="primary" size="md" onClick={...}>保存</Button>
<Button intent="ghost" disabled>停止する</Button>
```

`React.ButtonHTMLAttributes<HTMLButtonElement>` をそのまま受ける。slot は無し(text content のみ、icon を入れたい場合は children に `<Icon />` を `gap: 2` で並べる)。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `intent` | `primary` / `secondary` / `ghost` | `secondary` | 強さの梯子 |
| `size` | `sm` / `md` | `md` | 行 / 本文との関係で選ぶ |

### intent の選び方

- **primary** ── accent 塗り + 白文字。**その surface に一つ**だけ置く(accent precious 原則の派生、`principles.md` §5)。「保存」「送信」「次へ」など、その画面の唯一の主行動。
- **secondary** ── `surface.muted` + `fg.strong`。複数置いてよい補助行動。「キャンセル」「やり直す」「詳細を見る」など。
- **ghost** ── 透明 + `fg.secondary`、hover で `surface.muted` + `fg.strong`。toolbar / nav / 行内の最も静かな行動。

### size の選び方

- **md** ── body 18px に対して **font 16px**。Button が本文より一段引いた声色で「強調しすぎない」UI を作る。既定。
- **sm** ── **font 13px**(0.8125rem hardcode)。toolbar / dense panel 内 / 補助行動の段。md より更に一段下げてサイズ階層を明確化。

## States

| State | 視覚 |
| --- | --- |
| **rest** | intent ごとの base |
| **hover** | intent ごとに一段濃い bg(primary → `accent.hover`、secondary → `bg.subtle`、ghost → `surface.muted`) |
| **active(press)** | `translateY(0.5px)` の素っ気ない凹み。**色は変えない**(quiet register の原則、`motion-grammar.md` §Two-Axis) |
| **focus(keyboard)** | `box-shadow: focus`(accent 30% の outer ring) |
| **disabled / aria-disabled** | `opacity: disabled`(=0.55)+ `cursor: not-allowed`、hover/active feedback も止まる(Disabled Suspends Pointer Feedback、`token-semantic-usage-map.md`) |

**aria-disabled の扱い**:visually disabled だが click event は受ける(`Disabled Reveals Reason On Attempt` パターン)。Form 側で「試したが通らなかった」を教えるのに使う。`disabled` 属性は click を完全に止める / `aria-disabled` は試行を検出する、で使い分け。

## a11y

- **role** ── `<button>` ネイティブ。type は親 form の文脈で `submit` / `button` を明示。
- **keyboard** ── Enter / Space で activate(ネイティブ)。
- **focus ring** ── `_focusVisible`(キーボード操作時のみ)。マウスでは出ない、原則どおり。
- **disabled** ── 上記 "States" 参照。重要な判断:アクションが理由付きで使えないなら **`aria-disabled` 推奨**(理由を tooltip / inline で示す)、不可能な状態なら `disabled`。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) ── hover / focus / press の状態遷移 |
| Register | **quiet**(standard easing、段階化なし) |
| Press | `translateY(0.5px)`(色変更なし) |

`motion-grammar.md` の **quiet register は無口に保つ** の正典例:button は「触ると反応する」だけで足り、「描いて見せる」必要はない。

## Use when

- **動作を実行する**(保存、送信、削除、開く、閉じる)。
- 同じ surface 内で **強さの段** を表現したい(primary 1 個 + secondary 数個 + ghost 複数)。
- form の最終 action(submit)/ dialog の確認ボタン / toolbar のアクション。

## Use instead

- **場所の移動**(URL 遷移、内部リンク、外部リンク) → **Link**。
- **押し込み状態を保持** したい(toolbar の on/off、お気に入り) → **Toggle**。
- **フィルタの選択** → **Chip**。
- **設定の on/off** → **Switch**。

詳細は `component-selection-map.md` §action / §選択。

## Avoid

- 同一 surface に **primary を複数置く**(accent precious の破り)。二つ目以降は secondary / ghost に降ろす。
- ナビゲーション(ページ遷移)に Button を使う(URL がアドレスバーに出ない / 履歴が壊れる) → Link、または `<a>` を `render` した button。
- press feedback として色変化(Button は quiet register、translate だけ)。
- minHeight floor を勝手に足す(2026-06-20 確定の自然高さ方針、`principles.md` §13)。

## Decisions(本セッションの確定事項)

- **primary = 単一 accent**(2026-06-16) ── 旧 primary(墨=fg.strong)を accent に置換。墨 variant が要る場面が出たら別途。
- **minHeight floor 撤去**(2026-06-20) ── `sizes` スケール定義時、root 18px で `sizes-10`=45px となり control が間延びしたため、floor を持たず padding + 文字の自然高さに任せる方針へ。
- **ghost color = fg.secondary**(本文 18px と button 16px の size 差で operable と本文の区別が出るため)。
- **radius = sm**(12 → 8px)で「突き当たり感」を抑える。superellipse library を入れたら radius scale を再評価する deferred。

## Related

- 上位:`principles.md` §5(accent precious)、§13(control floor 自然高さ)、§3(emphasis ladder)
- 住み分け:`component-selection-map.md` §action、§form 値入力
- 詳細:`src/core-ui/button/button.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](Button 関連の決定全般)、[[otibo-accent-direction]](accent 採用経緯)
