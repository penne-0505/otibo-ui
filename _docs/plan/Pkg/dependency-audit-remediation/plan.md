---
title: "Plan: Dependency audit remediation"
status: active
draft_status: n/a
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/intent/Pkg/dependency-audit-remediation/decision.md"
  - "_docs/qa/Pkg/dependency-audit-remediation/test-plan.md"
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
related_issues: []
related_prs: []
---

## Overview

新規advisoryの公開によって失敗したPackage CIを、監査基準を緩めず修復する。public runtime contractには触れず、dev toolingのdirect patch updateと、upstream rangeだけではpatched versionへ到達できない推移依存への限定overrideで対応する。

## Scope

- `@pandacss/dev`と`markdownlint-cli2`を互換patchへ更新する。
- lockfileを更新し、advisory対象の`fast-uri`、`js-yaml`、`brace-expansion`、`postcss`をpatched versionへ解決する。
- `@modelcontextprotocol/sdk`が`@hono/node-server` 1系を要求する間は、dev-only Panda MCP経路に安全版2系を解決するoverrideを置く。
- canonical `npm run audit`とPackage CI matrixを維持する。
- full release gateとdocs validatorsで回帰を確認し、High risk verificationを残す。

## Non-Goals

- `npm audit --omit=dev`への縮小、severity thresholdの引き上げ、audit stepの削除。
- Pandaの破壊的downgrade、Panda major migration、component API変更。
- React / React DOM、Base UI、TypeScript、Vite、Biome等の便乗更新。
- npm publish、git commit、push、GitHub Actionsの手動再実行。

## Requirements

- **Security**: `npm audit --audit-level=low`が0件で成功し、patched version未満をlockfileに残さない。
- **Compatibility**: Panda codegen、TypeScript、Biome、package build、packed consumers、Ladle artifactが既存挙動を維持する。
- **Packaging**: runtime dependency、peer dependency、exports、tarball allowlistを変更しない。
- **CI**: Node 22 / 24 × React 18 / 19 matrixとfailure propagationを維持する。
- **Reproducibility**: direct toolsと必要なoverrideをmanifestに記録し、`npm ci`で同じ解決結果を再現する。

## Tasks

1. advisoryと依存経路ごとにfirst patched versionを確認する。
2. direct dev dependencyの互換patchと、必要最小限のoverrideをmanifestへ記録する。
3. lockfileを再生成し、対象packageのresolved versionとaudit結果を確認する。
4. `npm ci`相当、release gate、Node / React compatibility、docs validatorsを実行する。
5. QA verificationへ実測結果、rollback、security、data safety、残リスクを記録する。

## QA Plan

- QA document: `_docs/qa/Pkg/dependency-audit-remediation/test-plan.md`
- Risk level: High
- Regression: canonical release gate、packed consumer matrix、Panda生成、Ladle story artifact。
- Security: low audit 0件、runtime-only audit 0件、override対象のversion確認。
- Agent misbehavior: audit無効化、force fix、scope外dependency更新、publishを行わないことをdiff reviewする。

## Deployment / Rollout

- repository内のmanifest、lockfile、docsだけを変更し、publishは行わない。
- rollbackはこの変更のmanifest / lockfileを戻し、同じauditとrelease gateを再実行する。
- upstreamが安全版を通常rangeで解決できるようになった時点で、overrideを削除してauditとfull regressionを再実行する。
