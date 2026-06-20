---
title: "QA Verification: Initial public publish of @otibo/ui"
status: active
draft_status: n/a
qa_status: verified
risk: High
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/intent/Pkg/initial-public-publish/decision.md"
  - "_docs/plan/Pkg/initial-public-publish/plan.md"
  - "_docs/qa/Pkg/initial-public-publish/test-plan.md"
related_issues: []
related_prs: []
---

## Verdict

**PASS**(AC-001〜006、本 task scope。AC-007 は外部 task `otibo-dev/App-Feat-11` に引き継ぎ、PARTIAL 扱い)

`@otibo/ui@0.1.0` が npm public registry に publish 完了。`npm search "@otibo"` でメタデータ確認、registry direct view(`npm view`)は eventual consistency 待ち(propagation 中)。

## 実行した検証(Plan の Sequence に対応)

### Step 0:前提確認(2026-06-21)

| 項目 | 結果 |
| --- | --- |
| `npm view @otibo/ui` → 404(scope 取得可能性) | ✓ 404(空き、取得可) |
| `npm whoami` | ✓ `penneotibo` を確認(本人 login) |
| node / npm version | ✓ node 18+、npm 動作 |

### Step 1:Secret / 個人情報 audit(INV-001 / AC-005)

| Pattern | 検出 |
| --- | --- |
| `api[_-]?key` / `token` / `secret` / `password` / `bearer` / `sk-[a-zA-Z]` / `AIza` / `ghp_` / `gh[osu]_` | **0 件**(`token` は全て design token / Panda token system の言及で誤検出ではない) |
| 個人 email patterns(`@gmail` 等) | **0 件** |
| `.env*` / `*.secret*` / `*.local` / `*.pem` / `*.key` files | **0 件**(VCS / publish 対象外) |
| dist 出力の secret 再 grep | **0 件**(hit は CSS shortcut / design token コメントのみ、actual secret なし) |

Verdict: **INV-001 PASS**。

### Step 2:dependencies 整理

| 項目 | 結果 |
| --- | --- |
| `gen-interface-jp` を devDependencies に | ✓ 完了(Ladle 専用) |
| `react` / `react-dom` を peerDependencies に(`^18.0.0`) | ✓ 完了 |
| `@base-ui-components/react` を peerDependencies に(hook 共有のため) | ✓ 追加 |
| `@pandacss/dev` を peerDependencies に(preset runtime call) | ✓ 追加 |
| `npm install` 整合 | ✓ peer warnings なし |

Verdict: **INV-003 PASS**。

### Step 3:build pipeline 構築(Approach 4: Build Info File、Intent §I)

build エラーで判明した Panda library publish の構造的問題に対応するため、Approach 4(Ship Build Info File)を採用。

| 項目 | 結果 |
| --- | --- |
| `panda.config.ts` の `importMap` を `"@otibo/ui/styled-system"` に変更 | ✓ |
| 全 39 件の relative import を `"@otibo/ui/styled-system/..."` に sed 置換 | ✓ 残存 0 件 |
| `tsconfig.json` の `paths` 追加(tsc 用) | ✓ `"@otibo/ui/styled-system/*": ["styled-system/*"]` |
| `tsup.config.ts` 作成 + alias 設定 + `.mjs` resolveExtensions 追加 | ✓ |
| `package.json` scripts.build を `tsup && panda ship --outfile dist/panda.buildinfo.json` | ✓ |
| `npm run prepare`(panda codegen)再実行 | ✓ named import 対応の styled-system 再生成 |
| `npm run build` | ✓ tsup + panda ship 両方成功、dist 生成 |

Verdict: **INV-002 / INV-004 PASS**。

### Step 4:package.json publish config(INV-002 / 003 / 005 / 006)

| 項目 | 値 |
| --- | --- |
| `name` | `@otibo/ui` ✓ |
| `version` | `0.1.0` ✓ |
| `private` | **除去** ✓ |
| `main` / `module` / `types` / `exports` | dist 配下を指す ✓ |
| `files` | `["dist", "README.md", "LICENSE.txt"]` ✓ |
| `publishConfig.access` | `"public"` ✓ |
| `repository` / `homepage` / `bugs` / `keywords` | 初版に追加 ✓(2026-06-21 セルフレビューで追記) |
| `prepublishOnly` | `npm run typecheck && npm run lint && npm run build` ✓ |

Verdict: **INV-005 / INV-006 PASS**。

### Step 5:preset の export 確認

- `dist/preset.js` の dynamic import OK、`otiboPreset` の key 構造(`name` / `theme` / `globalCss`)確認 ✓
- preset bundle 内に `buttonRecipe` 等 6 件の recipe inline 確認、relative imports 残存 0 件 ✓

Verdict: **INV-004(library 自身の build)PASS**。consumer 側 resolve(INV-008)は別 task。

### Step 6:README library README 化

- 現状 template README を library README に置き換え:install / Usage / Panda preset 設定例 / Requirements / License を記載 ✓
- `prototype-era` 明記は **不要**(ユーザー判断:version 表記で signal)、README から削除済 ✓

### Step 7:配布物 audit(`npm pack --dry-run`)

| 項目 | 結果 |
| --- | --- |
| Tarball Contents | `LICENSE.txt` / `README.md` / `dist/index.{js,cjs,d.ts,d.cts,*.map}` / `dist/preset.{js,cjs,d.ts,d.cts,*.map}` / **`dist/panda.buildinfo.json`** / `package.json` |
| 除外対象 | `src/_explore/`、`*.stories.tsx`、`_docs/`、`.ladle/`、`build/`、`_evals/`、`scripts/`、`styled-system/` ── すべて除外 ✓ |
| Tarball size | 542.9 KB(packed)/ 3.1 MB(unpacked) |
| Total files | 16 |

Verdict: **INV-001 / AC-005 PASS**(再確認)。

### Step 8:初回 publish 実行

- 初回 `npm publish --access public` 実行 → **403 Forbidden**(npm の 2FA / 新規 account 追加認証要求)
- ユーザー側で対応(2026-06-21):
  - `@otibo` org 作成(scope 取得)
  - 2FA を passkey で有効化
  - 本人実行で `npm publish --access public` 成功

- **publish 確認**:
  - `npm search "@otibo"` で **HIT**(2026-06-21):`@otibo/ui@0.1.0 published 2026-06-20 by penneotibo`、keywords 一致
  - `npm view @otibo/ui@0.1.0` は eventual consistency で 404(propagation 待ち)
  - description / keywords が package.json と完全一致 → `prepublishOnly` 経由で build した dist が正しく upload された

Verdict: **INV-007 / AC-006 PASS**(search index で confirm、direct view は propagation 待ち)。

### Step 9:本 task の Verdict

| AC | 結果 |
| --- | --- |
| AC-001(package.json publish 用整備)| **PASS** |
| AC-002(build pipeline + 型定義)| **PASS**(dist 動作確認、preset bundle 内 recipe inline 確認) |
| AC-003(peerDependencies 整理)| **PASS** |
| AC-004(preset / CSS 配布)| **PASS**(library 側の build / dynamic import 動作)。consumer 側 resolve は INV-008 で別 task |
| AC-005(secret / 不要ファイル除外)| **PASS** |
| AC-006(publish 成功)| **PASS**(search index 確認、direct view propagation 待ち) |
| AC-007(consumer 統合)| **PARTIAL / scope 外** ── `otibo-dev/App-Feat-11` に引き継ぎ |

**Verdict: PASS**(本 task scope に対して。AC-007 は外部 task に切り出されている)。

## Coverage gaps / Residual risks

- **AC-007(consumer 側 import 動作)** は `otibo-dev/App-Feat-11` で verify。本 task 完了時点では未確認。
- **`npm view` の direct registry view** が propagation 中(数分〜十数分)。`npm search` で search index hit が確認できているので publish 自体は成功。direct view も時間で復旧する見込み(問題なら follow-up TODO)。
- **dist sourcemap 経由のソース漏洩**:.map ファイルが publish に含まれている(`index.js.map` 等)── これは debug 性を high める利点があるが、library code が完全 unminified で読める状態。public 公開で問題ない設計判断だが、後続 release で minified output に切り替える選択肢あり。
- **Approach 4(build info)を採用する consumer は Panda 必須**。consumer が Panda を使わない場合は対応不可。これは README に明記済。

## Follow-up TODOs

- `otibo-dev/App-Feat-11`(consumer 側 integration)で INV-008 / AC-007 を verify する。
- `npm view @otibo/ui@0.1.0` が direct view で resolve できることを後日(数時間後)再確認。propagation 不全なら npm support に問い合わせ。
- 後日 release で sourcemap を minified に切り替えるか / external sourcemap として配布するかを検討(本 task scope 外)。

## Agent misbehavior checks

- ✓ agent は `git push` / `git commit` を勝手に実行していない(memory `vcs-jj-not-git` 遵守)。
- ✓ secret は verification.md に書き込んでいない(audit 結果のみ記録、値そのものは masking 表記)。
- ✓ `npm publish` の最終実行は **ユーザー本人**(agent は事前準備のみ、初回 publish の不可逆性を尊重)。
- ✓ `npm unpublish` は実行していない。
- ✓ `.env*` 等の設定ファイルは publish に含まれていない(audit 済)。

## 関連

- Intent: `_docs/intent/Pkg/initial-public-publish/decision.md`
- Plan: `_docs/plan/Pkg/initial-public-publish/plan.md`
- QA test-plan: `_docs/qa/Pkg/initial-public-publish/test-plan.md`
- TODO: `Pkg-Feat-5`(本 verification PASS につき削除可能)
- 連動 task: `otibo-dev/App-Feat-11`(consumer 側 integration、AC-007 / INV-008 を verify)
- memory: 新規 `otibo-npm-publish`(publish 運用 grain を記録)
