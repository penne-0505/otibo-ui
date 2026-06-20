---
title: "Plan: Initial public publish of @otibo/ui"
status: active
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
  - "_docs/qa/Pkg/initial-public-publish/test-plan.md"
related_issues: []
related_prs: []
---

## Scope

`@otibo/ui` v0.1.0 を **npm public registry に publish するための、本リポジトリ内の作業**を完了させる:

- secret / 個人情報 / 不要ファイルの audit
- `package.json` の publish 用整備(name、version、files、exports、peerDependencies、publishConfig)
- build pipeline 構築(tsup)
- preset / CSS 配布構造の確定
- README の library README 化
- `npm pack --dry-run` での配布物 audit
- `npm publish --access public` の実行
- Verification 記録

## Non-Goals

- **consumer 側の動作確認**は別 task(`otibo-dev/App-Feat-11`)に引き継ぐ。本 task の Verdict は AC-001〜006 の PASS 条件で決める。
- **既存 component の API 変更**:現状の export 構造 + Phase 3 の 37 spec で固まった contract のまま publish。
- **CI/CD の automated publish 設定**:初版は手動 publish。CI publish は future task。
- **CHANGELOG.md の整備**:初版なので git history が始点、後続 release から changelog を運用する。
- **monorepo / multi-package 化**:現状 single package、将来 `@otibo/medo-client` 等を加える時に再検討。
- **bug fix / 既存 recipe の修正**:publish 作業の途中で発見しても、本 task の scope に含めず別 task に切り出す(scope creep を避ける)。

## Sequence

### Step 0: 前提確認(着手前)

- [ ] **npm scope 取得可否**:`npm view @otibo/ui` で 404 確認(既存なら衝突、Plan を一旦止めて Intent で代替 scope 検討)。
- [ ] **npm 認証**:penne 名義で `npm whoami` が通る、または `npm login` 実施(本人操作、agent は触らない)。
- [ ] **node / npm のバージョン確認**:tsup と Panda が動く環境(node 18+ 推奨)。

### Step 1: Secret / 個人情報 audit(INV-001 対応)

- [ ] **既知 secret patterns の grep**:`grep -rEn "(api[_-]?key|token|secret|password|bearer|sk-|AIza|ghp_|gh[osu]_)" src/ preset.ts panda.config.ts vite.config.ts .ladle/`
- [ ] **個人 email / 個人住所の確認**:`grep -rEn "@(gmail|yahoo|outlook|icloud)\." src/ preset.ts` 等(誤って入っていれば除去)。
- [ ] **`.env*` / `*.local` / `*.secret*` の存在確認**:`find . -maxdepth 3 -name ".env*" -o -name "*.secret*" -o -name "*.local"`(VCS / publish 対象外であることも確認)。
- [ ] **git 履歴 audit**:`git log --all --source --remotes -p -- "*.env*"` 等で過去含めて確認(historical commit に secret が入っていれば、tarball には含まれないが将来の対応として記録)。
- [ ] **結果を `verification.md` に記録**(値そのものは記載しない、masking 表記)。

### Step 2: dependencies 整理

- [ ] **`gen-interface-jp` を devDependencies に移動**(Ladle 専用、確認済 2026-06-21)。
- [ ] **`react` / `react-dom` を peerDependencies に移動**(範囲 `^18.0.0`)、対応する dev 用に **`devDependencies` にも保持**(otibo-ui 自身の Ladle / 型解決のため)。
- [ ] **`npm install` で `node_modules` の再構築**、`peer warnings` の確認。

### Step 3: build pipeline 構築(Approach 4: Build Info File、2026-06-21 改訂)

build エラー(2026-06-21)で発見した Panda library publish の構造的問題に対応するため、Approach 4(Ship Build Info File)を採用(Intent §I)。

**3a. library 内 import 形式の変更**:

- [ ] `panda.config.ts` の `importMap` を `"@/styled-system"` → **`"@otibo/ui/styled-system"`** に変更。
- [ ] 全 39 件の relative import を機械的に置換:
  ```bash
  find src/ \( -name "*.ts" -o -name "*.tsx" \) \
    -exec sed -i 's|"../../../styled-system/|"@otibo/ui/styled-system/|g' {} +
  ```
- [ ] `grep -rn '"\.\./\.\./\.\./styled-system' src/` で残存 0 件を確認。
- [ ] `npm run prepare`(panda codegen)を再実行、`styled-system/` を named import に対応した形に再生成。

**3b. tsup 設定**(完了済 + alias 追加):

- [ ] `tsup` を devDependencies に追加(完了 2026-06-21)。
- [ ] `tsup.config.ts` を改訂:
  - `entry: ["src/index.ts", "preset.ts"]`(preset も build、Intent §E)
  - `format: ["esm", "cjs"]`、`dts: true`、`clean: true`、`sourcemap: true`、`target: "es2020"`
  - `external: ["react", "react-dom", "@base-ui-components/react", "@pandacss/dev"]`
  - **`esbuildOptions.alias`**:`{"@otibo/ui/styled-system": <__dirname>/styled-system}` を設定(library 自体の build で named import を解決)
- [ ] `.gitignore` に `dist/` が含まれていることを確認(既存)。

**3c. `panda ship` を build chain に追加**(Approach 4 の核):

- [ ] `package.json` の `scripts.build` を **`"tsup && panda ship --outfile dist/panda.buildinfo.json"`** に。
- [ ] `prepublishOnly` は `npm run typecheck && npm run lint && npm run build` のまま。

**3d. build 動作確認**:

- [ ] `npm run build` 実行、生成物確認:
  - `dist/index.{js,cjs,d.ts}`、`dist/preset.{js,cjs,d.ts}`
  - **`dist/panda.buildinfo.json`** ← Approach 4 の核

### Step 4: package.json publish config 整備(INV-002 / 003 / 005 / 006 対応)

```jsonc
{
  "name": "@otibo/ui",
  "version": "0.1.0",
  // "private": true を削除
  "type": "module",
  "description": "otibo Design System UI library (Base UI + Panda CSS)",
  "license": "MIT",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./preset": {
      "types": "./preset.ts",
      "import": "./preset.ts"
    }
    // "./styles.css" は削除
  },
  "sideEffects": false,
  // sideEffects: ["*.css", "./src/index.css"] は削除(dist に CSS が入らない、tree-shaking を最大化)
  "files": ["dist", "preset.ts", "README.md", "LICENSE.txt"],
  "publishConfig": {
    "access": "public"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

- [ ] 上記の通り `package.json` を編集。
- [ ] **`./styles.css` export は削除**(Intent §E の決定)。
- [ ] **`sideEffects: false`** に変更(dist に CSS が入らないため、tree-shaking を最大化)。

### Step 5: preset.ts の export 確認

- [ ] **`preset.ts` の内容を確認**:Panda の `definePreset` で書かれており、consumer panda.config から `import preset from "@otibo/ui/preset"` で読める形か確認(Phase 2 で強化済みのはず)。
- [ ] **TypeScript の resolve がうまく行くか**:`exports."./preset".types` → `preset.ts` 直接で `tsc` が path を解決できる。

### Step 6: README 書き換え

- [ ] 現状 template README → **library README** に書き換え。最低限の内容:
  - **install**:`npm install @otibo/ui`(+ peer dependencies の Panda CSS が consumer に必要)
  - **基本的な使い方**:Button / Field / Link 等の import 例
  - **Panda preset の設定例**:`panda.config.ts` に `presets: [otiboPreset]` + `staticCss` の必須設定例
  - **prototype-era の signal**:「DS は active development、API は安定前、breaking change は minor bump で予告」── version 0.x.y で signal、README は最低限の説明にとどめる(Intent §B、ユーザー判断:明記不要)
  - **link** 集:Ladle preview(Cloudflare Pages、`otibo-ui.pages.dev`)、本 repo の `_docs/reference/DesignSystem/`(internal だが将来公開する場合は link)
- [ ] LICENSE 記載 を末尾に。

### Step 7: 配布物 audit(`npm pack --dry-run`)

- [ ] `npm pack --dry-run` を実行、tarball に含まれるファイルリストを取得。
- [ ] **期待**:`dist/`、`preset.ts`、`README.md`、`LICENSE.txt`、`package.json` のみ。
- [ ] **`src/_explore/`、`*.stories.tsx`、`_docs/`、`.ladle/`、`build/`、`_evals/`、`scripts/`、`node_modules/`、`.env*` が含まれていないことを確認**(QA INV-001)。
- [ ] tarball サイズが妥当か(数百 KB 以内、巨大なら何か入っている)。

### Step 8: 初回 publish

- [ ] **ユーザー確認**:publish 直前にユーザーに「実行していいか」最終確認(agent misbehavior check、初公開は不可逆)。
- [ ] `npm publish --access public` 実行(本人操作 or agent が user 同意のもとで実行)。
- [ ] `npm view @otibo/ui@0.1.0` で公開確認。
- [ ] (任意)`https://www.npmjs.com/package/@otibo/ui` を browser で開いて表示確認。

### Step 9: Verification 記録

- [ ] `_docs/qa/Pkg/initial-public-publish/verification.md` を作成。
- [ ] AC-001〜006 の verification 結果(コマンド + 出力 summary)を残す。
- [ ] AC-007(consumer 側動作)は **PARTIAL / not-covered**として記録、follow-up TODO `otibo-dev/App-Feat-11` を明記。
- [ ] Verdict を決定(PASS / PARTIAL / FAIL / BLOCKED)。

## Dependencies

- **外部:npm 公開アカウント**(penne 名義)が有効。本人操作。
- **外部:`@otibo` scope** が npm で取得可能 or 既に取得済(Step 0 で確認)。
- **外部:node 18+ / npm 環境**。
- **内部 task の依存なし**(本 task 単独で完結、consumer 動作確認は外部 task)。

## Risks

| Risk | Mitigation |
| --- | --- |
| **scope `@otibo` が取られている** | Step 0 で事前確認。取られていれば Plan を止めて Intent で代替 scope 検討。 |
| **secret 漏洩** | Step 1 で audit、Step 7 で再 audit。AGENTS.md の禁止事項(secret 流出)と整合。 |
| **build pipeline が動かない** | tsup は popular で安定、設定もシンプル。問題が出たら Vite library mode に切替(Intent §D)、ただし dist 構造が変わるので version 戦略に影響。 |
| **preset.ts が consumer Panda で読めない** | Step 5 で確認、Step 8 の `npm view` 後すぐに consumer 側で軽くテスト(App-Feat-11 着手時に発見)。 |
| **初公開後の不可逆性** | Intent で決定 log を残す。24h 以内に致命的問題発覚なら unpublish 検討。 |
| **consumer 側で動かない** | 本 task の scope 外、`App-Feat-11` で発見 → follow-up TODO で対応。Verdict は本 task の Verdict と分離。 |

## 完了条件

- Step 0〜9 が完了。
- QA test-plan の AC-001〜006 が PASS。AC-007 は PARTIAL / not-covered で OK(scope 外)。
- `verification.md` が `qa_status: verified` または `partial`(AC-007 未確認分)で記録される。
- ユーザーが publish 結果を確認。
- TODO の `Pkg-Feat-5` を削除可能。

## 関連

- Intent: `_docs/intent/Pkg/initial-public-publish/decision.md`
- QA: `_docs/qa/Pkg/initial-public-publish/test-plan.md`
- TODO: `Pkg-Feat-5`
- 連動 task(別 repo):`otibo-dev/App-Feat-11`
