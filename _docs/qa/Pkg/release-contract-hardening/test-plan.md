---
title: "QA Test Plan: Release contract hardening"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
  - "_docs/plan/Pkg/release-contract-hardening/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Release contract hardening`

## Source of Intent

- TODO: `Pkg-Bug-12`
- Plan: `_docs/plan/Pkg/release-contract-hardening/plan.md`
- Intent: `_docs/intent/Pkg/release-contract-hardening/decision.md`

## Quality Goal

0.3.0の全公開entrypointとrelease workflowが、consumer module形式や実行場所に依存せず同じ契約を検証する。

## Acceptance Criteria

- AC-001: CommonJS TypeScriptでTS1479が再発しない。
- AC-002: strict CSS side-effect importでTS2307が再発しない。
- AC-003: React 18 / 19のpacked consumerがbuildできる。
- AC-004: publint / ATTWがcomponent rootをgreenと判定する。
- AC-005: local / CI / prepublish gateが一致する。
- AC-006: repositoryとpublish dry-runの全検査が成功する。
- AC-007: CJS型、CSS型、React 18 / 19 consumer検証が回帰テストとして残る。

## Intent-derived Invariants

- INV-001: ESMは`.d.ts`、CJSは`.d.cts`を解決する。
- INV-002: CSSはassetとdeclarationを同じsubpathから解決する。
- INV-003: React 18 / 19でflat APIとcompiled CSSが維持される。
- INV-004: Docs CIは`docs:check`を再利用する。
- INV-005: prepublishはaudit / docs / package lintを省略しない。
- INV-006: package lint toolはlockfileへ固定される。

## Risk Assessment

- Risk level: Medium
- Risk rationale: public package metadataとCI / publish workflowを変更する。
- Regression risk: condition順序、tarball file欠落、CIだけの失敗、test recursion。
- Data safety risk: 永続dataを扱わない。
- Security / privacy risk: tarballへsecret / absolute local pathを含めない。
- UX risk: install時のTypeScript errorとrelease note欠落。
- Agent misbehavior risk: localだけ修正してCIを残す、PASS verificationを未検証で維持する、publishまで拡張する。

## Test Strategy

- Static: manifest conditions、CI script参照、dependency重複を検査する。
- Integration: packed React 18 / 19 consumer、CJS / ESM TypeScript、Vite / Next build。
- Package lint: publint / ATTW。
- Docs: markdownlint、Biome、Deno validators、negative fixtures。
- Release: audit-low、`npm publish --dry-run`。
- Diff review: runtime component behaviorに変更がないことを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | CJS types | regression | `npm run test:package` | `.cts` typecheck exit 0 | verified |
| AC-002 | TODO | CSS types | regression | `npm run test:package` | strict CSS import exit 0 | verified |
| AC-003 | TODO | React peer range | integration | `npm run test:package` | React 18 / 19 consumer build | verified |
| AC-004 | TODO | package metadata | package lint | `npm run lint:package` | publint / ATTW exit 0 | verified |
| AC-005 | TODO | gate parity | diff / CI | package scripts / workflows | canonical scriptsを再利用 | verified |
| AC-006 | TODO | full release readiness | release | `npm run release:check` / publish dry-run | exit 0 | verified |
| AC-007 | TODO | regression retention | regression | `scripts/verify-package.mjs` / Package CI | required consumer matrix | verified |
| INV-001 | intent | module-kind declarations | TypeScript | packed `.mts` / `.cts` | correct declarations | verified |
| INV-002 | intent | CSS declaration | TypeScript / pack | strict import / file assertion | TS2307なし | verified |
| INV-003 | intent | React 18 / 19 | Vite / Next | packed consumers | build成功 | verified |
| INV-004 | intent | docs parity | static | `docs-ci.yml` | `npm run docs:check` | verified |
| INV-005 | intent | prepublish completeness | static | `package.json` | `release:check`参照 | verified |
| INV-006 | intent | tool reproducibility | dependency | lockfile | fixed tool versions | verified |

## Manual QA Checklist

- [x] README / CHANGELOGで0.3.0 breaking migrationを即座に確認できる。
- [x] package error diagnosticsが0件である。

## Regression Checklist

- [x] namespace exportが再追加されていない。
- [x] compiled CSS / 384 WOFF2 / OFLが維持される。
- [x] Ladle 56 storiesがbuildできる。
- [x] runtime component sourceに非意図変更がない。

## Out of Scope

- npm publish、git commit / push、tag作成。
- Node engine、font subset構成、global reset方針の変更。

## Open Questions

- なし。修正方針はpublish前監査結果から確定済み。
