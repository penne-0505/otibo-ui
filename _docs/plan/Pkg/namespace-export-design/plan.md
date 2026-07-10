---
title: "Flat-only component exports"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/namespace-export-design/decision.md"
  - "_docs/qa/Pkg/namespace-export-design/test-plan.md"
related_issues: []
related_prs: []
---

## Overview

`@otibo/ui` 0.3.0でcompound componentのnamespace objectを削除し、全frameworkでflat named exportだけを使う公開契約へ統一する。

## Scope

- namespace objectを公開する22 componentを棚卸しする。
- 各slot / primitive wrapperを`ComponentSlot`形式でexportする。
- public root、component index、stories、source examples、README、component referenceをflat usageへ変更する。
- package artifactで旧namespace不在とflat export存在を検査する。
- ViteとNext.js App Routerのpack consumer buildを実行する。

## Non-Goals

- componentの視覚、状態管理、accessibility behaviorを変更しない。
- `ChipGroup`、`RadioGroup`、`ToggleGroup`等の通常componentを削除しない。
- per-component subpath exportを新設しない。
- 0.3.0をnpm publishしない。

## Requirements

- **Functional**: `FieldRoot`、`DialogRoot`等のflat exportだけで全compound componentを構成できる。
- **Functional**: `Field`、`Dialog`等のnamespace objectはpackage rootから取得できない。
- **Non-Functional**: component behaviorとLadle story coverageを維持する。
- **Non-Functional**: migration例が機械的に追える命名規則`Namespace.Slot` → `NamespaceSlot`を使う。
- **Non-Functional**: 0.2.xとの互換性より、単一APIの長期保守性を優先する。

## Tasks

1. 22 namespaceとslot対応表をIntentへ記録する。
2. source componentをflat named exportへ変更し、namespace objectを除去する。
3. root / local indexと全usageをflat名へ更新する。
4. package verifierへexport contract assertionを追加する。
5. Vite / Next.js consumer、repository checks、docs validatorsを実行する。

## QA Plan

- QA document: `_docs/qa/Pkg/namespace-export-design/test-plan.md`
- Risk level: Medium
- Test strategy:
  - Static: public export keyとnamespace不在をassertする。
  - Integration: pack済みtarballをVite / Next.js App Routerへinstallしてbuildする。
  - Regression: typecheck、lint、Ladle 56 storiesを維持する。
  - Documentation: README / component reference / sourceでdot notation残存を検索する。
  - Validator: docs gate全体を実行する。

## Deployment / Rollout

- 0.3.0のbreaking migrationとしてdrop-in styles変更と同時にreleaseする。
- deprecation期間は設けない。0.2.0は旧namespace利用者向けにregistryへ残す。
- publish前にNext.js App Router consumer buildとmigration documentationを最終確認する。
