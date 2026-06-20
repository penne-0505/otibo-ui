---
title: Checkbox
status: active
component: src/core-ui/checkbox/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**フォームの複数選択肢**(独立 boolean)。`checked` で **単一 accent** を当て(blessed pattern)、check は **手で描かれる**(stroke-dashoffset を heavy tier expressive で一筆)。**段階的 motion の正典例** ── 箱の color は瞬時(応答)、stroke は heavy(feedback)に分離。Switch(永続 on/off)/ Radio(排他一択)とは form 文脈で住み分け。

## API

slot recipe(Panda)+ Base UI Checkbox 委譲。slot は `root` / `indicator`(2 slot)。Base UI が `data-checked` / `data-indeterminate` / `data-disabled` を供給。

```tsx
<Field.Root>
  <Field.Label>製品アップデートを受け取る</Field.Label>
  <Checkbox.Root>
    <Checkbox.Indicator>
      <svg viewBox="0 0 16 16"><path d="M3 8.5 L7 12 L13 5" /></svg>
    </Checkbox.Indicator>
  </Checkbox.Root>
</Field.Root>
```

native checkbox は `border-radius` が GNOME/GTK で効かない等の環境依存があるため、**見た目は 100% custom 描画**(Base UI Checkbox.Root を素の box として使う)。

## Variants

なし(単一形)。size variant は持たない(form control 列で揃える grain)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root rest(unchecked)** | `width/height: 22px`(偶数 px) + `bg: surface` + `boxShadow: inset 0 0 0 1.5px border.strong` + `borderRadius: xs` |
| **root `data-checked` / `data-indeterminate`** | `bg: accent` + `boxShadow: inset 0 0 0 1.5px accent`(箱の color は **瞬時**、transition duration 0ms) |
| **root focus-visible** | `outline: 2px solid accent` + `outlineOffset: 2px`(inset shadow と競合しない) |
| **root disabled** | `opacity: disabled` + `cursor: not-allowed` |
| **indicator path(unchecked)** | `stroke-dashoffset: 1`(完全に隠れる) |
| **indicator path(checked / indeterminate)** | `stroke-dashoffset: 0`(描く)、duration **`heavy`(320ms)** + register **`expressive`** |
| **indicator path(off に戻る)** | duration **45ms** + register **`accelerate`**(速い払いで消す) |

**22px 偶数 px の理由**:18px root で `1.25rem = 22.5px` の半端ピクセルになり、glyph が滲む → **px 固定で偶数寸法に正規化**。sizes scale が rem ベースゆえの妥協(token を当てない、grain を意識した例外)。

## a11y

- **primitive** ── `@base-ui-components/react/checkbox`(Root / Indicator)。
- **role** ── `checkbox`(Base UI 担保)。
- **keyboard** ── Space で toggle。
- **focus ring** ── `outline`(inset shadow と layering 干渉しないため)。
- **indeterminate** ── `data-indeterminate` を Base UI が供給。checked と同じ visual(箱 accent)で扱う。
- **Field との接続** ── label / description / error は Field 経由で自動配線。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| **root**(箱の色) Tier | **0ms**(即時、応答 channel) |
| **indicator(描く)** Tier | **`heavy`(320ms)** |
| **indicator(描く)** Register | **`expressive`** |
| **indicator(消す)** Tier | **45ms**(手詰めの特例値、accelerate) |

**段階的 motion の正典例**(`motion-grammar.md` §Staged Motion):
- **応答(response)**:箱の color は 0ms で accent に切替 ── 「効いた」を即返す。
- **feedback**:stroke を 320ms で描く ── 「描かれていく様の鑑賞」に時間を回す。
- 脳は最初の即時応答で「効いた」を確定し、残り時間を見もの(描画)として受け取れる。だから 320ms でも「待たされ」ではなく快い。

**描く/消すの非対称**:オン(到着)= 印を打って手応えを持って着地(heavy / expressive)、オフ(離脱)= 一払いでパッと消す(45ms / accelerate)。直接操作の grain(checkbox / radio / switch 共通文法)。

**heavy tier は dialog と並ぶ最濃 presence**(motion-grammar §Tier)── 「線を描く」は最も濃い feedback、checkbox の描画にはこれが正当化される(checkbox は直接操作の signature motion)。

reduced-motion:stroke transition を `none`(状態は即時、描画演出だけ無効化、Honest の grain)。

## Use when

- **フォームの複数選択肢**(独立 boolean で 0 個〜複数 on)。
- **規約同意 / オプトイン**(単独の boolean をフォーム値として扱う)。
- **list の各項目を選ぶ**(table の row selection 等)── 消費側で組む。

## Use instead

- **設定の永続 on/off** → **Switch**(thumb の物理感が永続切替に合う)。
- **排他一択**(プラン:月額 / 年額) → **Radio**(複数択から一つ)。
- **toolbar の押し込み(単体 or 一択)** → **Toggle**(form 値の入れ物ではない)。
- **フィルタ / タグ複数選択** → **Chip**(角丸ピル、フィルタ文脈)。

詳細は `component-selection-map.md` §選択。

## Avoid

- **箱の color に transition を足す**(0ms 即時応答の grain を破る、段階的 motion が崩れる) → 0ms 維持。
- **stroke 描画を quick / medium に下げる**(checkbox signature の heavy が消える、Calm にも見えなくなる) → heavy 維持。
- **消去アニメーションも heavy で**(描く / 消すの非対称が崩れる) → 45ms accelerate。
- **設定の永続 on/off に Checkbox**(grain 違い、Switch の thumb 物理感が要る) → Switch。
- **size を rem 化**(半端ピクセルで滲む) → 22px 固定。

## Decisions(本セッションの確定事項)

- **100% custom 描画**(native checkbox の環境依存 border-radius 問題を回避) ── Base UI Checkbox.Root を素の box として、見た目は完全自前。
- **段階的 motion の正典**(箱 color 0ms + stroke heavy 320ms expressive) ── otibo の direct-manipulation signature。`motion-grammar.md` §Staged Motion の例として頻繁に参照される。
- **描く / 消すの非対称**(オン heavy expressive / オフ 45ms accelerate) ── 直接操作家系の共通文法(radio / switch とも共有)。
- **22px 偶数 px 固定**(rem 化しない) ── 18px root の半端ピクセル滲み回避、sizes scale の例外。
- **focus = outline + offset**(inset shadow と layering 干渉しない) ── 各 form control 共通の配慮。

## Related

- 上位:`principles.md` §4(白 on 色、checked = accent + 白 check)、§5(accent precious、checked 時に accent)、§7(motion = 状態の証言)、§14(Base UI 一本)
- 兄弟(直接操作家系):Switch(thumb 横断 trick)、Radio(dot bloom)
- 親 wrapper:Field(label / description / error)
- 住み分け:`component-selection-map.md` §選択(Checkbox vs Switch vs Toggle 等)
- 詳細:`src/core-ui/checkbox/checkbox.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/checkbox`
- motion 文法:`motion-grammar.md` §Staged Motion(段階的 motion の正典)
- memory:[[otibo-ds-progress]](Checkbox の決定全般)
