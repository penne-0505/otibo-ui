---
title: "QA Test Plan: Drop-in compiled styles"
status: active
draft_status: n/a
qa_status: in-progress
risk: High
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
  - "_docs/plan/Pkg/drop-in-styles/plan.md"
related_issues: []
related_prs: []
---

# QA Test Plan: `Drop-in compiled styles`

## Source of Intent

- TODO: `Pkg-Enhance-11`
- Plan: `_docs/plan/Pkg/drop-in-styles/plan.md`
- Intent: `_docs/intent/Pkg/drop-in-styles/decision.md`

## Quality Goal

Pandaを知らないconsumerが、packaged artifactだけからotiboの既定component stylesとfontを再現でき、従来のcomponent APIとrepository内previewに回帰がないことを確認する。

## Acceptance Criteria

- AC-001: `@otibo/ui/styles.css`の一度のimportでcomponent stylesを利用できる。
- AC-002: reset、global styles、tokens、全36 recipeの全variantが生成される。
- AC-003: Gen Interface JP 400 / 500 / 600とlicenseが自己完結して配布される。
- AC-004: Panda / preset公開契約がなくなり、Base UIとReactのdependency種別が意図どおりになる。
- AC-005: pack tarballを使う隔離consumerでESM / CJS / types / CSS / font assetsが解決する。
- AC-006: READMEがquickstart、reset影響、migrationを説明する。
- AC-007: repositoryの全標準checkが成功する。

## Intent-derived Invariants

- INV-001: consumer導入手順にPandaのinstall / config / codegenが存在しない。
- INV-002: sourceで未使用のrecipe / variantもcompiled CSSから欠落しない。
- INV-003: font CSSに外部URLや400 / 500 / 600以外のweightが存在しない。
- INV-004: package exportsに`./preset`がなく、tarballにbuild infoがない。
- INV-005: React / React DOMはpeer、Base UIはdependency、Pandaとfont source packageはdev-onlyである。
- INV-006: tarball中のCSS参照先がすべてtarball内に存在する。
- INV-007: global resetとbreaking migrationが利用前に認識できる。

## Risk Assessment

- Risk level: High
- Risk rationale: 公開packageのentrypoint、dependency、CSS適用範囲を破壊的に変更する。
- Regression risk: variant欠落、font path破損、CSS tree-shaking、RSC / CJS / declaration export回帰。
- Data safety risk: 永続dataは扱わない。npm publishはscope外とし、既存versionを変更しない。
- Security / privacy risk: 外部font hostを使わず、tarball secret auditを継続する。
- UX risk: resetがconsumer global styleへ影響する。README明示と隔離browser smokeで確認する。
- Agent misbehavior risk: 明示許可なしにpublish、commit、pushを実行しない。生成物確認のためにsourceやdocsを恒久削除しない。

## Test Strategy

- Unit / static: manifestと生成CSSをNode scriptで検査する。
- Integration: tarballを一時consumerへinstallし、package exportsとasset graphを検査する。
- E2E: Ladle production buildで既存component catalogがbundleできることを確認する。
- Manual QA: README導入手順とreset warning、package asset sizeをreviewする。
- Validator / static check: typecheck、Biome、docs validators、`npm audit`、`npm pack --dry-run`。
- Diff review: preset export / build info /旧README手順の残存、意図しないAPI差分、secretを確認する。

## Test Matrix

| ID | Source | Requirement / Invariant | Test Type | Command / File | Expected Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC-001 | TODO | 単一CSS entrypoint | integration | `npm run test:package` | packed consumerが`@otibo/ui/styles.css`を解決 | verified |
| AC-002 | TODO | reset / token / 全recipe variant | static | `npm run test:package` | expected recipe一覧とCSS markerがすべて存在 | verified |
| AC-003 | TODO | 3 font weightsとlicense | static / integration | `npm run test:package` | 384 WOFF2、3 font-face CSS群、OFL、全相対URL解決 | verified |
| AC-004 | TODO | dependency / export契約 | static | `npm run test:package` | manifest assertionが成功 | verified |
| AC-005 | TODO | packed artifact consumer | integration | `npm run test:package` | ESM / CJS / tsc / CSS asset graphが成功 | verified |
| AC-006 | TODO | quickstart / reset / migration | diff review | `README.md` | 3項目が明記され旧Panda手順がない | verified |
| AC-007 | TODO | repository regression checks | validator / build | `npm run check && npm run audit && scripts/check-docs.sh` | full repository gate exit 0 | verified |
| INV-001 | intent | consumer Panda不要 | static / diff | `package.json`, `README.md` | Pandaはdev-only、利用手順にPandaなし | verified |
| INV-002 | intent | usage非依存の全variant | static | `panda.config.ts`, generated CSS | 36 recipeに`["*"]`指定 | verified |
| INV-003 | intent | self-hosted 3 weights | static | `npm run test:package` | external URLなし、weight集合が400/500/600 | verified |
| INV-004 | intent | preset / build info廃止 | static | `npm run test:package` | export / tarball双方に不在 | verified |
| INV-005 | intent | dependency ownership | static | `npm run test:package` | dependency fieldsがdecisionと一致 | verified |
| INV-006 | intent | asset completeness | integration | `npm run test:package` | CSSの全urlがtarball内でresolve | verified |
| INV-007 | intent | reset / migration disclosure | diff review | `README.md` | warningと0.2.x移行節が存在 | verified |

## Manual QA Checklist

- [x] README冒頭からinstallとCSS importまでを迷わず辿れる。
- [x] `styles.css`がglobal resetを含むことをimport前に認識できる。
- [x] package dry-runのfile count / unpacked sizeがfont同梱方針と一致する。
- [x] Ladle build outputで既存component catalogのCSSとfontが解決される。

## Regression Checklist

- [x] public component exportsのESM / CJS / declarationsが維持される。
- [x] Next.js App Router向け`"use client"` bannerが維持される。
- [x] repository内のPanda authoringとLadle previewが維持される。
- [x] npm lifecycleでbuild前codegenが実行される。

## High-risk Checklist

- [x] Rollback / recovery path is documented.
- [x] Data safety has been checked.
- [x] Security / privacy implications have been checked.
- [x] Failure mode is understood.

## Out of Scope

- npm publish後のregistry verification
- consumer独自theme / token customization
- 既存global CSSと組み合わせた全siteの互換性
- namespace export方針

## Open Questions

- なし。font同梱、reset込み、preset廃止はユーザー合意済み。
