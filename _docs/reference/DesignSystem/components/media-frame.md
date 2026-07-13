---
title: MediaFrame
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
  - "../principles.md"
  - "../component-selection-map.md"
related_issues: []
related_prs: []
---

> Implementation: `src/core-ui/media-frame/`

## Overview

**図版・サムネ等の枠**。aspect / object-fit を持ち、画像があれば載せ、無ければ **`empty` slot** で欠落を示す。Skeleton（来る前）とは別。image の load fade は Avatar と同じ処方。

## API

```tsx
<MediaFrameRoot aspect="video">
  <MediaFrameImage src="/cover.jpg" alt="作品" />
</MediaFrameRoot>

<MediaFrameRoot aspect="square">
  <MediaFrameEmpty>画像がありません</MediaFrameEmpty>
</MediaFrameRoot>
```

Slots: `root` / `image` / `empty`。独立 `EmptyMedia` export は無い。

## Variants

| Variant | 値 | 既定 |
| --- | --- | --- |
| `aspect` | `auto` / `square` / `photo` / `video` / `wide` | `video` |
| `fit` | `cover` / `contain` | `cover`（Image でも指定可） |

Root の `aspect` / `fit` は Image slot へ継承される。`MediaFrameImage fit` を指定した場合だけ、Root の `fit` をその Image で上書きする。

## Use when

- Card / 記事 / gallery のメディア枠
- メディアが用意できないときの empty 表示

## Use instead

- **来る前の placeholder** → Skeleton
- **人の像** → Avatar
- **ブランドマーク** → LogoFrame
