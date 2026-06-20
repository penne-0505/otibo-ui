---
title: otibo Design System Token Semantic Usage Map (otibo-ui prototype)
status: active
draft_status: n/a
created_at: 2026-06-08
updated_at: 2026-06-19
references:
  - "_docs/reference/DesignSystem/motion-grammar.md"
  - "_docs/reference/DesignSystem/headless-primitive-policy.md"
  - "../../../../panda.config.ts"
related_issues: []
related_prs: []
---

## Overview

この reference は、otibo-ui prototype 期の token family を grammar 層へ接続する semantic usage map である。

`panda.config.ts` は token 値の source of truth。この文書は token 値ではなく、いつ・なぜその token を使うか、何を避けるかを定義する。

prototype 期(Card / Button / Input / Field / InlineEdit の 5 component 実装)で得られた一次的な発見を、grammar 上のルールとして残す。再導出フェーズで根拠が消えないようにするための文書である。

## Scope

この文書が決めること:

- token family と grammar 語彙の接続規則
- component spec の token 選択時の判断基準
- token 選択の順序
- token 使用の review smell
- prototype 期の deferred token decisions の queue

この文書が決めないこと:

- token の数値そのもの(`panda.config.ts` で確定する)
- token 名の変更
- CSS 生成 pipeline
- component の exact value
- 後続(dark mode / product-specific theme / accent palette 確定)

## Related Documents

- `headless-primitive-policy.md` ── a11y primitive(Base UI)採用判断と役割分担
- `motion-grammar.md` ── motion(duration tier × easing register、段階化、overlay 出現の選択基準)

## Relationship To panda.config

`panda.config.ts` の `tokens` と `semanticTokens` は token 在庫表である。この文書はそれをどう使うかを書く。

**token 値の変更は、この文書を改訂してから panda.config.ts に反映する**。逆順は許容しない。値だけ変えると grammar の justification が消える。

## Working Principles

### Structure Boundary Is Whitespace First (NEW: 2026-06-21 言語化)

otibo の構造区切りは原則 **余白**。色の差異(`bg → surface → surface.raised`)と spacing(`gap` / `margin`)で領域を語り、**border / hairline を明示的に引く場面は極めて少ない**。

理由は Calm/Honest:線で区切ると「線」という装飾が情報の上に乗る。色の段差と余白だけで区切ると、区切りが透明になり content が前に出る。実際、Card 間 / section 間に hairline は引かず gap で分節、Card の paper も「ring + 1px hairline + soft far shadow」で**最小限の線**しか持たない。account-settings footer のリンク群も Separator で繋ごうとして撤去 → 余白だけに戻した(2026-06-20、ユーザー判断)。

**操作則:**
- 構造を分けたい場面ではまず余白を当てる(`gap`、card 間 margin、heading の周囲 padding)。
- 余白で分節できない密集領域や inline 文字列の救援でだけ **Separator** を使う(narrow な用途のみ)。
- 領域ごとに `surface.muted` / `surface.raised` の地を切り替えるのも有効(輪郭でなく地の差で示す)。
- **`border: 1px solid` を引きそうになったら、まず "余白を増やせないか" を疑う**。

関連:`principles.md` §1、`component-selection-map.md` §structure。

### Token Is Not Role

token 名は grammar role の証明ではない。

Surface role は、ユーザーが読む、入力する、操作する face かどうかで診断する。`surface` token の使用は、その診断結果を実装する選択肢の一つにすぎない。

### Boundary Intent Comes Before Expression

border、shadow、radius、inset、divider は、見た目だけでは判断しない。先に Boundary Intent を診断する。

- Placement: object や subject を canvas から分ける
- Internal: 同じ object / flow の内部を整理する
- Affordance: 操作、入力、選択、実行を受け取ることを示す
- Identity: 小さな要素の種類や現在性を形・印で示す

### State Requires Base Boundary

`focused`、`selected`、`error`、`open`、`disabled`、`loading` は独立した token 選択理由ではない。必ず `focused affordance`、`selected internal item`、`error affordance`、`open placement` のように base boundary と一緒に扱う。

### Depth Law Decides Direction

色差や面の明度方向は Depth Law に従う。

- 親より暗い面: well / inset / sunken
- 親より明るい面: face / raised / floating
- `#FFFFFF` 以上の明るさは色ではなく shadow / layer で表す

### Shadow Source: Cast And Depth Are Different (NEW: otibo-ui prototype 発見)

foreground 用の dark token と shadow 用の dark token は同じではない。さらに、shadow の中でも **cast(物体が落とす影)** と **depth(凹みが受ける影)** は別 source が要る。

**cast shadow**(paper / lift / focus outer):

- 物体が光を浴びて落とす影
- warm 残光を持つことが brand atmosphere と整合(「暖かい光の下の object」)
- `fg.strong` を引数とした color-mix で表現できる(現状の paper / lift / focus はこれ)

**depth shadow**(field inset):

- 光が届かない凹み、surface の内側
- 「光の不在」として読まれる必要があり、cool 寄りの dark が要る
- `fg.strong`(warm, L 0.20)では α を下げても「薄い色の線」として読まれ、影として機能しない
- 必要な特性:L 0.10-0.15(L 0.20 は軽すぎる)、補色寄りの cool hue(現実の影は cool)
- 専用 token: `semanticTokens.colors.shadow.depth` = `oklch(0.12 0.03 260)`

`fg.strong` を depth shadow の source に流用してはいけない。逆に cast shadow を cool source で描いてもいけない(brand atmosphere が崩れ、「冷たい影」になる)。

**現状の panda.config**:

- paper / lift / focus.DEFAULT → `fg.strong` 参照(cast source として継続使用、token 名は付与せず役割で認知)
- field.DEFAULT → `{colors.shadow.depth}` 参照(depth source として独立 token 化)
- field.focus / field.error → focused / error affordance の boundary line として `fg.strong` / `oklch(...) warm red` を使用(これは "shadow" というより「colored line」として機能)

### Border Line And Soft Inner Edge Are Different (NEW)

同じ 1px の inset shadow でも、source の明度と hue が違えば意味論が逆転する。

- bright-warm 1px hairline = 「線が引かれている」= border 表現
- dark-cool 1px hairline = 「surface の内側 edge」= 凹みの一部

`border.subtle` family は前者専用とする。Input の inset hairline に流用してはいけない。

### Field Affordance Is The Signature, Not The HTML Element (NEW: otibo-dev Phase A 発見)

Field.Input が grammar 上担うのは **「form field 受け皿(inset shadow signature + surface fill)」** という affordance であって、HTML element の種類ではない。受け皿の signature が同じであれば、内側の element は `<input>` / `<textarea>` / `<select>` 等いずれでも構わない。

これは grammar の本質と HTML implementation を分離する。データ shape(短文 / 長文 / 選択肢)は内側の implementation choice、affordance signature は外側の grammar。

**実装パターン**(Base UI Field.Control の `render` prop):

```tsx
// 単行文字
<Field.Input type="email" />

// 複数行文字(textarea に差し替え、recipe の inset shadow signature は継承)
<Field.Input
  render={<textarea rows={3} />}
  className={css({ lineHeight: "snug", paddingBlock: "3", minHeight: "24", resize: "vertical" })}
/>
```

`render` prop は a11y 配線(`aria-labelledby` / `aria-invalid` 等)を保ったまま、内側の element だけを差し替える。affordance grammar(input recipe の inset shadow)は変わらない。

**含意**:

- 「Field.Textarea / Field.Select 等を component として分けるべきか」という疑問への答え:**長期的には分ける、短期的には render prop で diverge**。同じ pattern が 2 箇所以上で再現したら component として昇格
- Field.Input という命名は厳密には misnomer(Base UI の Field.Control が正確)。token re-derivation phase で再考
- recipe 上 `lineHeight: tight (1.25)` は複数行の和文には詰まりすぎる。textarea として render する場合は callsite で `snug` に上書きが必要 ── これは textarea 化が再発したら recipe variant 化する候補

**Avoid**:

- HTML element ごとに別 recipe を作ってしまうこと(input recipe / textarea recipe / select recipe を別々に持つ)── grammar が散逸する
- 受け皿の signature(inset shadow + bg surface)を element によって変えてしまうこと

### Disabled Suspends Pointer Feedback (NEW: otibo-dev Phase A 発見)

hover bg shift / active transform / 押下感などの **pointer feedback** は「これは押せる(interactive)」という affordance signal である。disabled element はこの signal の反対(「今は押せない」)を意味するため、両者を同居させると自己矛盾になる。

**結論**:`:disabled` および `[aria-disabled="true"]` 状態では **hover / active 系の feedback を suspend する**。focus ring は保つ(これは「keyboard 位置」signal であり、interactivity の主張ではない)。

**実装**:

```ts
// hover / active を「enabled の時だけ」発火させる
primary: {
  bg: "fg.strong",
  color: "surface",
  "&:not(:disabled):not([aria-disabled='true']):hover": { bg: "fg" },
  "&:not(:disabled):not([aria-disabled='true']):active": {
    transform: "translateY(0.5px)",
  },
}
```

`disabled` と `aria-disabled` 両方を扱うのは、次の `Disabled Reveals Reason On Attempt` で **aria-disabled を「visually disabled だが click は受ける」状態として使う** ため。両者で同じ feedback 抑制が必要。

**Avoid**:

- disabled button が hover で bg を変える / active で押下感を出す(self-contradictory)
- `_hover` をそのまま書いて disabled を考慮しない
- aria-disabled の見た目に `:disabled` と異なる扱いを与える

### Disabled Reveals Reason On Attempt (NEW: otibo-dev Phase A 発見)

disabled な affordance の説明は **「常時可視」ではなく「試して受け取れなかった瞬間に出す」** のが正しい。理由は cognitive flow と feedback grammar にある:

- **試行は探索**:ユーザーは「なぜ押せないか」を頭で考える前に「とりあえず押してみる」ことが多い。常時可視の hint はこの自然な探索を冗長にする
- **試行前の hint は noise**:ユーザーが既に何を入力すべきか把握している場合、常時表示の条件説明は単なる視覚的ノイズ
- **post-attempt は Field.Error と同じ grammar**:Field.Error は「入力 → validation 失敗 → 説明」。disabled hint も「click → 拒否 → 説明 + 原因 highlight」で同型

**Pattern: try → highlight → guide**

```tsx
// 1. visually disabled だが click は受ける
<Button type="submit" aria-disabled={!acknowledged}>送信</Button>

// 2. form の onSubmit で attempt を検出
function handleSubmit(e) {
  e.preventDefault()
  if (!acknowledged) {
    setAttempted(true)
    return
  }
  // proceed
}

// 3. attempted && precondition unmet:
//    a. 原因(checkbox 等)を danger color で highlight
//    b. 説明 text を adjacent に表示
//    c. precondition を満たした瞬間、両方消える
const showAckHint = attempted && !acknowledged
```

**Highlight の取り方 ── 役割三分離**:

error-reveal の場面では次の三役が同時に発生する。これらは **異なる手段** で表現する。混同して同じ手段(例:label の text 全体を danger 色で塗る)で済ませると、役割が溶け合って「全体が赤くなっただけ」になる。

| 役割 | 担当 | 表現手段 |
| --- | --- | --- |
| **A. 原因の所在 marker** | 「ここを直す」を物理的に指す | 原因 element 自体に色付き boundary(outline / ring / border)を当てる |
| **B. 原因の content** | 読まれるべき情報(checkbox label の同意文等) | **触らない**。色や weight を変えない。可読性を維持 |
| **C. error message** | 「なぜブロックされたか」 | adjacent に置く danger text(sm / medium) |

これにより読者は次の順で認知する:

1. error text(C)で「何が起きたか」を理解
2. boundary marker(A)で「どこか」を物理的に把握
3. content(B)を平常な状態で再確認(必要なら)

**Marker A の表現は文脈で選ぶ**:

原因 element に直接 outline / ring を当てる(point scope)か、原因 region を box callout で囲む(region scope)かは、原因 element の大きさ・周辺 layout・brand voice で決める。両者の trade-off:

| 表現 | 利点 | 欠点 / 適用条件 |
| --- | --- | --- |
| **outline / ring on element**(checkbox の外周等) | 原因を点で正確に指す | 小さい native element に巻くと「孤立した赤い square」になり raw に見える。custom component や十分な visual size があるとき |
| **box callout on region**(bg tint + 内側 padding、borderless が default)| region を物理化、icon と message を同じ box に束ねられる、複数 callout が並んでも壊れて見えない | 余白を消費する。border 線を併用すると囲い感が強すぎて all-at-once で複数並ぶ時に「壊れている」印象になるため、borderless が default |
| **left border callout**(縦線のみ) | quiet、layout impact 小さい | marker としての主張は弱い、複数行を跨ぐと「区切り」に見える可能性 |

prototype 期は **box callout** を default とする(native form element の小ささに対しては最も安定して refined に見える、icon prefix と相性が良い)。custom Checkbox / RadioGroup component が揃ったら outline ring も option として復活させる。

**bg は透過オーバーレイではなく designed solid color**:

`color-mix(in oklch, danger X%, transparent)` のような透過は、page bg と混ざって muddy(曇った warm-pink)に倒れる。「色を乗せた」より「汚れた」と読まれる。

代わりに「**明度を上げて chroma を抑えた danger 派生値**」を solid で置く。これは認知的に「lighter-danger × low-opacity」と等価で、page bg に依存せず clean な light pink になる:

- L:0.96 程度(page bg L≈0.97 にほぼ寄せる、わずかに沈む程度)
- chroma:0.015 程度(「気配としての pink」── 0.025 を超えると次第に強く感じられる)
- hue:danger と同じ 30

**Token Single, Derive At Site の運用戦略**:

色を追加せず、**token は `colors.danger` の 1 個に保つ**。bg 用の light pink は使用箇所で **oklch 直書きで派生** させる。これは:

- token を増やさない(palette 上の color count は据え置き)
- 派生値は「token から数学的に派生した派生」として認識される
- 同じ派生値が 3 surface 以上で再発したら、はじめて `colors.dangerSubtle` として graduate する

この方針により「証拠ベースの token 増殖」が成立し、prototype 期の sprawl を防げる。

**Avoid**:

- 「いつか他で使うかも」という予測で `dangerSubtle` 等の sub-token を先回り定義(prototype 期の規律破り)
- bg を transparent overlay で実装(muddy 問題)
- chroma を上げて「明らかに pink」にする(brand atmosphere との不協和、彩度 axis の侵食)

**実装例**(box callout pattern、borderless + designed solid bg):

```tsx
<div
  className={css(
    {
      borderRadius: "sm",
      transitionProperty: "padding, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
    },
    showHint && {
      bg: "oklch(0.96 0.015 30)",
      padding: "4",
    },
  )}
>
  <label className={css({ color: "fg.secondary" /* 触らない */ })}>
    <input type="checkbox" aria-invalid={showHint || undefined} ... />
    <span>同意の content text</span>
  </label>
  {showHint && (
    <p role="alert" className={css({ display: "flex", alignItems: "center", gap: "2", color: "danger", fontWeight: "medium" })}>
      <AlertCircle aria-hidden="true" />
      <span>削除を申し込むには、確認のチェックが必要です。</span>
    </p>
  )}
</div>
```

**Icon の grammar 上の位置**:

error message の前に **alert circle 等の icon** を置くのは、role C(message)の **「説明の anchor」** として region(box callout)と message を視覚的に束ねる役。Field.Error grammar の段で「typography で disambiguate、icon は使わない」と書いたが、これは **Field.Error(field 内)の対義語に対するもの**。box callout pattern の error message では icon は box 全体の identity を補強する役割があり、grammar 上正当。

- Field.Error(field の内側): typography(medium weight + danger color)で完結、icon 不要
- Box callout error(region scope の error): icon + message が region と束ねられ、box の役割を補強する

両者を混同しないために、**Field.Error は icon を持たず、box callout は icon を持つ** を grammar に固定する。

### Form Validation: Suppress Native UI, Use Callout Pattern (NEW)

native browser の constraint validation tooltip(`<input required>` で submit したときの「このフィールドを入力してください」等)は、上記の `Disabled Reveals Reason On Attempt` + box callout pattern と **二重の error UI** を生み grammar を破壊する。

**結論**:form では **`noValidate` を立ててブラウザ native の validation UI を抑制し、手動 validation を box callout pattern で統一**する。

```tsx
<form noValidate onSubmit={handleSubmit}>
  <CalloutBox active={!!emailError}>
    <Field.Root>
      <Field.Label>メールアドレス</Field.Label>
      <Field.Input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null) }}
        aria-invalid={!!emailError || undefined}
        aria-describedby={emailError ? "email-error" : undefined}
      />
      {emailError && <ErrorMessage id="email-error">{emailError}</ErrorMessage>}
    </Field.Root>
  </CalloutBox>

  <CalloutBox active={showAckHint}>
    <label>...checkbox + content...</label>
    {showAckHint && <ErrorMessage mt="2">削除を申し込むには、確認のチェックが必要です。</ErrorMessage>}
  </CalloutBox>
</form>

function handleSubmit(event) {
  event.preventDefault()
  const nextEmailError = validateEmail(email)
  setEmailError(nextEmailError)
  if (!acknowledged) setAttempted(true)
  if (nextEmailError || !acknowledged) return
  // proceed
}
```

**含意**:

- field-level error(email validation 失敗)と form-level precondition(checkbox 未確認)が **同じ callout pattern で統一** されるため、ユーザーは「box が出たら確認するところ」という一貫した認知を持てる
- error は **change で消す**(`if (emailError) setEmailError(null)` on change)── 修正を始めた瞬間に error が引っ込み、「直されつつある」を表現
- `required` 属性は **a11y のためにそのまま付ける**(`noValidate` は UI 抑制のみで、validity state API は使える)── が、`required` は **form の constraint** であり、`noValidate` 下では submit を block しない。我々の handleSubmit が block する
- Field.Error component(Base UI)は `match` で reactively render する仕組みだが、box callout pattern と併用すると structure が混乱するため、**この pattern では使わない**。手動 state で ErrorMessage を出す
- `validateEmail` 等の validator は callsite で書ける ── grammar 上は「form 側が persistence boundary を持つ」設計、design system 側は表現手段(CalloutBox / ErrorMessage)のみを提供

**Avoid**:

- `<form>` を `noValidate` なしで submit させる(native tooltip + 独自 callout の二重表示)
- field-level と form-level の error で UI pattern を分ける(認知の分裂)
- error を手動 clear せず、submit-on-fix まで持ち越す(直しても消えないので「効いたのか?」が不明)

**Avoid**:

- 原因 element の **content の text color を一括で danger 化**(B を A の手段で表現してしまうアンチパターン。可読性も損ねる)
- A と C を両方とも text 表現にする(差別化されない)
- boundary marker を強すぎる装飾(背景全面 danger 塗り、大きな ring 等)にする(form 全体が「壊れて見える」)

**Field.Error と同じ grammar、異なる scope**:

| 観点 | Field.Error | Disabled-reveal hint |
| --- | --- | --- |
| 出現 trigger | 個別 field の validation 失敗 | form submit / button click の precondition 失敗 |
| scope | 単一 field | form 横断の precondition(checkbox 等) |
| 表現 | Field.Error slot に danger text | 原因 element の color highlight + 隣接 danger text |
| 色 | danger | danger |
| weight | medium | medium |
| 消えるタイミング | validation 通過時 | precondition 満たした時 |

両者は同じ grammar(danger による失敗報告)を別 scope で適用したもの。**かつて「disabled hint は fg.muted の precondition 説明」と書いた版を廃案にした**(常時可視は noise、try → reveal が正しい)。

**Avoid**:

- 常時可視の「条件説明」を disabled の隣に置く(noise)
- attempt 検出なしの disabled button(silent rejection)
- 原因 highlight なしの error text(どこを直すべきか不明)
- danger ではなく fg.muted で attempt-after の hint を書く(失敗を「説明」にトーンダウンしてしまう)
- focus 移動を強制する(checkbox に自動 focus 等)── ユーザーの探索 flow を妨げる場合がある(検証要)

### Disabled As Quiet Surface (NEW: otibo-ui prototype 判断)

多くのデザインシステムは disabled を「専用 token shift」で表現する(`fg.disabled` / `surface.disabled` / `border.disabled` 等の独立 token に切り替える)。otibo-ui はこの方式を採らない。

採用しない理由:

- **warm-neutral voice の維持**:disabled 用 token を作ると、disabled の bg / fg がそれぞれ独立した色相 / 明度を持ち、結果として「disabled 表現用の小 palette」が暗黙に生まれる。warm-neutral 統一の brand voice に対して新しい色相 axis が侵入する
- **state expression の grammar 統合**:disabled は「affordance がその瞬間 quiet になっている」状態。Subject / Support / Affordance の全要素を **一括で** quiet 化する方が、「surface がまるごと静かになる」という認知に近い
- **意思決定の対称性**:Button primary disabled / secondary disabled / ghost disabled をそれぞれ専用 token で定義し始めると、組み合わせ爆発と意匠の不整合が連鎖する。一括 opacity はこの探索空間を閉じる

代わりの grammar:

- **disabled は `opacity: disabled` 一括で表現する**(`opacity.disabled` = 0.55、token として独立)
- 個別の token shift(`fg.disabled` 等)は導入しない。`fg.disabled` semanticToken は廃止し、必要なら `fg.subtle` で代替する
- cursor は `not-allowed` を併置(操作不能の物理的合図)
- aria 属性は標準通り(`disabled` 属性、`aria-disabled` 等)で a11y を担保する

「opacity-only は手抜きではないか」という疑問への grammar 上の答え:**「opacity = 全体を quiet 化する」は otibo の brand voice と意味論的に親和する**。warm-neutral 統一は「彩度で訴えない、配置と type hierarchy で構造を立てる」という原則であり、disabled も「state を別言語で叫ばずに、surface ごとトーンを引く」表現が筋。disabled だけ別 palette に色を持つことは、むしろ grammar の規律破り。

### Danger Is A State, Not A Semantic Family (NEW: otibo-ui prototype 判断)

多くのデザインシステムは `semantic.danger / warning / success / info` の 4 色族を持つ。otibo-ui はこの構造を採用しない。

採用しない理由:

- **対称性の引力**:danger を導入すると warning / success / info が「文法の自然な拡張」として連鎖し、設計者の意図と関係なく 4 色族へ向かう
- **高彩度の要請**:semantic 色は「一瞬で意味が伝わる」必要があるため構造的に高彩度になる。warm-neutral 統一(brand 原則「ハレーションを描かずに描く」)と衝突する
- **palette の独立 axis 化**:semantic 族は brand 色と独立した色相 axis を作り、画面の中で唯一の「目立つもの」になる。これは brand atmosphere の崩壊を意味する
- **state と意味の混同**:`semantic.danger` token は「error 状態の表現手段」ではなく「意味そのもの」になり、token 自体が semantic carrier に昇格する

代わりの grammar:

- **`danger` のみを特権的 token として導入する**(`colors.danger`、family 構造を持たない)
- success / warning / info は token として持たない。同等の伝達手段(typography emphasis、配置、文言、icon)で代替する
- danger は「error state という affordance 表現」の文脈で使う:`shadows.field.error`、`field.recipe.ts` error slot の text color など。color token としてだけ存在し、role を持たない使い方は避ける

「なぜ danger だけ特権的か」の grammar 上の説明:**danger は他の state と認知的に同列ではない**。進行を止める / 失敗を伝える情報は、ユーザーの操作を停止させる必要があり、他の伝達手段(typography 等)では遅すぎる場面がある。success / warning / info は「進行は続いている」前提の補助情報であり、彩度で訴える代わりに配置と文言で伝えられる。

実装上の意思としては、`semanticTokens.colors` の直下に `danger` を置き、`semantic` という namespace は意図的に作らない。token 名の構造が「semantic family を作らない」設計判断を物理的に体現する。

### Signature Per Affordance Variant (NEW)

「入力」という機能でも、文脈が違えば signature が違う。prototype で確立した三者分離:

- **Input** = inset shadow signature(「ここは form field」)
- **Field** = a11y wrap signature(視覚的 signature を持たない / Base UI が a11y のみ担う)
- **InlineEdit** = bottom underline signature(「ここは text の編集中」)

token 上はすべて `surface` + `fg` を使うが、shadow / radius / boundary 表現は異なる。signature の選択は Boundary Intent と「周囲との同化レベル」で決まる。

| Variant | 同化レベル | Signature |
| --- | --- | --- |
| Input | 同化しない(form field である宣言) | inset shadow + bg.surface |
| InlineEdit (read) | 完全に同化 | text のまま(hover で弱い bg.subtle) |
| InlineEdit (edit) | 部分的に同化 | bottom underline、bg は変えない |

### Emphasis Ladder Is A Single Axis (NEW: 2026-06-21 言語化)

tone の強弱は単一の梯子で表現する:**neutral(quiet)→ accent(情報の強調)→ danger(危急)**。「成功は緑」「警告は琥珀」と hue を増やしていくと、accent と danger の二色の規律が崩れ、画面がドキュメンタリーになる。**強さは色相でなく、明度・彩度・面積で表現する**(`otibo-accent-direction` で確定済)。

| Tier | Tone | 視覚運用 | 例 |
| --- | --- | --- | --- |
| 0(quiet) | neutral | `surface.muted` / `fg.muted` / hairline | 既定、補助、disabled |
| 1(情報の強調) | accent | accent 塗り + 白文字、or accent.subtle tint + accent text | primary button、selected、focus、押し込み済み toggle |
| 2(危急) | danger | danger 塗り + 白文字(80% black 混合で AA 確保) | destructive action、error state |

**規範:**
- tone を増やすなら ladder 上の段差として一貫させる(subtle / solid の混在を「強さの梯子」として読ませる)。
- success / warning は新 hue を作らない:success の含意は **neutral + check icon** で、warning は ladder 上で **accent / danger に振る**(または専用 component で文脈と form を変える)。
- 一画面に **primary(accent solid)は一つ** ── accent を撒かない(`### Accent Direction` 参照)の運用形。二つ目以降は secondary / ghost に降ろす。

関連:`principles.md` §3。

### White On Color Is The Only Safe Color-On-Color (NEW: 2026-06-21 言語化)

**有色の面に文字を載せる必要があるなら、文字は白**(`surface`)。これが otibo の **blessed pattern** ── 色を**precious な「強さの signal」**として効かせる唯一の安全運用。

なぜ唯一か:有色面に有色文字を載せる(color-on-color)と、面と content が同じ色家系で張り合い、視認性が落ちて画面が濁る ── これは好みでなく原理で、Alert を何度詰めても収束しなかった原因(`otibo-color-layering` 参照)。**白だけが色との干渉なしに面の上に乗れる**。

**適用箇所:**
- Button intent=primary、Toggle on、Chip on、Pagination 現在ページ、Checkbox checked、Spinner on accent。
- accent token は L=0.40 で white に対し WCAG AA を満たす(再校正済、2026-06-19)。
- danger token は L=0.58 のままだと白文字が AA を割るので、tint で **80% black 混合** 等して沈めて使う(Alert skip 検証で確認)。
- icon / spinner の白は `currentColor` で文脈追従(色を内蔵しない、文脈の color が乗る)。

**禁則(color-on-color の症状):**
- 有色面に有色文字(例:accent.subtle 地に accent.hover 文字)を載せる → 濁る、垢抜けない。
- tint と本文を同じ hue 家系で並べる(例:accent.subtle 地に accent text)→ 焦点ブロックで破綻する。
- 大きい面を solid 高彩度色で塗る → 渋滞。

代替:色面が要らないなら、neutral 面 + accent icon 一点 / hairline / focus ring の構成にする。

関連:`principles.md` §4、memory `otibo-color-layering`。

## Color Families

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| Background | `bg`, `bg.subtle`, `bg.sunken` | Canvas、Stage、Internal well | `bg` は全体の空気。`bg.subtle` は soft band。`bg.sunken` は沈む well。Depth Law 従う。 | Stage を太い rim にすること。 |
| Surface | `surface`, `surface.muted`, `surface.raised` | Surface role の face、Object face、Internal inset | Surface role は face 診断で決める。`surface.muted` は surface 内の凹みや補助面に。 | `surface` の使用だけで Surface role と判定すること。 |
| Border | `border.subtle`, `border`, `border.strong` | Internal divider、Identity outline、focus 以外の例外的 hairline | border は原則使わない。**明色 hairline として描画される用**。Input の inset edge に流用しない。 | Placement を border で囲うこと。Input の凹み edge に流用すること。 |
| Foreground | `fg`, `fg.secondary`, `fg.muted`, `fg.subtle`, `fg.strong` | Subject、Support、Control label、placeholder | 後続 §Foreground Subroles 参照。cast shadow source として参照されている(paper / lift / focus)が、depth shadow には使わない。`fg.disabled` は廃止(§Disabled As Quiet Surface)。 | `fg.muted` と `fg.secondary` の境界を曖昧にする。depth shadow source として流用する。 |
| Shadow source | `shadow.depth` | depth shadow(field inset)専用の source | `oklch(0.12 0.03 260)`。Input の inset を読みやすくするための cool-dark。 | cast shadow(paper / lift / focus)に流用すること、本文や border に使うこと。 |
| Accent | `accent`, `accent.hover`, `accent.subtle`, `accent.muted` | Affordance、selected internal item、focus、primary action | 単一 accent = `oklch(0.40 0.11 265)`(紫を一滴含む低彩度の藍)。薄いバリエーション(selected / band)は α 派生(subtle 0.12 / muted 0.05)。「画面に accent が一点」を保つ。 | accent を複数 hue に増やす、高彩度化、warm 採用(danger tint と衝突)。 |
| Danger | `danger` | **error state という affordance 表現の専用 source**(semantic family ではない、本書 §Danger Is A State 参照) | `shadows.field.error`、`field.recipe.ts` error slot の text color。error 状態の文脈でのみ参照する。 | warning / success / info を対称的に追加すること。decorative red として使うこと。state を持たない context で使うこと。 |
| Focus | `shadows.focus` (color token なし、`fg.strong` を cast source として参照) | focused affordance | keyboard focus 用 outer shadow。 | hover の代替。 |

## Foreground Subroles

`fg.*` family の使い分けは prototype 期に曖昧になっていた。実装の監査(2026-06-11)を経て、各 token を **「コンテンツが置かれている認知的役割」** で定義する形に正式化する。明度の数値より、文脈における役割で選ぶ。

| Token | 明度(warm-N) | 役割 | 該当する用法 |
| --- | --- | --- | --- |
| `fg.strong` | 900 | **unit identifier** ── そのまとまり(Card / Field / Button 等)を何であるか同定する content | `Card.title`、`Field.Label`、Button secondary label(action identifier)、Button ghost _hover、InlineEdit underline color |
| `fg` | 800 | **body subject default** ── 読まれる / 入力される / 操作される主役 content の default 色 | Input value text、global body default、Button primary _hover bg(invert 系) |
| `fg.secondary` | 700 | **quiet subject** ── subject だが文脈的に押し出さない(continuous reading の prose、低 affordance control)| `Card.body`(prose 本文)、Button ghost label(quiet control label) |
| `fg.muted` | 500 | **support** ── content そのものではなく、他の content を説明・補助するテキスト | `Card.description`、`Field.Description` |
| `fg.subtle` | 400 | **absent / placeholder** ── 値が無い / 入力前 / metadata 等の「不在」を弱く提示する | Input placeholder、InlineEdit 空値時の placeholder、InlineEdit edit placeholder |

注:`fg.disabled` は廃止(grammar §Disabled As Quiet Surface 参照)。disabled 状態は `opacity.disabled` token による全体 quiet 化で表現するため、disabled 専用の foreground 色は持たない。

### 重要な区別

- `fg.muted`(support)と `fg.subtle`(absent / placeholder)は混同しやすい。**「他の content を説明している」なら muted、「content そのものが不在」なら subtle**。`Field.Description` は support、`InlineEdit` 空値時の「未設定」表示は absent / placeholder。
- `fg.secondary`(quiet subject)と `fg.muted`(support)も混同しやすい。**「読まれる / 操作される主役」なら secondary、「主役を説明する脇役」なら muted**。`Card.body`(本文 prose)は secondary、`Card.description`(title の補助)は muted。
- `fg.strong` を「label / 識別子」として使うことは grammar 上正当。fg.strong は「最も濃い色」ではなく「unit identifier」という役割。Card.title も Field.Label も Button secondary label も、それぞれの unit を同定する役割を持つ。

### Component spec での選び方

- そのテキストはまとまりを **同定** しているか? → `fg.strong`
- 読まれる / 入力される / 操作される **主役** か? → `fg`(default)/ `fg.secondary`(quiet)
- 主役を **説明** しているか? → `fg.muted`
- そこに **コンテンツが無い** ことを伝えているか? → `fg.subtle`

## Shadow Families

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| Paper | `shadows.paper.sm`, `.md` | Object 表明用 surface treatment(prototype 例外カテゴリ) | `Card.surface="paper"` の Object face を「紙が浮いている」として読ませる。 | static card elevation の装飾、 generic container への乱用。 |
| Lift | `shadows.lift`(単一) | popover / select / tooltip 等が浮く cast shadow | 単一・非階層。段数で elevation を刻む方式は廃止(諧調化するため、本書 §Lift Is Single And Non-Graduated 参照)。switch thumb の接地影は elevation でなく contact なので switch 側に inline。 | 多段 penumbra ramp、static elevation、hierarchy decoration。 |
| Focus | `shadows.focus` | focused affordance | keyboard focus 用 outer ring。 | hover や selected の代替。 |
| Field | `shadows.field.DEFAULT`, `.focus`, `.error` | Input affordance(inset)、focused、error | Input の凹みを border ではなく inset で描く。 | InlineEdit / Button への流用、generic container の inset decoration。 |

### Paper Shadow As Prototype Exception

`shadow.paper.*` は「Surface Treatment」という新カテゴリの prototype である。grammar 上 shadow は実際に浮くものに限る(Lift / Focus)が、`Card.surface=paper` は「Object 表明としての浮き」であり、実際の layer 上昇はない。

判断保留中(Deferred §4):

- 残す場合:Surface Treatment を grammar 公式カテゴリに昇格し、`shadow` 原則から独立した token カテゴリとして位置づけ直す
- 廃止する場合:`Card.surface=paper` を削除し、Object role は flat surface + bg-color contrast で表現する

Card 単体での visual 評価では機能している。実 UI 化フェーズで Object 並列時にどう振る舞うかを見てから判断。

### Field Shadow Source As Independent Token

`shadows.field.DEFAULT` は `{colors.shadow.depth}`(= `oklch(0.12 0.03 260)`)を参照する。

これは「shadow source ≠ foreground source」の grammar 上の発見を token 化したもの。`fg.strong`(warm L=0.20)では shadow として軽く色相が浮くため、cool-dark の独立 source が要る。値は otibo_ds の `--shadow-inset-field` と同型。

なお `paper.*` と `lift` は `fg.strong` を継続使用している(cast shadow source として brand atmosphere と整合)。grammar 上の二系統分離(cast / depth)を実体化した形。

### Lift Is Single And Non-Graduated (NEW: 2026-06-19 判断)

`shadows.lift` は当初「段数を elevation に比例させる」階層(sm 1 段 → md 2 段 → lg 4 段 penumbra)だった。これを **廃止し単一値に統一**した。

理由:多段の penumbra ramp は「滑らかに落とす」ために諧調(tonal gradation)を意図的に作るが、otibo の Calm/Honest からすると **諧調そのものが認知ノイズ**になる。影は「あるかないか分かる」程度に働けば十分で、そこに勾配や段差が乗ると、影が情報を伝えるどころか目を引っかける異物になる。浮きの階層は presence(影の有無・濃淡)で十分表現でき、段数で刻む必要はない。

確定値(2026-06-19 改訂):`0 1px 2px color-mix(in oklch, {colors.fg.strong} 10%, transparent), 0 8px 24px -6px color-mix(in oklch, {colors.fg.strong} 16%, transparent)`(真上光 X=0)。**単一 elevation を物理二成分 ── 近接 contact(縁の定義)+ 遠 soft penumbra(浮き)── で表す**。これは elevation を段で刻む話ではなく一段の影の物理表現なので、非階層方針と矛盾しない(`paper` も同型の多層)。

当初は `0 2px 5px color-mix(in srgb, {colors.fg.strong} 14%, transparent)` と tight に置いていた。その動機は popover で見えた諧調バンドの回避だったが、**その諧調は HDR 由来と判明**したため、本来やりたかった soft falloff(oklch・広 blur)へ戻した。§Soft Shadow Banding 参照。

### Subtle Surface Lift — 白×warm-50 の明度差を物理感で補う(NEW: 2026-06-21 言語化)

`surface.raised`(white)と `bg`(warm.50)の明度差は **0.97→1.00 と極めて小さい**。白い面を warm.50 のページ地に直接置くと、明度差だけでは平らに沈んで見える(「のっぺり」する)── かと言って色を付けると `### Accent Direction` / `## color-on-color` の規律と衝突する。

**処方は装飾でなく "物理感だけ" を伝える極小の影**:`0 1px 1px color-mix(in srgb, {colors.fg.strong} 6%, transparent)` のような **短 blur + 低 alpha + srgb**(`### Soft Shadow Banding` の処方を逆向きに使う:諧調を作らない極小尺で物理だけ語る)。これは `shadows.lift`(overlay 用の浮き影)とは別の **「紙が乗っている小さな証言」** 用途。

**適用済の component:** Chip(2026-06-20、ユーザー検証で確定)。将来 paper の段差を要する場面(独立 pill / 小カード)に拡張可。

**判断:**
- 浮かせたいわけではないので blur は短く、alpha は低い(装飾の浮きにしない)。
- それでも noise が出るなら、影をやめて(1) 面を `surface.muted` に振る、(2) hairline を引く、の二択。色を付ける選択肢は採らない(原則 2/4 違反)。
- "control 内の小さな paper"(chip / 小カード)以外で使うときは要検討 ── 影が増えると Calm が崩れる。

関連:`principles.md` §6、`### Soft Shadow Banding`。

### Soft Shadow Banding — HDR 由来だった(2026-06-17 観測 → 2026-06-19 決着)

popover の borderless な soft shadow で諧調段差(バンディング)が見えた。当初これを 8bit 表示固有のバンドと判断し、`lift` を tight blur + srgb へ詰めて回避した。**が後日、これは HDR(ディスプレイのトーンマッピング)が作っていた諧調と判明した** ── 同じ HDR 経路が CSS に存在しない緑(segmented control クリック時)も生成しており、発色そのものが信用できなかった。HDR OFF=素の sRGB に基準を置き直すと、本来の soft falloff(oklch・広 blur)でも裾はほぼクリーン(8bit ディザ底が辛うじて見える程度)。よって `lift` は soft 版へ戻した(§Lift 参照)。**以後、色・影の判定は HDR OFF を基準にする。**

**ただし真正の 8bit バンディングは別途あり得る。** ぼかし影は原理的にグラデーションで、広 blur × 低 alpha は量子化段差を出し得る。素の sRGB でなお段が見えたときの処方は一方向 ── 勾配を急に保つ(1px あたりの alpha 変化を ~2%/px 以上):

- blur を詰める / alpha を上げる(勾配の幅を狭め落差を増やす)
- `color-mix` を `in oklch` → **`in srgb`**(oklch の transparent 補間は falloff が濁って裾を伸ばす。srgb は alpha が直線に落ちて裾がクリーン)

判定材料は **「HDR OFF の素の sRGB で出るか」**。出なければ HDR 由来として触らない。出るなら上の処方で詰める。なお banding の前景化は縁の手がかりにも依る:soft shadow が唯一の縁(borderless な popover)だと勾配を凝視されやすく、ring / hairline で縁が定義された要素(`paper`)では soft far shadow が周辺視へ退いて目立ちにくい。

## Radius Families

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| None / small | `radii.xs` (0.25rem), `radii.sm` (0.5rem) | divider、small identity、Control の小型 | Button / Input は sm。InlineEdit edit mode は `0`(underline 端をシャープに保つため)。 | large object を chip 風にすること。 |
| Medium | `radii.md` (0.75rem) | Control 標準、Input face | prototype 期に使用が少ない(Button / Input が sm)。再評価対象。 | container nesting のたびに md radius を重ねる。 |
| Large | `radii.lg` (1rem), `xl` (1.5rem), `2xl` (2rem) | Object role face、popover、sheet | Card は lg。Surface=paper の object 感を radius が補強する。 | Stage を rounded frame にすること。 |
| Full | `radii.full` | pill identity、compact affordance | chip / badge / pill button 用。prototype 期は未使用。 | large container を pill 化。 |

## Spacing And Container Families

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| Atomic spacing | `spacing.0` から `spacing.6` (1.5rem) | Internal spacing、Control gap、Support gap | まず spacing / alignment / type hierarchy で Region を作る。 | まとまりのためだけに surface / shell を追加すること。 |
| Placement spacing | `spacing.7` から `spacing.24` | Placement、Flow rhythm、Stage placement | Canvas と object / stage の関係を示す。Card padding=md の root.gap は `spacing.7`(暫定、padding と非比例。Deferred §5)。 | 余白が rim として見えるほど均一に残ること。 |
| Container | (未実装) | Canvas treatment、Surface wrapper、prose measure | prototype 期は未実装。実 UI 化フェーズで導入判断。 | --- |

## Type Families

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| Size | `fontSizes.xs` から `3xl` | Subject、Support、Control label | xl(28px)は Card title、md(18px)は body、base(16px)は description、sm(14px)は metadata。 | 派手さのためだけに scale を上げる。 |
| Weight | `fontWeights.regular/medium/semibold` | Subject emphasis、Control label | 400 / 500 / 600 に限定。500 は prototype 期の暫定。 | bold escalation、italic 系、serif fallback。 |
| Line height | `lineHeights.tight/snug/body/normal/relaxed` | prose Surface、compact Control、Support | tight は title、snug は description、body(1.49)は本文。AAA を意図的に外している(grammar 上の判断)。 | compact UI に relaxed を混ぜて操作対象を曖昧にすること。 |
| Letter spacing | `letterSpacings.tight/normal/wide/wider` | title 微調整、small metadata | 原則 normal。tight は title だけ。wide は prototype 期未使用(Deferred §8)。 | display text の decoration。 |
| Font family | `fonts.body/display/mono` | 全 UI、prose、code | body と display は Gen Interface JP で同一 family。 | weight 違い以外の font escalation。 |

> **Long-form reading surface uses 16px body (NEW: otibo-dev legal pages 判断)** ── 法務 / 長文リファレンス(privacy / terms / tokushoho)は body を `base`(16px)+ `lineHeight.normal`(1.55)で組む別 reading surface とする。app 本体・portfolio の body は `md`(18px)のまま。狙いは見出しとの比を開くこと(`md` 本文だと h2(`lg`)/body = 1.33× で attention がフラット化する。`base` 本文なら h2 1.5× / h1(`xl`)1.75×)。表セルは `sm` 据え置き。

## Motion And Layer Families

motion は **tier(duration)× register(easing / 段階化)の二軸** で扱う。詳細な文法は `motion-grammar.md` を参照(この表は token family の要約のみ)。

| Token family | Existing tokens | Grammar connection | Usage rule | Avoid |
| --- | --- | --- | --- | --- |
| Duration (tier) | `durations.snap/quick/medium/heavy`(90/120/240/320) | 中断の重さ ∝ 尺。全 component 共通の軸 | snap=in-place content 入替(tabs)、quick=form feedback / transient / tooltip / popover、medium=radio・switch・select・card lift、heavy=dialog・checkbox 描画。`base`/`calm` は撤去 | tier 外の magic number で尺を散らす(正当化済み特例を除く) |
| Easing (register) | `easings.standard/decelerate/accelerate` + `expressive` | expressive=直接操作 control + overlay 出現(段階化あり)、standard=quiet な form/hover state 遷移 | `expressive`(`cubic-bezier(0.25,0.85,0.4,1)`)は署名カーブ。quiet register に expressive / 段階化を載せない(無口原則) | bouncy / overshoot、quiet な遷移の expressive 化 |
| Keyframes | `keyframes.fadeIn` | tabs パネルの crossfade(slide しない) | navigate した content の入替に opacity fade-in | slide による「移動」の嘘 |
| Z layer | (未実装) | open placement、modal、toast、sticky | 実 UI 化フェーズで導入。 | --- |

## Token Selection Procedure

token を選ぶ順序は次の通り。

1. 診断単位を決める
2. Primary Composition と Subject を書く
3. Composition Role を割り当てる
4. Boundary Intent を書く
5. State があれば State Modifier と base boundary を書く
6. Depth Law で明度方向を確認する
7. Signature(同化レベル)を選ぶ ← otibo-ui で追加
8. 使える token family を選ぶ
9. border / shadow / semantic color を使う場合、例外理由を明記する

## Component Spec Connection

component spec の token hooks 欄では、値ではなく family と禁止事項を書く。

良い例:

- `Color`: surface family(face)、fg.muted(description)、fg.secondary(body)
- `Shadow`: none by default、focus shadow for focused affordance
- `Radius`: sm for control face、lg for Object face
- `Signature`: inset shadow(form field の宣言)/ underline(text 編集中)/ なし(同化)

避ける例:

- `Card uses surface because it is a Surface`
- `Error uses border`
- `Selected uses pill`
- `InlineEdit uses field shadow`

## Review Smells

次の記述や実装判断が現れた場合、token 使用の退行として扱う。

継承(otibo_ds から):

- token family が role diagnosis より先に決まっている
- `surface` の使用を Surface role の証明にしている
- selected / error / loading を base boundary なしに token へ直接接続している
- Internal boundary に Placement と同じ border / shadow / radius 強度を使っている
- static card / row に shadow を使って hierarchy を作っている
- Support text を弱くしすぎて判断材料として機能しなくしている
- semantic color を広い background や装飾面に使っている

新規(otibo-ui prototype 由来):

- `fg.strong` を **depth** shadow の source として流用している(warm 残光が出る。depth は `shadow.depth` を使う)
- `shadow.depth` を **cast** shadow(paper / lift / focus outer)に流用している(brand atmosphere が冷たくなる)
- `border.subtle` を Input の inset hairline に使っている(凹みではなく boundary 線として読まれる)
- Input の inset shadow を InlineEdit に流用している(signature 混乱)
- InlineEdit に bg-tint と underline を同時に当てている(signature の重複)
- `Card.surface=paper` を「subtle elevation の装飾」として使っている(本来は Object 表明)
- disabled 状態で個別 token shift(`fg.subtle` など)を当てている(grammar は `opacity.disabled` 一括、§Disabled As Quiet Surface)
- disabled 用に独立 palette(`semantic.disabled.*` 等)を作ろうとしている(symmetric pull、warm-neutral voice の侵食)
- `fg.muted` を本文 prose 色に使っている(本来は support 用)
- `fg.secondary` を description に使っている(本来は本文 subject 用)

## Deferred Decisions (Token Re-derivation Queue)

prototype の借金として明示しておく。token 再導出フェーズで決着させる:

1. **Shadow source の独立 token 化** ── *2026-06-08 完了*。`shadow.depth` を semanticToken に追加し `shadows.field` から参照。`paper.*` / `lift.*` / `focus.DEFAULT` は意図的に `fg.strong` を継続使用(cast shadow source として brand atmosphere と整合)。grammar 上は cast / depth の二系統分離として確定。
2. **`fg.muted` と `fg.secondary` の役割境界の正式化** ── *2026-06-11 完了*。本書 §Foreground Subroles を「役割」基準で正式化。`fg.strong` を unit identifier、`fg.secondary` を quiet subject、`fg.muted` を support、`fg.subtle` を absent / placeholder と定義。`InlineEdit` read mode の空値表示を `fg.muted` から `fg.subtle` に修正(grammar 違反の解消)。
3. **disabled token の独立** ── *2026-06-11 完了*。`opacity.disabled = 0.55` token を導入し、grammar §Disabled As Quiet Surface で正当化。`fg.disabled` semanticToken は廃止。disabled は専用 palette ではなく opacity 一括で「surface 全体が静かになる」表現として確定。
4. **Paper shadow の grammar 上の位置決め** ── `shadows.paper.*` を独立カテゴリ「Surface Treatment」化するか、廃止して bg-color contrast に置き換えるか。Object 並列時の挙動を見てから判断。
5. **Card padding=md の root.gap 非比例** ── `padding 1.5rem / gap 1.75rem`(spacing 6 / 7)で揃わない件の再判断。実 UI で複数 Card 並列時を見て決める。
6. **Field shadow の error 色 hardcode 解消** ── *2026-06-11 完了*。`oklch(0.58 0.13 30)` を `colors.danger` として独立 token 化。**意図的に semantic family(success / warning / info)を作らない選択**。grammar §Danger Is A State, Not A Semantic Family で理由を grammar 上に固定。token は `semanticTokens.colors` 直下にフラット配置し、`semantic` namespace の不在をもって「family を作らない」設計判断を構造的に体現。
7. **Accent family の確定** ── *2026-06-16 採用 / 2026-06-19 再校正*。単一 accent = `oklch(0.40 0.11 265)`(紫を一滴含む低彩度の藍)。warm 系は danger tint と衝突するため不採用。薄いバリエーション(selected / band)は α 派生(subtle 0.12 / muted 0.05)で賄い、新しい hue を増やさない。hover は同 hue を一段沈めた `oklch(0.35 0.11 265)`。当初値 `0.46` は HDR 表示下で決めており、HDR OFF=素の sRGB に基準を置き直すと「藍の深みが足りない」と判明。明度のみ `0.46→0.40` と沈めて深みを補った(彩度 `0.11` は据え置き=低彩度の節度は維持、深みは暗さで出した)。
8. **Letter spacing** ── 現状 `wide: 0.005em` が未使用。残すかの判断。
9. **InlineEdit underline の太さの token 化** ── 現状 `2px` を hardcode。size variant 導入時に相対値化するか、token として独立させるか。
10. **`fontWeights.medium` (500) の恒久採用判断** ── prototype 期に Button / Field.Label で使用。grammar audit で「prototype 後再判断」項目。
11. **No Operable Shift(error reveal 時の layout 安定)** ── error 表示で operable region(input / button)が動かないようにする原則。`Approach A`(CalloutBox padding 常時 + ErrorSlot で行高 reserve)を試行(2026-06-12)が、validatable field と optional field(reason)の余白統一に課題が残り保留。別アプローチ(全 field を CalloutBox で wrap して余白統一 / overlay / 別の reserve 戦略)を otibo-dev TODO.md Inbox に残す。

## Verification

- 関連 grammar audit: vault `30_Projects/otiboDesignSystem/grammar-audit.md`
- 関連 prototype 方針: vault `30_Projects/otiboDesignSystem/方針.md` §9
- 実装 source of truth: `panda.config.ts`
