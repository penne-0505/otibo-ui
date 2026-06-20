---
title: Table
status: active
component: src/core-ui/table/
references:
  - "../principles.md"
  - "../component-selection-map.md"
---

## Overview

**データ表示の表**(行列の構造)。Base UI に Table primitive は無いので **native の `<table>` 要素を styled**。otibo が最も得意な **純構造 component** ── 色を使わず、**hairline(`border.subtle`) + 余白 + タイポ**だけで構造を語る。zebra 縞や太枠は持たない(restraint、原則 1 の余白 grain)。行 hover にだけ quiet な `surface.muted` を敷く(色でなく明度差の feedback)。Card 内に収めることを前提とした paddingInline 設計。

## API

slot recipe(Panda)+ 純 native(`<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>`)。slot は `root` / `row` / `head` / `cell`。`<thead>` / `<tbody>` は素の HTML 要素で描く(slot 化しない、CSS 側で `tbody &` で scope)。

```tsx
<Table.Root>
  <thead>
    <Table.Row>
      <Table.Head>名前</Table.Head>
      <Table.Head>役割</Table.Head>
      <Table.Head>状態</Table.Head>
    </Table.Row>
  </thead>
  <tbody>
    <Table.Row>
      <Table.Cell>山田太郎</Table.Cell>
      <Table.Cell>管理者</Table.Cell>
      <Table.Cell>active</Table.Cell>
    </Table.Row>
  </tbody>
</Table.Root>
```

`<Table.Root>` は `<table>`、`borderCollapse: collapse` で hairline が二重にならない。

## Variants

なし(単一形)。size variant は持たない(restraint の grain、密度差が要るなら Field density のように上位で吸収する想定 ── 現状未着手)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | `width: 100%` + `borderCollapse: collapse` + `textAlign: start` |
| **row(thead 内)** | hover なし(header は静的) + 下端 hairline(`border.subtle`) |
| **row(tbody 内)** | 下端 hairline + 行間 transition(`background-color` quick standard) |
| **row hover(tbody)** | `bg: surface.muted`(明度差の feedback、色は使わない) |
| **row 最終(tbody `:last-of-type`)** | `borderBottomWidth: 0`(trailing hairline を引かない、「浮いた下線」を avoid) |
| **head**(th) | `xs` + `medium` + `wide letterSpacing` + `fg.muted` + `whiteSpace: nowrap` |
| **cell**(td) | `sm` + `tight` + `fg` + `verticalAlign: middle` |
| **head / cell first** | `paddingInlineStart: 0`(card 本文の左端に揃える) |
| **head / cell last** | `paddingInlineEnd: 0`(card 本文の右端に揃える) |

**最終行の hairline を引かない理由**:tbody 末尾の `border-bottom` は **「行間」ではなく「表の下端境界」**として読まれる ── 浮いた下線として見えてしまう。表の外枠は card や section 側で持つ(原則 1、余白で区切る)。

**端の cell の paddingInline = 0**:表を **card 本文の縁に揃える**(card.title の左端と table head の左端が揃う) ── これで row hover の塗りも card 幅いっぱいに伸び、表が card 内の独立した塊ではなく card の content として読まれる。

## a11y

- **structure** ── native `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>` をそのまま使う(role を再定義しない)。SR は native table を正しく読む。
- **`<th>` scope** ── 列見出しの場合は `scope="col"`、行見出しの場合は `scope="row"` を消費側で付ける(WAI-ARIA Table の標準)。
- **caption** ── 必要なら `<caption>` を `<Table.Root>` の最初の子として置く(消費側で組む)。
- **sortable / selectable** ── このスタイル recipe は描画のみ。sort / selection / pagination の機構は消費側で組む(Table は最小の primitive)。

## Motion

| 軸 | 値 |
| --- | --- |
| **row hover** Tier | `quick`(120ms) |
| **row hover** Register | **quiet**(standard) |
| 対象 property | `background-color`(transform / opacity 持たない) |

quiet 領域。表の grain として「動かない」が基本、行 hover だけが軽い feedback。

## Use when

- **行列構造のデータ表示**(列で比較したい、ユーザー / 製品 / トランザクション一覧)。
- card 内 / section 内に **整然とした表が要る場面**(restraint な見た目で content を前に出す)。

## Use instead

- **一つずつのまとまり**(album 一覧、作品 grid) → **Card**(行列でなく独立した paper の集合)。
- **小さな inline マーカー** → **Badge** / **Avatar**。
- **長 list の窓送り** → **Pagination**(Table と組み合わせる)。
- **複雑な editable grid**(spreadsheet 風) → 別 primitive 領域(otibo 未着手)。

詳細は `component-selection-map.md` §data。

## Avoid

- **zebra 縞を足す**(otibo の restraint 原則を破る、色や明度の noise を増やす)── 行 hover のみで feedback、平常は均一。
- **太枠 / 外周 border**(原則 1 の余白 grain を破る) → 外枠は card / section に任せる。
- **最終行に hairline を残す**(浮いた下線になる) → `:last-of-type` で borderBottomWidth 0。
- **first / last cell に paddingInline を足す**(card 縁から内側に inset され、title と列の左端が揃わない) → 0 で縁揃え。
- **row hover を色付きにする**(color layering 違反、原則 2 の「色は土台」に反する) → 明度差のみ(`surface.muted`)。
- **`<table>` 以外の要素で組む**(div grid 等、SR が読まない / 列構造が伝わらない) → native `<table>`。

## Decisions(本セッションの確定事項)

- **純構造で組む(zebra なし、太枠なし)** ── 原則 1 の余白 grain + restraint。色を使わずタイポと余白だけで列構造を語る ── otibo の核 grain の正典例。
- **row hover = 明度差のみ(`surface.muted`)** ── color layering(原則 2)を守り、accent や有色 hover を使わない。明度差の quiet feedback で十分。
- **最終行 hairline を消す** ── trailing hairline が「浮いた下線」になる視覚問題の解決。外枠は card / section に任せる(原則 1)。
- **端の cell paddingInline = 0**(card 本文の縁揃え) ── 表を card の content として一体化、card.title の左端と table の左端が揃う。row hover の塗りも card 幅いっぱいに伸びる。
- **native `<table>` 採用、role 再定義しない** ── SR が native を正しく読むので role 上書き不要。Base UI に Table primitive が無いことの自然な帰結。
- **sort / selection / pagination は消費側** ── Table は描画 primitive、機構は外で組む(柔軟性、Pagination との組み合わせも消費側で)。

## Related

- 上位:`principles.md` §1(構造区切りは余白、純構造の正典)、§2(色は土台、有色 hover を避ける)
- 隣接:Card(table を包む文脈)、Pagination(窓送りの組み合わせ)
- 住み分け:`component-selection-map.md` §data
- 詳細:`src/core-ui/table/table.recipe.ts`(canonical コメント)
- memory:[[otibo-ds-progress]](Table の決定全般)
