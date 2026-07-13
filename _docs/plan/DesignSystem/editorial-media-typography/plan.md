---
title: Editorial media typography plan
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
  - "_docs/qa/DesignSystem/editorial-media-typography/test-plan.md"
  - "_docs/reference/DesignSystem/principles.md"
  - "_docs/reference/DesignSystem/components/avatar.md"
  - "_docs/reference/DesignSystem/components/table.md"
related_issues: []
related_prs: []
---

# Editorial media typography plan

## Overview

Design System に Media / Typography+Prose / Table モバイルの三トラックを一気通貫で追加する。見た目確認は Ladle + Cursor browser MCP（必要時 Playwright CLI）で行う。

## Scope

- **Media**: `MediaFrame`（`Empty` slot）、`LogoFrame`
- **Typography + Prose**: named `textStyles`（display / heading.sm|md|lg / body / eyebrow / caption）、drop-in consumer向け`textStyle(role)` helper、`Prose`（reading=`ui`|`article`）
- **Table**: `TableScroll` による狭い幅での横スクロール + 端フェード。行カード化はしない
- public flat export、Panda recipe / textStyles 登録、staticCss、Ladle stories、reference / selection-map 更新

## Non-Goals

- `<Text role>` React component
- EmptyMedia の独立 package component
- Table の行カード化 / sort / selection 機構
- Avatar API の破壊的変更
- success / warning 等の新 hue

## Requirements

- Typography の正本は Panda `textStyles`。consumer は public `textStyle(role)` helperでcompiled classを取得し、HTML 要素は自分で選ぶ
- `heading` は `sm` / `md` / `lg`。`display` は editorial 上位一段
- `Empty` は MediaFrame の slot。Skeleton（来る前）と Empty（無い）を混同しない
- LogoFrame は Avatar と同型の構成だが、既定は角丸矩形 + `contain`、fallback は `surface.muted`
- Table 純構造（native table、zebra なし、端 padding 0）を維持し、スクロールは wrapper で足す
- package verification（recipe 数 / staticCss）を通す

## Tasks

1. Plan / Intent / QA / TODO を揃える
2. `textStyles`、public `textStyle(role)` helper、`Prose` を実装し stories で梯子を見せる
3. `MediaFrame` / `LogoFrame` を実装し stories で枠と empty / logo を見せる
4. `TableScroll` を追加し狭い viewport で横スクロールを確認する
5. export / preset / panda staticCss / verify-package / reference を更新する
6. Ladle + browser MCP で視覚確認し、verification を残す

## QA Plan

- QA test-plan: `_docs/qa/DesignSystem/editorial-media-typography/test-plan.md`
- Main checks: typecheck / lint / build / test:package / ladle stories / browser screenshot review

## Deployment / Rollout

otibo-ui package 内の追加のみ。consumer は新 export を opt-in で使う。既存 Avatar / Table の既定見た目は変えない（Table は Scroll を明示利用したときだけモバイル挙動が付く）。
