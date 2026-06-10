---
title: otibo-ui Headless Primitive Policy
status: active
draft_status: n/a
created_at: 2026-06-12
updated_at: 2026-06-12
references:
  - "../../../package.json"
  - "token-semantic-usage-map.md"
related_issues: []
related_prs: []
---

## Overview

otibo-ui は **visual UI framework を採用しない**。component の見た目は Panda CSS の recipe / slot recipe で 100% 自前で構築する。

一方、**accessibility 配線(focus management、ARIA 属性、keyboard 操作、constraint validation 等)は headless primitive library に委譲する**。これは「a11y を毎回自前で組み直さない」という運用判断であり、grammar 上の本質ではない。

primitive library として **`@base-ui-components/react`(Base UI)を採用する**。

## Scope

この文書が決めること:

- otibo-ui が外部 UI ライブラリに対して取る姿勢
- a11y primitive の役割分担(何を library に任せ、何を otibo が所有するか)
- 選定 library の確定(2026-06-12 時点)
- 代替に切り替える場合の判定基準

この文書が決めないこと:

- 個別 component の anatomy / signature(他 reference 参照)
- Panda CSS の使い方(`token-semantic-usage-map.md` 参照)
- form 状態管理 library の選定(別件)

## The Decision

**otibo-ui の component は次の二層で構成する**:

1. **a11y / interaction layer**:Base UI primitive(`@base-ui-components/react/<part>`)
2. **visual layer**:Panda CSS recipe(otibo の grammar 通り)

両層が一つの component の中で組み合わさる。例(現状の Field):

```tsx
import { Field as BaseField } from "@base-ui-components/react/field"
import { field } from "@/styled-system/recipes"

// a11y は Base UI、surface は Panda recipe
<BaseField.Root className={field().root}>
  <BaseField.Label className={field().label}>
  <BaseField.Control className={input()}>
  <BaseField.Description className={field().description}>
  <BaseField.Error className={field().error} match={...}>
```

## Why Base UI

選択肢:Base UI / Radix UI / Ark UI / Headless UI / 自前実装

Base UI を採る理由:

- **React 19 / form actions / suspense との整合**:Material UI チームによる新世代 primitive。Radix の後続として設計され、React 18+ の hooks / suspense / form 連携を前提
- **API の grammar 一貫性**:Field / Form 系の constraint validation 連携が宣言的(`match` prop で ValidityState に bind 等)。otibo の「state expression」grammar と相性が良い
- **SSR / RSC 互換**:Next.js App Router での server component 内利用が公式 support
- **tree-shake 単位**:`@base-ui-components/react/field`、`@base-ui-components/react/checkbox` のように part 単位で import 可能。bundle size が予測しやすい
- **活発な maintenance**:Material UI チームが本体としてメンテ

Radix UI を採らない理由:

- 設計上の機能差はわずか(両方とも headless で十分成熟)
- API は Base UI の方が新しめで RSC / form 連携で先行している
- どちらを選んでも単独で困らないが、複数を mix すると grammar が分裂するため一つに固定する

自前実装を採らない理由:

- a11y は domain knowledge の塊(focus trap、roving tabindex、type-ahead 等)で、自前で正しく組むコストが高い
- 「visual は所有、a11y は委譲」は適切な責務分割

## What otibo Owns vs What The Library Owns

| Layer | 担当 | 例 |
| --- | --- | --- |
| Surface paint(色 / shadow / radius / spacing / typography)| **otibo (Panda)** | Field 各 slot の color、Input の inset shadow |
| Interaction signature(凹み / underline / hover bg)| **otibo (Panda)** | InlineEdit の underline、Input の field shadow |
| Composition / anatomy | **otibo (recipe)** | slot 配置、size variants、density variants |
| ARIA attributes 自動配線 | **Base UI** | `aria-labelledby` / `aria-describedby` の伝播 |
| Focus management | **Base UI** | Dialog の focus trap、RadioGroup の roving tabindex |
| Keyboard operation | **Base UI** | Select の type-ahead、Tabs の arrow navigation |
| Constraint validation 連動 | **Base UI** | `Field.Error` の `match` prop |
| State machine(open / closed、active 等)| **Base UI** | Popover / Dialog / Tooltip の controlled API |

## Components That Need Base UI Backing

a11y / interaction が複雑な component は Base UI に委譲する:

- **Field**(現状実装済み)── label / description / error / control の a11y 配線
- **Checkbox** ── focus、indeterminate state、label 関連付け
- **RadioGroup** ── roving tabindex、value 管理
- **Switch** ── checkbox 派生、role="switch"
- **Select** ── popover、keyboard navigation、type-ahead、listbox semantics
- **Dialog / AlertDialog** ── focus trap、scroll lock、escape handling
- **Popover** ── positioning、outside-click、focus return
- **Tabs** ── arrow navigation、aria-controls 連動
- **Tooltip** ── delay、touch handling、role="tooltip"
- **Menu / DropdownMenu** ── keyboard navigation、submenu handling

## Components That DON'T Need Base UI Backing

a11y / interaction が単純な component は素の HTML element に Panda recipe を当てる。Base UI を経由する必要はない:

- **Card** ── `<div>` に slot recipe(role が要る場合は consumer が補う)
- **Button** ── `<button>` に recipe(focus / disabled は native + recipe で十分)
- **Input**(standalone)── `<input>` に recipe。a11y wrap が要る場合は Field 経由
- **InlineEdit** ── 自前の `<button>` / `<input>` toggle + recipe(現状)
- **Textarea**(将来)── `<textarea>` に recipe で済む可能性が高い

判定基準:**ARIA pattern や keyboard 操作が、素の HTML element + 普通の React state では再現できない** → Base UI 経由。それ以外は素で組む。

## Replacement Criteria

Base UI を放棄して別 library / 自前実装に切り替える条件:

- Base UI が long-term maintenance を停止した
- 重大な a11y bug が放置されている
- otibo の grammar(state expression、signature 分離)と整合しない API 変更があった
- React のメジャー変更で互換性が失われた

代替に切り替える場合、grammar 層(Panda recipe、visual signature、token usage)は影響を受けない設計を保つ。Base UI は wrapper 内に閉じ込めて、otibo が export する component API は library 非依存に保つ(これは将来 swap を可能にするための運用原則)。

## Concrete Bindings Catalog

`package.json` の `dependencies` に `@base-ui-components/react` を持つ。version は major で固定し、minor / patch は同 major 内で追従。

```
"@base-ui-components/react": "^1.0.0-beta.6"
```

(2026-06-12 現在の prototype 期は beta、stable release 後に `^1` 系へ移行)

各 component の import は part 単位:

```
@base-ui-components/react/field
@base-ui-components/react/checkbox
@base-ui-components/react/radio
...
```

barrel import(`@base-ui-components/react` 直下から全部)は避ける(tree-shake のため)。

## Verification

- 関連 grammar: `token-semantic-usage-map.md` §Signature Per Affordance Variant
- 実装 source of truth: `package.json` + 各 component の `*.tsx`
- prototype 期(2026-06)の Field 実装が最初の整合例
