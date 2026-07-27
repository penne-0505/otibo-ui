---
title: "QA Test Plan: Dependency audit remediation"
status: active
draft_status: n/a
qa_status: planned
risk: High
qa_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/plan/Pkg/dependency-audit-remediation/plan.md"
  - "_docs/intent/Pkg/dependency-audit-remediation/decision.md"
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
related_issues: []
related_prs: []
---

# QA Test Plan: Dependency audit remediation

## Source of Intent

- TODO: `Pkg-Bug-16`
- Plan: `_docs/plan/Pkg/dependency-audit-remediation/plan.md`
- Intent: `_docs/intent/Pkg/dependency-audit-remediation/decision.md`

## Decision Review Scope

- `DEC-001`: canonical low audit gateを維持する。
- `DEC-002`: direct patch updateを優先し、overrideをrange gapへ限定する。
- `DEC-003`: public package contractを変更しない。

## Quality Goal

新規advisoryをpatched dependencyで解消しながら、CI/release gate、Panda authoring、React互換、consumer package contractを維持する。

## Acceptance Criteria

- AC-001: `npm audit --audit-level=low`が0件で成功する。
- AC-002: typecheck、lint、package build、packed consumer、Ladle buildが成功する。
- AC-003: Node 22 / 24 × React 18 / 19のCI matrixとlow audit failure propagationを維持する。
- AC-004: runtime dependency、peer contract、exports、publish artifactを変更しない。
- AC-005: patched versionへの限定更新とし、force downgradeを採用しない。
- AC-006: fresh installとPackage CIのcanonical auditが脆弱versionへの回帰を検出する。

## Intent-derived Invariants

- INV-001: dev dependencyを含むlow audit failureを許容設定で覆わない。
- INV-002: public runtime dependency、React peer range、exports、artifact allowlistを変更しない。

## Risk Assessment

- Risk level: High
- Risk rationale: security advisory、dependency resolution、CI/release gateに関わり、推移依存のmajor overrideを含む。
- Regression risk: Panda codegen、MCP経路のmodule resolution、markdownlint、package/Ladle build。
- Security / privacy risk: patched version未満の残存、auditのfalse-green、外部registry metadataの誤読。secretや個人情報は扱わない。
- Data safety risk: 永続dataを扱わず、manifest / lockfile / docs以外を変更しない。
- Recovery / rollback: manifestとlockfileをrevertして復元できるが、audit failureは再発する。
- Agent misbehavior risk: `npm audit fix --force`、監査の無効化、無関係なdependency更新、publishまでscope拡張する危険がある。

## Test Strategy

- Static: manifest / lockfileのdirect version、override、resolved version、runtime contract差分を確認する。
- Security: full dependency treeと`--omit=dev`のauditを実行する。
- Integration: Panda generation、typecheck、lint、build、packed consumer、Ladle build、package lintを実行する。
- Compatibility: Package CIと同じNode / React matrixを可能な範囲でlocal再現する。
- Docs: canonical docs gateでTODO、Intent、QA referencesとfrontmatterを検証する。
- Diff review: failure masking、permissions、runtime contract、scope外更新、secret混入がないことを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | low audit 0件 | security | `npm audit --audit-level=low` | exit 0、0 vulnerabilities | verified |
| AC-002 | TODO | authoring / package regressionなし | integration | `npm run release:check` | canonical gate exit 0 | verified |
| AC-003 | TODO | Node / React matrix維持 | integration / diff | Package CI相当matrix、`.github/workflows/package-ci.yml` | 全cell成功、workflow差分なし | verified |
| AC-004 | TODO | public contract不変 | package / diff | `npm pack --dry-run --ignore-scripts --json`、manifest diff | artifact allowlistとruntime fields不変 | verified |
| AC-005 | TODO | patched versionへの限定更新 | static | `npm ls --all`、lockfile diff | advisory経路がfirst patched version以上、force downgradeなし | verified |
| AC-006 | TODO | lockfile regressionを再検出 | regression | fresh `npm ci`、Package CI audit step | fresh install後もaudit 0件、stepが常時実行 | verified |
| INV-001 | DEC-001 | audit failure maskingなし | static | scripts / workflow diff | threshold、対象、failure propagation不変 | verified |
| INV-002 | DEC-003 | runtime / peer / exports不変 | static / package | `package.json`、pack verifier | dev dependency / override以外のcontract差分なし | verified |

## Manual QA Checklist

- [x] dependency diffの各変更をadvisoryまたはdirect patch updateへ説明できる。
- [x] Pandaのmajor override後もgenerationとLadle artifactが成功する。
- [x] npm audit出力にignored / omitted advisoryがない。
- [x] npm publish、commit、push、workflow rerunを行っていない。

## Regression Checklist

- [x] Panda generated CSSとtypesを再生成できる。
- [x] React 18 / 19 packed consumersが成功する。
- [x] ESM / CJS / types / CSS exportsを維持する。
- [x] markdownlintとdocs validatorsが成功する。
- [x] Package CI matrix、permissions、audit commandに変更がない。

## High-risk Checklist

- [x] Rollback / recovery pathを確認する。
- [x] Data safety: 永続dataとregistry stateを変更していない。
- [x] Security: first patched version、full audit、runtime-only auditを確認する。
- [x] Scope: force fix、audit緩和、無関係なupgrade、publishを行っていない。

## Out of Scope

- component、design token、runtime dependency、peer contractの変更。
- audit policy変更、Panda major migration、npm publish。

## Open Questions

- なし。overrideの継続可否はfull regressionとupstream rangeの実測で判断する。
