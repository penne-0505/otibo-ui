---
title: Card
status: active
component: src/core-ui/card/
references:
  - "../principles.md"
  - "../token-semantic-usage-map.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**関連情報を一枚の paper にまとめる container**。「浮く」「区切る」「内側を組む」の三役を持ち、surface variant で **flat / paper / muted** を切り替える ── otibo 既定は **flat**(shadow なし)で、paper は「実際に浮く」場面でだけ opt-in する慎重な使い方。slot recipe で `root / header / title / description / body / footer` を持ち、card 内の typography rhythm と gap を一括管理する。

## API

slot recipe(Panda)。slot は `root` / `header` / `title` / `description` / `body` / `footer`。

```tsx
<Card.Root surface="paper" padding="md">
  <Card.Header>
    <Card.Title>2026 春の作品</Card.Title>
    <Card.Description>釉薬と土の対話、6 点</Card.Description>
  </Card.Header>
  <Card.Body>
    <p>本文...</p>
  </Card.Body>
  <Card.Footer>
    <Button>詳細を見る</Button>
  </Card.Footer>
</Card.Root>
```

slot は**全部 optional**(必要なものだけ並べる)。Header だけ / Body だけ の Card もアリ。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `surface` | `flat` / `paper` / `muted` | `flat` | flat=Internal region / paper=浮く Object / muted=凹んだ Internal |
| `padding` | `sm` / `md` / `lg` | `md` | content の breathing room |
| `interactive` | `true` | (none) | hover lift + focus ring(Control role) |

### surface の選び方

- **flat**(default) ── `bg: surface` + `boxShadow: none`。 **「Card 的単位だが浮かない」**。iA Writer / Anthropic 編集 UI の観察で、Card 単位は type と spacing で成立し、shadow は「実際に浮く」ものに限る方が grain が保たれる。
- **paper** ── `bg: surface` + `boxShadow: paper.sm`。**「ここは canvas から浮いた object である」**と明示する場面で opt-in(独立した作品 thumbnail、modal 風 panel、settings の section 浮かせ 等)。
- **muted** ── `bg: surface.muted`。**「凹んだ Internal 領域」**(quote、aside、footnote の地、settings の inactive section 等)。

### padding の選び方(値表)

- **sm** ── `padding: 5`(1.25rem) + `gap: 5`(1.25rem) ── 小さい thumbnail card / 高密度 list 内 card。
- **md**(default) ── `padding: 6`(1.5rem) + **`gap: 10`(2.5rem)** ── 通常 Card。
- **lg** ── `padding: 8`(2rem) + `gap: 10`(2.5rem) ── 主役 Card(landing 等)。

### interactive の選び方

`interactive={true}` で hover lift(`paper.md` + `translateY(-1px)`) + focus ring。**Card 全体を clickable にする時だけ**有効化(おすすめ作品 grid 等)。装飾の浮きには使わない(motion grammar §Self-running)。

## States(interactive のみ)

| State | 視覚 |
| --- | --- |
| **rest** | surface の base(flat/paper/muted) |
| **hover** | `boxShadow: paper.md` + `transform: translateY(-1px)`(物理的な浮き) |
| **active(press)** | `transform: translateY(0)`(押し込まれて元位置に戻る) |
| **focus(keyboard)** | `boxShadow: focus`(accent 30% ring) |

`interactive={false}`(既定)は state を持たない(static container)。

## a11y

- **role** ── 既定はネイティブ `<div>`(role なし)。 **interactive=true** にしても **role は自動で付かない**(消費側で `role="button"` / `<a>` render / `<button>` render 等を判断)。
- **clickable Card** ── `role="button"` + `tabindex="0"` + `onKeyDown`(Enter/Space)を手で付けるか、`render={<a href=...>}` で natural anchor にする(後者推奨、URL がある場合)。
- **focus ring** ── `interactive=true` の `_focusVisible` で `boxShadow: focus`。マウス click では出ない。
- **structure** ── `Card.Title` は heading element ではない(`<p>`)。Card が page の section heading を兼ねる場面では title slot を使わず `<h2>` を直接書く。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier | **`medium`**(240ms) ── card は大きな object が物理的に浮く(hover lift)ので、button/input の `quick` より一段重い尺で **substantial** に。 |
| Register | **quiet**(standard easing、段階化なし) |
| 対象 property | `box-shadow, transform, background-color` |

interactive=false の Card も transition は持つ(state が無いので発火しないだけ)── 後から interactive 化された時にも grain が変わらないように共通定義。

`motion-grammar.md` §Two-Axis の例外的位置:**quiet register で medium tier** の組み合わせは Card 固有(form control は quiet/quick、direct manipulation は expressive/medium)。

## Use when

- **関連情報を paper 単位でまとめる**(作品 / 製品 / 通知 / 設定 section)。
- 内側で複数 Field を組む **form の section**(AccountForm 等)── このときは surface=flat / muted で「浮かさず区切る」。
- **clickable な navigation 単位**(おすすめ作品 grid)── interactive=true + `<a>` render。

## Use instead

- **inline の小さなマーカー**(Pro バッジ、新規通知) → **Badge**。
- **画面を奪う重み**(削除確認、長 form の modal) → **Dialog**。
- **開閉できる詳細セクション** → **Accordion**。
- **section の単純な区切り**(border / margin で十分なもの) → Card を被せない。Card は paper の物理感を出す要素、強調手段ではない。

詳細は `component-selection-map.md` §container / §data。

## Avoid

- **補足情報を Card で囲って強調する**(Card は paper の物理感、強調手段ではない)── 強調なら Dialog / Toast を選ぶ。
- **Card 内 Card の入れ子**(paper の上に paper、shadow が重なって grain が崩れる)── 内側は flat / muted で受ける、または Card を解いて gap で組む。
- **interactive=true なのに `role` も `<a>` 化もしない**(kb で focus できるが Enter で何もできない)。
- **padding と gap を独自値で散らす**(2026-06-12 確定の md=padding 6 / gap 10 が AccountForm で検証済の値、これを破ると Card 内 Field 列の視覚階層が崩れる)。
- **shadow 強度を手で上げる**(`paper.lg` 等の独自値)── shadow は単一規範(原則 6)、強度で elevation を語らない。

## Decisions(本セッションの確定事項)

- **default surface = flat**(2026-06-12 以降) ── Reference 観察(iA Writer / Anthropic)で **Card 的単位は type と spacing だけで成立**しており、shadow を持つのは「実際に浮く」ものに限る。flat を既定にすることで「Card = 必ず影」のクセを断つ。
- **padding と gap を非同期に**(md: padding 6 / gap 10)── 当初 padding=gap で揃えていたが、AccountForm(Card 内 Field 複数)で **header → body の境目が「もう一本の Field 間 gap」と読まれて視覚階層が崩れた**。Field 間 gap(1.5rem)の 1.67× = 2.5rem(=gap 10)に逃がして、title 組と body 組を別カテゴリとして明示。
- **header.gap = 1.5**(title と description を一塊として強く読ませる)。
- **footer.gap = 2 + paddingTop 2** ── text-only Button が並ぶ場面で余白が大きく見えすぎないように、gap 3 → 2 に絞った。
- **interactive の hover lift = paper.md + translateY(-1px)、active = translateY(0)** ── 押し込まれて元位置に戻る物理を一段だけ表現(段階を増やさない)。
- **motion tier = medium**(button/input の quick より重い) ── card は大きな object の浮きで、quick だと「軽すぎる」、heavy だと「重すぎる」。medium が substantial な手触り。

## Related

- 上位:`principles.md` §6(影の規範、単一非階層 lift)、§7(motion = 状態の証言)、§1(構造区切りは余白 ── flat default の根拠)
- 内部 content:Field / Button / Link / 任意の child
- 隣接:Accordion(開閉できる Card 的単位)、Dialog(画面を奪う Card 的単位)
- 住み分け:`component-selection-map.md` §container、§data
- 詳細:`src/core-ui/card/card.recipe.ts`(canonical コメント)
- token:`token-semantic-usage-map.md` §Paper Shadow(paper.sm / paper.md)
- memory:[[otibo-ds-progress]](Card の決定全般)
