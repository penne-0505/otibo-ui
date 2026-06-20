# Project Task Management Rules

## 0. System Metadata

- **Current Max ID**: `Next ID No: 10` (タスク追加時にインクリメント必須)
- **ID Source of Truth**: このファイルの `Next ID No` 行が、全プロジェクトにおける唯一の ID 発番元である。

## 1. Task Lifecycle (State Machine)

タスクは以下の順序で単方向に遷移する。逆行は原則禁止とする。

### Phase 0: Inbox (Human Write-only)

- **Location**: `## Inbox` セクション
- **Description**: 人間がアイデアや依頼を書き殴る場所。フォーマット不問。ID 未付与。
- **Exit Condition**: LLM が内容を解析し、ID を付与して `Backlog` へ構造化移動する。

### Phase 1: Backlog (Structured)

- **Location**: `## Backlog` セクション
- **Status**: タスクとして認識済みだが、着手準備未完了。
- **Entry Criteria**:
  - ID が一意に採番されている。
  - 必須フィールドがすべて埋まっている。
  - `Risk`, `Acceptance Criteria`, `Intent`, `QA`, `Verification` が明示されている。
- **Exit Condition**: `Ready` の要件を満たす。

### Phase 2: Ready (Actionable)

- **Location**: `## Ready` セクション
- **Status**: いつでも着手可能な状態。
- **Entry Criteria**:
  - `Size >= M` の場合、Plan / Intent / QA が作成済みである。
  - `Risk >= Medium` の場合、Intent / QA が作成済みである。
  - Dependencies が解決済み、または未解決理由が明確である。
  - Steps が具体的、または Plan / QA への進行管理ポインタとして機能している。
- **Exit Condition**: 作業者がタスクに着手する。

### Phase 3: In Progress

- **Location**: `## In Progress` セクション
- **Status**: 現在実行中。
- **Entry Criteria**: 作業者がアサインされている、または自律的に着手している。

### Phase 4: Completed

- **Location**: なし。完了タスクは `TODO.md` から削除する。
- **Exit Action**: Goal と Acceptance Criteria の達成、および必要な verification verdict を確認後に削除する。
- **History**: 完了履歴は PR / commit / CHANGELOG / intent / guide / reference / QA verification に残す。`TODO.md` に Done / Archived セクションは作らない。

## 2. Schema & Validation

各タスクは以下のフィールドを必須とする。

| Field | Type | Constraint / Value Set |
| --- | --- | --- |
| **Title** | `String` | `[Category] Title` 形式。Category は後述の Enum 参照。 |
| **ID** | `String` | `<Area>-<Category>-<Number>` 形式。不変の一意キー。 |
| **Priority** | `Enum` | `P0` / `P1` / `P2` / `P3` |
| **Size** | `Enum` | `XS` / `S` / `M` / `L` / `XL` |
| **Risk** | `Enum` | `Low` / `Medium` / `High` / `Critical` |
| **Area** | `String` | タスクの論理領域。各 canonical path の `<Area>` と一致させる。 |
| **Dependencies** | `List<ID>` | 依存タスク ID の配列。なしは `[]`。 |
| **Goal** | `String` | 完了後に成り立つ状態を一文で書く。 |
| **Acceptance Criteria** | `Markdown` | `AC-001` 形式で、検証可能な条件を書く。 |
| **Steps** | `Markdown` | 進行管理用チェックリスト。 |
| **Description** | `Markdown` | Context / Notes を含める。 |
| **Plan** | `Path` | `None` または `_docs/plan/<Area>/<slug>/plan.md`。 |
| **Intent** | `Path` | `None` または `_docs/intent/<Area>/<slug>/decision.md`。 |
| **QA** | `Path` | `None` または `_docs/qa/<Area>/<slug>/test-plan.md`。 |
| **Verification** | `Path` | `None` または `_docs/qa/<Area>/<slug>/verification.md`。 |

推奨形式:

```markdown
### <ID>: [<Category>] <Title>

- **Title**: [<Category>] <Title>
- **ID**: <Area>-<Category>-<Number>
- **Priority**: P0 | P1 | P2 | P3
- **Size**: XS | S | M | L | XL
- **Risk**: Low | Medium | High | Critical
- **Area**: <Area>
- **Dependencies**: []
- **Goal**: <one sentence>
- **Acceptance Criteria**:
  - AC-001:
  - AC-002:
- **Steps**:
  1. [ ] Step 1
  2. [ ] Step 2
- **Description**:
  - Context:
  - Notes:
- **Plan**: None | _docs/plan/<Area>/<slug>/plan.md
- **Intent**: None | _docs/intent/<Area>/<slug>/decision.md
- **QA**: None | _docs/qa/<Area>/<slug>/test-plan.md
- **Verification**: None | _docs/qa/<Area>/<slug>/verification.md
```

## 3. Required Documents

| Condition | Requirement |
| --- | --- |
| `Size XS/S` and `Risk Low` | Plan / Intent / QA / Verification は `None` 可。 |
| `Size >= M` | Plan / Intent / QA が必須。 |
| `Risk >= Medium` | Intent / QA が必須。 |
| `Risk High / Critical` | Plan / Intent / QA が必須。完了前に Verification が必須。 |
| `Category Bug` | Acceptance Criteria に再発防止条件を含め、QA test-plan に regression test または no-test rationale を含める。 |
| `Category Refactor` | QA test-plan に behavior-preservation checks を含める。 |
| Agent workflow / validator / CI / Skill / documentation rule 変更 | QA test-plan に agent misbehavior checks を含める。 |

## 4. Completion Rules

タスクを `TODO.md` から削除できるのは、以下を満たす場合のみ。

1. Steps が完了している。
2. Acceptance Criteria が満たされている。
3. `Size >= M` または `Risk >= Medium` の場合、`verification.md` が存在する。
4. verification verdict が `PASS` である。
5. `PARTIAL` の場合は、残リスクと follow-up TODO が明記されている。
6. `FAIL` / `BLOCKED` の場合は完了扱いにしない。
7. 必要な intent / guide / reference / QA docs が更新されている。

完了履歴は `verification.md`、intent、guide、reference、PR / commit に残す。`TODO.md` は未完了作業の source of truth として保つ。

## 5. Canonical Document Paths

```text
_docs/draft/<Area>/<slug>/notes.md
_docs/survey/<Area>/<slug>/survey.md
_docs/plan/<Area>/<slug>/plan.md
_docs/intent/<Area>/<slug>/decision.md
_docs/qa/<Area>/<slug>/test-plan.md
_docs/qa/<Area>/<slug>/verification.md
_docs/guide/<Area>/<slug>/usage.md
_docs/reference/<Area>/<slug>/reference.md
_docs/archives/{draft,plan,survey}/<Area>/<slug>/...
```

`<Area>` はタスクの `Area` と一致させる。`<slug>` は機能・変更単位の kebab-case 名にする。`intent` / `qa` / `guide` / `reference` は archive 対象にしない。

## 6. Defined Enums

### Categories (Title & ID)

- `Feat` (New Feature)
- `Enhance` (Improvement)
- `Bug` (Fix)
- `Refactor` (Code Structuring)
- `Perf` (Performance)
- `Doc` (Documentation)
- `Test` (Testing)
- `Chore` (Maintenance/Misc)

### Priorities

- `P0`: Critical / immediate
- `P1`: High
- `P2`: Medium
- `P3`: Low

### Sizes

- `XS`: 0.5 day 未満
- `S`: 1 day 程度
- `M`: 2-3 days 程度
- `L`: 1 week 程度
- `XL`: 2 weeks 以上

### Risk

Risk の詳細は `_docs/standards/quality_assurance.md` を参照する。

- `Low`: 局所的で失敗影響が小さい変更。
- `Medium`: 機能挙動、ワークフロー、validator、ドキュメント規約、agent skill に影響する変更。
- `High`: 互換性、データ損失、認証、権限、セキュリティ、課金、外部 API、CI/CD、migration に関わる変更。
- `Critical`: 本番障害、secret 漏洩、重大なデータ破壊、ユーザー影響の大きい破壊的変更につながり得る変更。

## 7. Operational Workflows (for LLM)

### Create Task from Inbox

1. `Next ID No` を読み取り、割り当て予定の ID を決定する。
2. `Next ID No` をインクリメントしてファイルを更新する。
3. Inbox の内容を解析し、最適な `Area` / `Category` / `Risk` を決定する。
4. ID を生成する。
5. Acceptance Criteria を `AC-001` 形式で書く。
6. 必須文書条件に従い、Plan / Intent / QA / Verification を `None` または canonical path で埋める。
7. タスクを `Backlog` の末尾に追加する。
8. 元の Inbox 行を削除する。

### Promote to Ready

1. `Size >= M` なら Plan / Intent / QA が存在することを確認する。
2. `Risk >= Medium` なら Intent / QA が存在することを確認する。
3. QA test-plan の Test Matrix が、主要 AC / INV を最低 1 つの確認手段へ割り当てていることを確認する。
4. Dependencies が解決済みか確認する。
5. 全てクリアした場合のみ `Ready` セクションへ移動する。

### Complete Task

1. Steps と Acceptance Criteria を確認する。
2. `Size >= M` または `Risk >= Medium` なら `qa-review` skill を使う。
3. verification verdict が `PASS`、または許容済み `PARTIAL` であることを確認する。
4. `FAIL` / `BLOCKED` の場合は、タスクを残すか follow-up を追加する。
5. 完了可能な場合のみ `TODO.md` から削除する。

## 8. Task Definition Examples

### Case A: XS/S + Low Risk Task

```markdown
### Docs-Chore-10: [Chore] Update project display name

- **Title**: [Chore] Update project display name
- **ID**: Docs-Chore-10
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: README と Quickstart の表示名がプロジェクト名に置き換わっている。
- **Acceptance Criteria**:
  - AC-001: README の旧テンプレート名が新しいプロジェクト名に置き換わっている。
  - AC-002: Quickstart の初回案内が新しいプロジェクト名を参照している。
- **Steps**:
  1. [ ] README.md を更新する
  2. [ ] QUICKSTART.md を更新する
- **Description**:
  - Context: 新規プロジェクト作成直後の軽量カスタマイズ。
  - Notes: Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None
```

### Case B: Size M + Medium Risk Task

```markdown
### Core-Enhance-11: [Enhance] Add onboarding command

- **Title**: [Enhance] Add onboarding command
- **ID**: Core-Enhance-11
- **Priority**: P1
- **Size**: M
- **Risk**: Medium
- **Area**: Core
- **Dependencies**: []
- **Goal**: 新規メンバーが onboarding command で初期診断を実行できる。
- **Acceptance Criteria**:
  - AC-001: command が環境診断を実行し、結果を標準出力に表示する。
  - AC-002: intent-derived invariant に基づくテストまたは validator が存在する。
- **Steps**:
  1. [ ] Plan の Scope / Non-Goals を確認する
  2. [ ] QA test-plan の Test Matrix に従って実装と検証を進める
- **Description**:
  - Context: ユーザー向け workflow が増えるため Medium risk とする。
  - Notes: Plan / Intent / QA が必須。
- **Plan**: _docs/plan/Core/onboarding-command/plan.md
- **Intent**: _docs/intent/Core/onboarding-command/decision.md
- **QA**: _docs/qa/Core/onboarding-command/test-plan.md
- **Verification**: None
```

### Case C: Agent Workflow / Validator / Skill Task

```markdown
### Workflow-Chore-12: [Chore] Tighten TODO validator

- **Title**: [Chore] Tighten TODO validator
- **ID**: Workflow-Chore-12
- **Priority**: P1
- **Size**: M
- **Risk**: Medium
- **Area**: Workflow
- **Dependencies**: []
- **Goal**: TODO validator が新 schema と QA 必須条件を検出できる。
- **Acceptance Criteria**:
  - AC-001: validator が Risk / Intent / QA 欠落を error として検出する。
  - AC-002: QA test-plan に agent misbehavior checks が含まれている。
- **Steps**:
  1. [ ] Plan / Intent / QA を読む
  2. [ ] validator を更新する
  3. [ ] agent misbehavior checks を verification に残す
- **Description**:
  - Context: Agent workflow / validator / Skill 変更では、agent が古い運用へ戻るリスクを検証する。
  - Notes: `validate-todo` と `validate-qa` の両方を実行する。
- **Plan**: _docs/plan/Workflow/todo-validator/plan.md
- **Intent**: _docs/intent/Workflow/todo-validator/decision.md
- **QA**: _docs/qa/Workflow/todo-validator/test-plan.md
- **Verification**: None
```

---

## Inbox

-

---

## Backlog

### Docs-Chore-1: [Chore] Review and customize AGENTS.md

- **Title**: [Chore] Review and customize AGENTS.md
- **ID**: Docs-Chore-1
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `AGENTS.md` がプロジェクトのニーズに応じて必要に応じて編集されている。
- **Acceptance Criteria**:
  - AC-001: `AGENTS.md` の禁止事項、実行環境、推奨コマンドがプロジェクト実態に合っている。
  - AC-002: 外部入力、secret、破壊的操作の扱いがプロジェクトの安全基準と矛盾していない。
- **Steps**:
  1. [ ] `AGENTS.md` を開き、既存の内容を確認する
  2. [ ] 必要に応じてプロジェクト固有のコマンドや禁止事項を追記する
  3. [ ] 変更後にリンクと安全基準の整合性を確認する
- **Description**:
  - Context: 新規プロジェクト作成直後に agent 向け入口を調整する。
  - Notes: `Size XS` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Docs-Chore-2: [Chore] Customize README.md for project

- **Title**: [Chore] Customize README.md for project
- **ID**: Docs-Chore-2
- **Priority**: P0
- **Size**: S
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `README.md` がプロジェクトの概要、目的、使用方法に合わせて編集されている。
- **Acceptance Criteria**:
  - AC-001: README の概要、使用方法、カスタマイズ案内がプロジェクト固有の内容になっている。
  - AC-002: テンプレート由来の不要な説明が残っていない。
- **Steps**:
  1. [ ] 現在の `README.md` を確認する
  2. [ ] プロジェクト名、概要、説明をプロジェクトに合わせて書き換える
  3. [ ] 使用方法セクションを編集する
  4. [ ] 不要なテンプレート固有の記述を削除または修正する
- **Description**:
  - Context: テンプレートから実プロジェクトへ移行するための初期作業。
  - Notes: `Size S` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Docs-Chore-3: [Chore] Update LICENSE.txt author attribution

- **Title**: [Chore] Update LICENSE.txt author attribution
- **ID**: Docs-Chore-3
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Docs
- **Dependencies**: []
- **Goal**: `LICENSE.txt` の著作者名が正しいものに編集されている。
- **Acceptance Criteria**:
  - AC-001: `LICENSE.txt` の著作者表示がプロジェクトの権利者に更新されている。
  - AC-002: README のライセンスリンクが `LICENSE.txt` を参照している。
- **Steps**:
  1. [ ] `LICENSE.txt` を開き、著作者名を確認する
  2. [ ] 正しい著作者名に編集する
  3. [ ] README のライセンスリンクを確認する
- **Description**:
  - Context: OSS 配布前に著作者表示をプロジェクトに合わせる。
  - Notes: `Size XS` かつ `Risk Low` のため Plan / Intent / QA は不要。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Pkg-Doc-7: [Doc] README fix — include canonical + RSC flat export note

- **Title**: [Doc] README fix — include canonical + RSC flat export note
- **ID**: Pkg-Doc-7
- **Priority**: P1
- **Size**: XS
- **Risk**: Low
- **Area**: Pkg
- **Dependencies**: []
- **Goal**: README の consumer 向け Usage 例が、Approach 4 の正本設定および Next.js App Router RSC consumer での安全な import 形式を反映している。
- **Acceptance Criteria**:
  - AC-001: README の `panda.config.ts` 設定例の `include` が `./node_modules/@otibo/ui/dist/panda.buildinfo.json`(Approach 4 canonical、1 ファイル)になっており、古い `./node_modules/@otibo/ui/dist/**/*.{js,cjs}` glob 表記は除去されている。
  - AC-002: README の Usage 例(`<Field.Root>` 等の namespace 形式)に、Next.js App Router の Server Component で使う場合は **flat export(`FieldRoot` 等)を推奨** する短い note が併記されている(理由:RSC bundler が namespace property を Client Manifest で resolve できず build 失敗する)。
  - AC-003: 既存の Usage 例自体は残す(SPA / Pages Router / その他 consumer での namespace 形式は引き続き有効)。
- **Steps**:
  1. [ ] README の `include` 表記を Approach 4 canonical に置換する
  2. [ ] Usage 例に RSC flat export note を追加する
  3. [ ] markdownlint / 表記揺れを軽く確認
- **Description**:
  - Context: `otibo-dev/App-Feat-11`(`@otibo/ui@0.1.1` の consumer 統合)で発見。README の include glob は古い表記(canonical Intent §I は buildinfo 1 ファイル)。また Usage 例(`<Field.Root>`)を Next.js App Router の Server Component から使うと build が落ちる。
  - Notes: `Size XS / Risk Low` のため Plan / Intent / QA は不要。**Pkg-Enhance-8 と関連**(本 task は README の Usage 例 1 箇所と include 表記の修正のみ、namespace export の全体設計判断は別 task)。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Pkg-Enhance-8: [Enhance] Namespace export design — docs note vs deprecate

- **Title**: [Enhance] Namespace export design — docs note vs deprecate
- **ID**: Pkg-Enhance-8
- **Priority**: P2
- **Size**: M
- **Risk**: Medium
- **Area**: Pkg
- **Dependencies**: [Pkg-Doc-7]
- **Goal**: namespace export を持つ全 component(`Field` / `Card` / `Tabs` / `Toast` / `Combobox` / `NavigationMenu` / `Menu` / `Popover` / `PreviewCard` / `Dialog` / `Tooltip` / `Pagination` / `Accordion` / `Breadcrumb` / `SegmentedControl` / `Select` / `Table` / `RadioGroup` / `ChipGroup` / `NumberField` / `InlineEdit` / `Slider` / `ScrollArea` / 等)について、Next.js App Router RSC consumer に対する正しい使い方が library として明確に方針付けされている(docs note で済ますか、namespace 自体を deprecate するか)。
- **Acceptance Criteria**:
  - AC-001: namespace export を持つ全 component が棚卸しされ、`_docs/intent/Pkg/namespace-export-design/decision.md` に方針(docs note / deprecate / 維持の選択 + 理由)が記録されている。
  - AC-002: 採用方針に応じた library / docs / per-component spec(`_docs/reference/DesignSystem/components/<name>.md`)への反映が完了している。
  - AC-003: deprecate を選んだ場合、SemVer に従って bump 戦略(major / minor + deprecation period)が plan / intent に明記されている。
  - AC-004: typecheck / lint / build / publish dry-run が通る。
- **Steps**:
  1. [ ] Plan / Intent / QA を作成する(Plan で方針候補を列挙、Intent で決定)
  2. [ ] namespace export の現状棚卸し(grep + per-component spec)
  3. [ ] 採用方針に応じた実装(docs 追加 / API 変更 / 両方)
  4. [ ] Test:typecheck / lint / build、必要なら Ladle で動作確認
  5. [ ] Verification を残す
- **Description**:
  - Context: `otibo-dev/App-Feat-11` で `<Field.Root>` が Next.js App Router の RSC で build 失敗することを発見(Intent §Discovered)。同じ pattern を持つ component が多数あり、library 設計として方針を統一する必要がある。`flat export` は既に各 component で同居しているので、API breaking なしで docs だけ整える選択肢もある。
  - Notes: Plan / Intent / QA 必須(Size M, Risk Medium)。namespace deprecate を選ぶと breaking change(major / 大きめ minor bump)。docs note のみなら patch。Pkg-Doc-7 が完了して README の最小 fix が出てから本 task に取りかかる(`Pkg-Doc-7` を Dependencies に置く)。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

### Pkg-Chore-9: [Chore] Evaluate Base UI peer caret behaviour (beta → rc drift)

- **Title**: [Chore] Evaluate Base UI peer caret behaviour (beta → rc drift)
- **ID**: Pkg-Chore-9
- **Priority**: P2
- **Size**: XS
- **Risk**: Low
- **Area**: Pkg
- **Dependencies**: []
- **Goal**: `@otibo/ui` の `peerDependencies."@base-ui-components/react"` が consumer 側で意図通りの version を install させるか確認され、必要なら range 表記を更新する判断が記録されている。
- **Acceptance Criteria**:
  - AC-001: `^1.0.0-beta.6` が consumer の `npm install` で `^1.0.0-rc.0` を install する挙動(pre-release tag またぎ)が npm semver の仕様として正しいか、Base UI の breaking change rule(beta / rc 間)と整合しているかが確認されている。
  - AC-002: 結論(現状維持 / range を `>=1.0.0-beta.6 <2` 等に変更 / `^1.0.0-rc.0` に bump)が `_docs/intent` または本 task の Description に記録されている。
  - AC-003: range を変更する場合、`@otibo/ui` の patch / minor bump 戦略が明記されている(peer 変更は consumer に影響、breaking としての評価)。
- **Steps**:
  1. [ ] `npm semver` ドキュメントと Base UI 公式 release notes を確認
  2. [ ] otibo-ui の Button / Field 以外の component(Toast / Dialog / Combobox 等)で rc.0 の hook signature 差異が顕在化するか軽く検証(必要なら Ladle で)
  3. [ ] 判断を記録、必要なら別 follow-up task を起票
- **Description**:
  - Context: `otibo-dev/App-Feat-11` で peer `^1.0.0-beta.6` のはずが Base UI `^1.0.0-rc.0` が install された(npm の semver caret が pre-release tag またぎを許容する場合あり)。本 task ではまず評価のみ。range 変更は別 task に切り出して可。
  - Notes: `Size XS / Risk Low` のため Plan / Intent / QA は不要。range を変更する場合は Risk が上がるので、本 task は **評価のみで停止**し、変更は別 task で起票する設計。
- **Plan**: None
- **Intent**: None
- **QA**: None
- **Verification**: None

---

## Ready

---

## In Progress
