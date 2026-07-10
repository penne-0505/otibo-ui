---
title: "Drop-in compiled styles distribution"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
  - "_docs/qa/Pkg/drop-in-styles/test-plan.md"
related_issues: []
related_prs: []
---

## Overview

`@otibo/ui` 0.3.0 で consumer-side Panda codegen を廃止し、reset、global styles、tokens、全 recipe variant、Gen Interface JP を含む静的配布物へ移行する。consumer の基本導入は component import と `@otibo/ui/styles.css` の一度の import に限定する。

## Scope

- Panda を library 内部の authoring / build tool として維持する。
- 公開 recipe すべてを `staticCss` で生成し、`dist/styles.css` を export する。
- Gen Interface JP 400 / 500 / 600 の CSS、WOFF2、OFL license を `dist/fonts/` に同梱する。
- `@base-ui/react` を通常 dependency、React / React DOM を peer dependency にする。
- `./preset` と `panda.buildinfo.json` を配布契約から外す。
- pack 済み tarball を隔離 consumer から検証する。
- README に quickstart、reset の作用範囲、0.2.x からの移行を記載する。

## Non-Goals

- consumer による token / recipe / theme の深いカスタマイズを保証しない。
- reset なしの部分導入用 CSS を提供しない。
- CDN や外部 font host を設けない。
- 0.3.0 の npm publish、main merge、自動 publish workflow は行わない。
- component API や namespace export の設計は変更しない。

## Requirements

- **Functional**: `@otibo/ui/styles.css` が単独で既定デザインを成立させ、font URL は package 内で完結する。
- **Functional**: 全36 recipe の全 variant が source usage の有無に依存せず生成される。
- **Functional**: ESM / CJS / declaration exports は現行 component API を維持する。
- **Non-Functional**: build は再現可能で、publish tarball に必要な CSS / WOFF2 / license だけを含める。
- **Non-Functional**: global reset を含むことを導入前に README で認識できる。
- **Non-Functional**: font asset 約9.5 MiBのinstall costとUnicode rangeによるbrowser-side selective fetchを記録する。

## Tasks

1. Panda の `staticCss` を全 recipe 対象へ拡張する。
2. Panda CSS生成後にfont CSS / assets / licenseをdistへ組み立てるbuild scriptを作る。
3. tsupをcomponent bundle専用に戻し、package exports / dependencies / sideEffects / versionを更新する。
4. pack manifestと隔離consumerで公開契約を自動検査する。
5. README、test-plan、verificationを実装結果へ同期する。

## QA Plan

- QA document: `_docs/qa/Pkg/drop-in-styles/test-plan.md`
- Risk level: High
- Test strategy:
  - Unit / static: package manifest、CSS selector / font-face / URL、全 recipe名を検査する。
  - Integration: `npm pack` したtarballを一時consumerへinstallし、ESM / CJS / TypeScript / CSS assetsを解決する。
  - Regression: typecheck、Biome、tsup、Ladle buildを実行する。
  - Manual QA: READMEだけで導入手順とreset影響が理解できるかをdiff reviewする。
  - Validator: `scripts/check-docs.sh` と package auditを実行する。

## Deployment / Rollout

- 0.3.0 としてbuild / pack / consumer検証まで行い、publishは別途明示許可を受けて実行する。
- 公開後に重大な不具合が判明した場合、0.2.0を利用可能な旧契約として残し、修正版0.3.xを公開する。既存versionの上書きやunpublishは行わない。
- font / CSSサイズ、tarball内容、移行手順をpublish前の最終確認対象にする。
