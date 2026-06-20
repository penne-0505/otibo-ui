---
title: Badge
status: active
component: src/core-ui/badge/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**静的な小さな identity / metadata チップ**(Pro バッジ、新規マーカー、状態ラベル)。**押せない**(Chip が押せる版)。**塗りつぶしを avoid**(CTA ではないのでアテンション誘導が過剰になる)し、**透明背景 + 1px の細線 + tone テキスト**で軽く示す ── 「細めで軽やかな線」「accent は precious / 彩度で叫ばない」と整合(原則 5)。tone は accent / neutral / danger のみ(semantic family は作らない、原則 3 emphasis ladder の grain)。

## API

純 otibo(Base UI 不要、styled `<span>` / `<div>`)。

```tsx
<Badge>Pro</Badge>
<Badge tone="neutral">archived</Badge>
<Badge tone="danger">期限切れ</Badge>
```

slot は無し(単一 element に直接 text content)。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `tone` | `accent` / `neutral` / `danger` | `accent` | identity の強さ |

- **accent** ── `color: accent` + `boxShadow: inset 0 0 0 1px color-mix(in oklch, accent 40%, transparent)`(細線も accent の薄い派生)。
- **neutral** ── `color: fg.secondary` + `boxShadow: inset 0 0 0 1px border`(地味な metadata 表示)。
- **danger** ── `color: danger` + `boxShadow: inset 0 0 0 1px color-mix(in oklch, danger 40%, transparent)`(警告状態の identity、塗らずに線で示す ── form callout の塗り tint とは役割が違う)。

線色を `color-mix(40%)` で派生する理由:**token 変更に追従**する(accent を変えても線が自動で追従)── 数値固定の RGB ではない。

## States

| State | 視覚 |
| --- | --- |
| **rest** | tone ごとの細線 + text、`bg: transparent`、`fontSize: xs` + `fontWeight: medium`、padding `0.5625rem / 0.1875rem`、`borderRadius: 0.375rem`(xs と sm の中間) |

押せない静的表示なので **hover / focus / active / disabled は持たない**。

**padding が token scale 外の literal**(`0.5625rem` 等):文字と細線が接して見えないよう余裕を持たせる + token の scale に無い中間値が必要なため。
**borderRadius も literal**(`0.375rem`):ピルにせず「角丸の小さな札」に留める(token `xs` 0.25 と `sm` 0.5 の中間)。

## a11y

- **role** ── native `<span>` / `<div>`(role なし)── 装飾的 identity の grain。
- **screen reader** ── text content がそのまま読まれる(「Pro」「期限切れ」)。文脈で意味が伝わるよう、消費側で配置を工夫する(「ユーザー名 Pro」「料金プラン 期限切れ」のように、前後の context が SR で繋がる位置に置く)。
- **`aria-label`** ── icon-only Badge(現状なし)や、SR への補足が要る場面で消費側が付与。

## Motion

なし(静的)。Badge は state を持たず動かない。

## Use when

- **静的な metadata 表示**(Pro / Free / Beta / Archived / Featured)。
- **状態ラベル**(active / pending / expired)── ただし状態が **クリックで変わる** なら Chip。
- **小さな identity マーカー**(ユーザー role、製品 tier 等)。

## Use instead

- **押せる選択 ピル(フィルタ / タグ)** → **Chip**(角丸 pill、`data-pressed`)。
- **toolbar の押し込み** → **Toggle**(四角、押し込み状態)。
- **本文中の強調** → 本文 typography(bold / italic)、Badge は装飾でなく identity。
- **alert 的な警告 banner** → 現状未着手(Alert は不在、Card か Dialog で代替)。

詳細は `component-selection-map.md` §data(Badge vs Chip vs Toggle の三役表)。

## Avoid

- **塗りつぶし Badge**(アテンション誘導が CTA に近づく) → 透明 + 細線。
- **押せる Badge にする**(Chip との grain 衝突) → Chip。
- **tone を増やす**(success の緑、warning の琥珀など) → 原則 3 emphasis ladder を破る、新 hue 作らない方針(success は neutral + check icon、warning は accent / danger に振る)。
- **size を増やす**(grain として固定、識別マーカーは小さい一形) → fontSize xs 一定。
- **danger Badge を form 表示の error 代替に**(form の error は Field.Error、Badge は identity) → Field.Error。

## Decisions(本セッションの確定事項)

- **透明背景 + 1px 細線 + tone テキスト**(塗りつぶし avoid) ── 「accent は precious / 彩度で叫ばない」と整合。Badge は CTA ではなく identity、アテンション誘導は最小。
- **tone = accent / neutral / danger のみ**(success / warning hue を作らない、原則 3 emphasis ladder) ── 新 hue を増やさない方針。
- **線色 = `color-mix(in oklch, accent/danger 40%, transparent)`** ── token 追従、accent を変えれば線も追従。
- **literal padding / radius**(token scale 外) ── 細線と文字の最小視認余白 + 「角丸の小さな札」(ピルにしない、Chip と grain 分離)。
- **押せない静的表示**(Chip との明確な分離) ── push / pressed / hover の interaction を持たない。

## Related

- 上位:`principles.md` §1(構造区切りは余白 / 細線、ここは線で identity)、§3(emphasis ladder、accent / neutral / danger のみ)、§5(accent precious、塗らずに線で表現)
- 兄弟(混同三役):Chip(押せる版、pill)、Toggle(押し込み、四角)
- 住み分け:`component-selection-map.md` §data、§identity
- 詳細:`src/core-ui/badge/badge.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](Badge の決定全般)
