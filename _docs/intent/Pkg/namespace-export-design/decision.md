---
title: "Use flat-only public component exports"
status: active
draft_status: n/a
created_at: 2026-07-10
updated_at: 2026-07-10
references:
  - "_docs/plan/Pkg/namespace-export-design/plan.md"
  - "_docs/qa/Pkg/namespace-export-design/test-plan.md"
  - "_docs/intent/Pkg/drop-in-styles/decision.md"
related_issues: []
related_prs: []
---

## Context

0.2.xは`Field.Root`と`FieldRoot`のようなnamespace / flat二重APIを持つ。namespace propertyはNext.js App RouterのRSC Client Manifestで個別client componentとして安定解決できず、frameworkに応じてimport形式を変える例外を生んでいる。

0.3.0はconsumer-side Panda codegenも廃止するpre-1.0 breaking minorである。後方互換のため二重APIを残すより、このreleaseで公開契約を単一化する。

## Decision

- public component APIをflat named exportだけにする。
- namespace objectをdeprecateせず、0.3.0で直接削除する。
- flat名は原則`Namespace.Slot` → `NamespaceSlot`とする。
- Base UI primitiveを直接namespaceへ載せていたslotにも、otibo側の明示的なflat aliasを与える。
- source storiesとreferenceもflat APIをcanonical exampleとして使う。
- ordinary componentである`ChipGroup`、`RadioGroup`、`ToggleGroup`、`InlineEdit`、`Slider`等は維持する。

### Namespace inventory

| Removed namespace | Flat export prefix / exports |
| --- | --- |
| `Accordion` | `AccordionRoot`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel` |
| `Avatar` | `AvatarRoot`, `AvatarImage`, `AvatarFallback` |
| `Breadcrumb` | `BreadcrumbRoot`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbCurrent` |
| `Card` | `CardRoot`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter` |
| `Combobox` | `ComboboxRoot`, `ComboboxInput`, `ComboboxPopup`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`, `ComboboxValue` |
| `Dialog` | `DialogRoot`, `DialogTrigger`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose` |
| `Field` | `FieldRoot`, `FieldLabel`, `FieldInput`, `FieldDescription`, `FieldError` |
| `Menu` | `MenuRoot`, `MenuTrigger`, `MenuPopup`, `MenuItem`, `MenuSeparator`, `MenuGroup`, `MenuGroupLabel` |
| `Meter` | `MeterRoot`, `MeterLabel`, `MeterValue`, `MeterTrack` |
| `NavigationMenu` | `NavigationMenuRoot`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuLink`, `NavigationMenuContent`, `NavigationMenuGrid`, `NavigationMenuViewport` |
| `NumberField` | `NumberFieldRoot`, `NumberFieldField` |
| `Pagination` | `PaginationRoot`, `PaginationItem`, `PaginationPrev`, `PaginationNext`, `PaginationEllipsis` |
| `Popover` | `PopoverRoot`, `PopoverTrigger`, `PopoverPopup`, `PopoverTitle`, `PopoverDescription`, `PopoverClose` |
| `PreviewCard` | `PreviewCardRoot`, `PreviewCardTrigger`, `PreviewCardPopup`, `PreviewCardMedia`, `PreviewCardBody`, `PreviewCardTitle`, `PreviewCardDescription`, `PreviewCardFooter` |
| `Progress` | `ProgressRoot`, `ProgressLabel`, `ProgressValue`, `ProgressTrack` |
| `ScrollArea` | `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollAreaScrollbar` |
| `SegmentedControl` | `SegmentedControlRoot`, `SegmentedControlItem` |
| `Select` | `SelectRoot`, `SelectTrigger`, `SelectValue`, `SelectPopup`, `SelectItem`, `SelectItemText`, `SelectGroup`, `SelectGroupLabel`, `SelectSeparator` |
| `Table` | `TableRoot`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` |
| `Tabs` | `TabsRoot`, `TabsList`, `TabsTab`, `TabsPanel` |
| `Toast` | `ToastProvider`, `ToastToaster`, `useToastManager`, `createToastManager` |
| `Tooltip` | `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `TooltipPopup` |

## Alternatives

- **namespaceを維持しNextだけflat推奨**: framework別例外と二重APIが恒久化するため不採用。
- **一release deprecationする**: pre-1.0で既にbreaking migrationを行う時期に、移行期間のためだけに保守面を増やすため不採用。
- **namespaceだけに戻す**: RSC互換性とnamed exportの静的解析性を失うため不採用。

## Rationale

単一APIにすると、import、型、documentation、test、tree-shakingの契約が一致する。compound componentの視覚的なまとまりは失うが、prefix命名とIDE補完で発見可能性を維持できる。将来の削除releaseを避ける長期効力を優先する。

## Consequences / Impact

- 0.2.x consumerはdot notationをflat import / JSXへ移行する必要がある。
- import数は増える。
- Next.js App Routerを含む全consumerで同じexport contractになる。
- namespaceを参照するstories、docs、source commentsを一括移行する。
- component runtime behaviorとCSS classは変更しない。

## Quality Implications

- namespace objectが一つでもroot exportへ残ると二重APIが復活する。
- Base UI primitive aliasを漏らすと旧namespaceで可能だったcompositionが欠ける。
- docsだけflat化してsource storyがnamespaceを使い続けると、repository内exampleとpublic contractが乖離する。
- actual Next.js buildでClient Manifest解決を確認する必要がある。

## Intent-derived Invariants

- INV-001: public rootに22の旧namespace名が存在しない。
- INV-002: inventoryにある全flat exportがpublic rootから取得できる。
- INV-003: source / story / README / component referenceに`Namespace.Slot` usageが残らない。
- INV-004: ordinary standalone / group component APIは維持される。
- INV-005: ViteとNext.js App Routerが同じflat importでbuildできる。
- INV-006: 0.2.x migrationとdirect removalのSemVer理由が利用者に見える。

## Rollback / Follow-ups

- publish前はcommit revertでnamespace contractへ戻せる。
- publish後は0.2.0を旧contractとして残し、0.3.xへnamespaceを再追加しない。欠落flat slotはpatchで追加する。
