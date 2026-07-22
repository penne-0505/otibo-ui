---
title: "QA Test Plan: docs-driven template v1.0.0 migration"
status: active
draft_status: n/a
qa_status: planned
risk: High
qa_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/plan/Workflow/docs-template-v1-migration/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `docs-driven template v1.0.0 migration`

## Source of Intent

- TODO: `Workflow-Chore-15`
- Plan: `_docs/plan/Workflow/docs-template-v1-migration/plan.md`
- Intent: `_docs/intent/Workflow/docs-template-v1-migration/decision.md`

## Decision Review Scope

- DEC-001: inventory completeness and pathwise reconciliation。
- DEC-002: compatibility / strict schema separation。
- DEC-003: final-write provenance lock。
- DEC-004: runtime/release preservation。
- DEC-005: template self-history exclusion and evidence-bound deletion。
- DEC-006: hooks remain non-expanding guardrails。

## Quality Goal

v1 docs workflow を採用しながら、otibo-ui 固有の behavior と history を損なわず、再現可能な provenance と検証証跡を残す。

## Acceptance Criteria

- AC-001: B/U/P と clean cutoff が記録される。
- AC-002: path union と migration artifacts に未分類がない。
- AC-003: v1 distribution が customization-preserving merge で統合される。
- AC-004: schema field type separation と unknown warning が fixture で守られる。
- AC-005: CI ACMR scope と upstream-qualified provenance commands が確認できる。
- AC-006: compatibility / strict verdict と final lock ordering が明示される。
- AC-007: self-history exclusion と deletion evidence が確認できる。
- AC-008: docs/package/release regression checks が成功する。
- AC-009: runtime/public package behavior に diff がない。

## Intent-derived Invariants

- INV-001: lock は exact U source/tag/full SHA を指す。
- INV-002: docs migration は package/runtime/source behavior を変更しない。

## Risk Assessment

- Risk level: High
- Risk rationale: validator、CI、agent hooks、skills、schema compatibility、provenance を同時に移行する。
- Regression risk: legacy docs rejection、scope 漏れ、customization loss、release gate drift。
- Data safety risk: repository files の unintended deletion。
- Security / privacy risk: hooks が sensitive operation を誤許可する、external upstream command の取り違え。
- UX risk: package consumer behavior は変更しない。
- Agent misbehavior risk: branch mixing、blind replacement、premature lock、bulk schema rewrite、unproven deletion。

## Test Strategy

- Validator: wrapper と個別 unscoped checks、positive/negative fixtures。
- Hooks: unit、smoke、settings syntax。
- Static: paired skill comparison、markdownlint、lock/source/tag/SHA、CI env、inventory/diff set equality。
- Regression: package `release:check` と P との runtime/package path diff。
- Manual: self-history非導入、deletion references、compatibility/strict separation。

## Test Matrix

| ID | Source | Requirement / Optional Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | exact B/U/P cutoff | static | `git rev-parse`, status, tag resolution | exact values and clean P | verified |
| AC-002 | TODO | zero unclassified paths | diff | inventory reconciliation command | empty missing/extra sets | planned |
| AC-003 | TODO | v1 pathwise integration | diff | B/U/P ledger review | each path has one allowed resolution; seven U-absent paths use keep plus archive / supersede / quarantine disposition without deletion-hook bypass | verified |
| AC-004 | TODO | typed schema fields and warnings | fixture | `scripts/test-validators.mjs` | positive and warning cases PASS | planned |
| AC-005 | TODO | ACMR and upstream-qualified commands | static | workflow/docs/skill review | exact configuration | planned |
| AC-006 | TODO | compatibility/strict and final lock | static | verification/git diff order evidence | separate verdicts, exact lock | planned |
| AC-007 | TODO | no template self-history | search/diff | `rg`, exact blob/reference checks and active-path absence | no imported history; exact-B/U-absent retained paths are non-operational or superseded without deletion-hook bypass | verified |
| AC-008 | TODO | full checks | regression | docs wrapper, markdownlint, hooks, package release gate | docs and package gates pass except separately reported pre-existing audit baseline / redundant rerun ENOSPC | verified |
| AC-009 | TODO | runtime preservation | diff | P..HEAD scoped diff | no runtime/package behavior paths | planned |
| INV-001 | intent | exact provenance | static | lock/tag/full SHA review | exact U | verified |
| INV-002 | intent | no runtime behavior change | regression | path diff + release checks | zero behavior diff and applicable checks PASS | verified |

## Manual QA Checklist

- [x] migration-created artifacts are included in the ledger。
- [x] lifecycle/template self-history is absent from active guidance。
- [x] seven exact-B/U-absent paths are resolved without bypassing deletion policy。
- [x] compatibility and strict schema verdicts are separate。

## Regression Checklist

- [x] project README/QUICKSTART/documentation guide customizations remain project-specific。
- [x] package CI, package scripts, source, assets, and component references remain unchanged。
- [x] release/publish gates still execute from the same package scripts。
- [x] original checkout remains on `dev`; `main` and remotes are untouched。

## High-risk Checklist

- [x] Rollback or recovery path is documented。
- [x] Data safety has been checked。
- [x] Security / privacy implications have been checked。
- [x] Failure mode is understood。

## Out of Scope

- strict schema bulk conversion、runtime/package change、push、main update、publish。

## Open Questions

- None。
