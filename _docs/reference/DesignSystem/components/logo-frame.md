---
title: LogoFrame
status: active
draft_status: n/a
created_at: 2026-07-11
updated_at: 2026-07-12
references:
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
  - "../components/avatar.md"
  - "../component-selection-map.md"
related_issues: []
related_prs: []
---

> Implementation: `src/core-ui/logo-frame/`

## Overview

**ブランド / マークの像**。構成は Avatar（Root / Image / Fallback + Base UI load 判定）と同型だが、見た目は異なる。

- 角丸矩形（円ではない）
- `object-fit: contain`（透過余白を潰さない）
- fallback 地は `surface.muted`（Avatar の accent 円は使わない）

## shape

枠の形は `shape` で選ぶ。image の寸法は root の `shape` から `& img` で駆動する（子コンポーネントは `shape` を受け取らない）。

- `square`（既定）── アイコン / モノグラム向けの 1:1 枠。fallback 頭文字もここに収まる。
- `auto` ── 横長ワードマーク向け。高さを `size` で固定し、幅はロゴ比率に追従する。正方形枠にワードマークを入れると潰れて読めなくなるのを避けるための形。

## API

```tsx
// アイコン / モノグラム
<LogoFrameRoot size="lg">
  <LogoFrameImage src="/mark.svg" alt="otibo" />
  <LogoFrameFallback>OT</LogoFrameFallback>
</LogoFrameRoot>

// 横長ワードマーク
<LogoFrameRoot size="lg" shape="auto">
  <LogoFrameImage src="/wordmark.svg" alt="otibo" />
  <LogoFrameFallback>otibo</LogoFrameFallback>
</LogoFrameRoot>
```

## Variants

| Variant | 値 | 既定 |
| --- | --- | --- |
| `size` | `sm` / `md` / `lg` | `md` |
| `shape` | `square` / `auto` | `square` |

## Use when

- ヘッダーや設定のブランドマーク（アイコンは `square`、ワードマークは `auto`）
- 透過ロゴを枠に収める

## Use instead

- **人 / 主体** → Avatar
- **汎用図版** → MediaFrame
