---
title: PreviewCard
status: active
component: src/core-ui/preview-card/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**hover で開く軽量プレビュー**(リンク先の media + meta)。Popover の hover 版で、Tooltip(単一行 hint)とも別の **「読み手の興味を促進する preview」** ── リンクにカーソルを乗せると先の絵と要約が浮く。portfolio や記事索引で **「行きたいか確かめさせる」** のに効く。Trigger は **treatment B**(下線なし → hover/focus で accent + 下線出現)で **触る前に「ここに何かある」を予見**させる(原則 11、`motion-grammar.md` §Hover Trigger Must Be Predictive)。

## API

slot recipe(Panda)+ Base UI PreviewCard 委譲。slot は `trigger` / `popup` / `media` / `body` / `title` / `description` / `footer`(7 slot)。

```tsx
<PreviewCard.Root>
  <PreviewCard.Trigger render={<a href="/works/2026-spring">2026 春の作品</a>} />
  <PreviewCard.Portal>
    <PreviewCard.Positioner>
      <PreviewCard.Popup>
        <PreviewCard.Media src="..." alt="..." />
        <PreviewCard.Body>
          <PreviewCard.Title>2026 春の作品</PreviewCard.Title>
          <PreviewCard.Description>釉薬と土の対話、6 点</PreviewCard.Description>
        </PreviewCard.Body>
        <PreviewCard.Footer>2026.03 · 個展</PreviewCard.Footer>
      </PreviewCard.Popup>
    </PreviewCard.Positioner>
  </PreviewCard.Portal>
</PreviewCard.Root>
```

Trigger wrapper は `cloneElement` で **className を auto-merge** ── consumer の `<a>` に hover response を自動付与し、消費側は treatment を書かなくて済む。

## Variants

なし(単一形)。size variant は持たない(`width: 20rem` 固定、media 比率 16/10 固定)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **trigger rest** | `color: fg` + 下線なし(treatment B、Link の文法と同じ) |
| **trigger hover** | `color: accent` + `text-decoration: underline` + `text-decoration-color: accent` |
| **trigger focus-visible** | `color: accent` + `outline: 2px solid accent` + `outlineOffset: 2px` + `borderRadius: xs` |
| **popup rest** | `width: 20rem` + `bg: surface.raised` + `boxShadow: lift` + `borderRadius: lg` + `overflow: hidden` |
| **popup `data-starting-style`** | `opacity: 0` |
| **popup `data-ending-style`** | `opacity: 0` |
| **media** | `aspectRatio: 16 / 10` + `objectFit: cover` + `bg: surface.muted`(画像 load 中の待機タイル) |
| **body** | `padding: 4` + flex column + `gap: 1` |
| **title** | `base` + `semibold` + `tight` + `fg.strong` |
| **description** | `sm` + `snug` + `fg.muted` |
| **footer** | `paddingInline: 4 / paddingBottom: 4 / marginTop: 2` + xs + `fg.subtle`(meta 行) |

**media の待機 bg**(`surface.muted`):画像 async decode の前に **背景タイルで box が見える**(image load fade 処方の一部、`motion-grammar.md` §Image Load Fade)── 「ポン」と画像が現れる前に preview の輪郭が読める。

## a11y

- **primitive** ── `@base-ui-components/react/preview-card`(Root / Trigger / Portal / Positioner / Popup)。
- **role** ── popup は `dialog`(non-modal)。preview は補足表示で focus を奪わない。
- **Trigger 構造** ── `<a>` を `render` 推奨(URL がある場合 ── ネイティブ link で a11y / kb / SEO すべて自然)。
- **keyboard** ── Tab で trigger に focus すると open(focus も hover の trigger になる)、Esc で close、Enter で render した `<a>` の遷移。
- **touch / モバイル** ── hover が無い環境では出にくい(Tooltip と同じ性質) ── 重要情報は preview に頼らず本文に。

## Motion

| 軸 | 値 |
| --- | --- |
| **popup opacity** Tier | `snap`(90ms) |
| **popup opacity** Register(enter) | `decelerate` |
| **popup opacity** Register(exit) | `standard` |
| 動作 | **opacity フェードのみ**(scale なし) |
| **trigger** Tier | `quick`(120ms)── `color / text-decoration` |
| **trigger** Register | `quiet`(standard) |

**「スッと出る」snap(90ms)** ── hover overlay として焦点的に出るが、 hint より重い(media + meta)ので「最も軽い snap で出して」**hover の続きとして読み始められる**速度感。tooltip(quick=120)より更に軽い。

opacity-only(scale なし):**焦点ブロック(title + description + media)として読まれる**ので scale-on-text snap が知覚される(popover / tooltip と同じ判断、`motion-grammar.md` §Overlay Appearance)。

### Hover-Open Asymmetric Delay(Trigger wrapper 既定)

- **delay = 350ms** ── pointer の意図的 lingering を確認、通過 hover で誤発火しない。
- **closeDelay = 100ms** ── pointer が離れたら即消える。
- Base UI 既定(600/300)は **otibo の手触りに合わない**:open が遅すぎる(タメが過剰)、close が遅すぎる(離れた後も居座る)── otibo wrapper で 350/100 に上書き。**`preview-card.tsx` の Trigger wrapper が canonical 実装**(`motion-grammar.md` §Hover-Open Asymmetric Delay)。

reduced-motion:opacity snap だけなので travel を抜く必要なし。

## Use when

- **portfolio / 記事索引でリンク先をチラ見させたい**(作品 / blog post / 製品ページ)。
- **興味喚起の affordance**(タイトルだけで判断させず、絵 + 要約で「行きたいか」を確かめさせる)。
- **trigger が prose / nav の中の link**(button ではない、treatment B が活きる場面)。

## Use instead

- **単一行 hint** → **Tooltip**(media なし、最も軽い)。
- **click で開く補足 / 軽い操作** → **Popover**(明示的 dismiss、scrim なし)。
- **top nav の dropdown** → **NavigationMenu**(共有 Viewport モデル)。
- **action のリスト** → **Menu**。

詳細は `component-selection-map.md` §overlay(Tooltip vs Popover vs PreviewCard)。

## Avoid

- **trigger に treatment を書かせる**(消費側で treatment B を再実装する手間)── recipe の Trigger wrapper が `cloneElement` で auto-merge する設計を活かす。
- **trigger を button にする**(URL 遷移リンクの preview なのに button にすると aria/href が壊れる) → `<a>` を `render`。
- **scale を popup に足す**(焦点ブロックで scale-on-text snap が知覚される) → opacity-only。
- **delay を Base UI 既定(600/300)のまま使う**(open 遅すぎ / close 遅すぎで手触りが otibo に合わない) → wrapper の 350/100 を維持。
- **重要情報を preview に隠す**(touch / SR で届かない) → 本文 / Field.Description。

## Decisions(本セッションの確定事項)

- **trigger に treatment B を auto-merge**(`cloneElement` で消費側の `<a>` に hover response を自動付与) ── 「hover で何か起こる要素は予見させる」原則 11 の正典実装。Link / Breadcrumb / NavigationMenu Trigger と同じ文法で **DS 全体の treatment B 一貫性**を保つ。
- **popup motion = opacity snap(90ms)** ── 「スッと出る」grain、hover の続きとして即読み始められる速度。tooltip(quick=120)より軽い理由は「興味喚起」の文脈が hint より早い反応を要求するため。
- **opacity-only(scale なし)** ── 焦点ブロックで scale-on-text snap を avoid(popover / tooltip と同じ側)。
- **非対称 delay = 350/100ms(Trigger wrapper 既定)** ── Base UI 既定(600/300)が otibo に合わない、Mac Dock 文法に倒した(`motion-grammar.md` §Hover-Open Asymmetric Delay)。
- **media の `aspectRatio: 16/10` + `bg: surface.muted` 待機タイル** ── image load 中に preview の輪郭が読める、`motion-grammar.md` §Image Load Fade の grain(decode 待機をボックスで埋める)。
- **width 20rem 固定** ── preview の「軽量」感を強制、超えるなら Popover / Card に倒す。

## Related

- 上位:`principles.md` §5(accent precious、trigger hover の accent)、§9(描画パイプライン罠、image decode timing)、§10(overlay 出現 motion 分岐 ── 単一焦点 opacity-only)、§11(hover trigger must be predictive、treatment B)、§12(非対称 delay)、§14(Base UI 一本)
- 兄弟(treatment B 同文法):Link / Breadcrumb crumb / NavigationMenu Trigger
- 別 overlay:Tooltip(hint chip)、Popover(click + paper)、Menu(action list scale)、NavigationMenu(共有 Viewport)
- 住み分け:`component-selection-map.md` §overlay(Tooltip vs Popover vs PreviewCard)
- 詳細:`src/core-ui/preview-card/preview-card.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/preview-card`
- motion 文法:`motion-grammar.md` §Overlay Appearance、§Hover-Open Asymmetric Delay、§Image Load Fade
- memory:[[otibo-ds-progress]](PreviewCard の決定全般)
