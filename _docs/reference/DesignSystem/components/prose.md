---
title: Prose
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
  - "../token-semantic-usage-map.md"
  - "../component-selection-map.md"
related_issues: []
related_prs: []
---

> Implementation: `src/core-ui/prose/`

## Overview

**読み面**。`maxWidth: prose` と段落リズムを持ち、子要素の声は textStyles 梯子に寄せる。タイポ role の正本は textStyles であり、Prose は面。

## API

```tsx
<Prose>
  <h2>見出し</h2>
  <p>本文…</p>
</Prose>

<Prose reading="article" as="article">…</Prose>
```

## Variants

| Variant | 値 | 既定 | 効果 |
| --- | --- | --- | --- |
| `reading` | `ui` | ✓ | 本文 md（18px） |
| `reading` | `article` | | 長文 base（16px）+ normal leading |

## Typography roles（textStyles）

正本は `src/theme/text-styles.ts`。`<Text>` component は公開しない。

| Role | 用途 |
| --- | --- |
| `display` | editorial 上位 |
| `heading.sm\|md\|lg` | 見出し帯（md ≈ Card title） |
| `body` | UI 本文 |
| `eyebrow` | kicker |
| `caption` | 注釈 |

```tsx
import { textStyle } from "@otibo/ui"

<p className={textStyle("heading.md")}>…</p>
```

`textStyle()` は `@otibo/ui/styles.css` に含まれる named textStyle の安定 class を返す。consumer 側の Panda install / config / codegen は不要。HTML 要素は消費側が選ぶ。

## Use when

- 法務・ガイド・長めの説明文
- UI 内の短い読みブロックで measure を揃えたいとき

## Use instead

- Card 内の短い title/description → Card slots
- 単独の1行ラベル → textStyle 直接 / eyebrow / caption
