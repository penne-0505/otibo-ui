---
title: "QA Test Plan: Dependency baseline and peer contract upgrade"
status: active
draft_status: n/a
qa_status: planned
risk: High
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/plan/Pkg/dependency-baseline-upgrade/plan.md"
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Dependency baseline and peer contract upgrade`

## Source of Intent

- TODO: `Pkg-Chore-10`
- Plan: `_docs/plan/Pkg/dependency-baseline-upgrade/plan.md`
- Intent: `_docs/intent/Pkg/dependency-baseline-upgrade/decision.md`

## Quality Goal

dependency major migration後も、consumer向けpackage contract、React 18 / 19互換、Panda生成物、component interaction、publish artifactを維持し、fresh checkoutとCIがfailureを正しく検出できる状態にする。

## Acceptance Criteria

- AC-001: fresh checkout相当の`npm ci`でPanda CSSが生成され、Ladle buildが実storyを持つ。
- AC-002: Panda 1 / Base UI stableへ完全移行し、legacy package参照がない。
- AC-003: React 18 / 19の両方でtypecheck / build / Ladle artifact verificationが成功する。
- AC-004: Biome 2.5.3でlintが成功する。
- AC-005: Node / React matrix、高severity audit、package build、Ladle artifactをCIが検証する。
- AC-006: package version、README、reference、pack artifact、docs validationが新contractと一致する。

## Intent-derived Invariants

- INV-001: `@base-ui-components/react`を残さない。
- INV-002: Reactはpeerのまま18 / 19を許可し、bundleへ内包しない。
- INV-003: clean generationとLadle artifact freshness / story countを再現・検証できる。
- INV-004: ESM/CJS/types/Panda buildinfoのpackage export構造を維持する。
- INV-005: CIはmatrix failureを無視せず、不要なpermissions / secretsを持たない。
- INV-006: TypeScript 5.9 / Vite 6 / Gen Interface JP 0.6.2のscope boundaryを守る。

## Risk Assessment

- Risk level: High
- Risk rationale: public peer contract、consumer migration、dependency security、CI変更を含む。
- Regression risk: Base UI stableのref型 / interaction、Panda codegen / buildinfo、React 18互換、Biome mechanical diff。
- Data safety risk: 永続dataを扱わない。npm publishを行わないためregistry rollbackは不要。
- Security / privacy risk: external inputやsecretを追加しない。high auditをgateにする。
- UX risk: popup focus、form control、selection、toast等のheadless primitive挙動がdependency更新で変わる可能性がある。
- Agent misbehavior risk: CI failureを`continue-on-error`やshell pipelineで覆う、未実行matrixをPASS扱いする、npm publishまで拡張する危険がある。

## Test Strategy

- Unit: `scripts/verify-ladle-build.mjs`がfresh `meta.json`と1件以上のstoryを要求する。
- Integration: current workspaceと一時React 18 / 19環境でtypecheck / build / Ladle buildを実行する。
- E2E: local Ladleをbrowserで開き、Dialog / Select / Checkbox / Tabs等の代表操作とconsole error不在を確認する。
- Manual QA: package.json、lockfile、CI matrix、README、reference、Base UI型修正をreviewする。
- Validator / static check: Biome、TypeScript、legacy grep、npm ls、npm audit、npm pack、docs validators。
- Diff review: Biomeの53-file mechanical changeにbehavior変更が混ざっていないか、CIにfailure maskingや不要権限がないか確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | fresh installでCSS / story artifactを生成 | integration | fresh tempで`npm ci`、`npm run ladle:build` | `styled-system/styles.css`が存在しstory count > 0 | verified |
| AC-002 | TODO | Panda 1 / Base UI stable完全移行 | static / integration | `npm ls --depth=0`、legacy `rg`、`npm run build` | expected version、legacy参照0、build成功 | verified |
| AC-003 | TODO | React 18 / 19互換 | integration | temporary matrixでtypecheck / build / verify:ladle | 両versionで成功 | verified |
| AC-004 | TODO | Biome 2 lint | static | `npm run lint` | diagnostics 0 | verified |
| AC-005 | TODO | CI matrix / audit / artifact gate | diff / static | `.github/workflows/package-ci.yml`、`npm audit --audit-level=high` | matrixあり、high 0、failure maskingなし | verified |
| AC-006 | TODO | docs / package / pack同期 | validator | `npm pack --dry-run --ignore-scripts --json`、docs validatorの変更scope照合 | allowlist artifactと新規docsのvalidator error 0 | verified |
| INV-001 | intent | legacy Base UI参照0 | static | runtime code / config / README / DesignSystem reference / package metadataを`rg` | matchなし | verified |
| INV-002 | intent | React peer / external維持 | diff / bundle | `package.json`、`tsup.config.ts`、dist grep | peer range 18 / 19、bundleにReact本体なし | verified |
| INV-003 | intent | clean generation / artifact verifier | regression | fresh temp + verifier | stale / empty artifactでPASSしない | verified |
| INV-004 | intent | package export構造維持 | package | `npm run build`、`npm pack --dry-run --ignore-scripts --json` | ESM/CJS/types/buildinfoを含む | verified |
| INV-005 | intent | CI failureを覆わない | diff review | workflow grep / review | `continue-on-error`なし、permissions追加なし | verified |
| INV-006 | intent | scope boundary維持 | static | `npm ls typescript vite gen-interface-jp` | TS 5.9、Vite 6、font 0.6.2 | verified |

## Manual QA Checklist

- [x] Ladleに主要storyが表示される。
- [x] Dialog / popupのopen-closeとfocus returnが動作する。
- [x] Select / Checkbox / Tabsのkeyboardまたはclick操作が動作する。
- [x] browser consoleにReact hook / hydration / Base UI errorがない。
- [x] README install / requirementがpackage metadataと一致する。

## Regression Checklist

- [x] `dist/index.{js,cjs,d.ts}`と`dist/preset.{js,cjs,d.ts}`が生成される。
- [x] `dist/panda.buildinfo.json`が生成される。
- [x] `npm pack --dry-run`にallowlist外のsource / secret / generated previewが入らない。
- [x] React / React DOM / Base UI / Pandaをbundleへ内包しない。
- [x] Biome mechanical diff以外に意図しないcomponent API変更がない。

## High-risk Checklist

- [x] Rollback / recovery pathはnpm publish前のrepository revertで完結する。
- [x] Data safety: 永続data / secret / credentialを扱っていない。
- [x] Security / privacy: high auditとexternal input exposureを確認する。
- [x] Failure mode: consumer install failureとCI false-greenを検証する。

## Out of Scope

- TypeScript 6 / 7、Vite 8、Gen Interface JP 0.7。
- npm publishとconsumer repository変更。

## Open Questions

- なし。P2までの実施と`0.2.0` migration方針はユーザー確認済み。
