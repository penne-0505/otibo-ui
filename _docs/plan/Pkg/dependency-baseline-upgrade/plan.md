---
title: "Plan: Dependency baseline and peer contract upgrade"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/qa/Pkg/dependency-baseline-upgrade/test-plan.md"
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
related_issues: []
related_prs: []
---

## Overview

`@otibo/ui` の dependency baseline を Panda 1、Base UI stable、React 18 / 19、Biome 2、Node 24 LTS に更新する。同時に、fresh checkout で Panda CSS が欠落する問題と、Ladle が内部 build failure を終了コード 0 で覆う検証漏れを修正する。

package は `0.2.0` へ更新するが、npm publish は行わない。peer contract の変更は consumer migration を伴うため、implementation と verification を完了させてから別途 publish 判断を行う。

## Scope

- `@pandacss/dev` を `^1.11.4` へ更新し、peer / dev range を同期する。
- `@base-ui-components/react` を `@base-ui/react@^1.6.0` へ置き換える。
- React / React DOM / type package の開発 baseline を 19.2 系へ上げ、peer range は React 18 / 19 の両方を許可する。
- Biome 2.5.3 へ移行し、新しい config schema と import organizer に source を合わせる。
- Node 24.18.0 を既定開発 version とし、package engine は supported LTS の Node 22 以上とする。
- Panda の完全生成、Ladle artifact verification、Node / React matrix、high audit、package build を CI に追加する。
- README、headless primitive policy、package metadata、version を更新する。

## Non-Goals

- TypeScript 6 / 7 への更新。
- Vite 8 への更新。Ladle 5.1.1 と整合する Vite 6 を明示的 dev dependency とする。
- `gen-interface-jp` 0.7.0 への更新。
- npm publish、git commit、push、consumer repository の変更。
- component API の意図的な再設計。

## Requirements

- **Functional**: 全 component / preset / Ladle story が新 dependency baseline で build できる。
- **Compatibility**: public peer contract は React 18 / 19 を許可し、Base UI / Panda の旧 peer 名・range を残さない。
- **Reproducibility**: ignored generated filesがない fresh checkout でも `npm ci` 後に必要 artifact が揃う。
- **Verification**: Ladle の process status だけでなく、更新直後の `build/meta.json` に story が存在することを検証する。
- **Security**: `npm audit --audit-level=high` が成功し、CI に不要な権限や secret を追加しない。
- **Packaging**: `main` / `module` / `types` / `exports` / `files` / Panda buildinfo の公開構造を維持する。

## Tasks

1. package version、engines、scripts、peer / dev dependencies、lockfile を更新する。
2. Base UI import / external / optimizeDeps を新 package 名へ置換し、stable型に合わせてref型を修正する。
3. Panda full generationをprepare経路に入れ、fresh checkoutでCSSを生成する。
4. Biome migrationを実行し、新sorterの機械差分を独立した意味のないformat changeとして確認する。
5. Ladle artifact verifierとpackage CIを追加する。
6. READMEとDesignSystem referenceを新しいconsumer contractへ同期する。
7. QA test-planに従ってlocal / temporary React matrix / browser smoke / docs validationを実施する。

## QA Plan

- QA document: `_docs/qa/Pkg/dependency-baseline-upgrade/test-plan.md`
- Risk level: High
- Test strategy:
  - Unit: Ladle artifact verifierのfailure / success条件をfresh buildで確認する。
  - Integration: React 18 / 19の一時環境でtypecheck、library build、Ladle buildを実行する。
  - E2E: Ladle上で代表的なpopup / form / selection primitiveをブラウザ操作する。
  - Manual QA: package metadata、peer range、generated artifact、browser consoleを確認する。
  - Validator / static check: Biome、TypeScript、npm audit、npm pack、docs validators、legacy reference grep。
- 全ACとintent-derived invariantをtest matrixへ割り当てる。
- CI変更について、failureを`continue-on-error`等で覆わないことをdiff reviewする。

## Deployment / Rollout

- 本変更ではnpm publishしない。
- verificationがPASSになるまで`0.2.0` release candidateとして扱う。
- rollbackはdependency manifest / lockfile / config / source / docsを直前の`0.1.1` baselineへ戻し、同じQA matrixを再実行する。
- consumer rolloutではPanda 1と`@base-ui/react`を同時にinstallする必要があるため、publish時にREADMEのinstall手順をrelease noteとして再利用する。
