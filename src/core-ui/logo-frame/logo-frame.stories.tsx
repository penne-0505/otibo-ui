import type { Story } from "@ladle/react"

import { LogoFrameFallback, LogoFrameImage, LogoFrameRoot } from "./logo-frame"

export default {
  title: "core-ui / LogoFrame",
}

// 横長ワードマーク（shape="auto" 向け）
const wordmarkSrc =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <text x="0" y="30" fill="#3d3a36" font-family="system-ui,sans-serif" font-size="30" font-weight="600">otibo</text>
    </svg>`,
  )

// 正方形マーク（shape="square" 向け）
const markSrc =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect x="6" y="6" width="36" height="36" rx="9" fill="none" stroke="#3d3a36" stroke-width="3"/>
      <circle cx="24" cy="24" r="7" fill="#3d3a36"/>
    </svg>`,
  )

export const Wordmark: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
    {(["sm", "md", "lg"] as const).map((size) => (
      <LogoFrameRoot key={size} size={size} shape="auto">
        <LogoFrameImage src={wordmarkSrc} alt="otibo" />
        <LogoFrameFallback>OT</LogoFrameFallback>
      </LogoFrameRoot>
    ))}
  </div>
)

export const Mark: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    {(["sm", "md", "lg"] as const).map((size) => (
      <LogoFrameRoot key={size} size={size}>
        <LogoFrameImage src={markSrc} alt="otibo mark" />
        <LogoFrameFallback>OT</LogoFrameFallback>
      </LogoFrameRoot>
    ))}
  </div>
)

export const Fallback: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
    <LogoFrameRoot size="lg">
      <LogoFrameImage src="/does-not-exist.png" alt="missing" />
      <LogoFrameFallback>OT</LogoFrameFallback>
    </LogoFrameRoot>
    <LogoFrameRoot size="lg" shape="auto">
      <LogoFrameImage src="/does-not-exist.png" alt="missing" />
      <LogoFrameFallback>otibo</LogoFrameFallback>
    </LogoFrameRoot>
  </div>
)

export const VersusAvatarHint: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "28rem" }}>
    <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.7 }}>
      LogoFrame は角丸・contain・muted。横長は shape="auto"、アイコンは square。人の円形
      identity は Avatar のまま。
    </p>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <LogoFrameRoot size="lg" shape="auto">
        <LogoFrameImage src={wordmarkSrc} alt="otibo" />
        <LogoFrameFallback>OT</LogoFrameFallback>
      </LogoFrameRoot>
      <LogoFrameRoot size="lg">
        <LogoFrameImage src={markSrc} alt="otibo mark" />
        <LogoFrameFallback>OT</LogoFrameFallback>
      </LogoFrameRoot>
    </div>
  </div>
)
