---
title: "Intent: Dependency baseline and peer contract upgrade"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Pkg/dependency-baseline-upgrade/plan.md"
  - "_docs/qa/Pkg/dependency-baseline-upgrade/test-plan.md"
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
  - "_docs/reference/DesignSystem/headless-primitive-policy.md"
related_issues: []
related_prs: []
---

## Context

2026-07-10 の dependency survey で次を確認した。

- `@base-ui-components/react@1.0.0-rc.0` はdeprecatedで、stable packageは`@base-ui/react`へ改名されている。
- npm semverでは`^1.0.0-beta.6`が同じ`1.0.0` core tupleの`1.0.0-rc.0`を許可するため、旧peer rangeでrcが解決された挙動自体は仕様通りである。ただしbeta / rc間の互換をpublic contractとして保証し続ける根拠にはならない。
- `@pandacss/dev@0.53.7` の開発dependency treeにhigh 1 / moderate 8 / low 1のaudit指摘がある。production dependencyのみでは0件で、Panda 1.11.4への分離更新後はlow 1件のみになった。
- React 19.2.7は現行sourceのtypecheck / build / Ladle buildを通過した。
- Biome 2はconfig migration後に新しいimport organizerを適用する必要がある。
- TypeScript 6 / 7はCSS side-effect import、Ladle type、tsup d.ts生成と互換でなく、今回のbaselineにはできない。
- fresh checkoutでは`panda codegen`だけでは`styled-system/styles.css`が生成されず、Ladleは内部Vite failure後も終了コード0を返す。

## Decision

- package versionを`0.2.0`へ更新し、Panda 1 / Base UI stableへのpeer migrationをbreaking-capable minorとして示す。
- Base UIは旧packageを併存させず、`@base-ui/react@^1.6.0`へ全面移行する。
- Pandaは`@pandacss/dev@^1.11.4`へ更新し、consumer peerも同じmajor baselineへ進める。
- Reactは開発baselineを19.2系へ上げる一方、peerは`^18.0.0 || ^19.0.0`として18系consumerを維持する。
- Biome 2の新しいdefault import organizationを採用し、旧並びの再現用custom sorterは設けない。
- Node 24.18.0を既定versionとし、package engineは`>=22`にする。
- ViteはLadleと同じ6系をdirect dev dependencyとして宣言する。TypeScriptは5.9系、Gen Interface JPは0.6.2を維持する。
- `prepare`はPanda runtimeだけでなくCSSも生成する。Ladle buildはartifact timestampとstory countを別scriptで検証する。
- CIはNode 22 / 24とReact 18 / 19のmatrixを持ち、typecheck / lint / build / Ladle artifact / high auditを検証する。

## Alternatives

- **全最新版へ一括更新**: TypeScript 7とVite 8が現行build toolchainを壊すため不採用。
- **旧Base UI packageをpeer aliasとして残す**: deprecated packageをpublic contractに残し、consumer移行を曖昧にするため不採用。
- **React 19のみを許可する**: Base UI stableとsourceはReact 18も対応でき、既存consumerを不必要に切るため不採用。
- **Biome 1を維持する**: 緊急性はないが、今回P2範囲として明示承認され、migration差分を他のsemantic changeと区別してreviewできるため更新する。
- **Ladleの終了コードだけを信頼する**: 実測でfalse-greenを確認したため不採用。

## Rationale

public component libraryでは、peer rangeがconsumerのinstall contractそのものである。Base UI package renameとPanda major更新を`0.1.x`のpatchとして隠さず、`0.2.0`で明示する。Reactは18 / 19両方をmatrix検証することで、開発baselineの更新とconsumer互換を分離する。

生成物をgit管理しない構成では、fresh checkoutで再生成できることが品質条件になる。Ladleのfalse-greenを補うartifact verificationを追加し、CIが実際のstory buildを証明する構成にする。

## Consequences / Impact

- consumerは`@base-ui-components/react`ではなく`@base-ui/react`をinstallする必要がある。
- consumerのPanda baselineは1.11系へ上がる。
- React 18 consumerは引き続き許可され、React 19 consumerが新たに正式対象になる。
- Biome migrationでsourceのimport / export順に大きなmechanical diffが出るが、component behaviorは変更しない。
- contributorの既定Nodeは24.18.0になる。Node 22もCIでsupported rangeとして検証する。
- TypeScript 7 / Vite 8 / font updateは後続判断として残る。

## Quality Implications

- legacy package参照が一つでも残るとconsumer installまたはruntime resolveが壊れる。
- React 19だけで検証するとReact 18 peer互換を誤って失う可能性がある。
- generated CSSの存在だけを作業済みworkspaceで確認するとfresh checkout regressionを検出できない。
- Ladle process statusだけではbuild failureを見落とすため、artifact freshnessとstory countが必要である。
- Biomeのmechanical diffにsemantic changeが混ざらないことをdiff reviewする必要がある。
- CI変更がfailureを無視したり不要な権限を持ったりしないことを確認する。

## Intent-derived Invariants

- INV-001: runtime code / config / README / DesignSystem reference / package metadataに旧package参照が残らず、`@base-ui/react`だけをconsumer contractとする。移行経緯を記録するintent / QAは対象外とする。
- INV-002: `react` / `react-dom`はdependenciesへ移さずpeerに置き、peer rangeはReact 18 / 19の両方を許可する。
- INV-003: ignored generated filesがない状態でも、install / generation後に`styled-system/styles.css`と実storyを持つLadle artifactを再現できる。
- INV-004: package exports、Panda buildinfo、ESM/CJS/typesの公開構造を維持し、peer libraryをbundleへ内包しない。
- INV-005: CIはNode 22 / 24、React 18 / 19、high auditを検証し、failureを許容設定で覆わない。
- INV-006: TypeScriptは5.9系、Viteは6系、Gen Interface JPは0.6.2のままとし、今回のmigration境界を拡張しない。

## Rollback / Follow-ups

- npm publish前のため、rollbackはrepository changeを直前baselineへ戻すことで完結する。
- publish後にconsumer regressionが見つかった場合は`0.2.x` patchで修正し、旧deprecated Base UI packageへ戻さない。
- TypeScript 6 / 7、Vite 8、Gen Interface JP 0.7は各toolchain / visual impactを分離したfollow-upで判断する。
