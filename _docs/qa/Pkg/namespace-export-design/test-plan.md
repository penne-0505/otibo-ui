---
title: "QA Test Plan: Flat-only component exports"
status: active
draft_status: n/a
qa_status: planned
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/namespace-export-design/decision.md"
  - "_docs/plan/Pkg/namespace-export-design/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Flat-only component exports`

## Source of Intent

- TODO: `Pkg-Enhance-8`
- Plan: `_docs/plan/Pkg/namespace-export-design/plan.md`
- Intent: `_docs/intent/Pkg/namespace-export-design/decision.md`

## Quality Goal

全compound componentがflat exportだけで欠落なく構成でき、Vite / Next.js App Routerとrepository内exampleが同じAPIを使う状態を保証する。

## Acceptance Criteria

- AC-001: 22 namespaceのinventoryとdirect removal判断が記録される。
- AC-002: public code、stories、README、component referenceがflat-onlyになる。
- AC-003: 0.2.x migrationとSemVer判断が記載される。
- AC-004: package artifactでexport contractを検査しVite / Next buildが成功する。
- AC-005: repository標準checkとdocs validatorsが成功する。

## Intent-derived Invariants

- INV-001: 旧namespace名がpublic rootにない。
- INV-002: 全inventory slotのflat exportがpublic rootにある。
- INV-003: canonical source / docsにdot notationがない。
- INV-004: ordinary component / group exportは維持される。
- INV-005: Vite / Nextが同じflat usageでbuildできる。
- INV-006: migrationとbreaking理由が公開される。

## Risk Assessment

- Risk level: Medium
- Risk rationale: pre-1.0 public APIを破壊的に変更するが、data / security / external serviceは扱わない。
- Regression risk: slot export漏れ、story/docs残存、component behavior変化、Next build failure。
- Data safety risk: なし。
- Security / privacy risk: なし。
- UX risk: import数増加とmigration理解不足。
- Agent misbehavior risk: namespaceを互換目的で残さない。publish / commit / pushは別途明示依頼まで実行しない。

## Test Strategy

- Unit / static: `verify-package.mjs`でflat export集合とnamespace不在をassertする。
- Integration: packed tarballをVite / Next.js App Router consumerでbuildする。
- E2E: Ladle production buildで全storyを検証する。
- Manual QA: README migrationとcomponent reference例をreviewする。
- Validator / static check: typecheck、Biome、ripgrep残存検索、docs validators、npm audit。
- Diff review: runtime logic / recipe classの非意図変更がないことを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | 22 namespace inventory | diff review | Intent inventory | source object数と一致 | planned |
| AC-002 | TODO | 全surfaceをflat-only化 | static | `rg` + typecheck | dot notation / namespace export 0件 | planned |
| AC-003 | TODO | direct migration | diff review | README / Intent | 0.2.x migrationと0.3.0理由 | planned |
| AC-004 | TODO | artifact / framework compatibility | integration | `npm run test:package` | Vite / Next builds成功 | planned |
| AC-005 | TODO | repository checks | validator | `npm run check`, `scripts/check-docs.sh` | exit 0 | planned |
| INV-001 | intent | namespace不在 | static | `verify-package.mjs` | 22 key不在 | planned |
| INV-002 | intent | flat slot完全性 | static | `verify-package.mjs` | expected export全件存在 | planned |
| INV-003 | intent | dot notation残存なし | static | `rg` | canonical path 0件 | planned |
| INV-004 | intent | ordinary exports維持 | static | `verify-package.mjs` | Button / ChipGroup等存在 | planned |
| INV-005 | intent | Vite / Next同一usage | integration | package fixture builds | 両build exit 0 | planned |
| INV-006 | intent | migration disclosure | diff review | README | flat対応例あり | planned |

## Manual QA Checklist

- [ ] README quickstartがflat importだけで完結する。
- [ ] migrationが`Namespace.Slot` → `NamespaceSlot`として理解できる。
- [ ] component referenceのAPI例が実際のexport名と一致する。

## Regression Checklist

- [ ] component recipe / runtime behaviorに非意図変更がない。
- [ ] Ladle 56 storiesがbuildできる。
- [ ] types / ESM / CJS exportsが解決する。
- [ ] drop-in styles / font asset検証が維持される。

## Out of Scope

- npm registry publish
- component visual redesign
- 1.0以降のSemVer policy全般

## Open Questions

- なし。flat-only direct removalはユーザー合意済み。
