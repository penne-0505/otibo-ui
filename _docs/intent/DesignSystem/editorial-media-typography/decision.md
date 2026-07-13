---
title: Editorial media typography decisions
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/plan/DesignSystem/editorial-media-typography/plan.md"
  - "_docs/qa/DesignSystem/editorial-media-typography/test-plan.md"
  - "_docs/reference/DesignSystem/principles.md"
  - "_docs/reference/DesignSystem/components/avatar.md"
  - "_docs/reference/DesignSystem/components/table.md"
related_issues: []
related_prs: []
---

## Context

otibo のカタログには Avatar / Table / Skeleton / Card があるが、図版枠・ロゴ枠・タイポの role 梯子・読み面・表の狭い幅対応が無い。editorial 幅トークン（`prose` / `lede` 等）は preset に既にある。要件整理の結果、三トラックに分けて一気通貫で追加する。

## Decision

1. **三トラック**: Media / Typography+Prose / Table。Intent は本文書にまとめるが、実装・検証はトラック単位で追いやすくする。
2. **EmptyMedia**: 独立 component にせず、`MediaFrame` の **`empty` slot** とする。Skeleton は「来る前」、Empty は「無い」。
3. **Typography roles**: `display` / `heading`（`sm`|`md`|`lg`）/ `body` / `eyebrow` / `caption` を Panda **named textStyles** にする。drop-in consumerにはpublic `textStyle(role)` helperでcompiled class名を返す。`<Text>` component は置かず、見た目の role と HTML 見出しレベルを分離する。
4. **Prose**: 読み面 component。`reading="ui"`（本文 `md`）と `reading="article"`（長文 `base`）を持つ。role の正本は textStyles。
5. **LogoFrame**: Avatar と同型の Root / Image / Fallback 構成。既定は **角丸矩形 + `object-fit: contain`**、fallback 地は **`surface.muted`**（Avatar の accent 円は踏襲しない）。
6. **Table モバイル**: 行カード化は今ラウンド対象外。**`TableScroll` wrapper** で横スクロール + 端フェードを既定とする。

## Alternatives

- **EmptyMedia 独立 component**: 枠契約が MediaFrame と分裂するため不採用。
- **`<Text role>` API**: 見た目と HTML semantics の再結合、既存 slot typography との二重管理を招くため不採用。必要なら後から textStyles の薄いエイリアスとして足せる。
- **consumerからPanda `css()`をimport**: 0.3.0以降のdrop-in contractに反してPanda生成物をpublic exportに増やすため不採用。
- **Table 行カード化**: markup / a11y が別 primitive になるため、今ラウンドでは不採用。

## Rationale

textStyles 正本は CardTitle が heading element でない判断と整合する。LogoFrame を Avatar から見た目まで揃えないのは、ロゴが透過余白と矩形を前提にすることが多いため。Table は純構造の grain を壊さず、狭い幅の壊れ方だけを wrapper で吸収する。

## Consequences / Impact

- public API に MediaFrame / LogoFrame / Prose / TableScroll と textStyles が増える。
- selection-map / component reference / README の inventory を更新する必要がある。
- 既存 Table 単体の見た目は変わらない（Scroll を巻いたときだけ横スクロールが付く）。

## Quality Implications

- Empty と Skeleton の混同は grain 破壊になる。
- LogoFrame が Avatar と同じ accent 円 fallback だと brand mark が人の identity に誤読される。
- textStyles が static CSS に載らないと package consumer で梯子が欠ける。
- TableScroll 無しで広い表を狭い viewport に置くと従来どおり溢れる（opt-in であることの文書化が必要）。

## Intent-derived Invariants

- INV-001: Typography roles の正本は textStyles であり、専用 `<Text>` component を公開しない。
- INV-002: MediaFrame の empty は slot であり、独立 EmptyMedia export を持たない。
- INV-003: LogoFrame の既定は contain + 非円（角丸）+ muted fallback である。
- INV-004: Table のモバイル既定は横スクロール wrapper であり、行カード化しない。
- INV-005: Skeleton は loading placeholder、MediaFrame empty は欠落表示として住み分ける。
- INV-006: MediaFrameRoot の aspect / fit は Image slot に伝播し、Image の明示 fit だけが局所的に上書きする。
- INV-007: Typography role は consumer-side Panda を要求せずpublic rootから利用でき、専用 `<Text>` componentを増やさない。
