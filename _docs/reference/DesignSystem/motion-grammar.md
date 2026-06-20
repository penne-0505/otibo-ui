---
title: otibo Design System Motion Grammar (otibo-ui prototype)
status: active
draft_status: n/a
created_at: 2026-06-19
updated_at: 2026-06-19
references:
  - "_docs/reference/DesignSystem/token-semantic-usage-map.md"
related_issues: []
related_prs: []
---

## Overview

この reference は otibo-ui の motion(transition / animation)文法を定義する。`preset.ts` の `durations` / `easings` / `keyframes` と各 recipe のコメントが値の source of truth であり、この文書は **いつ・なぜその尺と曲線を当てるか、何を避けるか** を書く。

motion は「装飾」ではなく **状態の証言** と位置づける。影が「物がどこにあるか」を静的に語るように、motion は「何が今変わったか」を動的に語る。理念は no-trendy / Honest・Calm。

> **動きは物理であれ。** 瞬間遷移(0ms の状態飛び)は自然界に存在しないので避ける。一方、諧調を嫌って動きを減らすほど良いわけでもない(止まりすぎも不自然)。正しい軸は「動きの多寡」ではなく「物理的にあり得るか」。

## Scope

この文書が決めること:

- duration tier と「中断の重さ」の対応
- easing(register)と staging(段階化)の役割
- 各 component の motion 割り当て規則
- overlay の出現/消滅 motion の選択基準
- motion の review smell

この文書が決めないこと:

- token の数値そのもの(`preset.ts` で確定)
- 個別 component の exact 値(recipe で確定、コメントが canonical)
- reduced-motion 以外の a11y 配線(Base UI に委譲)

## Two-Axis Model: Tier × Register

motion は **tier(duration)と register(easing + 段階化)の二軸** で決める。両者は直交し、全 component が同じ tier 軸に乗る。これにより「card(medium・quiet)と popover(medium・expressive)は同じ尺で動くが性格が違う」と二次元で語れる。

これは影のグラマー(光源は共通・段数を elevation に比例)の時間軸版である:**曲線(署名)は共通、尺を weight に比例させる**。

### Axis 1 — Tier (Duration)

duration を「どれだけユーザーを中断するか」に比例させる。4 tier:

| Tier | 値 | 役割 | 割り当て |
| --- | --- | --- | --- |
| `snap` | 90ms | in-place の content 入替。navigate した content は gate しない=最軽 | tabs パネル切替 |
| `quick`(=light)| 120ms | form feedback / transient / 頻繁な hover・focus | button / input / inline-edit の hover・focus、tooltip、popover、overlay の opacity channel・exit |
| `medium` | 240ms | 標準の event | radio・switch・select の feedback、card の lift |
| `heavy` | 320ms | 画面を奪う / 最も濃い presence | dialog のせり上げ、checkbox の描画 |

`base`(180)/ `calm`(260)は撤去済み。`quick` は参照箇所が多いため名を据え置き(=light tier)。

### Axis 2 — Register (Easing + Staging)

| Register | Easing | 段階化 | 対象 |
| --- | --- | --- | --- |
| **expressive** | `easings.expressive` | あり(応答/feedback 分離) | 直接操作 control(checkbox / radio / switch)、overlay の出現 |
| **quiet** | `easings.standard` | なし | form / hover の state 遷移(button / input / inline-edit / card) |

`easings.expressive`(`cubic-bezier(0.25, 0.85, 0.4, 1)`)は checkbox の描画を手で詰めて確定した **署名カーブ**。前のめりに立ち上がり、長い尾でそっと置く。direct-manipulation の「到着」と overlay の settle に使う。

**quiet register は無口に保つ。** form / hover の state 遷移に expressive や段階化を載せてはいけない。全部に生命感を盛ると UI は玩具になる。button の press が `translateY(0.5px)` の素っ気なさで止まっているのは欠落ではなく正解。「触ると反応する」だけで足り、「描いて見せる」必要はない。

## Staged Motion (Response / Feedback Separation)

expressive register の中核原則。**応答(response)と feedback を別チャンネルに分離する。**

即時の「効いた」を 0ms〜quick で返し、その上に tier 尺の遅い feedback を重ねる。即時応答が responsiveness を確定するので、遅い層は「待ち」ではなく「見もの」になる。

- **原型は checkbox**:箱の色は瞬時に accent(応答)、その上に stroke を 320ms で描く(feedback)。脳は最初の即時応答で「効いた」を確定し、残り時間を「描かれていく様」の鑑賞に回せる。だから 320ms でも「待たされ」でなく快い。
- **control**:色 / 状態 = 瞬時、形 / 動き = tier 尺。
- **overlay**:opacity = 即時〜quick、transform = tier 尺。

### Exception: Moving Part Crossing Its *Primary* Color Signal

可動部が色域を横断し、かつ **その色が主たる state signal** のとき、色を瞬時にすると **色が物理を追い越して「先走り」** に見える。

- **switch**:thumb が track 上を横断し、track の色と thumb の位置が同じ「状態」を二重に語る。**track の色 = 主たる on/off signal**。track を即 accent にすると、thumb がまだ off 位置にいるのに track だけ「ON」と言い切り、二分された動きに見える。→ track の accent 化を **80ms だけ** animate して thumb の glide に連れ添わせ、一つの協調動作にする。
- checkbox / radio は可動部が色域を横断しない(check / dot は色の上に**載る**だけ)ので、色は瞬時で破綻しない。

**「横断する」だけでは不十分 ── 横断する色が *主たる* signal のときだけ trick が要る**(2026-06-19、slider / segmented control の実機検証で精緻化):

- **slider**:fill(accent)は thumb の位置で終わる=色と可動部が**同じ縁を共有**(構造的連動)。先走りは構造的に起き得ず、trick 不要。
- **segmented control**:pill が滑り、選択中ラベルが fg.strong になるが、**pill が主たる選択 signal で label 色は脇役**。だから label 色を瞬時に変えても先走って見えない。trick 不要(選択色の transition は連れ添わせでなく、単なる quiet な hover/選択 feedback として quick で置く)。

当初「つまみが軌道を横断する系は switch と同じ扱い」と予言したが、**slider・segmented control とも外れ**。switch が特殊だったのは「横断する色が状態そのもの」だったから。

## Enter / Exit Asymmetry

入りは味わわせ、出は速く。enter と exit で非対称に組む。

- **直接操作の exit** = `accelerate` の速い払い + 状態色は瞬時(checkbox の wipe は 45ms)。
- **overlay の exit** = `standard`(quick)。

> **overlay の exit に `accelerate`(ease-in)を使わない。** その場 fade では ease-in の出だし停滞が「閉じが遅い」として露呈する(dismiss は押した瞬間に反応すべき)。`accelerate` の速い払いは尺の短い直接操作 wipe 専用。

## Hover-Open Asymmetric Delay

hover で出る overlay(tooltip / preview-card / navigation-menu の hover モード)は、**open と close で delay を非対称**に設定する:

- **open** ≈ 350ms ── pointer が**意図的に lingering** したかを確かめてから出す(通過 hover で誤発火しない)。
- **close** ≈ 100ms ── pointer が離れたら**即消える**(留まりすぎを避ける)。

Base UI 既定は **600ms / 300ms**(preview-card)で、どちらも otibo の手触りに合わない:open が遅すぎると「タメが過剰」、close が遅すぎると「離れた後も居座る」。Mac の Dock や iPhone の中継表示など、好かれる hover UI はすべてこの非対称になっている ── **「出るは慎重、消えは速く」が正しい hover overlay の体験**。

実装:Base UI が `delay` / `closeDelay` の prop を持つので、otibo の wrapper component で既定を上書きする。新しい hover overlay を作るときは、この非対称を最初から組む(`preview-card.tsx` の Trigger wrapper が canonical 実装)。

> 関連:`principles.md` §12、PreviewCard recipe / wrapper のコメント。

## Overlay Appearance: The Scale-On-Text Snap

`transform: scale()` をテキストを含む要素に当てると、scale が 1 に着いた終端で GPU レイヤが解除され **テキストがネイティブ解像度で再描画**される。この再描画で glyph がピクセルグリッドに再スナップし、最終フレームで位置が 1px 弱ズレる=「ガクッ」。これは scale 手法に内在する **回避不能** な副作用。

`will-change` / GPU pin で抑えようとすると、レイヤ保持でテキストが**常時ボケる**ので却下(一瞬の snap を恒常的な滲みと交換するのは改悪)。

隠せるのは **視線の逃げ場がある時だけ**。出現を frame0 に畳む(opacity 即時)と目は中身に移り、scale settle が非焦点化されて snap が知覚から外れる。逃げ場が無い焦点的テキストでは隠せない。この基準で overlay の出現 motion が割れる:

| Overlay | content | 出現 motion | 理由 |
| --- | --- | --- | --- |
| **tooltip** | 単一行の hint | opacity フェードのみ(scale 撤去)| 最も焦点的・逃げ場なし。hint は「現れる」だけでよく空間の手がかり不要 |
| **popover** | title + 本文 | opacity フェードのみ(scale 撤去)| 一つの焦点ブロックとして読まれ attention が散らない。trigger 隣接で位置が手がかり |
| **select** | list(複数 item)| opacity 即時(0s)+ scale(medium)| list は読みで attention が散るので scale settle を非焦点化できる |
| **dialog** | modal paper | opacity 即時相当 + 8px せり上げ(heavy)| 画面を奪うので最も濃い presence。せり上げは中央寄せ translate を保持して合成 |

将来の menu / dropdown は **list 型 → select 側**(scale 可)、単一焦点の overlay は **opacity-only 側** に振る。

関連:soft shadow のバンディングも「ぼかし=諧調」という同型の認知ノイズ問題。`token-semantic-usage-map.md` の Shadow Families / banding 項を参照。

## Hover Trigger Must Be Predictive

**Rule.** **hover で content が出る要素は、それ自体が hover response を持つべき**(色 / 下線 / カーソル変化)。ユーザーは触る前に「ここに何かあるよ」を知る権利がある。

「触ったら何か起こる」を**触ってから初めて知る** UI は不親切で、信頼を損なう(慎重なユーザーほど触らないので、機能が発見されない)。普通の link が下線で affordance を示すのと同じ理屈で、preview / tooltip / hover menu のように **hover が情報を出す trigger** は、**その trigger 自身が同じ hover で予告**する。

**実装則:**
- hover で出す overlay の **Trigger を recipe で wrap** し、`render` した要素に response を自動付与(消費側に書かせない)。
- response は **Link の treatment B と同じ文法**(平常 fg + 下線なし → hover/focus で accent + 下線出現)を採用 ── DS 内で「平常は静か、hover で accent が立ち上がる」を一貫させる(Link / Breadcrumb crumb / NavigationMenu Trigger / PreviewCard Trigger すべて同じ思想)。
- **click で開く** overlay の trigger(button)は除外:押せる箱自体が affordance なので別 treatment 不要。

> 関連:`principles.md` §11、PreviewCard recipe(trigger slot)/ Trigger wrapper(`cloneElement` で auto-merge)。

## Image Load Fade: Decode Timing

img の load fade(要素が loaded でマウント → 現れる瞬間に opacity fade)は、他の transient feedback と違い **「短いほど良い」が成り立たない**。img の bitmap は **async decode** の後に描画されるため、マウント即時に走る短い opacity animation は bitmap が出る頃には終わっており、結果フル不透明で「ポン」と出る(fade が知覚されない)。`quick`(120)は decode 遅延に飲まれて見えなかった。

処方:(1) 小さな `animation-delay`(~40ms)で decode/paint を待ち、`fill-mode: backwards` でその間 opacity 0 を保持する。(2) duration は `medium`(240)を最低線に。(3) easing は `decelerate`(置かれる尾)。

一般則:**DOM マウントを起点にする entry motion で、対象がラスタライズ/デコードを伴う(img、重い canvas 等)なら、motion の真の起点は「マウント時刻」でなく「paint 時刻」**。その差を delay で吸収する。scale-on-text snap(GPU レイヤ解除 → テキスト再ラスタライズ)と同根の、**描画パイプライン timing** 問題として扱う。

## Reduced Motion

`prefers-reduced-motion: reduce` を一級市民として扱う(Honest の帰結)。**travel(transform / scale)を抜き、opacity だけ残す。** 完全停止ではなく「何かが現れた」という証言を opacity で残す。dialog はセンタリング translate を維持して transform travel だけ抜く(`translate(-50%,-50%)` を保つ)。

## Loading: The Self-Running Exception

otibo は自走 animation(無限ループ)を持たない ── 普通それは「装飾の生命感」で、no-trendy / Calm に反する。**唯一の例外が loading**。loading の動き(spinner の回転、将来の skeleton の脈動)は装飾ではなく **「作業が継続している」という証言**であり、止めれば意味そのものが消える。動きが情報なので認める。

- **spinner**:細いリングを **等速(linear)** 回転(非線形 easing は揺れて見える)。duration ~0.7s。色は currentColor で文脈追従(色を内蔵しない=color layering 非依存)。
- **reduced-motion でも止めない** ── travel を抜く一般則の例外(ここでは travel が message そのもの)。ただし速度は落として控えめに(spinner 0.7s→1.3s)。
- **線引き**:この例外は「不定の待ち時間」を示すものに限る。進捗が分かるなら determinate(progress bar)を使い自走させない。決着済み([[otibo-ds-progress]] progress / spinner)。非 loading 要素の decorative pulse / bouncy / 自走は依然 smell。

## Review Smells

次が現れたら motion の退行として扱う:

- quiet register(button / input / inline-edit / card)に expressive カーブや段階化を載せている(無口原則の破り)
- 直接操作の色 / 状態変化に tier 尺の duration を当てている(応答が遅延し「効いたか」が不明になる)
- 可動部が**主たる色 signal** を横断する control(switch 系)で色を瞬時にしている(先走り)。脇役の色なら瞬時で可(slider / segmented control)
- overlay の exit に `accelerate` を当てている(閉じが遅く見える)
- 焦点的テキスト overlay(tooltip / popover)に `scale` を当てている(終端 snap)
- reduced-motion で opacity まで殺す / dialog のセンタリングを `transform: none` で壊す
- duration を tier 表の外の magic number で散らす(checkbox 描画 320ms / switch 連れ添い 80ms 等の正当化済み特例を除く)
- 自走 animation / decorative pulse / bouncy overshoot(no-trendy の破り)── ただし loading の自走は §Loading の明示的な例外

## Deferred Decisions

1. **feedback 層の濃さの再評価** ── tier 化で一旦解決(dialog=heavy、他=medium/light)。slider / toast / segmented control を実装し、いずれも既存 tier/easing で収まった(新 tier 不要)。
2. **menu / dropdown の motion** ── *2026-06-19 決着*。Menu に select と同式(opacity 即時 0s + scale を medium・expressive で trigger 起点に settle、exit は quick の fade+scale)を当て、実機で終端 snap が出ないことを確認。**予言どおり list 型は select 側**(複数 item で attention が散り scale settle が非焦点化される)。3 項目程度の少ない Menu でも snap は前景化せず、opacity-only(tooltip/popover 側)へ倒す必要はなかった。Overlay 出現表に menu = select 行と同扱いで含める。
3. **expressive duration の特例値(checkbox 320ms / switch 80ms)** ── tier token 外の手詰め値。同種が再発したら token 化を検討。

## Verification

- 実装 source of truth:`preset.ts`(`durations` / `easings` / `keyframes` とコメント)、各 component の `*.recipe.ts`
- 視覚判定:ローカル dev server(`ladle serve`)での手触り。motion / snap / banding は headless で検証不能のため実機判定。
