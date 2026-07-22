---
title: "QA Verification: docs-driven template v1.0.0 migration"
status: active
draft_status: n/a
qa_status: partial
risk: High
qa_schema: 2
created_at: 2026-07-22
updated_at: 2026-07-22
references:
  - "_docs/intent/Workflow/docs-template-v1-migration/decision.md"
  - "_docs/plan/Workflow/docs-template-v1-migration/plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/test-plan.md"
  - "_docs/qa/Workflow/docs-template-v1-migration/inventory.tsv"
related_issues: []
related_prs: []
---

# QA Verification: `docs-driven template v1.0.0 migration`

## Summary

pre-v1 baseline B と owner-approved P を基準に v1.0.0 U を pathwise merge した。v1 validators、fixtures、hooks、paired skills、standards、templates、CI と root guidance は legacy-compatible に動作し、package/runtime/source diff はない。upstream-removed の 7 exact-B/U-absent path は deletion hook を迂回せず、1 archive、3 superseded canonical records、3 non-operational quarantine として解決した。

Compatibility migration: PASS。source-union 340 path と migration-created destination artifact 5 path は inventory に記録され、許容された resolution は apply=71、merge=12、keep=258、defer=4 である。別 disposition は archive=2、supersede=3、quarantine=6。4 defer は P に存在しない upstream lifecycle self-history であり、active tree に残った removal ではない。

Strict schema migration: DEFERRED。既存 project docs の一括 schema conversion は実施していない。legacy compatibility は維持される。

Overall verification: PARTIAL。互換移行そのものではなく、package `release:check` の既存 npm audit baseline と、既に成功した packed-consumer test の冗長 rerun が `/tmp` ENOSPC で止まった点を別 residual として残す。

## Verification Verdict

Verdict: PARTIAL

## Commands Run

```bash
date '+%Y-%m-%d %H:%M:%S %Z'
git status --short --branch
git rev-parse HEAD
git -C /home/penne/dev/tools/templates/docs_driven_dev_template rev-parse 37f7198edd9e27f1c7270fb74ce2caf83dca27de
git -C /home/penne/dev/tools/templates/docs_driven_dev_template rev-parse 'refs/tags/v1.0.0^{}'
env -u DD_SCOPE_BASE -u DD_SCOPE_PATHS -u DD_SCOPE_DIFF_FILTER ./scripts/check-docs.sh
DD_SCOPE_BASE=d823baf77878693e46828ec423aaa8d444ec024f DD_SCOPE_DIFF_FILTER=ACMR ./scripts/check-docs.sh
npx markdownlint-cli2 "_docs/**/*.md" "_evals/**/*.md" README.md AGENTS.md TODO.md QUICKSTART.md "#_docs/archives/**" "#_docs/standards/templates/**"
npx biome format --write scripts/*.mjs
npx biome check --write --unsafe scripts/*.mjs
npm ci
npm run release:check
npm run docs:check
npm run lint:package
npm run typecheck
npm run build
npm run test:package
git diff --check
for skill in docs-cleanup docs-inventory docs-prep docs-template-migration implementation-prep post-implementation qa-prep qa-review test-maintenance; do cmp -s ".agents/skills/$skill/SKILL.md" ".claude/skills/$skill/SKILL.md" || { echo "DIFF $skill"; exit 1; }; done
test ! -e .agents/skills/frontend-design/SKILL.md
test ! -e .claude/skills/frontend-design/SKILL.md
test ! -e _docs/standards/jj_workflow.md
test "$(git -C /home/penne/dev/tools/templates/docs_driven_dev_template show 37f7198edd9e27f1c7270fb74ce2caf83dca27de:.agents/skills/frontend-design/SKILL.md | git hash-object --stdin)" = "$(git hash-object .template-legacy/frontend-design/agents-skill.md)"
test "$(git -C /home/penne/dev/tools/templates/docs_driven_dev_template show 37f7198edd9e27f1c7270fb74ce2caf83dca27de:.claude/skills/frontend-design/SKILL.md | git hash-object --stdin)" = "$(git hash-object .template-legacy/frontend-design/claude-skill.md)"
awk -F '\t' 'NR>6 { if ($4 !~ /^(apply|merge|keep|remove|defer)$/ || $5 == "") exit 1 }' _docs/qa/Workflow/docs-template-v1-migration/inventory.tsv
git diff --name-only d823baf77878693e46828ec423aaa8d444ec024f -- package.json package-lock.json src assets panda.config.ts preset.ts tsconfig.json tsup.config.ts vite.config.ts .github/workflows/package-ci.yml scripts/build-package-styles.mjs scripts/lint-package.mjs scripts/verify-ladle-build.mjs scripts/verify-package.mjs
```

Result:

```text
B=37f7198edd9e27f1c7270fb74ce2caf83dca27de
U=v1.0.0@f71e9ab20466ea2972158334261f5ae2b2265754
P=d823baf77878693e46828ec423aaa8d444ec024f (clean)
unscoped/scoped docs wrapper / full markdownlint / validators / fixtures / hooks / smoke / paired active skills: PASS
active legacy-path absence / upstream B blob preservation: PASS
inventory resolutions: apply=71, merge=12, keep=258, defer=4 (345 total); dispositions: archive=2, supersede=3, quarantine=6
source-union resolutions: apply=71, merge=12, keep=253, defer=4 (340 total); dispositions: archive=1, supersede=3, quarantine=3
final migration artifact paths missing from inventory: 0
typecheck / build / first packed consumer run / Ladle 72 stories / publint / ATTW: PASS
release:check: stopped at npm audit (7 existing advisories)
second packed consumer run: stopped at ENOSPC after the first run had passed
runtime/package preservation diff: empty
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `env -u DD_SCOPE_BASE -u DD_SCOPE_PATHS -u DD_SCOPE_DIFF_FILTER ./scripts/check-docs.sh` | PASS | Full unscoped markdownlint, validators, fixtures, hook tests and smoke checks passed. |
| `DD_SCOPE_BASE=P DD_SCOPE_DIFF_FILTER=ACMR ./scripts/check-docs.sh` | PASS | Scoped validation covers modified/added/copied/renamed migration docs. |
| Full `markdownlint-cli2` command | PASS | 128 in-scope Markdown files, 0 errors. |
| Inventory resolution schema | PASS | All 345 rows use `apply`, `merge`, `keep`, `remove`, or `defer`; 11 non-destructive dispositions are recorded separately. |
| Frontmatter pilot fixtures | PASS | Correct-type schema fields are accepted; wrong-type and generic unknown fields warn. |
| Paired active skill comparison | PASS | The nine retained `.agents` / `.claude` paired skills are byte-identical; `frontend-design` is absent from both loader paths. |
| Legacy-path quarantine / preservation | PASS | Active `jj` standard and paired legacy skills are absent; the two skill blobs match upstream B byte-for-byte in `.template-legacy/`. |
| `npm run typecheck` | PASS | Exit 0. |
| `npm run build` | PASS | ESM/CJS/DTS/CSS build succeeded. |
| First `npm run test:package` through `release:check` | PASS | React 18/19 ESM/CJS/types/Vite/Next consumers verified. |
| `npm run ladle:build` through `release:check` | PASS | 72 stories verified. |
| `npm run lint:package` | PASS | publint and ATTW reported no problems. |
| `npm audit --audit-level=low` through `release:check` | FAIL | 7 existing dependency advisories; package and lockfile are unchanged. |
| Second `npm run test:package` | BLOCKED | Host `/tmp` reached ENOSPC during consumer install; earlier canonical run passed. |
| Runtime/package preservation diff | PASS | No changed path in package metadata, source, assets, package CI, build or publish helpers. |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| B/U/P provenance | PASS | Exact full SHAs and tag resolution recorded. |
| Inventory classification | PASS | B..U, B..P and migration artifacts are listed path-by-path; every resolution uses the five-value contract and non-destructive handling is a separate disposition. |
| Upstream lifecycle self-history | PASS | New lifecycle-self-audit docs were not imported; hook anchors point to project DEC-006. |
| Obsolete path handling | PASS | Seven exact-B/U-absent/no-project-reference paths are inactive without deletion-hook bypass: 1 archive, 3 superseded records, 3 quarantines. |
| Compatibility vs strict schema | PASS | Compatibility PASS and strict DEFERRED are reported separately. |
| Original checkout / main / remotes | PASS | Original checkout remains on `dev`; no push or main ref update was performed. |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | Exact B/U/P and clean cutoff are recorded in the ledger and this verification. |
| AC-002 | PASS | Inventory reconciliation covers the union and migration-created artifacts. |
| AC-003 | PASS | v1 distribution is merged; all seven upstream-removed retained paths have non-destructive, non-operational resolutions. |
| AC-004 | PASS | Four frontmatter fixtures cover accepted and warning behavior. |
| AC-005 | PASS | Docs CI uses P with `DD_SCOPE_DIFF_FILTER=ACMR`; migration skill commands name the upstream checkout. |
| AC-006 | PASS | Lock was created after compatibility checks; strict migration is separately DEFERRED. |
| AC-007 | PASS | New self-history is absent and old exact-B Template paths are archived, superseded, or quarantined without deleting them. |
| AC-008 | PARTIAL | Docs/package checks pass except baseline audit advisories and an ENOSPC rerun. |
| AC-009 | PASS | Runtime/package preservation path diff is empty. |

## Decision Conformance

| ID | Result | Why the implementation remains aligned |
| --- | --- | --- |
| DEC-001 | PASS | Every union path has one allowed inventory resolution and rationale; non-destructive disposition is recorded separately. |
| DEC-002 | PASS | New schema v2 docs coexist with unchanged legacy project docs. |
| DEC-003 | PASS | Exact lock was written only after compatibility validation. |
| DEC-004 | PASS | Runtime/package paths are unchanged and their gates were exercised. |
| DEC-005 | PASS | New self-history is excluded; retained legacy material cannot act as active standards, loaders, plans, or current QA instructions. |
| DEC-006 | PASS | Hook behavior is tested as a non-expanding guardrail. |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | Lock source/tag/full SHA match upstream `v1.0.0`. |
| INV-002 | PASS | Package/runtime/source preservation diff is empty. |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| AC-006 strict | Bulk schema conversion would rewrite project rationale without a separate semantic review. | Schedule a separate strict schema migration only if the owner wants it. |
| AC-008 audit | Existing dependency advisories are unrelated to docs migration; dependency changes are out of scope. | Address advisories in a package dependency task. |
| AC-008 rerun | `/tmp` reached ENOSPC during a redundant second packed-consumer run. | Re-run after sufficient temporary capacity if a second independent pass is required. |

## Residual Risks

- Canonical `release:check` remains red at the existing npm audit gate.
- Strict schema v2 semantics have not been applied to legacy project Intent/QA docs.
- The quarantined historical copies remain pending owner-authorized deletion, but their paths and banners prevent active-loader or active-standard use.

## Follow-up TODOs

- Package dependency advisories require a separate owner-scoped task; they are not changed by this migration.
- Strict schema conversion remains a separate owner-approved task if it is desired.
