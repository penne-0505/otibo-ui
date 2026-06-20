---
title: Dialog
status: active
component: src/core-ui/dialog/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../token-semantic-usage-map.md"
  - "../component-selection-map.md"
---

## Overview

**最上位の overlay(modal)**。世界を一段暗く落とし(scrim)、その上に paper を一枚浮かせて注意を集中させる。trigger に紐づかず**画面中央に固定**、focus-trap / scroll-lock / outside-dismiss は Base UI Dialog.Root(modal 既定)に委譲。Popover との違いは**背景を奪う**こと ── 「取り消し不可性が高い確認」「集中して書く form」など、画面を奪うことに正当性があるときだけ使う。

## API

slot recipe(Panda)+ Base UI Dialog 委譲。slot は `backdrop` / `popup` / `title` / `description`。

```tsx
<Dialog.Root>
  <Dialog.Trigger render={<Button>削除</Button>} />
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Dialog.Title>本当に削除しますか?</Dialog.Title>
      <Dialog.Description>この操作は取り消せません。</Dialog.Description>
      <div>{/* form / action ボタン */}</div>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

`modal=true`(Base UI 既定)で focus が popup 内に閉じ込められ、Esc / backdrop click で close する。

## Variants

なし(単一形)。size variant は持たない(`width: calc(100% - 2rem)` + `maxWidth: 28rem` で中型固定)。長 content は `maxHeight: calc(100dvh - 4rem)` で overflowY: auto。

## States

| Slot / State | 視覚 |
| --- | --- |
| **backdrop** | `bg: color-mix(in oklch, fg.strong 21%, transparent)` ── **暖色ダーク scrim**(純黒ではなく fg.strong を薄く敷いて世界観に揃える) |
| **popup rest** | `position: fixed` + 中央配置(`top: 50%, left: 50%, translate(-50%, -50%)`)、`surface.raised` + radius lg、padding 6、**shadow なし** |
| **popup `data-starting-style`** | `opacity: 0` + `translate(-50%, calc(-50% + 8px)) scale(0.98)`(8px 下からせり上がる) |
| **popup `data-ending-style`** | 同上(下に 8px 沈んで scale 0.98 へ戻る) |
| **title** | `lg` + `semibold` + `tight` + `fg.strong` + `marginBottom: 2` |
| **description** | `sm` + `snug` + `fg.muted` |

**影を持たない理由**:modal は **scrim が分離を担う**ので drop shadow は redundant。暗い scrim の上に暗い影を落とすと角丸の濃い halo(島)になって濁る ── 白カード対 scrim のコントラストで浮きは成立する(原則 6 影の規範と整合)。

## a11y

- **primitive** ── `@base-ui-components/react/dialog`(Root / Trigger / Portal / Backdrop / Popup / Title / Description / Close)。
- **role** ── `dialog`(modal=true で `aria-modal="true"`)。
- **focus-trap** ── Base UI が自動で focus を popup 内に trap、close で trigger に戻る。
- **scroll-lock** ── 背景 body の scroll を止める(Base UI 既定)。
- **outside-dismiss / Esc** ── backdrop click と Esc キーで close(Base UI 既定)。`dismissible=false` で disable 可。
- **title / description の ARIA 関連付け** ── `aria-labelledby` / `aria-describedby` が Title / Description の id に自動接続。

## Motion

| 軸 | 値 |
| --- | --- |
| **backdrop** Tier | `quick`(120ms)── opacity fade |
| **backdrop** Register | enter = `decelerate`、exit = `standard` |
| **popup opacity** Tier | `quick`(120ms)decelerate |
| **popup transform** Tier | **`heavy`**(320ms) |
| **popup transform** Register | **`expressive`** |
| **popup transform** 動作 | 8px translate-Y + scale 0.98 → 1(センタリング `translate(-50%, -50%)` を保持) |

**段階的 motion の正典例**:scrim は quick で素早く dim =「modal が起動した」を**即返す(応答)**、paper のせり上げを **heavy で時間を稼がせる(feedback)**。脳は最初の応答で「効いた」を確定し、残り時間を「立ち上がる paper の鑑賞」に回せる ── だから 320ms でも「待たされ」ではなく快い(`motion-grammar.md` §Staged Motion)。

**heavy が最も正当化される唯一の overlay** ── dialog は画面を奪う最も濃い presence、ゆっくり立ち上げる重みに見合う(他 overlay は medium / quick)。

reduced-motion:**8px せり上げ + scale を抜き、センタリングは維持して opacity だけ**(`translate(-50%, -50%)` を保持、`transform: none` にすると中央配置が壊れる)── `motion-grammar.md` §Reduced Motion の grain。

## Use when

- **取り消し不可性が高い確認**(削除確認、サブスク解約、不可逆な action)。
- **集中して書く form**(account create、長 form ── ただし長すぎる form は別画面に倒すか sheet を検討、現状 sheet 未着手)。
- **画面を奪うことに正当性がある**警告 / 重要通知。

## Use instead

- **操作結果の通知**(保存しました、コピーしました) → **Toast**(自発、消える)。
- **補足情報 / 軽い操作**(1〜2 行 form) → **Popover**(trigger 隣接、scrim 無し)。
- **action のリスト**(プロフィール / ログアウト) → **Menu**。
- **常設 notice / inline 警告**(メール未確認) → **Field.Description** に Link、または **Card** で囲む。

詳細は `component-selection-map.md` §overlay。Alert は **不在**(grain 衝突で skip、§feedback "Alert の不在" 参照)── 「常設の警告 banner」を作りたくなったら Card か Dialog に倒す。

## Avoid

- **「保存しました」の通知に Dialog**(scrim で画面を奪うのは取り消し不可性が高い時のみ) → Toast。
- **補足情報を Dialog で**(画面を奪うのが過剰) → Popover。
- **shadow を popup に足す**(scrim + shadow で暗い halo が出て濁る) → 影なしが grain。
- **`transform: none` を reduced-motion で**(`translate(-50%, -50%)` のセンタリングが壊れて popup が左上に飛ぶ) → センタリング保持で transform travel だけ抜く。
- **dismissible=false を無闇に**(ユーザーが閉じ込められる、a11y にも反する) → ほぼ全ての場面で true、自社の不可逆 action 確認等のごく一部例外でのみ false。
- **heavy tier を他 overlay に流用**(dialog の重みは「画面を奪う」固有のもの、他は medium / quick) → motion-grammar の tier 割り当てに従う。

## Decisions(本セッションの確定事項)

- **影を持たない(scrim で分離を担う)** ── 暗い scrim の上に暗い影は halo を作って濁る。白 paper 対 scrim の純コントラストで浮きが成立、原則 6 の影の規範と整合。
- **scrim = `fg.strong` 21% mix**(純黒ではない) ── 暖色ダーク。otibo の世界観に揃える(warm.50 ページ地と整合)。
- **段階的 motion = opacity quick(応答)+ transform heavy(feedback)** ── 最も時間を「待たされ」ではなく「鑑賞」に変える適用例。
- **heavy tier は dialog 専用** ── 他 overlay(popover / menu / select / combobox / tooltip / preview-card)はすべて quick / medium。dialog だけが「画面を奪う」重みで heavy を正当化する。
- **reduced-motion はセンタリング保持 + opacity** ── transform travel だけ抜く、`translate(-50%, -50%)` は維持(motion-grammar §Reduced Motion の grain)。
- **size variant 持たない**(width / maxWidth / maxHeight 固定で 1 形) ── modal は「中型固定」の体験で grain を取る。長 content は overflowY: auto で吸収。

## Related

- 上位:`principles.md` §6(影の規範、scrim と影の衝突回避)、§7(motion = 状態の証言)、§10(overlay 出現 motion 分岐 ── modal は heavy 上がり)、§14(Base UI 一本)
- 兄弟(別 overlay):Popover(scrim 無し、trigger 隣接)、Menu(action list)、Toast(自発)
- 住み分け:`component-selection-map.md` §overlay、§feedback(Alert の不在で Dialog に倒す場面)
- 詳細:`src/core-ui/dialog/dialog.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/dialog`
- motion 文法:`motion-grammar.md` §Staged Motion、§Reduced Motion
- memory:[[otibo-ds-progress]](Dialog の決定全般)
