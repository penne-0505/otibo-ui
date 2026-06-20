---
title: Accordion
status: active
component: src/core-ui/accordion/
references:
  - "../principles.md"
  - "../motion-grammar.md"
  - "../component-selection-map.md"
---

## Overview

**開閉できる詳細セクション**(disclosure)。otibo の motion grammar における**新領域** ── これまでの opacity / transform / scale と違い、**高さ(サイズ)を animate** する初めての component。Base UI が panel の実高さを `--accordion-panel-height` で供給するので、height をそれと 0 の間で transition する。**height animation の鉄則:padding を animate する要素に乗せない**(畳んでも padding 分の高さが残り 0 にならない) ── panel は height/overflow だけ、余白は `panelContent` に逃がす。

## API

slot recipe(Panda)+ Base UI Accordion 委譲。slot は `root` / `item` / `header` / `trigger` / `icon` / `panel` / `panelContent`(7 slot)。

```tsx
<Accordion.Root>
  <Accordion.Item value="basics">
    <Accordion.Header>
      <Accordion.Trigger>
        基本設定 <Accordion.Icon><Icon name="chevron-down" /></Accordion.Icon>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      <Accordion.PanelContent>...</Accordion.PanelContent>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

**otibo 既定は非排他(multiple=true)** ── 触っていない section を勝手に閉じない grain。排他にしたい時だけ `multiple={false}` で opt-in(`AccordionRoot` wrapper で既定を反転、Base UI 既定は multiple=false)。

## Variants

なし(単一形)。size variant は持たない(section disclosure の grain で固定)。`multiple` は wrapper 側の既定で反転している(grain として記録)。

## States

| Slot / State | 視覚 |
| --- | --- |
| **root** | flex column(item 縦並び) |
| **item** | `borderBottom: 1px solid border.subtle`(項目間 hairline) |
| **item `:last-of-type`** | `borderBottomWidth: 0`(最後は引かない、容器の縁と二重にしない) |
| **trigger rest** | flex space-between + gap 3 + paddingBlock 3 + `md` + `medium` + `fg.strong` + `bg: transparent` |
| **trigger focus-visible** | `outline: 2px solid accent` + `outlineOffset: 2px` + `borderRadius: xs` |
| **trigger `data-disabled`** | `opacity: disabled` + `cursor: not-allowed` |
| **icon rest** | `color: fg.muted` + `transform: none` |
| **icon `[data-panel-open] &`**(open 中の trigger 内) | `transform: rotate(180deg)`(chevron 反転) |
| **panel rest(open)** | `height: var(--accordion-panel-height)` + `overflow: hidden` |
| **panel `data-starting-style` / `data-ending-style`(closed)** | `height: 0` |
| **panelContent** | `paddingBottom: 3` + `sm` + `normal lineHeight` + `fg`(余白を持つ内側) |

**height animation の鉄則**:
- **panel = height + overflow:hidden だけ**(padding 持たない)
- **余白は panelContent に**(panel が 0 まで畳めるように)
- これで panel は **0 まできれいに畳み**、中身は上から clip されて現れる。
- 違反すると「畳んでも padding 分の高さが残る」「panel 内で要素が見切れない」等の不具合が発生。

## a11y

- **primitive** ── `@base-ui-components/react/accordion`(Root / Item / Header / Trigger / Panel)。
- **role** ── trigger は `button` + `aria-expanded` + `aria-controls`、panel は `region` + `aria-labelledby`(Base UI 担保)。
- **keyboard** ── ↑↓ で trigger 間移動、Enter / Space で toggle、Home / End で先頭 / 末尾(Base UI 担保)。
- **header** ── `<h3>` などで wrap することを消費側が判断(Accordion.Header は `<div>` 既定、margin 0 で見出し階層に乗せる)。

## Motion

| Slot / 軸 | 値 |
| --- | --- |
| **panel height** Tier | `medium`(240ms) |
| **panel** Register | **`expressive`**(decelerate 尾、reveal の grain) |
| **icon chevron rotate** Tier | `quick`(120ms) |
| **icon** Register | quiet(standard) |
| **icon, trigger color** 対象 property | `transform, color` |

reveal motion なので **expressive**(decelerate 尾 = 「置かれる」感) + **medium tier**(画面が変化する重みに見合う)。**`motion-grammar.md` の Deferred Decision 検証台**だった Accordion は、実機で「中身テキストの reflow ガタつきが出ないか」を確認 ── 出ずに medium / expressive で grain が成立(検証済)。

reduced-motion:`transition: none`(height も瞬時で切替、travel を抜く)。

## Use when

- **section の開閉**(FAQ、設定 group、詳細情報の reveal)。
- 内容が **入れ子の構造を持つ**(section に複数の field / content)。
- **省スペース化**(モバイルで複数 section を縦に詰める文脈)。

## Use instead

- **ウィザード / 段階遷移**(順序と進捗が必要) → stepper / 別画面 / Tabs(順序 / 進捗が伝わらない grain 違い)。
- **常設の section grouping** → Card / 見出し(Accordion は触らないと中身が読めない)。
- **inline の disclosure(短い hint)** → Tooltip / Popover。
- **画面を奪う重み** → Dialog。

詳細は `component-selection-map.md` §container。

## Avoid

- **panel に padding を直接持たせる**(畳んでも padding 分の高さが残り 0 にならない) → panelContent に逃がす。
- **height transition を quick / heavy にする**(quick = 「ピョン」と開いて grain 違い、heavy = 過剰 / 重い) → medium 維持。
- **ウィザードに Accordion**(順序 / 進捗が読み取れない) → 別 component に倒す。
- **trigger を `<a>` にする**(URL 遷移と disclosure は別 grain) → button 維持。
- **multiple={false} を既定にする**(otibo 既定は非排他、勝手に閉じる挙動を avoid) → wrapper の既定を維持。

## Decisions(本セッションの確定事項)

- **otibo 既定は非排他(multiple=true)** ── 触っていない section を勝手に閉じない grain。排他は opt-in。Base UI 既定(multiple=false)を反転している(`AccordionRoot` wrapper)。
- **height animation の鉄則**:panel = height + overflow:hidden、余白は panelContent ── 畳めない / 見切れないバグを構造で回避。
- **motion = medium expressive**(decelerate 尾、reveal grain) ── 実機検証で reflow ガタつき出ず、検証済。
- **項目間 hairline、最後は引かない** ── Card / 容器の縁と二重にしない、原則 1 余白 grain と整合。
- **trigger は flex space-between + chevron 反転 icon** ── 開閉状態が icon 反転で明示、視覚 + ARIA 二重の signal。

## Related

- 上位:`principles.md` §1(構造区切りは hairline 最小)、§7(motion = 状態の証言、height reveal)、§14(Base UI 一本)
- 別 container:Card(浮く paper)、Dialog(画面を奪う)
- 住み分け:`component-selection-map.md` §container
- 詳細:`src/core-ui/accordion/accordion.recipe.ts`(canonical コメント)、Base UI `@base-ui-components/react/accordion`
- motion 文法:`motion-grammar.md` §Deferred Decisions(Accordion の height reveal 検証)
- memory:[[otibo-ds-progress]](Accordion の決定全般)
