---
title: "Make package metadata and release gates executable contracts"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Pkg/release-contract-hardening/plan.md"
  - "_docs/qa/Pkg/release-contract-hardening/test-plan.md"
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
  - "_docs/intent/Pkg/namespace-export-design/decision.md"
related_issues: []
related_prs: []
---

## Context

0.3.0のpacked runtime、Vite、Next.js検証は成功したが、CommonJS TypeScriptはESM宣言を参照してTS1479になり、厳格なCSS side-effect importはTS2307になった。さらにlocal docs gateをBiomeへ変更した一方、Docs CIはDeno fmtを使い続けていた。個別の成功だけではrelease contract全体を保証できない。

## Decision

- component rootの`exports`を`import` / `require`ごとのnested conditionsにし、それぞれ`.d.ts` / `.d.cts`を割り当てる。
- `./styles.css`へ明示的な`types` conditionを持たせ、buildでCSS declarationを生成する。
- packed consumer testをpublic contractのprimary regression testとする。
- `release:check`をlocalと`prepublishOnly`のcanonical release gateにする。
- Docs CIは独自command列を持たず、repositoryの`docs:check`を実行する。
- Package CIはpacked consumer testを少なくともcanonical Node / React matrix cellで実行する。
- publint、ATTW、markdownlintはdev dependencyへ固定し、release gateから実行する。

## Alternatives

- **CJS exportを削除する**: contract縮小は可能だが、既にruntime CJSを公開しており今回の目的は宣言対応を正すことなので不採用。
- **CSS型をconsumer frameworkへ委ねる**: Vite / Next以外や`noUncheckedSideEffectImports`で失敗するため不採用。
- **CIだけ修正しprepublishは軽量のまま**: CIを経ずpublishでき、gateが分岐するため不採用。
- **external linterを毎回latestで取得する**: 結果が時間で変わるため不採用。lockfileへ固定する。

## Rationale

package metadataはruntime codeと同じ公開APIであり、実consumerとstandard linterで実行可能に検査する必要がある。release経路を一つのnpm scriptへ集約すると、local成功とCI失敗、CI成功とpublish時省略の差を防げる。

## Consequences / Impact

- dev dependencyとrelease check時間が増える。
- CSS declarationがtarballへ1file追加される。
- React 18 / 19とCJS / ESMの回帰がpublish前に検出される。
- Denoはdocs validator runtimeとして残るが、JavaScript formatterには使わない。

## Quality Implications

- condition順序を誤るとTypeScriptがdefault JSを先に解決する。
- verifierがsourceを参照するとtarball欠落を検出できない。
- CIがnpm scriptを展開して再記述すると将来また乖離する。
- external linterを固定しても、実consumer testを代替するものではない。

## Intent-derived Invariants

- INV-001: ESM / CJS consumerは対応するmodule-kindの型宣言を解決する。
- INV-002: CSS entrypointはruntime assetと型宣言の両方をexportsから解決する。
- INV-003: React 18 / 19のpacked consumerがflat-only APIとcompiled CSSを利用できる。
- INV-004: local docs gateとDocs CIは同じ`docs:check`を実行する。
- INV-005: `prepublishOnly`はcode、package metadata、audit、docsの全gateを迂回しない。
- INV-006: publint / ATTW / markdownlintのversionと結果はlockfileで再現可能である。

## Rollback / Follow-ups

- publish前はpackage metadata、script、CI変更をrevertできる。
- tool updateで新しいdiagnosticが増えた場合は、version固定を外さず意図を確認して更新する。
