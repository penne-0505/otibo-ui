---
title: "Intent: Remediate dependency advisories without weakening release gates"
status: active
draft_status: n/a
intent_schema: 2
created_at: 2026-07-28
updated_at: 2026-07-28
references:
  - "_docs/plan/Pkg/dependency-audit-remediation/plan.md"
  - "_docs/qa/Pkg/dependency-audit-remediation/test-plan.md"
  - "_docs/intent/Pkg/dependency-baseline-upgrade/decision.md"
  - "_docs/intent/Pkg/release-contract-hardening/decision.md"
related_issues: []
related_prs: []
---

## Context

同一dependency lockは2026-07-13のPackage CIでadvisory 0件だったが、7月20〜21に`js-yaml`、`@hono/node-server`、`fast-uri`のadvisoryが公開され、7月22日の全matrix cellが`npm audit --audit-level=low`で失敗した。7月28日時点では`brace-expansion`と`postcss`を含む追加advisoryも検出される。対象はdev tooling treeで、public runtime dependencyのauditは0件である。

## Decisions

### DEC-001: low severityを含むcanonical audit gateを維持する

- **What**: `npm run audit`、`release:check`、Package CIの監査範囲とfailure propagationを変更しない。
- **Why**: advisory databaseの更新で結果が変わることは監査の性質であり、赤を消すために検査を狭めるとrelease前に開発toolchainの既知リスクを検出する契約を失うため。
- **Change freedom**: npm以外の同等以上の監査器へ移行できるが、dev dependencyを含むlow severity以上の未許容advisoryを失敗として扱う結果を保つ。
- **Why not**: `--omit=dev`、severity引き上げ、`continue-on-error`は今回の検出対象を不可視化するため採用しない。

### DEC-002: direct patch updateを優先し、overrideはupstream range gapへ限定する

- **What**: direct toolは互換patchへ更新し、通常のsemver解決でpatched versionへ到達できない推移依存だけをroot overrideで置き換える。
- **Why**: broadな`npm update`や`npm audit fix --force`は監査修復と無関係なdependency差分やPanda downgradeを混ぜる一方、lockfileだけの偶発的解決では将来の`npm install`時に修復意図を再現できないため。
- **Change freedom**: upstreamがpatched dependency rangeを公開したらdirect package更新へ置き換え、不要になったoverrideを削除できる。
- **Why not**: advisoryをignore listへ固定すると、実際にpatched releaseが存在する依存を脆弱版のまま維持するため採用しない。
- **Revisit when**: Panda MCPまたはMCP SDKが`@hono/node-server >=2.0.5`とpatched PostCSSを通常解決するreleaseを公開したとき。

### DEC-003: public package contractをdependency audit修復から分離する

- **What**: runtime dependencies、React peer range、exports、component source、publish artifactを変更しない。
- **Why**:今回のadvisoryはPanda、markdownlint等のauthoring toolchainにあり、consumer contractを変更しても原因を解消せず回帰面だけが増えるため。
- **Change freedom**:別タスクで互換性とconsumer migrationを検証するならruntime dependencyを更新できる。

## Consequences / Impact

- dev installでpatched transitive dependencyを強制するoverrideが増える。
- Panda MCPが宣言したmajor rangeを越える`@hono/node-server`を使うため、Panda generationとfull release gateによる互換確認が必要になる。
- consumerがinstallするruntime dependency treeとpackage exportsは変わらない。

## Quality Implications

- audit 0件だけではoverride先のtool compatibilityを証明しないため、Panda generationとpackage/Ladle regressionを同時に確認する。
- overrideはfirst patched version以上であることと、upstream修復後に削除可能であることをreviewする。
- lockfileの広範な便乗更新を避け、変更dependencyをadvisory経路に説明可能な範囲へ限定する。

## Intent-derived Invariants

- INV-001 (from DEC-001): dev dependencyを含むlow severity以上のaudit failureをrelease gateとPackage CIが許容設定で覆わない。
- INV-002 (from DEC-003): public runtime dependencies、React peer range、exports、package artifact allowlistを変更しない。

## Rollback / Follow-ups

- rollbackはmanifestとlockfileの変更を戻す。ただしadvisoryは再発するため、rollback後のrelease gateは赤になることを明示する。
- 永続data、secret、credential、registry stateは変更しない。
- upstream修復後はoverride removalを独立したdependency maintenanceとして検証する。
