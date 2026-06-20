---
title: Link
status: active
component: src/core-ui/link/
references:
  - "../principles.md"
  - "../component-selection-map.md"
  - "../motion-grammar.md"
---

## Overview

文中・footer・nav の **遷移リンク**(URL を踏む `<a>`)。平常は本文に馴染んで静かに座り、hover/focus でだけ accent に立ち上がる。otibo の **「平常は静か、hover で accent が立ち上がる」(treatment B)の正典実装**。**動作の実行**(click で何かが起こる)は `Button`、ここは**場所の移動**専用。

## API

純 otibo(Base UI 非依存、styled `<a>`)。`React.AnchorHTMLAttributes<HTMLAnchorElement>` をそのまま受ける。

```tsx
<Link href="/works">作品集</Link>
<Link href="https://otibo.dev" target="_blank" rel="noopener">外部リンク</Link>
```

slot は無し。font は **inherit**(inline で周囲文の size/family を引き継ぐ)── prose の段落に挿しても文字組が崩れない設計。

## Variants

なし。intent や size を持たない**意図的な単形**:
- prose 内で **本文に馴染む** ことを最優先するため、size を分けない(周囲の文の size に追従)。
- 「強い link / 弱い link」を作りたい衝動が起きたら、それは大抵 Button(intent=primary/ghost)で表現すべき場面 ── §Use instead 参照。

## States

| State | 視覚 |
| --- | --- |
| **rest** | `color: fg` + `text-decoration: underline` で**常時下線**(色に依存しない affordance、a11y の根幹) |
| **下線色(rest)** | `color-mix(in oklch, fg 35%, transparent)` ── 下線は引きつつ静かに |
| **hover** | `color: accent` + `text-decoration-color: accent`(文字と下線が同時に accent に立ち上がる) |
| **focus(keyboard)** | `color: accent` + `outline: 2px solid accent` + `outline-offset: 2px` |
| **visited** | 既定の `<a>` 挙動(otibo は visited 色を別途定義しない、neutral grain を保つため) |

下線を hover で初めて出すパターンは取らない:**下線=リンクであることの affordance**であり、色変化は二次的な signal。色覚特性に依らない discovery を保証する。

## a11y

- **role** ── `<a>` ネイティブ。`href` 必須(`<a>` without href は link role を失う)。
- **keyboard** ── Enter で activate(ネイティブ)。
- **focus ring** ── `_focusVisible`(キーボード操作時のみ)。**`outline` 採用**(`box-shadow` ではない理由は §Decisions)。
- **external link** ── `target="_blank"` の場合は `rel="noopener"` を必ず付ける(window.opener exploit 対策、ネイティブ責務)。
- **screen reader 文脈** ── 「こちら」「詳細」のような文脈無し link 名を避ける。link 名だけで何処へ行くかが分かる文言にする(これは消費側の責務、recipe には強制機構を持たない)。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | `quick`(120ms) ── color / text-decoration-color の hover/focus 遷移 |
| Register | **quiet**(standard easing、段階化なし) |
| 対象 property | `color, text-decoration-color`(他の property は transition しない) |

Link は form/inline の **quiet 領域**:`motion-grammar.md` §Two-Axis Model の通り、無口に保つ。段階的 motion も transform も持たない。

## Use when

- prose / footer / 説明文中の**ページ遷移**(内部 URL / 外部 URL / アンカー)。
- Breadcrumb の各 crumb(最後の current 以外、ネイティブ `<a>` で組まれる文脈)。
- 「ここからもっと深い情報へ行ける」を**控えめに**示したい場面(下線 affordance + 文脈中の静かな存在感)。

## Use instead

- **動作の実行**(保存 / 送信 / open dialog / close) → **Button**。URL 遷移を伴わない click は Button。
- **画面の主導線として強く出したい遷移**(Hero の CTA "始める") → **Button intent=primary**(ghost で `render` した `<a>` でも良い、a11y は href の有無で判定される)。
- **同一画面の content 切替**(URL を変えない、tab 的切替) → **Tabs**。
- **top nav の集約 / dropdown** → **NavigationMenu**。

詳細は `component-selection-map.md` §action / §navigation。

## Avoid

- `href` を持たない `<a>`(link role を失い、tab で focus できない / SR が読まない)→ Button を使う。
- **下線を消す**(hover で初めて下線を出す style)── 色覚特性のあるユーザーで link が discoverable でなくなる。下線常時は譲らない。
- **prose 内で文字色だけ accent**(下線なし)── 同上、affordance が弱い。
- click で動作実行(scroll、modal open、削除) → Button。
- 装飾的に文字色を accent にする(リンクでないテキストに accent) → accent precious の破り(原則 5)。

## Decisions(本セッションの確定事項)

- **下線は常時 + hover/focus で accent**(treatment B、原則 11「hover trigger must be predictive」と整合) ── 「下線が affordance、色は interaction signal」の二層構造。Link / Breadcrumb crumb / NavigationMenu Trigger / PreviewCard Trigger すべて同じ文法に揃えた。
- **下線色 = `color-mix(in oklch, fg 35%, transparent)`** ── 「引くけど静か」を実現。pure black 下線は重い、pure transparent は消える。fg を 35% mix で控えめに。
- **font は inherit**(色のみ明示) ── inline で周囲文に馴染ませるため。Link が prose に挿さっても文字組が崩れない。
- **focus は `outline` 採用**(`box-shadow` ではない) ── Link は inline 要素で、line-break を跨ぐ可能性がある。`box-shadow` は line-break で shadow が断片化するが、`outline` は各 fragment に正しく回り込む。Button(block 要素 / box-shadow 採用)とは別物。
- **borderRadius: xs** ── focus outline の角を僅かに丸めるためだけの値(text 自体は radius を持たない)。
- **visited 色は定義しない** ── otibo grain(neutral 平常 + accent interaction)を保つため。ブラウザ既定にも干渉しない(`color: fg` は visited にも適用)。

## Related

- 上位:`principles.md` §5(accent precious)、§11(hover trigger must be predictive)、§3(emphasis ladder)
- 住み分け:`component-selection-map.md` §navigation、§action(Button vs Link の境界)
- 同文法の仲間:Breadcrumb crumb、NavigationMenu Trigger、PreviewCard Trigger(全部 treatment B)
- 詳細:`src/core-ui/link/link.recipe.ts`(canonical コメント)
- memory:[[otibo-accent-direction]](accent 採用経緯)、[[otibo-ds-progress]](Link の決定全般)
