---
title: "Migrate docs template by provenance-locked three-way reconciliation"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/plan/Workflow/docs-template-v1-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
related_issues: []
related_prs: []
---

# Migrate docs template by provenance-locked three-way reconciliation

## Context

otibo-ui は pre-v1.0.0 template を project 固有に発展させており、upstream の全置換は package release workflow と durable project docs を失わせる。旧採用 revision は blob evidence と owner approval により B として確定している。

## Decisions

### DEC-001: B/U/P の pathwise three-way を migration authority にする

- **What**: upstream delta と project delta の union を path ごとに分類し、許容された一つの resolution（apply / merge / keep / remove / defer）と rationale を持たせる。archive / supersede / quarantine は resolution ではなく disposition として別記する。
- **Why**: moving branch や latest tree の単純コピーでは、project customization と migration 由来変更を区別できないため。
- **Change freedom**: 同じ B/U/P と全 path classification を再現できる限り、ledger format や merge tooling は変更できる。

### DEC-002: compatibility adoption と strict schema conversion を分離する

- **What**: v1 validator は legacy docs を受理し、新規 schema fields は document type ごとに検証する。既存 docs の一括 v2 化は行わない。
- **Why**: template mechanics の adoption と project rationale の semantic rewrite を同時にすると、機械的変更が歴史的意図を書き換えるため。
- **Change freedom**: strict conversion は別 task と verification で段階的に実施できる。

### DEC-003: provenance lock を compatibility checks 後の最終 migration write にする

- **What**: `docs-template.lock.json` は reconciled distribution が検証済みになってから exact tag/full SHA で作成する。
- **Why**: lock の先行更新は未完了 migration を adopted baseline と誤認させるため。
- **Change freedom**: lock schema が将来拡張されても、source/tag/full SHA と書き込み順序は追跡可能でなければならない。

### DEC-004: project runtime と release contract を移行対象外として保全する

- **What**: package/runtime/source/test/release/publish paths は keep とし、docs integration に必要な既存 entrypoint だけを merge する。
- **Why**: この migration の目的は docs workflow の更新であり、公開 package behavior の変更根拠を持たないため。
- **Change freedom**: 後続の独立 task は通常の Plan/Intent/QA を経て runtime を変更できる。

### DEC-005: template self-history は downstream history にしない

- **What**: upstream lifecycle-self-audit docs は導入せず、旧 Template self-finalization の 7 path は active guidance から archive / superseded state / non-operational quarantine へ移す。intent/QA は canonical path に残し、plan だけを allowed archive へ移す。
- **Why**: upstream 自身の実装履歴は otibo-ui の意思決定ではなく、active project guidance と混同される。一方、deletion hook を迂回すると migration の safety boundary 自体を破るため。
- **Change freedom**: reusable standard、fixture、hook behavior は self-history を参照しない形に一般化して採用できる。非削除の扱いは、active loader / standards path から外れ、current migration authority への link と deferred deletion rationale を持つ限り変更できる。

### DEC-006: lifecycle hooks は scope を拡張しない guardrail とする

- **What**: prompt、write、stop の各境界で短い監査を行うが、docs 自動更新や新規作業の承認には使わない。
- **Why**: lifecycle reminder が task authority と混同されると、agent が合意済み Scope を越えて変更するため。
- **Change freedom**: event 名や文面は、同じ非拡張・非自動更新の結果を保つ限り変更できる。

## Consequences / Impact

- migration ledger と QA evidence が増える。
- v1 compatibility は採用するが、既存 project docs は legacy schema のまま残り得る。
- docs CI は modified legacy docs も対象にする。
- runtime/package artifacts は P と同一に保たれる。

## Quality Implications

- unclassified path、blind replacement、premature lock、branch mixing は migration failure とする。
- correct-type schema acceptance と wrong-type/unknown-field warnings を fixture で検証する。
- final diff と inventory の集合一致、および runtime-preservation diff が必要である。

## Intent-derived Invariants

- INV-001 (from DEC-003): provenance lock は採用済み distribution の exact source/tag/full SHA を指す。
- INV-002 (from DEC-004): docs template migration 単独では public package/runtime/source behavior を変更しない。

## Enforced in (optional)

- DEC-001: `_docs/qa/Workflow/docs-template-v1-migration/inventory.tsv`
- DEC-002: `scripts/validate-frontmatter.mjs`, `scripts/validate-intent.mjs`, `scripts/validate-qa.mjs`
- DEC-006: `scripts/agent-workflow-hook.mjs` と agent hook settings。
- INV-001: `docs-template.lock.json` と migration verification。
- INV-002: P との path/diff review と package release gate。

## Rollback / Follow-ups

- 専用 branch の単一 commit を revert する。
- strict schema conversion は compatibility migration の PASS 後に独立 task として判断する。
