---
title: "QA Verification: Flat-only component exports"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/namespace-export-design/decision.md"
  - "_docs/plan/Pkg/namespace-export-design/plan.md"
  - "_docs/qa/Pkg/namespace-export-design/test-plan.md"
  - "_docs/qa/Pkg/release-contract-hardening/verification.md"
related_issues: []
related_prs: []
---

# QA Verification: `Flat-only component exports`

## Summary

22の旧namespace objectを0.3.0のpublic rootから直接削除し、公開slotをflat named exportへ統一した。source、56 Ladle stories、README、37 component referenceを同じ契約へ移行し、packed tarballを使う隔離Vite / Next.js App Router consumerでproduction buildを確認した。

## Verification Verdict

Verdict: PASS

## Commands Run

```bash
npm run typecheck
npm run check
npm run test:package
npm audit --audit-level=low
./scripts/check-docs.sh
rg -n '^export const (Accordion|Avatar|Breadcrumb|Card|Combobox|Dialog|Field|Menu|Meter|NavigationMenu|NumberField|Pagination|Popover|PreviewCard|Progress|ScrollArea|SegmentedControl|Select|Table|Tabs|Toast|Tooltip)\\s*=' src
rg -n '\\b(Accordion|Avatar|Breadcrumb|Card|Combobox|Dialog|Field|Menu|Meter|NavigationMenu|NumberField|Pagination|Popover|PreviewCard|Progress|ScrollArea|SegmentedControl|Select|Table|Tabs|Toast|Tooltip)\\.[A-Z]' src _docs/reference/DesignSystem README.md
```

Result:

```text
PASS typecheck / Biome / build / package integration / Ladle / audit / docs validators
PASS 22 namespace export objects: 0件
PASS source / referenceの旧namespace usage: 0件
NOTE READMEの1件は0.2.x migrationのbefore例として意図的に保持
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm run check` | PASS | typecheck、Biome、ESM/CJS/types build、package test、Ladle 56 stories |
| `npm run test:package` | PASS | 後続hardeningで397 files、10.45 MB、旧namespace不在、全flat export、React 18 / 19 Vite / Next buildへ拡張 |
| `npm audit --audit-level=low` | PASS | tsup配下esbuildを0.28.1へoverrideし0 vulnerabilities |
| `./scripts/check-docs.sh` | PASS | formatter、front matter、TODO、links、QA、negative validator fixtures |
| namespace export search | PASS | source export object 0件 |
| namespace usage search | PASS | source / reference 0件。README migration before例のみ |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| README quickstart | PASS | flat named importだけで完結 |
| 0.2.x migration | PASS | before / afterとdirect removalを明示 |
| Intent inventory | PASS | 実際の22 namespaceと公開flat slotが一致 |
| component reference | PASS | wrapper内部のPortal / Indicator等をpublic APIとして露出しない例へ更新 |
| runtime behavior diff | PASS | namespace object削除、alias export、usage renameに限定。recipe class / wrapper behaviorは維持 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | Intentに22 namespaceとflat export対応表 |
| AC-002 | PASS | root / source / stories / README / 37 referencesをflat-only化 |
| AC-003 | PASS | README migrationとPlan / Intentのpre-1.0 direct removal判断 |
| AC-004 | PASS | artifact export assertion、Vite / Next App Router production build |
| AC-005 | PASS | full `npm run check`、audit-low、docs gate |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | packed ESM / CJSの22 key不在をassert |
| INV-002 | PASS | Intent inventory全flat export存在をassert |
| INV-003 | PASS | canonical source / referenceに旧dot usageなし |
| INV-004 | PASS | Button / ChipGroup / RadioGroup / ToggleGroup / InlineEdit / Sliderをassert |
| INV-005 | PASS | Vite / Nextが同じField flat importでbuild |
| INV-006 | PASS | READMEに0.2.x migrationとbreaking理由 |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| npm registry publish | 本taskのscope外 | publishの明示依頼時に実行 |

## Residual Risks

None

## Follow-up TODOs

None
