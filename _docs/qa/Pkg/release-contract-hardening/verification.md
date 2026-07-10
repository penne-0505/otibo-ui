---
title: "QA Verification: Release contract hardening"
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
  - "_docs/plan/Pkg/release-contract-hardening/plan.md"
  - "_docs/qa/Pkg/release-contract-hardening/test-plan.md"
related_issues: []
related_prs: []
---

# QA Verification: `Release contract hardening`

## Summary

0.3.0のCJS / ESM conditional type exportsとCSS declarationをpacked consumerで検証し、React 18 / 19、Vite、Next.js、CommonJS TypeScript、strict CSS side-effect importが成功した。release gateをlocal、CI、`prepublishOnly`で共通化し、`npm publish --dry-run`配下でもnested pack / installが実行されるようdry-run環境の継承を明示的に分離した。

## Verification Verdict

Verdict: PASS

## Commands Run

```bash
npm run lint:package
npm run docs:check
npm run release:check
npm_config_dry_run=true npm run test:package
npm_config_dry_run=true npm run lint:package
npm publish --dry-run --access public
git diff --check
rg -l -I '(AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)' dist README.md CHANGELOG.md package.json
rg -l -I '/home/penne/|/Users/[^/]+/' dist README.md CHANGELOG.md package.json
```

Result:

```text
PASS release:check and final publish dry-run
PASS package consumer and package lint under npm_config_dry_run=true
PASS secret and absolute local path scans: 0 matches
PASS diff whitespace check
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm run release:check` | PASS | typecheck、Biome、build、packed consumer、Ladle、audit、docs、package lintを連続実行 |
| `npm run test:package` | PASS | 397 files、10.45 MB、384 WOFF2、React 18 / 19 ESM / CJS / types / Vite / Next |
| `npm run lint:package` | PASS | publint 0 diagnostics、ATTW root entryは全resolution mode green |
| `npm run docs:check` | PASS | markdownlint 0 errors、Biome、Deno validators、negative fixtures |
| `npm publish --dry-run --access public` | PASS | `prepublishOnly`から全gateを再実行し、397-file tarballを生成 |
| `npm audit --audit-level=low` | PASS | 0 vulnerabilities |
| `npm run ladle:build` | PASS | 56 stories、11.66 MiB artifact |
| `git diff --check` | PASS | whitespace errorなし |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| README / CHANGELOG migration | PASS | install、CSS import、flat export migration、breaking changesを記載 |
| tarball contents | PASS | CHANGELOG、CSS declaration、OFL、384 WOFF2を含み、preset / Panda build infoを含まない |
| package diagnostics | PASS | component rootはpublint / ATTWとも問題なし。CSS entryは実consumerで検証 |
| secret / local path | PASS | high-confidence secret patternとabsolute home pathは0件 |
| workflow parity | PASS | Docs CIは`docs:check`、Package CIはcanonical cellでconsumer / package lintを実行 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | packed `.cts` consumerがNode16 module resolutionでtypecheck成功 |
| AC-002 | PASS | `noUncheckedSideEffectImports`有効のCSS importがtypecheck成功 |
| AC-003 | PASS | React 18 / 19 consumerとVite / Next production build成功 |
| AC-004 | PASS | publint / ATTW root entry diagnostics 0件 |
| AC-005 | PASS | `docs:check` / `release:check`をCIとprepublishから再利用 |
| AC-006 | PASS | final `release:check`とpublish dry-runがexit 0 |
| AC-007 | PASS | verifierとPackage CIにCJS / CSS / React matrixを固定 |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | ESMは`.d.ts`、CJSは`.d.cts`へ解決 |
| INV-002 | PASS | `./styles.css`がCSS assetとdeclarationをexport |
| INV-003 | PASS | flat API、compiled CSS、React 18 / 19をpacked artifactから検証 |
| INV-004 | PASS | Docs CIがrepositoryの`npm run docs:check`を直接実行 |
| INV-005 | PASS | dry-runの`prepublishOnly`から全release gateを実行 |
| INV-006 | PASS | package lint toolsはexact versionでlockfileに記録 |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| npm registry publish | 本taskはdry-runまで。実publishは別の明示指示で行う | publish時にregistry versionとclean installを確認 |

## Residual Risks

None

## Follow-up TODOs

None
