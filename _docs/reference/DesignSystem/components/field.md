---
title: Field
status: active
component: src/core-ui/field/
references:
  - "../principles.md"
  - "../component-selection-map.md"
  - "../token-semantic-usage-map.md"
---

## Overview

form の **「一行」を束ねる Internal boundary**。Label / Control(Input・Select・Combobox・etc)/ Description(help)/ Error を「同じ作業単位」として組み、`aria-labelledby` / `aria-describedby` / `aria-invalid` を **Base UI Field primitive 経由で自動配線**する。control 単体ではなく Field でラップするのが otibo の標準。

## API

slot recipe(Panda)+ Base UI Field 委譲。slot は `root` / `label` / `description` / `error`。

```tsx
<Field.Root>
  <Field.Label>メールアドレス</Field.Label>
  <Input type="email" />
  <Field.Description>仕事用のアドレスをご利用ください</Field.Description>
  <Field.Error>有効な形式で入力してください</Field.Error>
</Field.Root>
```

`Field.Error` は **Base UI が validation state を持つ時だけ render される**(`aria-invalid` 設定や HTML constraint validation の trigger 時)。常時出したい error も Base UI の API で制御可能。

## Variants

| Variant | 値 | 既定 | 用途 |
| --- | --- | --- | --- |
| `density` | `comfortable` / `compact` | `comfortable` | 通常 form(comfortable)/ Settings sheet 等 dense surface(compact) |

- **comfortable** ── `root.gap: 1.5`(0.375rem)── label と control、control と help の間に余裕。
- **compact** ── `root.gap: 1`(0.25rem)── 行数が多い設定画面で field stack が間延びしないように。

## States

Field 自身は state を持たない(state は内側の control が持ち、Base UI が `aria-invalid` 等を通じて伝播する)。slot ごとの**静的 typography** だけ持つ:

| Slot | Typography |
| --- | --- |
| **label** | `fontSize: base`(16px) + `fontWeight: medium` + `color: fg.strong` |
| **description** | `fontSize: sm`(14px) + `fontWeight: regular` + `color: fg.muted` |
| **error** | `fontSize: sm`(14px) + `fontWeight: medium` + `color: danger` |

**error は description と同 size / 同 line-height だが weight が medium**(description は regular)── icon に頼らず **weight 軸で disambiguate** する設計(grammar §Danger Is A State の「彩度で訴える代わりに配置と文言で伝える」を weight 軸に拡張)。

## a11y

- **primitive** ── `@base-ui-components/react/field`(`Field.Root` / `Field.Label` / `Field.Description` / `Field.Error` / `Field.Validity`)。
- **自動配線** ── label↔control の `for` / `id`、help↔control の `aria-describedby`、error 表示時の `aria-invalid` を Field primitive が引き受ける。consumer が手で `htmlFor` / `id` を書く必要がない。
- **constraint validation** ── ネイティブ HTML validation(`required` / `pattern` / `type=email` 等)と統合。`Field.Validity` で `validity.valueMissing` 等にアクセスできる。
- **error メッセージ** ── 表示と同時に SR に通知される(`role="alert"` 相当の挙動を Base UI が担保)。

## Motion

Field 自身は motion を持たない(layout だけ)。state 遷移の motion は内側の control(Input / Select 等)が持つ。

## Use when

- form control を**単独で置く時は必ず Field でラップする**(label と help と error が必ず付くため、また a11y 配線のため)。
- 「label」「control」「help」「error」のうち**一つでも要る**ならまず Field を考える。
- 同じ form 内で並ぶ複数行を、stack で揃えたい時(`Field.Root` を vertical stack の item として並べる)。

## Use instead

- **label が不要な単独 control**(toolbar の Input、search box only 等) → Field を外して直接 control。aria-label を control 側に手で付ける。
- **複数 control を 1 行で組む**(姓 / 名 を横並び等) → 外側に独自 wrapper を作り、内側に複数 Field か単一 Field + 横並び control を組む。Field 1 個で複数 control を束ねるのは Base UI primitive の責務外。
- **form 全体の構造**(複数 Field の並び、submit ボタン位置) → Form / Card 側で組む。Field は「一行」の単位。

詳細は `component-selection-map.md` §form 値入力。

## Avoid

- control を直接ベタ置きする(label が漏れる / a11y が壊れる)── Field でラップする。
- `<label>` を手で書いて `htmlFor` を control の id と紐付ける(Base UI Field が自動で配線するので不要)。
- error をエラー時以外も常時 render する(Field.Error は条件付き render を前提)。
- error と description を**色だけ**で分ける(色覚特性で読み分けが壊れる)── weight を変える otibo 既定を保つ。
- Field の slot に control 以外の重い content を入れる(レイアウトが破綻)── Field は form 行の単位、Card のような盛り上げは想定外。

## Decisions(本セッションの確定事項)

- **Base UI Field を採用**(primitive 一本化、`headless-primitive-policy.md` の方針) ── a11y の自動配線(label/help/error)を毎回手で書かないため。
- **density 二段(comfortable / compact)で打ち止め** ── form の段は size より **gap** で表現する方が grain が保たれる(label / control の typography size は揃えたまま、間隔だけ変える)。
- **error weight = medium、description weight = regular** ── 同 size / 同 lineHeight の中で **weight 軸で disambiguate**。icon に頼らず typography で error を読み分ける。danger 色は二重 signal(色 + weight)で、色覚特性のあるユーザーにも weight で届く。
- **error 色は danger(token)** ── otibo の ladder 上の danger を使う(原則 3)、新 hue を作らない。
- **slot 名固定(root / label / description / error)**、help / hint / note 等の synonyms は採らない ── HTML 由来の `description` を一本化(Base UI の slot 名と整合)。

## Related

- 上位:`principles.md` §3(emphasis ladder、danger は ladder 上)、§14(Base UI 一本)
- 内部 control:Input / Select / Combobox / NumberField / InlineEdit / Switch / Checkbox / RadioGroup
- 親:Form / Card(form 全体の構造、Field 複数を並べる文脈)
- 住み分け:`component-selection-map.md` §form 値入力
- 詳細:`src/core-ui/field/field.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/field`
- memory:[[otibo-ds-progress]](Field の決定全般)
