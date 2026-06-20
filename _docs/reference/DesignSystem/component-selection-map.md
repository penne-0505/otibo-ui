---
title: otibo Design System — Component Selection Map
status: active
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "token-semantic-usage-map.md"
  - "motion-grammar.md"
  - "headless-primitive-policy.md"
related_issues: []
related_prs: []
---

## Overview

otibo-ui には**「同じことをする」 component が複数ある**(例:選択を表す Toggle / Chip / SegmentedControl / Switch / Checkbox / Radio、6 種類)。同じ primitive(`@base-ui-components/react/toggle`)の上に **otibo が用途と視覚イディオムで positioning を分けて**いるためで、消費側にとっては「いつ何を使うか」が即決できる必要がある。

この文書は **本丸 UI を組み立てるときに開く ledger**。同カテゴリ内の住み分けを表と決定木で整理する。recipe の決定の **why** は `token-semantic-usage-map.md` / `motion-grammar.md` を、a11y/primitive の選定は `headless-primitive-policy.md` を参照。

## How to read

- 各章 = カテゴリ別「同じことをする N 個の component の住み分け」。
- **summary 表** = 比較の一覧、**決定木** = 「どれを使うか」の text 判定、**avoid** = 混同しやすいアンチパターン。
- 困ったら冒頭の **At-a-glance**(全 36 component の一行 catalog)→ 該当章 → summary 表、の順に降りる。
- 個別 component の API / variants / states 詳細は `components/<name>.md` 参照(Phase 3 で整備)。

## At-a-glance (全 36 component, 一行 catalog)

| Component | 領分(一言) | 章 |
| --- | --- | --- |
| Button | 主行動・補助行動の押せる箱(intent で強弱) | §form 値入力(action) |
| Link | 文中 or footer の遷移リンク(hover で accent) | §navigation |
| Input | 短いテキスト入力(field の中核) | §text 入力 |
| Field | label + control + help + error の form 行 | §form 値入力 |
| InlineEdit | 同じ場所で読み↔編集を切り替えるテキスト | §text 入力 |
| NumberField | stepper + キーボード ↑↓ + ホイール scrub | §text 入力 |
| Checkbox | フォームの複数選択肢(独立 boolean) | §選択 |
| Radio / RadioGroup | フォームの一択 | §選択 |
| Switch | 永続的な設定の on/off | §選択 |
| Toggle | toolbar の押し込み(一択 or 単体) | §選択 |
| Chip | フィルタ・タグの複数選択ピル | §選択 |
| SegmentedControl | 密に並ぶ「一つだけ選ぶ」設定 | §選択 |
| Slider | 連続値の直接操作 | §選択 / §form 値入力 |
| Select | 値を一つ選ぶ listbox(検索なし) | §form 値入力 |
| Combobox | 値を一つ選ぶ + **検索で絞れる** | §form 値入力 |
| Tabs | 同一 viewport で content を切替える | §navigation |
| Breadcrumb | 階層内の現在地 nav | §navigation |
| Pagination | リスト送り | §navigation |
| NavigationMenu | top nav + dropdown(portfolio header) | §navigation |
| Tooltip | 1 行 hint(transient、明示的に開かない) | §overlay |
| Popover | click で開く補足ブロック | §overlay |
| PreviewCard | hover で開く軽量プレビュー(リンク先) | §overlay |
| Menu | trigger から開く action リスト | §overlay |
| Dialog | 画面を奪う modal | §overlay |
| Toast | 自発的に出て自動で消える通知 | §feedback |
| Spinner | loading の自走(不定の作業中) | §feedback |
| Skeleton | content 到着前の neutral placeholder | §feedback |
| Progress | 作業の完了率(時間軸) | §feedback |
| Meter | 現在値の度合い(容量・強度) | §feedback |
| Table | 行列構造の data display | §data |
| Card | 浮く / 区切る紙の面 | §container |
| Accordion | 開閉できる詳細セクション | §container |
| Avatar | 人/主体の円(image + fallback) | §identity |
| Badge | 静的な小さな identity / metadata チップ | §identity |
| Icon | 16 viewbox の stroke icon | §identity |
| Separator | inline / section の hairline 区切り | §structure |
| ScrollArea | カスタムスクロール(細い hairline) | §structure |

**alert は意図的に作らず**(色 on 色の grain 衝突)── §feedback の末尾参照。

---

## §選択(値を選ぶ / 切り替える)

「一つ選ぶ / 複数選ぶ / 単独の on/off」を分ける一段目と、用途で分ける二段目で位置決めする。同じ primitive(Toggle)を見た目で分けた組(Toggle / Chip)もある。

### Summary

| Component | 数 | 領分 | 視覚 | 永続性 |
| --- | --- | --- | --- | --- |
| **Checkbox** | 複数 | **フォーム**の選択肢 | 22px 箱 + check | フォーム値 |
| **Radio** | 一つ | **フォーム**の一択 | 22px 円 + dot | フォーム値 |
| **Switch** | 単独 | **設定**の永続 on/off | track + thumb | 設定値 |
| **Toggle** | 一つ or 単独 | **toolbar** の押し込み | 四角ボタン | UI モード or アクション |
| **Chip** | 複数 | **フィルタ / タグ** | 角丸ピル | 絞り込み状態 |
| **SegmentedControl** | 一つ | **密に並ぶ設定の一択** | 連結 pill + 滑る indicator | 設定値 |
| **Slider** | 連続値 | 連続的な値の調整 | 凹みレール + thumb | フォーム値 |

### 決定木

```
排他か非排他か(一つ / 複数)?
├ 一つ(排他)
│ ├ フォームの一択肢(プラン:月額/年額) → Radio
│ ├ 密に並ぶ設定の三択(外観:ライト/ダーク/システム) → SegmentedControl
│ ├ toolbar の表示モード切替(⊞/☰) → Toggle(排他 group)
│ └ listbox(タイムゾーン等、長さ可変) → Select(検索なし) / Combobox(検索)
└ 非排他(0 個 〜 複数)
  ├ フォームの複数選択肢(製品アップデート等) → Checkbox
  ├ ギャラリーのフィルタ・タグ → Chip
  └ 単独の on/off
    ├ 永続的な設定(通知の有効化) → Switch
    └ toolbar の押し込み(★お気に入り、ミュート、ピン留め) → Toggle(単体)
```

### Toggle vs Chip vs SegmentedControl(混同しやすい三役)

三つとも「同じ primitive で実装され、見た目で分けた」ので個別決定が必要。

| | Toggle | Chip | SegmentedControl |
| --- | --- | --- | --- |
| 見た目 | 四角ボタン | 角丸ピル | 連結 pill + 滑る indicator |
| 排他性 | otibo 既定は **一択 or 単体**(`multiple` は能力として残るが標準は使わない) | **複数選択** | **一択(必ず一つ)** |
| 想定文脈 | toolbar アクション・UI モード | フィルタ・タグ | 設定の三択 |
| 並べ方 | 個別に gap | 個別に gap(ピル列) | 連結(隣接) |
| on の表現 | accent 塗り + 白 | accent 塗り + 白 | 滑る白 pill |

整形ツールバーの B / I / U(複数 on)は **Toggle の正当な非排他用途**だが、otibo の標準ではこの位置は無く、もし作るなら `multiple` を opt-in する。

### avoid

- 設定の on/off に Checkbox を使う(→ Switch)。Checkbox は**フォーム**の選択肢。
- フォームの複数選択肢に Chip を使う(→ Checkbox)。Chip は**フィルタ/タグ**。
- フィルタに Toggle(四角)を使う(→ Chip)。フィルタの定型は角丸ピル。
- 「ライト/ダーク/システム」のような**密で一つだけ**選ぶ設定に Radio を使う(縦に伸びる)→ SegmentedControl。
- 「タイムゾーン」のような**長くて値だけ**選ぶ form 入力に SegmentedControl を使う(横が破綻)→ Select。

---

## §form 値入力(文字・数値・選択)

「値を入力する」 control。Field がそれら control を label + help + error と組む。

### Summary

| Component | 入力するもの | 視覚 | 検索 |
| --- | --- | --- | --- |
| **Input** | 短い文字列 | 白い受け皿 + field inset shadow | — |
| **InlineEdit** | 同じ場所で読み↔編集する | 周囲文と同質 → focus で受け皿化 | — |
| **NumberField** | 数値 + stepper | 受け皿 + [−] 値 [＋] | ホイール / ドラッグ scrub(Base UI) |
| **Select** | 一つの値(短い list) | 受け皿(input 同形)+ chevron | × |
| **Combobox** | 一つの値(長い list) | 受け皿 + 虫眼鏡 + 検索 input | ○ |
| **Slider** | 連続値 | 凹みレール + accent thumb | — |
| **Field** | 上記 control をラップ | label / help / error 構造 | — |

### 決定木 — どの control を使うか

```
入力するものは?
├ 短い文字列 / メール / URL → Input
│  └ 編集が**同じ場所で発生**するなら → InlineEdit(header 等の name 編集)
├ 数値 → NumberField(stepper・キーボード ↑↓・ホイール scrub つき)
├ 選択肢から一つ
│  ├ 4〜6 項目程度で一望できる → Select
│  └ 数十項目 / 検索したい / 自由入力 → Combobox
└ 連続値(0〜100、音量等) → Slider
```

### Select vs Combobox(住み分けの軸)

- **Select** = 一望できる短い list、検索不要。chevron だけ(打てない)。
- **Combobox** = 長い list、検索可。**先頭の虫眼鏡アイコン** で「打てる」を予見させる。chevron も残す。

視覚言語(受け皿・popup・active=accent.subtle・selected=check)は意図的に共有。「使い分けは aria-haspopup ではなく**形** で示す」=虫眼鏡の有無。

### avoid

- 数値入力に素の Input(`type=number`)を使う → NumberField(stepper・clamp・scrub が無料で乗る)。
- 永続編集中の field を InlineEdit にする(InlineEdit は読み⇄編集の往復が前提)。
- 4〜5 項目しかない選択肢に Combobox(検索 input が過剰)。
- 数十項目に Select(scan が苦痛、Combobox に行く)。

---

## §overlay(トリガから浮く面)

「trigger と紐づいて出る面」たち。**出現契機**(hover / click / 自発)と **content の形**(単一焦点 / list / modal)で分かれる。

### Summary

| Component | 出現契機 | content の形 | motion | 用途 |
| --- | --- | --- | --- | --- |
| **Tooltip** | hover / focus(transient) | 単一行 hint | opacity quick | 補足の一言 |
| **Popover** | click | 焦点ブロック(title + 本文) | opacity quick | 補足情報 / 軽い操作 |
| **PreviewCard** | hover | media + body | opacity snap(非対称 delay) | リンク先プレビュー |
| **Menu** | click | action list | opacity 即時 + scale medium | overflow メニュー / action 群 |
| **Select** | click(値選択) | option list | opacity 即時 + scale medium | フォーム値選択 |
| **Combobox** | click + 入力 | option list(filter) | opacity 即時 + scale medium | フォーム値選択(検索) |
| **NavigationMenu** | hover / click | dropdown(grid links) | opacity quick + Viewport width/height medium | top nav の集約 |
| **Dialog** | click(明示) | modal paper | opacity + 8px translate(heavy) | 画面を奪う確認 / フォーム |
| **Toast** | **自発**(コードから) | 通知行(stackable) | slide + fade medium | 操作後の通知 |

### 決定木 — どの overlay を使うか

```
出現契機は?
├ hover で**そっと**(非操作)
│ ├ 単一行 hint → Tooltip
│ ├ リンク先のプレビュー(media + meta) → PreviewCard
│ └ top nav の dropdown → NavigationMenu(の hover モード)
├ click で**明示的に**開く
│ ├ 補足情報 / 軽い操作(form 1〜2 行) → Popover
│ ├ アクションのリスト(プロフィール / ログアウト) → Menu
│ ├ 値選択(短い list) → Select
│ ├ 値選択(検索したい / 長い list) → Combobox
│ ├ top nav の dropdown → NavigationMenu(の click モード)
│ └ 画面を奪う / 操作の取り消し不可性が高い → Dialog
└ 自発(コードから)
  └ 操作後の通知 → Toast
```

### 出現 motion の分岐(motion-grammar §Overlay Appearance に従う)

- **単一焦点テキスト**(Tooltip / Popover / PreviewCard / NavigationMenu Viewport)→ **opacity フェードのみ**(scale-on-text snap を避ける)。
- **list 型**(Menu / Select / Combobox)→ **opacity 即時 + scale medium**(中身は読みで attention が散るので scale settle が非焦点化される)。
- **modal**(Dialog)→ opacity + 8px translate の heavy 上がり。
- **自発**(Toast)→ slide + fade medium。

### avoid

- click で十分なものを hover で開く(誤発火 / モバイル不具合)。hover overlay は **PreviewCard / Tooltip / NavigationMenu の hover モード**に限る。
- modal(Dialog)を「補足」に使う(画面を奪うのは取り消し不可性が高い時のみ)。
- Toast に取り消し不能な確認を入れる(消える)→ Dialog。
- Menu と Select を混同する(action vs 値選択。check indicator の有無 / a11y も別)。

---

## §navigation(場所を移る)

「ページ / 階層 / 一覧の中を移動する」 component。

### Summary

| Component | 用途 | 形 |
| --- | --- | --- |
| **Link** | 文中 / footer の遷移リンク | 下線(hover で accent) |
| **Tabs** | **同一 viewport で content 切替**(ページ遷移しない) | 横並び + 下線 indicator |
| **Breadcrumb** | 階層内の現在地表示 | ` / ` で繋いだ inline |
| **Pagination** | リスト送り(同一画面で list を切る) | 番号ボタン列 + Prev/Next |
| **NavigationMenu** | top nav(ページ間移動の主導線) | 横並び + dropdown |

### 決定木

```
何を切替える?
├ ページ遷移
│ ├ 文中 / footer → Link
│ └ サイトの top 主導線 → NavigationMenu
├ 階層内の現在地表示(遷移リンク含む) → Breadcrumb
├ 同一 viewport で内容を切替え(URL 変えない) → Tabs
└ 長いリストの一部を切って表示 → Pagination
```

### Tabs vs NavigationMenu vs Breadcrumb の境界

- **Tabs** = 同一画面の内側で content を切替える(「すべて / 重要のみ / オフ」)。URL は基本変えない(変えてもよいが主目的は表示切替)。
- **NavigationMenu** = サイト構造の主導線(作品 / ブログ / About)。ページ遷移が前提。
- **Breadcrumb** = 「**今どこにいるか**」を示す(最終要素は遷移できない current)。Tabs / NavigationMenu とは目的が違う(現在地表示 vs 移動)。

### Pagination の windowing

長いリスト(数十ページ以上)は windowing(`1 ... 現在±1 ... last`)を消費側で組む。component 内蔵にしない(柔軟性のため、Item / Ellipsis を並べる方針)。

### avoid

- 同一画面の内容切替に Link を使う(scroll が飛ぶ / 履歴が壊れる)。
- 階層表示に Tabs を使う(階層情報が消える)。
- pagination 全項目をベタ並びにする(30 ページ以上で UI が破綻)→ windowing。
- top nav の dropdown に Menu を使う(Menu は action 群。NavigationMenu は遷移 link 群)。

---

## §feedback(状態 / 結果を伝える)

「何かが起きている / 起きた」をユーザーに告げる。

### Summary

| Component | 伝えること | 視覚 | motion |
| --- | --- | --- | --- |
| **Toast** | 操作後の結果通知 | stack する notification | slide + fade |
| **Spinner** | 不定の作業継続(終わり不明) | 回転する弧(currentColor) | 自走(loading 例外) |
| **Skeleton** | content 到着前 | neutral 面の opacity 呼吸 | 自走(loading 例外) |
| **Progress** | 作業の完了率(時間軸) | 凹み track + accent fill | width transition |
| **Meter** | 現在値の度合い(静的) | 凹み track + accent fill(視覚共有) | width transition |

### 決定木

```
何を伝える?
├ 操作の結果(保存しました等) → Toast
├ 作業中の status
│ ├ 終わりが明確で進捗が分かる(ダウンロード) → Progress
│ └ 終わりが不明(不定) → Spinner(短時間) / Skeleton(content 到着前)
└ 静的な値の度合い(容量・強度・電池) → Meter
```

### Progress vs Meter(視覚共有 / semantic 分離)

| | Progress | Meter |
| --- | --- | --- |
| 何 | 時間軸の完了率 | 現在の度合い |
| HTML | `<progress>` | `<meter>` |
| 例 | ダウンロード、同期、保存 | ストレージ使用量、パスワード強度、電池残量 |
| SR 読み上げ | 「読み込み中、42%」 | 「42/100」 |

**判定の一行ルール**:**「終わりがある」=Progress、「現在地」=Meter**。

視覚は意図的に同じ(凹み track + accent fill)── 画面上は同じに見えて、a11y と semantic のレベルでだけ違いが現れる。

### Alert の不在

otibo に Alert は無い(2026-06-19 削除済)。理由:

- Alert の仕事は「**色で目立たせる**」だが、otibo は色を出し惜しむ grammar(`otibo-color-layering` 参照)。
- 大きい面を solid 色にする = 渋滞、有色面に有色文字 = color-on-color の濁り。何度詰めても収束しなかった。
- 代替案:
  - 「保存しました」等の操作後通知 → **Toast**
  - 「メール未確認です」等の常設 notice → **Field.Description** に Link を入れて行内で済ます / **Card** で囲んでタイトル + Link
  - 「最後の警告」が要る場面 → **Dialog**(画面を奪う重み)

再挑戦する場合は **「白 on 色」または「neutral 面の単一アクセント」** から再設計。

### avoid

- Toast に「取り消し不可」の確認を入れる(消える)→ Dialog。
- 進捗が不明なものに Progress(0% で止まって見える)→ Spinner / Skeleton。
- 静的な値に Progress(SR が「読み込み中」と読む)→ Meter。
- Spinner を「装飾の生命感」として置く(自走 anim は loading 例外で許される、装飾ではない)。

---

## §data(並べる / 比較する)

行列・カードで並べる data display。

### Summary

| Component | 用途 | 形 |
| --- | --- | --- |
| **Table** | 行列の構造(列で比較) | hairline 区切り、行 hover に明度差 |
| **Card** | 関連情報を一枚にまとめる | 浮く紙(paper.sm/md) |
| **Badge** | 静的な小さな identity / metadata | 細線の小札(押せない) |
| **Avatar** | 人 / 主体の円 | image + fallback の丸 |

### 決定木

```
何を並べる?
├ 行列(列で比較したい) → Table
├ 一つずつのまとまり(album / 作品 / 通知 card)
│ ├ 浮く紙として独立 → Card
│ └ inline の小さなマーカー
│   ├ 識別 / 状態(Pro / 新規) → Badge
│   └ 人 / 主体の像 → Avatar
```

### Badge vs Chip vs Toggle(似て非なる三役)

| | Badge | Chip | Toggle |
| --- | --- | --- | --- |
| 押せる? | × 静的 | ○ 選択 | ○ 押し込み |
| 形 | 細線の小札 | 角丸ピル(影で浮く) | 四角ボタン |
| 用途 | identity / metadata 表示 | フィルタ / タグ選択 | toolbar アクション |

「Pro」「2か月分お得」など**表示するだけ**なら **Badge**。フィルタや絞り込み(押せる)なら **Chip**。toolbar の押し込みなら **Toggle**。

### avoid

- 識別表示に Chip を使う(押せるべきでないものに interaction を出す)→ Badge。
- 二行カードを Card で表示するだけのために Card を使う(Card は paper / lift の物理感を出す要素。inline list は素の div で組める)。
- 大きな user 表示に Avatar を使わず手で円を描く(account-settings header での経験:Avatar に正規化することで image load fade も乗る)。

---

## §container(包む / 開閉する)

「物を包む」 component と「開閉する」 disclosure。

### Summary

| Component | 用途 | 形 |
| --- | --- | --- |
| **Card** | 関連情報の paper 単位 | 浮く紙(paper.sm/md)、surface 切替可 |
| **Accordion** | 開閉できる詳細セクション | 項目間 hairline、panel が height animate |
| **Dialog** | 画面を奪う modal | scrim + 中央のせり上げ paper |

Dialog は overlay でもあるので §overlay 参照。

### Accordion の既定:**非排他(multiple=true)**

otibo 既定は「**触っていない section を勝手に閉じない**」=非排他。排他にしたい時だけ `multiple={false}` で opt-in。

排他が筋に合うのは「フローの段」「master-detail のスロット」「一つ選んで読む」型のとき。`AccordionRoot` wrapper で既定を反転している(Base UI 既定は multiple=false)。

### avoid

- 補足情報を Card で囲って強調する(Card は paper の物理感 ── 強調なら Dialog で画面を奪う、Toast で告げる、を選ぶ)。
- ウィザード(段階遷移)に Accordion を使う(順序 / 進捗が伝わらない ── stepper / 別画面 / Tabs を選ぶ)。

---

## §identity(人 / 物の小さなマーカー)

inline で「これは誰 / 何か」を示す。

| Component | 用途 |
| --- | --- |
| **Avatar** | 人 / 主体の像(image + fallback) |
| **Badge** | 静的な metadata / 状態 |
| **Icon** | 16 viewbox の stroke icon(currentColor) |

§data の決定木で混同三役は整理済。

---

## §structure(区切り / scroll)

純構造の primitive。

| Component | 用途 |
| --- | --- |
| **Separator** | inline 文字列の縦 hairline / section の hairline |
| **ScrollArea** | カスタムスクロール(細い hairline scrollbar) |

### Separator の使い時(原則:**構造区切りは余白**)

otibo の構造区切りは**原則「余白」**(card 間 / section 間 / row 間)。Separator は **narrow な用途** のみ使う:

- inline 文字列の縦 hairline(`A | B | C` の `|` ── ただし 2026-06-21 の判断で account-settings footer ですらこれは外し「余白だけで分ける」に倒した)。
- どうしても余白で分節できない密集領域での hairline。

迷ったら **使わず余白で**。

### ScrollArea の使い時

固定高さの領域に長い content を内蔵するとき。ブラウザ既定の太い scrollbar を **otibo の細い hairline scrollbar**(`0.5rem`、通常は地と馴染む `fg 15%`、scrollbar 軌道に直接 hover で `fg.muted`)に置き換える。

ページ全体の scroll は ScrollArea で wrap しない(ネイティブ scroll の方が滑らか)。**領域内の overflow に限る**(dialog body / long list panel など)。

### avoid

- 構造区切りで毎回 Separator を打つ(原則余白で分ける、これは otibo の grain)。
- ページ全体の scroll を ScrollArea で wrap する(モバイル kinetic scroll が損なわれる、accessibility にも影響)。

---

## §action(押せる箱)

| Component | 用途 |
| --- | --- |
| **Button** | 主行動 / 補助行動の押せる箱(intent で強弱) |
| **Link** | 文中 / nav のテキストリンク |
| **Toggle** | toolbar の押し込み(§選択 を参照) |

### Button intent の選び方

| intent | 用途 |
| --- | --- |
| **primary** | その surface の単一の主行動(accent 塗り + 白) |
| **secondary** | 補助行動(quiet な塗り) |
| **ghost** | 最も静かな行動(透明、hover で薄塗り) |

「primary は **その surface に一つ**」 = otibo の「accent を撒かない」と整合。一画面に複数の primary を置きたくなったら、二つ目以降は secondary / ghost に降ろす。

### Button vs Link の境界

- **Button** = 動作の実行(click で何かが起こる)。form の submit、保存、削除、開く。
- **Link** = 場所の移動(URL に遷移)。アンカー / 外部リンク / 内部ページ。

「ボタンに見える Link」(ghost button で `<a>` を render)も出てくる。a11y は機能で判定(URL 遷移なら `<a>` / 動作実行なら `<button>`)、見た目は機能と独立に選んでよい。

---

## カテゴリを跨ぐ "似て非なる" 早見表

混同しやすいペア / トリオを一覧化(各章で個別整理済、ここは index):

- **Toggle vs Chip vs SegmentedControl** → §選択
- **Badge vs Chip vs Toggle** → §data
- **Select vs Combobox** → §form 値入力
- **Menu vs Select** → §overlay(Menu は action、Select は値)
- **Tabs vs NavigationMenu** → §navigation(Tabs は viewport 切替、NavigationMenu は遷移)
- **Progress vs Meter** → §feedback(時間軸 vs 現在地)
- **Tooltip vs Popover vs PreviewCard** → §overlay(hover の transient vs click の補足 vs hover の preview)
- **Toast vs Dialog** → §feedback / §overlay(自発の通知 vs 画面を奪う確認)
- **Card vs Accordion vs Dialog** → §container(paper vs 開閉 vs modal)
- **Spinner vs Skeleton vs Progress** → §feedback(不定の作業 vs content 待機 vs 進捗)

## Inventory at the bottom — 一覧

冒頭の at-a-glance 表参照。新規 component を加える時はこちらも更新する。alert を再挑戦する場合は §feedback の "Alert の不在" 注記を更新する。
