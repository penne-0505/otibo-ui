---
title: "QA Verification: Dependency audit remediation"
status: active
draft_status: n/a
qa_status: verified
risk: High
qa_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/plan/Pkg/dependency-audit-remediation/plan.md"
  - "_docs/intent/Pkg/dependency-audit-remediation/decision.md"
  - "_docs/qa/Pkg/dependency-audit-remediation/test-plan.md"
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
related_issues: []
related_prs: []
---

# Dependency audit remediation QA verification

## Summary

Package CIを失敗させたdev tooling advisoryを、監査範囲を変えずpatched dependencyへ更新した。Pandaを1.11.5、markdownlint-cli2を0.23.2へ更新し、通常のupstream rangeでは安全版へ到達できない`@hono/node-server`、`fast-uri`、`brace-expansion`、`postcss`だけをroot overrideで固定した。full auditとruntime-only auditはいずれも0件で、Node 22 / 24 × React 18 / 19のPackage CI相当matrixが成功した。

## Verification Verdict

Verdict: PASS

## Commands Run

| Command / Test | Result | Notes |
| --- | --- | --- |
| `date --iso-8601=seconds` | PASS | 2026-07-28 JSTを確認。 |
| `npm ci --ignore-scripts` | PASS | lockfileから705 packageを再現し、install時audit 0件。 |
| `npm run panda` | PASS | 155 filesから`styled-system/styles.css`を生成。 |
| `npm audit --audit-level=low` | PASS | full dev treeを含め0 vulnerabilities。 |
| `npm audit --omit=dev --audit-level=low` | PASS | public runtime treeも0 vulnerabilities。 |
| `npm run release:check` | PASS | typecheck / lint / build / packed consumer / Ladle / audit / docs / publint / ATTWが成功。 |
| Node 24 + React 18.3.1 Package CI相当cell | PASS | Panda、typecheck、lint、build、Ladle 72 stories、audit 0件。 |
| Node 24 + React 19.2.7 Package CI相当cell | PASS | canonical release gateとpacked React 18/19 consumer verificationを含め成功。 |
| Node 22.23.1 + React 18.3.1 Package CI相当cell | PASS | Volta Node 22 / npm 10.9.8でPanda、typecheck、lint、build、Ladle、audit成功。 |
| Node 22.23.1 + React 19.2.7 Package CI相当cell | PASS | Volta Node 22 / npm 10.9.8で同じgateが成功。 |
| `npm ls ... --all` | PASS | Hono 2.0.12、fast-uri 3.1.4、brace-expansion 5.0.8、PostCSS 8.5.23、js-yaml 5.2.2を確認。 |
| Hono / MCP ESM import smoke | PASS | overridden Honoの`serve` exportとMCP server moduleをload。 |
| `npm run docs:check` | PASS | markdown、TODO、Intent、QA、links、validator fixtures、workflow smokeがerror 0。 |
| public package contract field comparison | PASS | dependencies、peers、exports、files、sideEffects、engines、entrypointsに差分なし。 |
| `git diff --check` | PASS | whitespace error 0。 |

## Regression Test Evidence

- `scripts/verify-package.mjs`のPanda patched baseline assertionを`AC-005`へ接続し、古いdirect rangeへ戻る変更を検出する。
- `npm ci`後のfull auditとPackage CIの既存`npm run audit` stepが、脆弱versionへ戻るlockfileを失敗として検出する。
- packed verifierは397 files、約10.46 MBのtarballとReact 18 / 19のESM/CJS/types/Vite/Next consumerを検証した。
- Ladle verifierは全matrixでfresh metadataと72 storiesを確認した。

## Automated Test Results

- canonical release gate、full audit、runtime-only audit、docs gateはすべてexit 0。
- Node 22 / 24 × React 18 / 19の4 cellでPanda generation、typecheck、lint、build、Ladle artifact、auditが成功した。
- packed consumer verifier、publint、ATTW、public contract field comparisonが成功した。

## Manual QA Results

- dependency version diffをadvisory経路と照合し、direct patchまたはpatched transitive versionで説明できることを確認した。
- workflow、runtime dependency、peer、exports、artifact allowlist、CI permissionsに差分がないことを確認した。
- user-facing componentとvisual behaviorは変更していないため、browser visual QAはnot applicableとした。

## Acceptance Criteria Coverage

- AC-001: PASS。full dependency treeでlow severity以上0件。
- AC-002: PASS。canonical release gateと全matrix相当cellが成功。
- AC-003: PASS。Package CI workflowを変更せず、Node 22 / 24 × React 18 / 19とaudit failure propagationを維持。
- AC-004: PASS。public runtime dependency、peer contract、exports、artifact allowlistは不変。
- AC-005: PASS。force downgradeを使わず、direct patchとadvisory対象overrideだけを更新。
- AC-006: PASS。fresh `npm ci`後にcanonical auditが0件で、workflowのaudit stepも常時実行のまま。

## Decision Conformance

- DEC-001: PASS。audit script、severity、dev dependency範囲、Package CI stepを変更していない。
- DEC-002: PASS。direct packageはcompatible patch、overrideはupstream range gapの4 packageへ限定した。lockfileの追加差分はPanda / markdownlint patchの推移依存で説明できる。
- DEC-003: PASS。public package contract fieldsとcomponent sourceを変更していない。

## Invariant Coverage

- INV-001: PASS。`continue-on-error`、audit omit、threshold変更、workflow差分なし。
- INV-002: PASS。runtime dependencies、React peers、exports、artifact allowlistに差分なし。

## High-risk Review

- Rollback / recovery: manifest、lockfile、package verifier assertionをrevertすればrepository状態は復元する。ただしadvisory failureは再発する。
- Data safety: 永続data、registry state、remote repositoryを変更していない。
- Security: full auditとruntime-only auditの双方を実行し、override先がfirst patched version以上であることを確認した。
- Scope: `npm audit fix --force`、audit policy変更、npm publish、commit、push、workflow rerunを行っていない。

## Deferred / Not Covered

- GitHub Actionsのremote rerunは未実施。localでworkflowと同じNode / React matrixとcommandを実行した。
- Panda MCP serverの長時間通信sessionは起動していない。CLI command discovery、Hono serve export、MCP server module load、通常のPanda generationでoverride compatibilityを確認した。

## Residual Risks

None

## Follow-up TODOs

- None。Panda MCPまたはMCP SDKがpatched Hono / PostCSS rangeを通常解決するreleaseを公開した場合、override削除を別dependency maintenanceとして検討する。

## Agent Misbehavior Checks

- auditを無効化・縮小せず、failure maskingを追加していない。
- advisoryと無関係なdirect dependency、runtime code、CI permissionsを変更していない。
- secret、credential、個人情報を読み書きしていない。
- npm publish、git commit、push、GitHub Actions rerunへscopeを拡張していない。
