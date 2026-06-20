---
title: "Intent: Initial public publish of @otibo/ui"
status: active
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "_docs/plan/Pkg/initial-public-publish/plan.md"
  - "_docs/qa/Pkg/initial-public-publish/test-plan.md"
related_issues: []
related_prs: []
---

## 背景と目的

otibo-ui は **two-track 構造**(memory `otibo-two-track-structure`)の一翼で、app dev(otibo-dev = portfolio site)が依存する Design System ライブラリ。これまで非公開で iterate してきたが、portfolio site の本実装(otibo-dev `App-Feat-11`)で **依存として使う**ために、npm public registry に publish する必要が出た。

本 Intent は、その初公開(`@otibo/ui` v0.1.0)に伴う **不可逆性の高い決定**(scope name、version 戦略、配布方式、build pipeline)を記録する。初公開後は npm の policy 上 24 時間以内のみ unpublish 可能で、name / scope の変更は実質的に新 package として再 publish する形になるため、決定理由を log として残す価値が高い。

## 中核の決定

| 項目 | 決定 |
| --- | --- |
| **package name** | `@otibo/ui`(scoped) |
| **初版 version** | `0.1.0` |
| **registry** | npm public registry |
| **publish 公開度** | `--access public` |
| **license** | MIT(既存) |
| **build pipeline** | tsup(esbuild ベース) |
| **CSS / preset 配布方式** | **preset 経由 consumer codegen 一本**(`./styles.css` export は削除)。preset は **dist 経由**(`dist/preset.js`、`dist/preset.d.ts`)で配布。**Panda library publish は Approach 4(Ship Build Info File)を採用**(2026-06-21 訂正、下記 §E / §I 参照) |
| **Panda library publish approach** | **Approach 4: Ship Build Info File**(`panda ship --outfile dist/panda.buildinfo.json`)── consumer は buildinfo JSON 1 ファイルを `include` するだけで完結(2026-06-21 追記、下記 §I 参照) |
| **library 内 import 形式** | **`"@otibo/ui/styled-system/recipes"` の named import**(relative path から書き換え、`importMap` 経由で resolve、2026-06-21 追記) |
| **files allowlist** | `["dist", "README.md", "LICENSE.txt"]`(preset は build 出力に含まれるので allowlist から除外、2026-06-21 訂正)。`dist/` には tsup の output(`index.{js,cjs,d.ts}` / `preset.{js,cjs,d.ts}`)と `panda.buildinfo.json` の両方を含む。 |
| **`react` / `react-dom`** | dependencies → **peerDependencies** に移動 |
| **`gen-interface-jp`** | dependencies → **devDependencies** に移動 |

---

## A. package name = `@otibo/ui`(scoped)

### 決定理由
- **屋号 scope**(`@otibo`)を取ることで、将来 `@otibo/medo-client`、`@otibo/sarae-client` などの兄弟 package を出すときに **brand と name の単位が一致**する。
- scoped package は **`--access public` を明示的に渡さない限り private 扱い**で安全側に倒れる(unscoped より誤公開リスクが低い)。
- otibo は屋号(ぺんね個人事業)で、ブランドの単位は個人(penne)ではなく屋号(otibo)。scope を otibo に合わせる方が long-term grain。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| `otibo-ui`(unscoped) | npm 一意性のリスク(既に取られている可能性)+ scope 無しは brand の単位が薄まる。兄弟 package を出すとき `otibo-*` で命名が散る。 |
| `@penne/ui`(個人 scope) | penne は個人名、otibo は屋号。DS は屋号の成果物としてリリースしたい(otibo-real-goal memory の grain と一致)。個人 scope を別途取るかは将来の判断。 |

### 制約 / 不可逆性
- npm の policy:scope `@otibo` が他者に取られていれば取得不可。**`npm view @otibo/ui` で事前確認**(Plan の Step 0)。
- 初公開後 24 時間を過ぎると unpublish 不可。name 変更は deprecate + 新 name で再公開という流れになる。

---

## B. 初版 version = `0.1.0`(SemVer)

### 決定理由
- memory `otibo-real-goal` に **「DS still prototype-era」** と明記。SemVer の `0.x.y` は「**安定 API はまだ無い、minor で breaking change を出して良い**」signal。Phase 3 stocktake で per-component spec を 37 本書いて grain を固めたが、portfolio site で実使用してから「足りない / 違う」が出る可能性は高い。
- `0.1.0` は「**初の意味ある publish**」を表す慣例。`0.0.1` は patch から始まり、初の minor 到達まで `0.0.x` で余分な history が積もる ── `0.1.0` の方が清い。
- 1.0.0(安定 signal)で始めると、portfolio site の実使用フィードバックを反映するときに毎回 major bump が要る。これは otibo の prototype-era の grain と擦れる。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| `0.0.1` で始める | 慣習的に初版は `0.1.0`。`0.0.x` は「実験中の更に手前」signal で、外部に出す package には強すぎる。 |
| `1.0.0` で始める | 「安定」signal、breaking change のたびに major bump が要る。prototype-era には早すぎる。 |

### README での補強
- README に「**0.x.y は安定前、breaking change 予告なし、保証なし**」を明記する方針 → **却下**(ユーザー判断、TODO 起票時:「version 表記だけちゃんと気を遣う、明記は不要」)。
- 代わりに **version 数字そのもの**で signal を運ぶ。`0.1.x` → `0.2.x` の minor bump で「breaking change ありえた」、`0.1.0` → `0.1.1` の patch bump で「互換性のある修正」。SemVer の慣習に従う。

---

## C. registry / 公開度 = npm public, `--access public`

### 決定理由
- ユーザー判断(2026-06-21 同意):**public で publish**。
- scoped package は **既定で private**(npm の policy)── public にするには `npm publish --access public` を明示する必要がある。または `publishConfig.access: "public"` を `package.json` に書く方針。
- **`publishConfig.access: "public"` を `package.json` に書く**(明示的、CI/CD 移行時にも安全)。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| GitHub Packages | private 用途には向くが、public consumer から見ると認証が要る場合あり、grain が違う。public DS は npm が標準。 |
| Cloudflare Workers Packages | エコシステムが狭い、Panda CSS の preset 流通には不向き。 |
| private なまま file: / workspace で otibo-dev に link | 短期は可能だが、long-term の **two-track 構造**(memory `otibo-two-track-structure`)で他の consumer(将来の penne portfolio 等)からも使いたくなる時に grain が崩れる。 |

### 「public で困らないか」の検討(ユーザー判断 2026-06-21)

ユーザー懸念に対する判断 log:

1. **「otibo っぽい UI」が他者に使われる可能性** → **許容**。Stripe Sail / Vercel Geist / shadcn/ui 等の前例と同じく、DS 公開は brand 強化にもつながる。
2. **メンテナンス負荷 / breaking change の予告** → **version 表記で signal**、README 明記は不要(SemVer 慣習に任せる)。
3. **秘密情報チェック** → **必ず実施**(Plan Step 1 + QA INV-001)。
4. **package name 選択** → `@otibo/ui` で確定。

---

## D. build pipeline = tsup

### 決定理由
- **esbuild ベース**で速い、設定が短い(`tsup.config.ts` 数行)。
- **TypeScript-first**:`dts: true` で d.ts を自動生成、別途 `dts-bundle-generator` 等を入れる必要がない。
- **ESM/CJS dual** が `format: ["esm", "cjs"]` 一行で実現。consumer の module system に合わせて選ばれる。
- DS / component library で **popular な選択**(shadcn-style template、Radix UI の build、Mantine 等が tsup を採用)。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| Vite library mode | 既に `vite.config.ts`(Ladle 用)があるが、Ladle の Vite と library build の Vite を**同居させる**と config が分岐して読みにくい。library 専用 tool の方が清い。d.ts は別途 `vite-plugin-dts` が要り、設定が増える。 |
| tsc 単体 | bundling できない(consumer に raw TypeScript module tree が伝わる、tree-shaking が consumer 依存)、ESM/CJS dual も困難。 |
| unbuild / rollup | 細かい設定が要る。今の規模に対して overengineering。tsup で困ったら検討。 |
| Bun build | エコシステムの成熟度がまだ揺らぐ。安定版を取りたい。 |

### 切り替えの不可逆性
- tsup から他の bundler へ切り替えるとき、**dist/ の構造が変わる**ので consumer 影響が出る(import path、tree-shake の挙動)。breaking change として major bump(0.x → 1.0、または 0.x → 0.(x+1) の minor bump で予告)。
- 初版は tsup で固める、問題が発見されたら version bump で対応。

---

## E. CSS / preset 配布方式 = preset 経由 consumer codegen 一本

### 決定理由

memory `panda-dynamic-component-staticcss` に記載の通り、otibo-ui の component の一部は **consumer 側の `panda.config` にも `staticCss` を書かないと CSS が emit されない**(toast、pagination の active、combobox、navigation-menu、number-field):

> `staticCss` は bundler config(`panda.config.ts`)側であって preset(theme/token)側ではない。よって consumer(otibo-dev 等)が otibo-ui を使う場合、その consumer の `panda.config.ts` にも同じ `staticCss` エントリが要る(preset 継承だけでは伝播しない)。

つまり **consumer は自分で Panda codegen を実行する前提**で設計されている。よって preset を export し、consumer が `panda.config` で extend → `panda codegen` 実行、という方式が canonical。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| pre-built `styles.css` を配布 | otibo-ui で codegen 済の CSS を配布する案。consumer の Panda 環境(他 preset との合成、追加 staticCss)と**干渉**する。consumer が自分の app の他の Panda 利用と並走させたい場合、**二重 codegen / 二重 CSS で衝突**。consumer に主権を残す方が grain。 |
| 両方サポート(preset + styles.css) | 「お好きな方を」は consumer に **迷い**を生む、後方互換の負担を増やす(将来「styles.css をやめる」と言いにくくなる)。一本に絞る方が清い。 |
| CSS-in-JS への切替 | Panda は build-time CSS 抽出が grain。runtime CSS-in-JS は SSR / motion / accessibility のいくつかで grain が違う。否決。 |

### 制約

- **consumer は Panda CSS が必須**(Tailwind / CSS modules / vanilla CSS との併用は明示しない)。otibo の DS を使うには Panda を入れる、という前提を README で明示する。
- consumer の `panda.config.ts` で **`presets: [otiboPreset]`** + **`staticCss`**(必要な recipe を列挙)を書く必要がある。この設定例を README に載せる。
- consumer 側で `panda codegen` を実行(`prepare` 等の script で hook)する必要がある。これは Panda の標準 workflow。

### export 構造

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./preset": {
      "types": "./dist/preset.d.ts",
      "import": "./dist/preset.js",
      "require": "./dist/preset.cjs"
    }
  }
}
```

- `.` ── React component(build 出力)
- `./preset` ── Panda preset(**build 出力**、consumer の panda.config が import)
- **`./styles.css` export は削除**

### preset を build して dist 経由で配布する理由(2026-06-21 訂正)

当初は「preset.ts を直接 export(build しない)」設計だったが、実装時に **致命的な問題** を発見したため訂正:

- **問題**:`preset.ts` は内部で `./src/core-ui/<name>/<name>.recipe` を **relative import** している(全 37 component 分)。preset.ts 単体を publish しても、consumer 側で `node_modules/@otibo/ui/preset.ts` から `./src/core-ui/...` を解決できない(src/ が publish に含まれていないため)。
- **解決**:**preset.ts も tsup の entry に追加して build**(`dist/preset.js`、`dist/preset.cjs`、`dist/preset.d.ts`)。relative import は build 時に bundle される(self-contained になる)。
- consumer は `panda.config.ts` で `import { otiboPreset } from "@otibo/ui/preset"` と書く ── Panda が node の import resolver 経由で `dist/preset.js` を解決する。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| **preset.ts 直接 export + src/ も publish** | src/ には story / explore / internal docs が混じる、配布サイズが膨らむ、files allowlist を細かく制御するコストが高い。 |
| **preset.ts の relative import を path-mapped にして preset.ts だけ自己完結化** | recipe を 1 ファイルに inline すれば self-contained だが、preset.ts が巨大化して読みにくくなる(現状 700 行超を想定)。grain 違反。 |
| **preset を 静的 JSON で配布**(token のみ抜き出し) | Panda preset は recipe や globalCss を含むので JSON では表現できない、build した JS が必要。 |

---

## I. Panda library publish approach = Approach 4(Ship Build Info File)(2026-06-21 追記)

### 背景

initial publish 作業時に `tsup` build が **39 件の `from "../../../styled-system/recipes"` を resolve できない** failure を起こした。原因は library code が relative path で Panda codegen 出力(`styled-system/`)を import していること ── library として publish したとき consumer 側でこの path は存在しない。

この問題は **Panda CSS library publish の構造的問題**で、tsup の external だけでは解決しない。公式 docs(`https://panda-css.com/docs/guides/component-library`)に解法が記載されている。

### 公式が示す 4 approach の比較

| # | 内容 | otibo 適合 |
| --- | --- | --- |
| 1 | Ship a Panda Preset(token / recipe のみ) | ✗ component を ship したいので不適 |
| 2 | Ship Static CSS File(pre-built CSS) | ✗ recipe customize 不可、consumer の Panda 環境と衝突 |
| 3 | Include Source Files(src + styled-system を ship) | △ 動くが配布物が膨らむ |
| 4 | **Ship Build Info File**(`panda.buildinfo.json` を ship) | **✓ 採用** |

公式は Approach 3 と 4 を **「exact same end-result」** と評価。

### Approach 4 採用理由

- 配布物が **clean**:`dist/` に tsup output + `panda.buildinfo.json` の JSON 1 ファイル
- otibo-ui の src は GitHub で公開予定(透明性は repo 側で担保)、publish に含めない
- consumer は **JSON 1 ファイル**を `include` するだけで完結 ── 構造が清い
- `panda ship` の output は extraction 済 metadata、consumer codegen が速い

### Approach 4 が要求する変更

1. **library 内 import 形式の変更**:全 component の `from "../../../styled-system/<x>"` を **`from "@otibo/ui/styled-system/<x>"`** に書き換え(39 件、機械的 sed 置換)。
2. **`panda.config.ts` の `importMap`**:`"@/styled-system"` → `"@otibo/ui/styled-system"` に変更(library / consumer 双方が同じ importMap を使う、consumer codegen が library code の import を rewrite する Panda の magic)。
3. **`tsup.config.ts` に alias 追加**:library build 時、`@otibo/ui/styled-system` を library 内 `./styled-system` に解決(`esbuildOptions.alias`)。これは library 自体の build のため必要、consumer 側では `importMap` 経由で別解決される。
4. **build pipeline に `panda ship` を追加**:`scripts.build` を `tsup && panda ship --outfile dist/panda.buildinfo.json` の chain にする。
5. **`panda codegen` 再実行**:named import 形式に対応した新 `styled-system/` を library 内に再生成。

### consumer 側(otibo-dev/App-Feat-11)で必要な設定

```ts
// consumer の panda.config.ts
import { defineConfig } from "@pandacss/dev"
import { otiboPreset } from "@otibo/ui/preset"

export default defineConfig({
  presets: [otiboPreset],
  include: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@otibo/ui/dist/panda.buildinfo.json",
  ],
  importMap: "@otibo/ui/styled-system",
  staticCss: {
    recipes: {
      toast: ["*"],
      pagination: ["*"],
      combobox: ["*"],
      navigationMenu: ["*"],
      numberField: ["*"],
      toggle: ["*"],
      chip: ["*"],
    },
  },
  outdir: "styled-system",
  jsxFramework: "react",
})
```

### Approach 3(Include Source Files)を採用しなかった理由

- src/ をすべて publish する必要(story / explore / internal docs を細かく allowlist 除外する操作コスト)。
- 配布サイズが膨らむ(現状の src/ + styled-system/ 込みで MB 級)。
- 公式が「exact same end-result」と言う以上、Approach 4(clean な JSON 1 ファイル)を選ぶのが grain。

### 不可逆性

- 後から Approach 3 への切替は **breaking change**(consumer の `include` 設定が変わる) → major / minor bump で予告。
- import 形式の変更(`"../../../styled-system/..."` → `"@otibo/ui/styled-system/..."`)も同様。一度 publish したらこの形式が API の一部。

### 関連

- [Panda 公式 docs: Using Panda in a Component Library](https://panda-css.com/docs/guides/component-library)
- 調査メモ:`~/chat/otibo-ui-publish-research/findings.md`

---

## F. files allowlist = `["dist", "preset.ts", "README.md", "LICENSE.txt"]`

### 決定理由

publish tarball に含めるべきもの:
- **`dist/`**:tsup の build 出力(JS + .d.ts + sourcemap)
- **`preset.ts`**:Panda preset(consumer panda.config 用)
- **`README.md`**:install + 使い方(npm がデフォルトで含めるが allowlist では明示が安全)
- **`LICENSE.txt`**:MIT(npm デフォルト含、明示)

含めないもの(明示的に除外する理由):

| 除外項目 | Why |
| --- | --- |
| `src/_explore/` | story、internal exploration、production unrelated |
| `src/**/*.stories.tsx` | Ladle story、consumer 不要 |
| `_docs/` | otibo-ui の internal docs(principles.md、37 spec 等)。consumer は dist の API を使う、internal docs を見る必要は無い。docs を公開したい場合は別途 Ladle build を Cloudflare Pages に出す(memory `otibo-ui-pages-deploy`)。 |
| `.ladle/`、`build/` | Ladle build 出力 |
| `_evals/`、`scripts/` | template scaffolding |
| `panda.config.ts` | otibo-ui の dev 用 Panda config。consumer は自分の panda.config を持つ、otibo-ui の panda.config は不要。 |
| `node_modules/`、`.git/`、`.jj/` | npm 標準で自動除外 |
| `.env*` | 万一あれば INV-001 違反、Plan Step 1 で audit |

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| `["src", "preset.ts", "panda.config.ts"]`(現状) | `src/` の中の story / explore が含まれてしまう。`src/` を細かく除外するには `.npmignore` を厳しく書く必要があり、files allowlist 方式の方が明示的で安全。 |
| `["dist"]` のみ | preset.ts が無いと consumer が preset を読めない。`./preset` export は dist には入れない方針(上記 E)。 |

### `.gitignore` / build artifact

- `dist/` は **`.gitignore` に追加**(VCS には不要、publish 時に build して含める)。
- `prepublishOnly` script で build を走らせる(publish 前に必ず build される)。

---

## G. react / react-dom = peerDependencies

### 決定理由

- consumer の React と version 衝突を避ける。memory `otibo-ui-ladle-vite-deps` に記載の **"Invalid hook call / >1 copy of React"** 問題と同根:**同じ React instance を共有しないと hook が壊れる**。peer にして「consumer が持つ React に従う」設計が標準。
- `^18.0.0` で範囲指定(React 18 系全般)。React 19 が出たら別途検証 + 範囲拡張。

### 採用しなかった案

| 案 | Why not |
| --- | --- |
| dependencies に残す | npm install 時に otibo-ui の React と consumer の React が両方入り、bundler の hoisting によっては 2 つの React instance が出る → hook 壊れる。 |
| optionalPeerDependencies | React 必須(otibo-ui は React component library)、optional ではない。 |

---

## H. gen-interface-jp = devDependencies

### 決定理由

- `gen-interface-jp` は **`.ladle/components.tsx` だけで使用**(grep で確認、2026-06-21)── node_modules を見ると 100-800 weight の CSS + OFL.txt で、**日本語 webfont(SIL Open Font License)を Ladle 環境に load する library**。
- production library(`dist/`)には不要。consumer に install させると無駄な download。
- **devDependencies に移動**、publish には含まれない。

### 関連

- font 自体は SIL OFL ライセンス。otibo-ui の publish に含まれない以上、ライセンス上の懸念なし。

---

## 制約 / トレードオフ(全体)

- **consumer は Panda CSS 必須**(otibo-ui は Panda 前提、Tailwind 等への併用は想定外)。
- **build pipeline 切り替えコスト**:tsup から他へ移すと dist 構造が変わり consumer 影響あり。major / minor bump で予告。
- **不可逆性**:初公開後 24 時間を過ぎると unpublish 不可。name / version は事前確定。
- **0.x.y の SemVer**:minor で breaking change を出して良い、これは prototype-era の grain として明示。
- **publish 認証**:npm へのログインが penne 名義で必要(Plan の前提条件)。

## Verification 条件(QA test-plan と連動)

`_docs/qa/Pkg/initial-public-publish/test-plan.md` の **INV-001 〜 INV-008** にすべて map。verification では:

- `npm pack --dry-run` で配布物 audit(INV-001、INV-002)
- `package.json` 静的検査(INV-003、INV-005、INV-006)
- `node -e "..."` で dist の import 動作確認(INV-002、INV-004)
- `npm publish --access public` 実行 → `npm view @otibo/ui@0.1.0`(INV-007)
- AC-007(consumer 側動作確認)は **本 task の scope 外**、`otibo-dev/App-Feat-11` に引き継ぐ(INV-008)。Verdict は AC-001〜006 PASS なら本 task の Verdict は PASS、INV-008 は PARTIAL signal として残す。

## 関連

- TODO: `Pkg-Feat-5`
- Plan: `_docs/plan/Pkg/initial-public-publish/plan.md`
- QA: `_docs/qa/Pkg/initial-public-publish/test-plan.md`
- memory: `otibo-two-track-structure`、`otibo-real-goal`、`panda-dynamic-component-staticcss`、`vcs-jj-not-git`、`otibo-ui-ladle-vite-deps`、`otibo-ds-progress`
- 連動 task(別 repo):`otibo-dev/App-Feat-11`(consumer 側統合)
