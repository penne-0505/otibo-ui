---
title: "QA Test Plan: Initial public publish of @otibo/ui"
status: active
draft_status: n/a
qa_status: planned
risk: High
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
  - "_docs/plan/Pkg/initial-public-publish/plan.md"
related_issues: []
related_prs: []
---

## Risk classification

**Risk: High**(`_docs/standards/quality_assurance.md` の Risk 定義に基づく):

- **不可逆性**:初公開後 24h を超えると npm unpublish 不可、name / scope は実質固定。
- **secret 漏洩リスク**:tarball に secret が含まれると外部に拡散、回収不可。
- **consumer 影響**:publish 後 dist 構造を変えると consumer の breakage、major bump が要る。
- **brand 影響**:公開された package は brand の出力物として扱われる。誤公開は brand reputation に影響。

## Intent-derived Invariants

Intent の決定から導出した不変条件(verification で確認するもの):

- **INV-001 — Secret/不要ファイル排除**:publish tarball に secret(API key、token、bearer、`sk-` 等)、個人情報(個人 email、住所)、production 不要ファイル(`_explore/`、`*.stories.tsx`、`_docs/`、`.ladle/`、`build/`、`_evals/`、`scripts/`、`.env*`)が含まれない。Intent §F、ユーザー判断 §3。
- **INV-002 — build 出力指向**:`package.json` の `main` / `module` / `types` / `exports."."` は `dist/` 配下を指す(`src/` の TypeScript を直接指さない)。Intent §D、§E、§F。
- **INV-003 — peer dependencies**:`react` / `react-dom` は `peerDependencies` に存在し、`dependencies` には存在しない。Intent §G。
- **INV-004 — preset resolution**:`@otibo/ui/preset` が consumer の panda.config / TypeScript runtime から resolve できる(`preset.ts` 直配布、Intent §E)。
- **INV-005 — name / version / access**:`name` は `@otibo/ui`、初版 `version` は `0.1.0`、`publishConfig.access` は `"public"`。Intent §A、§B、§C。
- **INV-006 — private 解除**:`private: true` が `package.json` から除去されている(scoped package で private のままだと publish 拒否)。Intent §A、§C。
- **INV-007 — publish 成功**:`npm publish --access public` が成功し、`npm view @otibo/ui@0.1.0` で公開状態が確認できる。Intent §C。
- **INV-008 — consumer 統合**(外部 task に委譲):consumer 側(otibo-dev)で `npm install @otibo/ui` + Panda preset 設定だけで主要 component(Button / Field / Link 等)が描画できる。本 task の scope **外**、`otibo-dev/App-Feat-11` で verify。

## Test Matrix

| AC | INV | Method | Plan Step |
| --- | --- | --- | --- |
| AC-001 | INV-002, 005, 006 | `cat package.json` 目視 + `npm pack --dry-run` で publish 範囲確認 | Step 4, 7 |
| AC-002 | INV-002 | `ls dist/` で `.d.ts` 存在確認 + `node -e "require('./dist/index.cjs')"` で require 動作 + `node -e "import('./dist/index.js')"` で import 動作 | Step 3, 7 |
| AC-003 | INV-003 | `package.json` の `peerDependencies` 目視 + `dependencies` から `react` / `react-dom` が消えていることを目視 | Step 2, 4 |
| AC-004 | INV-004 | preset の static 解析:`node --input-type=module -e "import('@otibo/ui/preset').then(p => console.log(typeof p.default))"` で resolve 可能性確認(publish 後)。publish 前は本 repo 内で `node --input-type=module -e "import('./preset.ts')"` 相当を ts-node / tsx 経由で実行。 | Step 5, 8 |
| AC-005 | INV-001 | (a) `npm pack --dry-run` 出力リストを目視で **不要ファイル不在を確認**(白 list 外のものが無い)。(b) `grep -rEn "(api[_-]?key\|token\|secret\|password\|bearer\|sk-\|AIza\|ghp_\|gh[osu]_)" src/ preset.ts` で secret pattern 検出ゼロ。 | Step 1, 7 |
| AC-006 | INV-007 | `npm publish --access public` 実行(Step 8、本 task の最終アクション)+ `npm view @otibo/ui@0.1.0 version dist-tags` で確認。 | Step 8 |
| AC-007 | INV-008 | **本 task の scope 外**:`otibo-dev/App-Feat-11` で verify。本 task の Verdict は AC-007 を PARTIAL / not-covered として扱う。 | (外部 task) |

## Verification 手順詳細

### Pre-publish phase(Step 0〜7、`npm publish` 前)

1. **scope availability**:`npm view @otibo/ui 2>&1 | grep -i "404\|not found"` で 404 確認。404 が返らなければ scope 衝突可能性 → Verdict BLOCKED。
2. **authentication**:`npm whoami` で penne 名義確認(本人操作)。
3. **secret audit**(INV-001、AC-005):
   - `grep` patterns:`api[_-]?key`、`token`、`secret`、`password`、`bearer`、`sk-`、`AIza`、`ghp_`、`gh[osu]_`、個人 email patterns。
   - 範囲:`src/`、`preset.ts`、`panda.config.ts`、`vite.config.ts`、`.ladle/`。
   - 検出ゼロを `verification.md` に記録(検出値そのものは記載しない、masking)。
4. **package.json 静的検査**(INV-002, 003, 005, 006、AC-001, 003):
   - `name === "@otibo/ui"`
   - `version === "0.1.0"`
   - `private` フィールドが存在しない
   - `main / module / types` が `dist/` 配下
   - `exports."."` が `dist/` 配下
   - `exports."./preset"` が `preset.ts` 直
   - `peerDependencies.react` / `peerDependencies.react-dom` が存在
   - `dependencies` に `react` / `react-dom` が **存在しない**
   - `dependencies` に `gen-interface-jp` が **存在しない**(devDependencies に移動済)
   - `publishConfig.access === "public"`
   - `files` が `["dist", "preset.ts", "README.md", "LICENSE.txt"]`
5. **build verify**(INV-002、AC-002):
   - `npm run build` 成功
   - `dist/index.js`、`dist/index.cjs`、`dist/index.d.ts` 存在
   - `node -e "require('./dist/index.cjs').Button"` で named export 動作確認(stub レベル、render は不要)
6. **`npm pack --dry-run`**(INV-001、AC-001、AC-005):
   - 出力リストに **`dist/`、`preset.ts`、`README.md`、`LICENSE.txt`、`package.json` 以外が無い**ことを目視。
   - tarball サイズが妥当(数百 KB 以内、超えていれば audit やり直し)。

### Publish phase(Step 8、`npm publish` 実行)

7. **ユーザー最終確認**:agent misbehavior check として、publish 直前にユーザー同意を取る。同意なしでは絶対実行しない。
8. **`npm publish --access public`** 実行(INV-007、AC-006):
   - exit code 0 を確認。
   - エラーログがあれば Verdict BLOCKED として記録。
9. **`npm view @otibo/ui@0.1.0`**(INV-007、AC-006):
   - `version === "0.1.0"` が出力に含まれる。
   - `dist-tags.latest === "0.1.0"` を確認。

### Post-publish phase(Step 9、verification 記録)

10. **(任意)preset resolve test**(INV-004、AC-004):
    - 別ディレクトリで `npm install @otibo/ui`、`node --input-type=module -e "import('@otibo/ui/preset').then(p => console.log(typeof p.default))"` で resolve 確認。
    - 失敗時は follow-up TODO(`Pkg-Bug-N: preset export が consumer から resolve できない`)を起票、本 task は PARTIAL。
11. **AC-007**(INV-008):**本 task の scope 外**として記録、`otibo-dev/App-Feat-11` に引き継ぐ。

## Regression / Behavior preservation

- **既存 Ladle story が動く**:`npm run ladle` で otibo-ui の dev 環境が壊れていない(devDependencies 移動後の動作確認)。
- **既存 component の API は不変**:現状の export 構造を保つ。`./styles.css` export 削除は API 変更だが、consumer は現状存在しない(初版)ので影響なし。
- **typecheck / lint**:`npm run typecheck` / `npm run lint` が通る(Plan の `prepublishOnly` で gate)。

## Agent misbehavior checks

template の grain に従い、本 task は **agent workflow / Skill / CI 関連の変更ではない**が、不可逆操作(`npm publish`)を含むため以下を明示:

- **agent が `git push` / `git commit` を勝手に実行しない**(memory `vcs-jj-not-git`、AGENTS.md 禁止事項)。jj/git 操作はユーザー。
- **agent が secret を `verification.md` に書き込まない**:audit で発見した値は masking、`[redacted]` 表記。
- **agent が `npm publish` を user 確認なしで実行しない**:初公開は不可逆、明示的合意必須。Step 8 でユーザーに最終確認。
- **agent が `npm unpublish` を勝手に実行しない**:同様に user 確認必須(24h 以内のみ可、それ以降は不可)。
- **agent が `.env*` 等の設定ファイルを publish に含めない**:INV-001 audit で gate。

## Verdict 判定

| 条件 | Verdict |
| --- | --- |
| AC-001〜006 すべて PASS + INV-001〜007 確認 + secret 漏洩なし + `npm view` で公開確認 | **PASS** |
| AC-001〜006 PASS、AC-007 は外部 task に引き継ぎ(明記) | **PASS**(本 task scope に対して。AC-007 は別 task に分離されている。) |
| AC-001〜005 PASS、AC-006 で publish 後に何か軽微な問題(README typo 等)発覚 | **PARTIAL** + follow-up TODO 起票 |
| INV-001 で secret 検出 | **FAIL**(publish しない、修正してから再実施) |
| `@otibo` scope 取得不可 / 認証失敗 / publish エラー | **BLOCKED** + Intent / Plan に戻る |
| AC-002 で build が動かない / dist が import できない | **FAIL** |
| AC-004 で preset が resolve できない | publish 後発見なら **PARTIAL** + follow-up、publish 前発見なら **BLOCKED**(修正) |

## 関連

- Intent: `_docs/intent/Pkg/initial-public-publish/decision.md`
- Plan: `_docs/plan/Pkg/initial-public-publish/plan.md`
- TODO: `Pkg-Feat-5`
- 連動 task(別 repo):`otibo-dev/App-Feat-11`(AC-007 / INV-008 の verify)
- memory: `panda-dynamic-component-staticcss`、`vcs-jj-not-git`、`otibo-ui-ladle-vite-deps`
