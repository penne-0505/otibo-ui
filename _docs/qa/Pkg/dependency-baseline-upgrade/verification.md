---
title: "QA Verification: Dependency baseline and peer contract upgrade"
status: active
draft_status: n/a
qa_status: verified
risk: High
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Pkg/dependency-baseline-upgrade/plan.md"
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/qa/Pkg/dependency-baseline-upgrade/test-plan.md"
related_issues: []
related_prs: []
---

# Dependency baseline and peer contract upgrade QA verification

## Summary

`@otibo/ui@0.2.0` のdependency baselineをPanda 1.11.4、Base UI 1.6.0、React 19.2.7、Biome 2.5.3へ更新した。public peer contractはReact 18 / 19を許可し、fresh install、Node / React matrix、package artifact、Ladle 56 stories、代表的なinteractionを検証した。npm publish、commit、pushは実行していない。

## Verification Verdict

Verdict: PASS

## Commands Run

| Command / Test | Result | Notes |
| --- | --- | --- |
| `date +%F` | PASS | `2026-07-10`。 |
| fresh temp `npm ci` | PASS | `prepare: panda`で`styled-system/styles.css`を137 filesから生成。 |
| Node 22.23.1 + React 18.3.1 matrix | PASS | TypeScript、Biome、package build、Ladle 56 stories、high auditを確認。React typesは18.3.31。 |
| Node 24.18.0 + React 19.2.7 matrix | PASS | TypeScript、Biome、package build、Ladle 56 stories、high audit、packを確認。 |
| `npm run lint` | PASS | Biome 2.5.3で130 files、diagnostics 0。 |
| `npm run typecheck` | PASS | TypeScript 5.9.3、diagnostics 0。 |
| `npm run build` | PASS | ESM / CJS / d.ts / d.ctsと`panda.buildinfo.json`を生成。 |
| `npm run ladle:build` | PASS | fresh `meta.json`と56 storiesを確認。 |
| `npm run check` | PASS | typecheck / lint / package build / Ladle artifact verificationの統合gateがexit 0。 |
| verifier failure fixtures | PASS | raw exit 7、stale metadata、story count 0がいずれもnon-zeroになった。 |
| `npm run audit` | PASS | high / critical 0。Windows dev serverに限定されたesbuild low 1のみ。 |
| `npm pack --dry-run --ignore-scripts --json` | PASS | `0.2.0`、16 files、467,572 bytes、必須artifact欠落0。 |
| legacy package `rg` | PASS | runtime code、config、README、DesignSystem reference、package metadataにmatchなし。 |
| `git diff --check` | PASS | whitespace error 0。 |
| docs validators scope review | PASS | 新規Plan / Intent / QAにvalidator errorなし。repository全体の既存baseline errorは下記へ分離。 |

## Automated Test Results

- fresh tempのReact 18 / 19双方でtypecheck、library build、Ladle artifact verificationが成功した。
- Node 22.23.1 / 24.18.0のCI境界でもfresh installから同じgateが成功した。
- `@base-ui/react`とReactはdistのexternal importとして残り、library bundleへ内包されていない。
- publish artifactは`LICENSE.txt`、`README.md`、package metadata、distのESM / CJS / types / source maps / Panda buildinfoだけを含む。
- workflowはNode 22 / 24 × React 18 / 19のmatrix、read-only contents permission、high auditを持ち、`continue-on-error`やshell fallbackを持たない。
- Biomeのsource差分はimport / export organizationが中心で、semantic変更はBase UI stableのpackage importとNavigationMenu / PreviewCardの正しいDOM ref型に限定されている。

## Manual QA Results

- local LadleでDialogを開閉し、close後にtriggerへfocusが戻ることを確認した。
- Selectを京都府から大阪府へ変更し、popup closeと表示値更新を確認した。
- Checkboxの`aria-checked`が`false`から`true`へ変化することを確認した。
- Tabsはclickで実装tabへ移動し、ArrowRightで計測tabへfocus移動、Spaceで選択できることを確認した。
- browser consoleにReact / hydration / Base UI errorは0件。Electron開発環境由来のCSP warningだけを観測した。

## Acceptance Criteria Coverage

- AC-001: PASS。fresh `npm ci`でPanda CSSを生成し、Ladle verifierが56 storiesとartifact freshnessを確認した。
- AC-002: PASS。Panda 1.11.4 / Base UI 1.6.0へ移行し、consumer contract領域のlegacy参照は0件。
- AC-003: PASS。React 18.3.1 / 19.2.7でtypecheck、build、Ladleが成功した。
- AC-004: PASS。Biome 2.5.3のmigrationと54 filesの機械整形後、lintが成功した。
- AC-005: PASS。Node 24.18.0 baseline、Node / React matrix、high audit、package / Ladle gateをworkflowへ追加し、境界versionをlocal実行した。
- AC-006: PASS。version、README、DesignSystem reference、pack 16 files、新規docsのvalidator結果が`0.2.0` contractと一致する。

## Invariant Coverage

- INV-001: PASS。旧Base UI package名は移行履歴を保持するintent / QA以外のconsumer contract領域に残っていない。
- INV-002: PASS。React / React DOMはpeerのまま18 / 19を許可し、distではexternalである。
- INV-003: PASS。clean generationを再現し、Ladle verifierのraw failure / stale / empty-story failureを確認した。
- INV-004: PASS。ESM / CJS / types / Panda buildinfoとpackage allowlistを維持した。
- INV-005: PASS。CIはNode 22 / 24 × React 18 / 19を検証し、failure maskingや不要な権限を持たない。
- INV-006: PASS。TypeScript 5.9.3、Vite 6.4.3、Gen Interface JP 0.6.2を維持した。

## Deferred / Not Covered

- GitHub Actions自体のremote runは未実施。workflowと同じ境界version / commandをlocal temporary environmentで実行した。
- repository全体の`./scripts/check-docs.sh`は、本変更前から存在するDeno / Biome format不一致、historical docs frontmatter、`Pkg-Enhance-8`、`Pkg-Doc-7` link、旧QA templateのerrorでexit 1となる。各validatorを個別実行し、本変更のPlan / Intent / QAに新規errorがないことを確認した。
- `npm audit`のlow 1件は`tsup`配下のesbuildがWindows development serverで任意file readを許すadvisoryである。本projectのLinux package buildには該当せず、今回のhigh severity gate対象外とした。
- Ladle 5.1.1配下の`react-inspector@6.0.2`はpeer rangeがReact 18までのため、React 19 install時にnpm warningを出す。Ladleは現行最新版で、React 19のbuild / browser smokeは成功しており、直接overrideは行わない。
- TypeScript 7、Vite 8、Gen Interface JP 0.7はIntentで明示した別migration境界のため未更新。

## Residual Risks

None

## Follow-up TODOs

- None.

## Agent Misbehavior Checks

- npm publish、commit、pushを実行していない。
- `continue-on-error`や`|| true`でCI gateを成功扱いしていない。
- secret、credential、外部入力を追加・送信していない。
- ユーザー許可前にrepository rootの一時出力を削除せず、明示許可後に対象1ファイルだけを削除した。
