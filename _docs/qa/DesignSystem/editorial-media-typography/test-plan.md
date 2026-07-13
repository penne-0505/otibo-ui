---
title: Editorial media typography QA test plan
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/plan/DesignSystem/editorial-media-typography/plan.md"
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
related_issues: []
related_prs: []
---

# Editorial media typography QA test plan

## Source of Intent

- TODO task: `DesignSystem-Feat-13`
- Plan: `_docs/plan/DesignSystem/editorial-media-typography/plan.md`
- Intent: `_docs/intent/DesignSystem/editorial-media-typography/decision.md`

## Quality Goal

Media / Typography+Prose / TableScroll が合意した grain を守り、package として export・CSS・stories から利用でき、狭い幅の表と typography 梯子が視覚的に確認できる。

## Acceptance Criteria

- AC-001: `display` / `heading.sm|md|lg` / `body` / `eyebrow` / `caption` の textStyles が定義され、packed consumerがpublic `textStyle(role)` helperからPanda無しで適用できる。
- AC-002: `Prose` が `reading="ui" | "article"` を持ち、measure（prose 幅）と本文サイズ差が分かる。
- AC-003: `MediaFrame` が image / empty slot を持ち、独立 `EmptyMedia` export が無い。
- AC-004: `LogoFrame` が Avatar と同型 API で、既定が contain・角丸・muted fallback である。
- AC-005: `TableScroll` が狭い幅で横スクロール可能で、行カード化を導入していない。
- AC-006: public flat export・Panda recipe/staticCss・`npm run typecheck` / `lint` / `build` / `test:package` が通る。
- AC-007: `MediaFrameRoot` の aspect / fit が Image slotへ伝播し、Imageの明示fitで上書きできる。
- AC-008: `Prose` の直下ul/olがmarkerを持ち、その直下liにreading typographyが適用される。

## Intent-derived Invariants

- INV-001: Typography roles の正本は textStyles であり、専用 `<Text>` component を公開しない。
- INV-002: MediaFrame の empty は slot であり、独立 EmptyMedia export を持たない。
- INV-003: LogoFrame の既定は contain + 非円（角丸）+ muted fallback である。
- INV-004: Table のモバイル既定は横スクロール wrapper であり、行カード化しない。
- INV-005: Skeleton は loading placeholder、MediaFrame empty は欠落表示として住み分ける。
- INV-006: MediaFrameRoot の aspect / fit は Image slot に伝播し、Image の明示 fit だけが局所的に上書きする。
- INV-007: Typography role は consumer-side Panda を要求せずpublic rootから利用でき、専用 `<Text>` componentを増やさない。

## Risk Assessment

Risk: Medium。公開 API・視覚 grain・package CSS に影響する。既存 Avatar / Table 既定を壊すと regression になる。

## Test Strategy

- 静的: typecheck / biome / package verify（recipe inventory）
- 差分: export に EmptyMedia / Text が無いこと、Table がカード化していないこと
- 視覚: Ladle stories を Cursor browser MCP で開きスクショ確認（不可時 Playwright CLI）

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | textStyles ladder exists | static check | `src/theme/text-styles.ts`, stories | Roles render in Ladle | verified |
| AC-002 | TODO | Prose reading surfaces | visual | Ladle Prose stories | ui vs article body size differs | verified |
| AC-003 | TODO | MediaFrame empty slot | diff review + visual | `src/index.ts`, MediaFrame stories | No EmptyMedia export; empty slot visible | verified |
| AC-004 | TODO | LogoFrame defaults | visual + code review | LogoFrame recipe/stories | contain, rounded rect, muted fallback | verified |
| AC-005 | TODO | TableScroll only | visual + diff | Table stories, table.tsx | Horizontal scroll; no card rows | verified |
| AC-006 | TODO | package health | automated | `npm run typecheck && lint && build && test:package` | Exit 0 | verified |
| INV-001 | intent | No Text component | static check | `rg "export.*Text" src/index.ts` | No typography Text export | verified |
| INV-002 | intent | No EmptyMedia export | static check | `rg EmptyMedia src/index.ts` | No matches | verified |
| INV-003 | intent | LogoFrame ≠ Avatar look | code review | logo-frame.recipe.ts | contain + muted + radius md | verified |
| INV-004 | intent | No table card layout | diff review | table.* | Scroll wrapper only | verified |
| INV-005 | intent | Empty ≠ Skeleton | doc + visual | MediaFrame vs Skeleton stories | Distinct copy/purpose | verified |
| AC-007 / INV-006 | TODO / intent | Root variants reach Image; Image fit overrides | automated + story | `npm run test:package`, MediaFrame stories | packed SSR output contains inherited auto/contain classes and explicit override | verified |
| AC-008 | review | Prose list semantics survive reset | compiled CSS + story | `npm run test:package`, Prose stories | disc/decimal markers and direct-li selectors exist | verified |
| INV-007 | intent | Drop-in typography helper, no Text component | packed consumer | `npm run test:package` | ESM/CJS/types expose `textStyle`; no Panda subpath or Text export | verified |

## Manual QA Checklist

- Ladle で Typography / Prose / MediaFrame / LogoFrame / TableScroll を開く
- 狭い viewport（≈375px）で TableScroll が横に動く
- LogoFrame fallback が accent 円に見えない
- MediaFrame empty が Skeleton の脈動に見えない

## Regression Checklist

- 既存 Avatar の円・accent fallback・cover が維持される
- 既存 Table（Scroll 無し）の端 padding 0 / zebra 無しが維持される
- namespace export が復活していない

## Out of Scope

- 行カード Table
- 実画像 CDN 依存の load flake を CI ゲートにすること（stories は安定アセット or CSS で代替可）

## Open Questions

- None（実装前に仮置き確定済み）
