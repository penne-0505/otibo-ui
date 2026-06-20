---
title: otibo Design System — Principles
status: active
draft_status: n/a
created_at: 2026-06-21
updated_at: 2026-06-21
references:
  - "token-semantic-usage-map.md"
  - "motion-grammar.md"
  - "component-selection-map.md"
  - "headless-primitive-policy.md"
related_issues: []
related_prs: []
---

## Overview

この文書は **otibo の見せ方の原則を一望できる入口**。otibo を初めて理解する人(将来の自分・別セッション・他者)が最初に読む短い文書として位置付ける。各原則は **見出し + 一行 + Why + How to apply** で構成し、運用詳細は既存文書(`token-semantic-usage-map.md` / `motion-grammar.md` / `component-selection-map.md`)にリンクする。

「原則」は決まりごとである以上に **判断の規範**:迷ったときに立ち返る場所であり、新しい component を設計するときの最初の眼鏡。原則が増えすぎると守れないので、ここに置くのは **otibo の grain を構成する数個** に絞る。

> 関連:`理念.md`(brand 側の上位文書)、`otibo-ds-progress`(memory:component 単位の決定 ledger)。

## Where it sits

| 文書 | 役割 | 開く時 |
| --- | --- | --- |
| **principles.md** (this) | 原則の一望 | 迷ったとき・新しい component を作る前 |
| `component-selection-map.md` | 「いつ何を使うか」の即決 ledger | 本丸 UI を組み立てるとき |
| `token-semantic-usage-map.md` | 色・影・spacing・font の運用詳細 | token の使い方を確認するとき |
| `motion-grammar.md` | motion の運用詳細 | transition を設計するとき |
| `headless-primitive-policy.md` | a11y primitive の選定理由 | Base UI 以外を入れたくなったとき |
| `components/<name>.md`(Phase 3) | 個別 component の API / 決定 | API 契約を確認するとき |

---

## 0. 上位 — Honest / Calm / no-trendy

「no-trendy」は流行りを排する単なる省略ではなく、**装飾でなく機能で説得する** という積極的選択。「Honest」は嘘の物理を作らない(瞬間遷移しない、装飾の動きで時間を稼がない)。「Calm」は静かに揃える(色は撒かず、動きは控え、形は端正に)。下記すべての原則はこの三つから派生する。

> 詳細:`理念.md`(brand)、`token-semantic-usage-map.md` の前文。

---

## 1. 見せ方の根本 — **色の差異と余白感で見せる**

**Rule.** otibo の構造区切りは原則 **余白**。color の差異と spacing で領域を語り、border / hairline を**明示的に引く場面は極めて少ない**。

**Why.** Calm/Honest の帰結。線で区切ると「線」という装飾が情報に上乗せされる。色の段差(`bg → surface → surface.raised`)と余白(`gap`、`margin`)だけで区切ると、区切りが透明になり content が前に出る。実際、card 間も section 間も hairline を引かず gap で分節している。Card の paper も「ring + 1px hairline + soft far shadow」で**最小限の線**しか持たない。

**How to apply.** 
- **構造を分けたい場面ではまず余白を当てる**(`gap`、card 間 margin、heading の周囲 padding)。
- 余白で分節できない密集領域や inline 文字列の区切りでだけ **Separator** を使う(narrow な救援)。
- 領域ごとに `surface.muted` / `surface.raised` の地を切り替えるのも有効(輪郭でなく地の差で示す)。
- **border:1px solid を引きそうになったら、まず "余白を増やせないか" を疑う**。

> 関連:`component-selection-map.md` §structure。

---

## 2. 色の積層原則 — **色は土台、content は neutral**

**Rule.** **色は層構造の土台に置き、その上の content は neutral**(白 or 黒)。**有色面に有色文字を載せる(color-on-color)は避ける**。

**Why.** 色を二層重ねると "色が precious" が崩れ、面と content が張り合って濁る。視認性も落ちる。これは好みでなく原理で、違反すると毎回「垢抜けない / 濁る」として現れる。Alert はこれと正面衝突したため skip した。

**How to apply.** 色を使うときは二択に倒す:
- **(a) 色を面/土台に**して content は白 / neutral(=白 on 色、原則 5)。primary button、Toggle on、Chip on、Pagination 現在ページ、checkbox checked。
- **(b) neutral 面の上に単一の小さな色アクセント**(icon 一点、focus ring、accent.subtle の tint band)。
- **やってはいけない:**有色面に有色文字を載せる、大きい面を solid 高彩度色で塗る、tint と本文を同じ hue 家系で並べる("hover で文字を accent" は焦点ブロックの上で破綻する)。

> 詳細:memory `otibo-color-layering`、`token-semantic-usage-map.md` §Accent / §Background。

---

## 3. 強弱の梯子 — emphasis ladder

**Rule.** tone の強弱は単一の梯子で:**neutral(quiet)→ accent(情報の強調)→ danger(危急)**。同じ画面で複数の strong tone が競らないよう、ladder の上位は希少に保つ。

**Why.** 「成功は緑」「警告は琥珀」と hue を増やしていくと、accent と danger の二色の規律が崩れ、画面がドキュメンタリーになる。otibo は hue を増やさない (`otibo-accent-direction` で確定)── **強さは色相でなく、明度・彩度・面積で表現する**。

**How to apply.** 
- **tone の選択は三つから**:neutral / accent / danger。success / warning は新 hue を作らない(success の含意は neutral + check icon で、warning は ladder 上で accent / danger に振る)。
- 一画面に **primary(accent)は一つ**(accent を撒かない、原則 6 の派生)。
- **subtle / solid の混在は ladder 上の段差として一貫**:neutral=subtle(淡い tint or 透明)、accent/danger=solid + 白 content、を組み合わせる。

> 詳細:Badge / Alert(skip)/ Toast 等の tone variant、`token-semantic-usage-map.md` §Accent。

---

## 4. 白 on 色 — 色面に文字を載せる時の唯一の正解

**Rule.** **有色の面に文字を載せる必要があるなら、文字は白(surface)**。これが otibo の blessed pattern。

**Why.** 原則 2 と 3 の運用形。accent の L=0.40 と white の組み合わせは WCAG AA を満たし、color-on-color の濁りも避けられる。色を**precious な「強さの signal」**として効かせる唯一の安全運用。

**How to apply.** 
- Button primary、Toggle on、Chip on、Pagination 現在ページ、checkbox checked、Spinner on accent、Toast の error tone(将来作るなら)── すべて accent / danger 地 + 白 content。
- danger は token L=0.58 のままだと白文字が AA を割るので、tint で 80% black 混合等して沈めて使う(Alert skip のときに検証済)。
- spinner / icon の白は `currentColor` で文脈追従(色を内蔵しない)。

> 詳細:`token-semantic-usage-map.md` §Accent、Button intent=primary recipe。

---

## 5. accent precious — 単一 accent、撒かない、interaction 時だけ

**Rule.** otibo は **単一 accent**(`oklch(0.40 0.11 265)`)。色は希少資源として扱い、平常時はほとんど画面に出さず、**interaction(hover / focus / pressed / open / selected)の時だけ出す**。

**Why.** 色を撒くと一点の重みが消える。accent は CTA(primary button)/ selected(subtle tint)/ band(muted)/ focus ring / 押し込み済みトグル、と複数の意味を担うが、いずれも「**今ここで起きていること**」を指し示す働き。背景や見出し色には使わない。

**How to apply.** 
- **平常時の文字は fg / fg.muted**、interaction で初めて accent に立ち上がる(Link / Breadcrumb crumb / NavigationMenu Trigger は全部この treatment)。
- **primary button は一つの surface に一つ**(原則 3 の派生)。二つ目以降は secondary / ghost に降ろす。
- accent.subtle(α0.12)は selected / chip fill / active 行に、accent.muted(α0.05)は band に、というように **α で派生して新 hue を増やさない**。
- 「hover で accent が出る」要素は**それ自体が予見的**(原則 11、hover trigger は予告する)。

> 詳細:memory `otibo-accent-direction`、`token-semantic-usage-map.md` §Accent。

---

## 6. 影の規範 — 単一非階層 lift + 物理表現の小影

**Rule.** **lift shadow は単一**(階層を段で刻まない)、物理を二成分(近接 contact + 遠 soft penumbra)で表す。**判定基準は HDR OFF = 素の sRGB**。

**Why.** 多段 penumbra ramp は「滑らかに落とす」ために諧調を作るが、それ自体が認知ノイズになる(Calm に反する)。当初観測された popover の諧調バンドは HDR(ディスプレイのトーンマッピング)由来と判明した(2026-06-19)── HDR は色と影を歪めるので、色・影の判定はすべて HDR OFF で行う。

**How to apply.** 
- overlay 系(popover / tooltip / select / menu / preview-card / dialog / navigation-menu)は **`shadows.lift` を共通**で使う。
- 「ほぼ平らだけど少し浮かせたい」場面(Chip、card 内の独立ピル等)は **`0 1px 1px / fg.strong 6% / srgb`** のような極小影で **物理感だけ** を伝える(装飾の浮きではない、warm.50 と white の小さな明度差 0.97→1.00 を補う用)。
- **諧調バンドが見えたとき**:まず HDR を OFF にして再現確認。再現しなければ HDR 由来として CSS は触らない。再現したら短 blur + 高 alpha + srgb 補間で勾配を急にする(`shadow-banding-fix` memory)。
- depth shadow(field inset)と cast shadow(lift / paper)は別系統:depth は `shadow.depth`、cast は `fg.strong` 由来。混用しない。

> 詳細:`token-semantic-usage-map.md` §Lift / §Soft Shadow Banding、memory `shadow-banding-fix`。

---

## 7. motion = 状態の証言 — 装飾でなく証言

**Rule.** motion は装飾ではなく **状態の証言**。「物が今どう変わったか」を物理的に説明する(瞬間遷移=自然界に無い=避ける、過剰=玩具=避ける)。tier(duration)× register(easing/staging)の二軸で全 component を組む。

**Why.** Honest の motion 軸版。瞬間遷移は嘘、ジャンプ overshoot も嘘、装飾の脈動は語っていない動き。一方止まりすぎも不自然 ── 軸は「動きの多寡」でなく「物理的にあり得るか」。

**How to apply.** 
- tier:**snap(90)/ quick(120)/ medium(240)/ heavy(320)** で「中断の重さ」に比例。
- register:**quiet**(form/hover の state 遷移、無口に保つ)/ **expressive**(直接操作 control の段階的 motion、overlay の出現 settle)。
- 段階的 motion(expressive のみ):**応答は瞬時、feedback は tier 尺**(checkbox の色は瞬時、stroke の描画は 320ms)。
- 詳細・例外・review smell は `motion-grammar.md`。

> 詳細:`motion-grammar.md` 全体、各 recipe の motion コメント。

---

## 8. 自走 animation は loading のみ — それ以外は no-self-running

**Rule.** otibo は **自走 animation を持たない**。唯一の例外は **loading**(Spinner の回転、Skeleton の opacity 呼吸)── これらは装飾でなく「**作業が継続している**」という状態の証言。

**Why.** 自走の生命感は no-trendy / Calm に反する(画面が玩具になる)。loading だけが「動きそのものが情報」── 止めれば意味が消える。例外を明確に限定することで、原則が守られる。

**How to apply.** 
- Spinner = linear 等速回転、currentColor、reduced-motion でも止めず速度だけ落とす(travel が message なので travel を抜けない)。
- Skeleton = opacity の穏やかな呼吸、trendy な shimmer sweep は採らない(no-trendy)。reduced-motion で脈動を止めてよい(静止 gray でも placeholder と読める)。
- 非 loading 要素の decorative pulse / bouncy overshoot / 自走 は依然 smell。

> 詳細:`motion-grammar.md` §Loading。

---

## 9. 描画パイプライン由来の motion 罠

**Rule.** ブラウザの描画パイプライン(GPU レイヤ / async decode)に起因する**回避不能な視覚バグ**を構造的に避ける。

**(a) scale-on-text snap** — `transform: scale()` を**焦点的テキスト要素**に当てると、scale=1 着地で GPU レイヤ解除 → テキストが再ラスタライズ → glyph がピクセルグリッドに再 snap して位置が 1px ずれる。**回避策:focal text overlay には scale を当てず opacity-only**(tooltip / popover / preview-card / navigation-menu の Viewport)。list 型 overlay(menu / select / combobox)は読みで attention が散り snap が非焦点化されるので scale 可。

**(b) image load decode timing** — img の bitmap は async decode 後に描画されるので、マウント即時の短い fade は bitmap が出る頃に終わり「ポン」と出る。**回避策:小さな `animation-delay`(~40ms)+ `fill-mode: backwards` で decode/paint を待ち、medium で「スッと」可視化**(Avatar Image)。

**(c) 一般則** — DOM マウントを起点とする entry motion で、対象が**ラスタライズ/デコードを伴う**(img、重い canvas 等)なら、motion の真の起点は「マウント時刻」でなく「paint 時刻」。その差を delay で吸収する。

> 詳細:`motion-grammar.md` §Overlay Appearance / §Image Load Fade。

---

## 10. overlay の出現 motion は逃げ場で割れる

**Rule.** overlay の出現 motion は **「視線の逃げ場があるか」** で分岐する。

- **逃げ場が無い(単一焦点)**:tooltip / popover / preview-card / navigation-menu Viewport → **opacity フェードのみ**(原則 9-a の回避策)。
- **逃げ場がある(list で attention が散る)**:menu / select / combobox → **opacity 即時 + scale medium**(trigger 起点に settle)。
- **modal**:dialog → opacity + 8px translate の heavy。
- **自発**:toast → slide + fade。

**enter / exit の非対称**:入りは味わわせ、出は速く(enter expressive / exit quick)。**overlay の exit に `accelerate` を当てない**(その場 fade で ease-in の停滞が「閉じが遅い」と露呈)。

> 詳細:`motion-grammar.md` §Overlay Appearance / §Enter–Exit Asymmetry。

---

## 11. hover で何か起こる要素は予見させる

**Rule.** **hover で content が出る要素は、それ自体が hover response を持つべき**(色 / 下線 / カーソル変化)── ユーザーは触る前に「ここに何かあるよ」を知る権利がある。

**Why.** 「触ったら何か起こる」を触ってから知る UI は不親切。link が下線で affordance を示すのと同じ。preview / tooltip / hover menu のように **hover が情報を出す trigger** は、その trigger 自身が同じ hover で予告する。

**How to apply.** 
- PreviewCard の Trigger は recipe で auto-merge し、`render` した `<a>` などに「平常 fg・下線なし → hover/focus で accent + 下線出現」を自動付与(Link の treatment B と同じ文法)。
- 同じ思想は Link / Breadcrumb crumb / NavigationMenu Trigger にも貫かれる(平常は静か、hover で accent が立ち上がる)。
- 逆に **click で開く** overlay の trigger(button)は、それ自体が押せる箱なので affordance がすでに乗っている(別 treatment 不要)。

> 関連:Link recipe(treatment B)、PreviewCard Trigger wrapper。

---

## 12. 非対称 delay — 出るは慎重、消えは速く

**Rule.** hover で出る overlay は **delay を非対称**に設定する:出るは **350ms 程度**(意図的 lingering の確認)、消えは **100ms 程度**(離れたら即)。Base UI 既定(600/300)はどちらも otibo の手触りに合わない。

**Why.** 出るが速すぎる = pointer が通過しただけで誤発火(ノイズ)。消えが遅すぎる = hover 抜けた後も画面に居座る(うっとうしい)。Mac の Dock や iPhone の中継表示など、好かれる hover UI はすべてこの非対称になっている。

**How to apply.** 
- PreviewCard:`delay=350` / `closeDelay=100`(wrapper で otibo 既定として上書き)。
- Tooltip:現状は別個に調整(otibo 既定 250ms / provider timeout=0)、原則的には同じ思想で組まれている。
- 新しい hover overlay を作るときは、この非対称を最初から組む。

> 詳細:PreviewCard wrapper の Trigger props 既定。

---

## 13. control の最低高さは自然高さに任せる(floor は持たない)

**Rule.** form control(button / input / select / combobox)は `minHeight` の **強制 floor を持たない**。padding + 文字の自然高さで決まる。

**Why.** rem は html の font-size に追従するため、root が `fontSize: md`(=1.125rem=18px)の otibo では `sizes-10`(2.5rem)が 45px になる。これは control の理想(38-42px)を超えて間延びさせる。**floor を持つと sizes 定義の瞬間に背が伸びる**ので、自然高さを正本とする方針に倒した(2026-06-20)。

**How to apply.** 
- 数値 size トークン(`width: "10"` 等)は使ってよい(sizes スケール定義済)── ただし control の高さ強制には使わない。
- 「最低タップ高さの floor が欲しい」となった場合は、18px root に合う**専用値**(2.25rem 等)で別途決める。「token を当てれば良い」と思考停止しない。
- Avatar(8/10/12)/ Toast close(6)/ Combobox(`width: full`)等は sizes トークンで OK。

> 詳細:memory `otibo-ds-progress` §確定した文法・決定(sizes)、TODO.md inbox。

---

## 14. headless primitive は Base UI 一本

**Rule.** otibo は **`@base-ui-components/react` を唯一の primitive library として採用**。a11y(focus management / ARIA / keyboard / constraint validation)は Base UI に委譲、見た目は Panda CSS で 100% 自前。

**Why.** a11y を毎回自前で組み直さないため。primitive 選定の理由 / 採用基準 / 例外プロセスは `headless-primitive-policy.md` 参照。

**How to apply.** 
- 新 component を作るときはまず Base UI に該当 primitive があるか確認(`node_modules/@base-ui-components/react/<name>/`)。
- Base UI に無いもの(Table / Breadcrumb / Pagination / Chip / Spinner / Skeleton 等)は **純 otibo** として組む(`<table>` / `<nav>` / `<button>` の semantic HTML + recipe)。
- 別の primitive library を入れたくなったら、まず `headless-primitive-policy.md` の例外プロセス。

> 詳細:`headless-primitive-policy.md`。

---

## Reading order

新しく otibo を理解するとき:

1. **理念.md**(brand の上位)→
2. **principles.md**(この文書、原則の一望)→
3. **component-selection-map.md**(本丸組み立て時の即決)→
4. **token-semantic-usage-map.md** / **motion-grammar.md**(token / motion の運用詳細)→
5. **components/<name>.md**(個別 API、Phase 3)

迷ったときの戻り先は常に **principles.md**。

## Decisions deferred / open questions

現時点で **原則として未確定** な点(Phase 3 以降で決まれば原則化を検討):

- success / warning が**本当に永遠に不要**か(現状は「ladder 上で accent / danger に振る、新 hue は作らない」で運用しているが、portfolio + app UI を実際に組むと別 hue が要る場面に当たる可能性)。
- Toolbar primitive(coordinator) を入れるか(Toggle + Chip + Separator で組めるが、共通の keyboard nav が欲しくなったら別途検討)。
- 単一 accent から **dual accent(主 + 補)** への拡張を許すか(現状は単一で確定)。
- Alert を再挑戦する場合の正解(現状は skip、再挑戦時は「白 on 色 or 単一アクセント」から)。
