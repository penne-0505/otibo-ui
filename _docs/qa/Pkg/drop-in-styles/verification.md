---
title: "QA Verification: Drop-in compiled styles"
status: active
draft_status: n/a
qa_status: verified
risk: High
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
  - "_docs/plan/Pkg/drop-in-styles/plan.md"
  - "_docs/qa/Pkg/drop-in-styles/test-plan.md"
  - "_docs/qa/Pkg/release-contract-hardening/verification.md"
related_issues: []
related_prs: []
---

# QA Verification: `Drop-in compiled styles`

## Summary

`@otibo/ui` 0.3.0のcompiled CSS、Gen Interface JP 3ウェイト、公開exports、dependency ownershipを実装し、pack済みtarballを隔離consumerへinstallしてESM / CJS / TypeScript / Vite production buildを検証した。browser smokeでも実際のfont、reset、color、focus ring適用を確認した。

repository全体のdocs baselineも現行schemaへ修復し、formatter、front matter、TODO、link、QA、negative fixtureを含むdocs gateまで確認した。Next.js App Routerの隔離consumer buildも追加し、publish前のrepository gateに未検証項目は残っていない。

## Verification Verdict

Verdict: PASS

## Commands Run

```bash
npm install --package-lock-only --ignore-scripts
npm run check
npm run build
npm run typecheck
npm run lint
npm run test:package
npm run ladle:build
npm audit --audit-level=high
npm pack --json --ignore-scripts --pack-destination /tmp
git diff --check
scripts/check-docs.sh
deno run --allow-read scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
deno run --allow-read scripts/validate-qa.mjs _docs/qa/Pkg/drop-in-styles
deno run --allow-read scripts/validate-doc-links.mjs
```

Result:

```text
PASS build / typecheck / Biome / package integration / Ladle / audit-low / diff check
PASS targeted QA document validation
PASS repository docs gate
```

## Automated Test Results

| Command / Test | Result | Notes |
| --- | --- | --- |
| `npm run check` | PASS | final stateでtypecheck / lint / build / package integration / Ladleを連続実行 |
| `npm run build` | PASS | tsup ESM / CJS / declarationsと399,446 byteの`styles.css`を生成 |
| `npm run test:package` | PASS | 後続hardeningで397 files、10.45 MB、384 WOFF2、React 18 / 19 ESM / CJS / types / Vite / Nextへ拡張 |
| `npm run typecheck` | PASS | TypeScript source errorなし |
| `npm run lint` | PASS | Biome 132 files |
| `npm run ladle:build` | PASS | 56 stories、11.66 MiB artifact |
| `npm audit --audit-level=low` | PASS | tsup配下esbuildを0.28.1へoverrideし0 vulnerabilities |
| `git diff --check` | PASS | whitespace errorなし |
| `scripts/check-docs.sh` | PASS | Biome formatter、全docs validator、negative fixtures成功 |
| targeted `validate-qa` | PASS | new test-plan / verificationのcanonical structureを確認 |

## Manual QA Results

| Checklist Item | Result | Notes |
| --- | --- | --- |
| README quickstart | PASS | install → root CSS import → component importの順で記載 |
| reset / migration disclosure | PASS | global effect、resetなしentrypoint不在、0.2.x migrationを明示 |
| package size disclosure | PASS | 10.45 MB tarballとUnicode range fetchを記載 |
| Browser page identity / non-blank | PASS | `http://127.0.0.1:4173/`、DOMに`button "otibo"` |
| Browser console | PASS | app errorなし。Electron host自身のCSP warningだけを確認 |
| Browser computed styles | PASS | Gen Interface JP 500 loaded、body margin 0、warm background / text、9px radius |
| Browser interaction | PASS | Button click後にactive elementとなり3px focus ringを確認 |

## Acceptance Criteria Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| AC-001 | PASS | public `./styles.css` exportと隔離Vite consumer build |
| AC-002 | PASS | 36 recipeの`["*"]`、全recipe class marker、reset / token assertion |
| AC-003 | PASS | 384 WOFF2、400 / 500 / 600限定、OFL、browser font load |
| AC-004 | PASS | preset exportなし、Panda dev-only、Base UI dependency、React peers |
| AC-005 | PASS | packed tarballからESM / CJS / tsc / CSS asset graph / Vite build成功 |
| AC-006 | PASS | README quickstart / reset / migration / font licenseを更新 |
| AC-007 | PASS | code / package / Ladle / audit / repository docs gateが全て成功 |

## Invariant Coverage

| ID | Result | Evidence |
| --- | --- | --- |
| INV-001 | PASS | consumer READMEとpackage dependencyにPanda要件なし |
| INV-002 | PASS | 全36 recipeのstatic all-variant configとcompiled class marker検査 |
| INV-003 | PASS | CSS URLは`./fonts/w/normal/{400,500,600}`だけ、browser font loaded |
| INV-004 | PASS | exportsは`.`と`./styles.css`だけ、tarballにpreset / build infoなし |
| INV-005 | PASS | manifest assertionと隔離installでBase UI自動導入 |
| INV-006 | PASS | CSS参照384assetとOFLがtarball / installed packageに存在 |
| INV-007 | PASS | READMEのGlobal styles / Migrating節 |

## Deferred / Not Covered

| ID | Reason | Follow-up |
| --- | --- | --- |
| npm registry | publishは本タスクscope外 | publishの明示依頼時に`npm publish`とregistry installを検証する |

## Residual Risks

None

## Follow-up TODOs

None
