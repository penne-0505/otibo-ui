---
title: "Plan: docs-driven template v1.0.0 migration"
status: active
draft_status: n/a
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
related_issues: []
related_prs: []
---

# Plan: docs-driven template v1.0.0 migration

## Overview

legacy baseline B から tagged upstream U へ、owner-approved project cutoff P を third side とする provenance-locked migration を行う。

## Scope

- B..U と B..P の path union、migration-created artifacts の inventory。`resolution` は `apply` / `merge` / `keep` / `remove` / `defer` に限り、archive / supersede / quarantine は別 `disposition` として記録する。
- validators、fixtures、hooks、paired skills、standards、templates、root guidance、CI の pathwise merge。
- project docs は legacy-compatible validation を維持し、strict schema adoption は別判定する。
- compatibility checks 後の exact provenance lock 作成。

## Non-Goals

- package/runtime/source/component behavior、public API、dependency、release/publish contract の変更。
- upstream lifecycle-self-audit、旧 Template self-history の downstream history としての保持。
- `main` ref 更新、push、publish。
- 既存 project docs の一括 schema rewrite。

## Requirements

- **Provenance**: B=`37f7198edd9e27f1c7270fb74ce2caf83dca27de`、U=`v1.0.0` / `f71e9ab20466ea2972158334261f5ae2b2265754`、P=`d823baf77878693e46828ec423aaa8d444ec024f`。
- **Isolation**: clean P から isolated worktree と専用 branch を使う。
- **Preservation**: project-only paths と customized shared pathsを blind replacement しない。
- **Non-destructive removal handling**: exact B blob、U/current absent or replaced、project refs/customization なしを確認できる template-only path は、plan の archive、intent/QA の superseded state、非運用 quarantine のいずれかへ移す。`rm` / `git rm` / deletion-hook の迂回は使わない。
- **Pilot fixes**: schema field typing、unknown warning fixture、ACMR CI scope、upstream-repo-qualified provenance command、complete ledger を統合する。

## Tasks

1. baseline validators と cutoff evidence を記録する。
2. inventory ledger で全 path に apply / merge / keep / remove / defer を一つ割り当てる。
3. validators / fixtures を legacy-compatible mode で導入し、既存 project docs を検査する。
4. standards / templates / paired skills / hooks / CI / root guidance を pathwise merge する。
5. lifecycle/template self-history を除外し、7 retained path を `keep` resolution と archive / supersede / quarantine disposition で解決する。
6. compatibility checks 成功後に lock を exact U へ作成する。
7. final diff と ledger を照合し、project release gate を実行する。

## QA Plan

- QA document: `_docs/qa/Workflow/docs-template-v1-migration/test-plan.md`
- Risk level: High
- Validator / static: unscoped docs wrapper、individual validators、fixtures、hook tests、paired skills、lock、inventory reconciliation。
- Regression: `npm run release:check`、package tests/build、P との runtime/source/package diff。
- Rollback: migration commit 一つを revert でき、元 `dev` checkout と `main` ref は不変。

## Deployment / Rollout

単一 migration commit を専用 branch に作成する。push、main 更新、package publish は行わない。
