---
title: Tooltip
status: active
component: src/core-ui/tooltip/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**transient な補足(一行の hint)**。hover / focus で出て、明示的に開かない最も静かな overlay。**暖色の濃い chip**(`fg.strong` 地 + `surface` 文字)で一瞬で読める contrast を確保しつつ、純黒ではなく warm dark に留めて world 観に揃える。矢印なし(配置 noise を避ける)、輪郭は **lift shadow** のみ。Popover との grain 違い:Tooltip は **chip**(濃色)、Popover は **paper**(明色)。

## API

slot recipe(Panda)+ Base UI Tooltip 委譲。slot は `popup`(1 slot のみ)。

```tsx
<Tooltip.Root>
  <Tooltip.Trigger render={<Button intent="ghost"><Icon name="info" /></Button>} />
  <Tooltip.Portal>
    <Tooltip.Positioner>
      <Tooltip.Popup>表示は端末の設定を使用します</Tooltip.Popup>
    </Tooltip.Positioner>
  </Tooltip.Portal>
</Tooltip.Root>
```

`TooltipProvider` を上位に置いて `delay` / `closeDelay` を otibo 既定に上書きする(provider timeout=0 で「次の trigger に hover した時に即出す」grain)。

## Variants

なし(単一形)。size variant は持たない(transient chip としての形は固定、`fontSize: xs`、`maxWidth: 16rem`)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **popup rest** | `bg: fg.strong` + `color: surface` + `fontSize: xs` + `padding: 2 / 1` + `borderRadius: sm` + `boxShadow: lift` + `maxWidth: 16rem` |
| **popup `data-starting-style`** | `opacity: 0` |
| **popup `data-ending-style`** | `opacity: 0` |

**矢印を持たない** ── 配置自由度を優先(`flip` / `shift` で trigger 周囲に自由に置く)。矢印は trigger との接続感を補強するが、shadow + 位置で十分。

## a11y

- **primitive** ── `@base-ui-components/react/tooltip`(Provider / Root / Trigger / Portal / Positioner / Popup)。
- **role** ── `tooltip`(WAI-ARIA Tooltip Authoring Practices)。
- **trigger との関連付け** ── trigger 要素の `aria-describedby` が popup の id に自動接続。
- **keyboard** ── Tab で trigger に focus した瞬間に open、Esc で close。focus を popup 内に移さない(transient なので)。
- **touch / モバイル** ── hover が無い環境では tooltip は出にくい(タッチで long-press や別 affordance を考える) ── Tooltip に頼らず必要な情報は本文 / Field.Description に出す方が grain。

## Motion

| 軸 | 値 |
| --- | --- |
| Tier(enter / exit) | `quick`(120ms) |
| Register(enter) | `decelerate` |
| Register(exit) | `standard` |
| 動作 | **opacity フェードのみ**(scale なし) |

**scale を捨てた理由**:tooltip は **単一行の hint = 最も焦点的で、視線の逃げ場が無い**。scale を入れると scale=1 終端のテキスト再ラスタライズ snap(`motion-grammar.md` §Overlay Appearance、GPU レイヤ解除で glyph がピクセルグリッドに再 snap)が**必ず焦点に乗る**(list の select / 複数行の popover と違い、attention を別の場所に移して隠すことができない)。よって opacity フェードのみ ── hint は「現れる」だけでよく、trigger からの空間の手がかりは不要。

### Hover-Open Asymmetric Delay(provider 側で otibo 既定を設定)

- **open delay** ≈ 250ms ── pointer の意図的 lingering を確認(通過 hover で誤発火しない)。
- **provider timeout=0** ── 既に他 tooltip が出ている状態で次の trigger に hover した時は **即出す**(間に open delay を入れない、Mac Dock の「最初の一つだけタメる」grain)。
- **close** ── 離れたら即(`motion-grammar.md` §Hover-Open Asymmetric Delay の grain)。

詳細値は `TooltipProvider` の prop で握る(消費側で `delay={250}` 等を渡す)。

reduced-motion:opacity quick だけなので travel を抜く必要なし(自然に reduced-motion でも収まる)。

## Use when

- **icon-only button の説明**(★ → "お気に入りに追加")。
- **truncate された text の full version 表示**(table cell が省略されている時)。
- **短い補足 / 用語の意味**(一行に収まる範囲)。

## Use instead

- **複数行 or 軽い操作** → **Popover**(click で開く、明示的 dismiss)。
- **リンク先のプレビュー** → **PreviewCard**(media + meta、treatment B trigger)。
- **本文に書いて済むもの** → **本文 / Field.Description**(touch / モバイルで読めない問題を avoid)。
- **永続的な notice** → **Card** か **Field.Description**(消えるべきでない情報を tooltip に隠さない)。

詳細は `component-selection-map.md` §overlay(Tooltip vs Popover vs PreviewCard)。

## Avoid

- **scale を popup に足す**(焦点的 hint で scale-on-text snap が必ず焦点に乗る) → opacity-only。
- **複数行 / 重い content を tooltip に詰める**(read time が長い content は明示的開閉が要る) → Popover。
- **必須情報を tooltip に隠す**(touch / SR で届かない場面が出る) → 本文 / Field.Description。
- **矢印を足す**(配置 noise、shadow + 位置で十分) → 矢印なし。
- **light bg(`surface.raised`)に文字を載せる**(popover との grain 衝突、tooltip の chip 性が消える) → fg.strong 地 + 白文字。

## Decisions(本セッションの確定事項)

- **chip 表現(`fg.strong` 地 + `surface` 文字)** ── 暖色濃い chip で transient hint を表現。Popover の paper(明色)と grain で住み分け。「白 on 色」の blessed pattern(原則 4)を accent 以外で適用した例。
- **scale 撤去、opacity-only** ── 単一焦点 hint は scale-on-text snap を隠せないため(`motion-grammar.md` §Overlay Appearance)。
- **矢印持たない** ── 配置 noise を avoid、lift shadow と位置で十分。
- **provider timeout=0、otibo 既定 delay 250ms** ── 「最初の一つだけタメる」grain(Mac Dock pattern、`motion-grammar.md` §Hover-Open Asymmetric Delay)。
- **maxWidth 16rem 固定** ── 一行 hint の役割を強制(超えると複数行になり、Popover の領分に侵食する)。

## Related

- 上位:`principles.md` §4(白 on 色、tooltip でも適用)、§6(影の規範、lift 単一)、§10(overlay 出現 motion 分岐 ── 単一焦点は opacity-only)、§12(非対称 delay)、§14(Base UI 一本)
- 兄弟(同 motion 文法 opacity-only):Popover / PreviewCard / NavigationMenu Viewport
- 別 overlay:Popover(click + paper)、Menu(action list scale)、PreviewCard(hover + treatment B trigger + media)
- 住み分け:`component-selection-map.md` §overlay
- 詳細:`src/core-ui/tooltip/tooltip.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/tooltip`
- motion 文法:`motion-grammar.md` §Overlay Appearance、§Hover-Open Asymmetric Delay
- memory:[[otibo-ds-progress]](Tooltip の決定全般)
