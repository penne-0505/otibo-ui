---
title: "Harden 0.3.0 package types and release gates"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
  - "_docs/qa/Pkg/release-contract-hardening/test-plan.md"
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
  - "_docs/intent/Pkg/namespace-export-design/decision.md"
related_issues: []
related_prs: []
---

## Overview

0.3.0 publish前監査で検出したCJS型、CSS subpath型、Docs CI不一致を修正し、同じ失敗をlocal / CI / prepublishの全経路で検出する。

## Scope

- ESM / CJSごとのconditional type exportsを定義する。
- `styles.css`の型宣言をbuild artifactへ追加する。
- packed consumer testsをReact 18 / 19とESM / CJSへ拡張する。
- publint、ATTW、markdownlintを固定versionのrelease toolとして導入する。
- local scripts、Docs CI、Package CI、prepublish gateを同期する。
- 0.3.0のbreaking changesをCHANGELOGへ記録する。

## Non-Goals

- component runtime behaviorやvisual designを変更しない。
- Node.js `>=22`、global reset、font同梱方針を変更しない。
- npm publish、git commit、push、tag作成を行わない。

## Requirements

- **Functional**: CJS TypeScriptは`.d.cts`、ESM TypeScriptは`.d.ts`を解決する。
- **Functional**: CSS side-effect importがTypeScriptの厳格解決で成功する。
- **Non-Functional**: release gateは手動確認に依存せず、local / CI / npm publishで同じ必須検査を実行する。
- **Non-Functional**: package artifact検査はpacked tarballをsource of truthとする。

## Tasks

1. package exportsとbuild artifactを修正する。
2. verifierへCJS / CSS / React 18 regressionを追加する。
3. docs / package CIとrelease scriptsを統一する。
4. markdownlint違反とdependency重複を整理する。
5. QA review、publish dry-run、external package lintersを実行する。

## QA Plan

- QA document: `_docs/qa/Pkg/release-contract-hardening/test-plan.md`
- Risk level: Medium
- Regression: TS1479とTS2307を再現するconsumerを成功条件へ反転する。
- Workflow: CIが旧Deno formatterやpackage test省略へ戻らないことをdiff / executionで確認する。

## Deployment / Rollout

- 0.3.0をpublishする前に全release gateを完走する。
- publish前のためrollbackは変更commitのrevertで行える。
- publish後はversion上書きやunpublishではなく0.3.x patchで修正する。
