---
title: "Distribute otibo as drop-in compiled styles"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Pkg/drop-in-styles/plan.md"
  - "_docs/qa/Pkg/drop-in-styles/test-plan.md"
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
related_issues: []
related_prs: []
---

## Context

0.2.x は Panda preset、build info、consumer-side codegen を公開契約にしている。この方式はtheme customizationには適するが、otiboの複数app / pageへ同一の既定デザインを簡単に配る目的に対して、Pandaの導入、config、static CSS指定、codegenが過剰な利用者負担になっている。

第三者利用もotiboと同じ既定の見た目を適用する用途を主とし、token / themeの深いカスタマイズは前提にしない。したがって配布契約をconsumer-owned codegenからlibrary-owned compiled CSSへ変更する。

本decisionは `_docs/intent/Pkg/initial-public-publish/decision.md` の「CSS / preset配布方式」と「Panda library publish approach」を0.3.0以降について置き換える。それ以外の公開先、build、license等の判断は継続する。

## Decision

- canonical entrypointを `@otibo/ui` と `@otibo/ui/styles.css` の2つにする。
- `styles.css` はglobal reset / preflight、global styles、tokens、全公開recipeの全variantを含む。
- Pandaはrepository内のauthoring / static generation専用dev dependencyとして残す。
- `@otibo/ui/preset` とbuild infoを公開契約から外す。
- Gen Interface JP 400 / 500 / 600を、Unicode range分割を保ったself-hosted WOFF2としてpackageへ同梱する。
- `styles.css`からfont CSSを読み込み、font URLはpackage内の相対pathだけを使う。
- `@base-ui/react` はcomponent bundleのruntime dependencyとして通常dependencyにする。React / React DOMはsingle instanceを維持するためpeer dependencyにする。
- 0.2.xからのbreaking changeをpre-1.0 minor release 0.3.0として表す。

## Alternatives

- **presetをcanonicalのまま維持**: customization能力は高いが、主用途に不要なbuild toolとconfigを全consumerへ要求するため不採用。
- **presetとcompiled CSSを併売**: 導入経路が二つになり、どちらが品質保証対象か曖昧になるため不採用。
- **resetを別entrypointに分離**: 既存siteへの部分導入には有利だが、otibo app baselineを一度で適用する目的から外れるため不採用。
- **fontをconsumerまたはCDNに委ねる**: install sizeは減るが、zero-configと同一表示を満たさず外部hostの可用性も契約に入るため不採用。
- **全8ウェイトを同梱**: 現行designが使わないassetを増やすため不採用。400 / 500 / 600に限定する。

## Rationale

libraryが見た目の生成責任を持つことで、consumerのframeworkやCSS toolに関係なく同じ配布物を適用できる。global resetは侵襲的だが、今回は部分component kitではなくotibo app baselineを配るため意図した挙動である。

Japanese fontは3ウェイトで約9.5 MiBのinstall assetを追加する。一方、128個/weightのUnicode range分割によりbrowserはページ中の文字に必要なsubsetだけを取得できる。配布サイズよりもself-containedな再現性を優先する。

## Consequences / Impact

- consumerはPandaをinstall / configure / runしなくてよい。
- 0.2.x consumerの `@otibo/ui/preset` importとPanda include設定は削除対象になる。
- `styles.css` importはdocument全体へresetとfont-familyを適用するため、既存global styleとの併用時にはcascade確認が必要になる。
- package install sizeはfont asset分増加する。
- token / recipe customizationは0.3.0のpublic compatibility guaranteeから外れる。
- library maintainerは公開recipe追加時にcompiled CSS収録を維持する責任を持つ。

## Quality Implications

- source usage scanだけに依存すると未使用variantが欠落するため、全recipeを`staticCss`へ明示する必要がある。
- CSSから外部URLを参照した場合、offline / CSP / host障害で同一表示が崩れる。
- `sideEffects: false`のままではconsumer bundlerがCSSを除去する可能性があるためCSSをside effectとして宣言する。
- tarballにfont licenseまたは参照assetが欠けると配布物として不完全になる。
- preset/build infoがexportsやREADMEに残ると、廃止した二つ目の導入経路が復活する。

## Intent-derived Invariants

- INV-001: 公開導入にPandaのinstall、config、codegenを要求しない。
- INV-002: `styles.css`はreset、tokens、global styles、全公開recipeの全variantを常に含む。
- INV-003: fontは400 / 500 / 600だけをpackage内相対URLで参照し、外部networkへ依存しない。
- INV-004: public exportsはcomponent rootと`./styles.css`に限定し、`./preset`とbuild infoを含まない。
- INV-005: React / React DOMだけがpeerで、Base UIはconsumerへ自動導入されるruntime dependencyになる。
- INV-006: publish tarballはCSSが参照する全assetとfont licenseを含み、隔離consumerで解決できる。
- INV-007: global resetの適用と0.2.xからの移行がREADMEに明示される。

## Rollback / Follow-ups

- publish前は変更commitをrevertして0.2.x契約へ戻せる。
- publish後は0.2.0を旧契約として保持し、0.3.xで修正する。versionの上書きやunpublishは行わない。
- component単位の部分導入需要が実際に発生した場合のみ、別CSS entrypointを新たなintentで検討する。
