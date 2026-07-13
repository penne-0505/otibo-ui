import type { Story } from "@ladle/react"

import { MediaFrameEmpty, MediaFrameImage, MediaFrameRoot } from "./media-frame"

export default {
  title: "core-ui / MediaFrame",
}

const sampleSrc =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d4cfc6"/>
          <stop offset="100%" stop-color="#8a847a"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="url(#g)"/>
      <text x="48" y="480" fill="#f5f1eb" font-family="system-ui,sans-serif" font-size="36">otibo media</text>
    </svg>`,
  )

export const WithImage: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <MediaFrameRoot aspect="video">
      <MediaFrameImage src={sampleSrc} alt="サンプル図版" />
    </MediaFrameRoot>
  </div>
)

export const Empty: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <MediaFrameRoot aspect="video">
      <MediaFrameEmpty>画像がありません</MediaFrameEmpty>
    </MediaFrameRoot>
  </div>
)

export const Aspects: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
      gap: "1.5rem",
      maxWidth: "48rem",
    }}
  >
    {(["square", "photo", "video", "wide"] as const).map((aspect) => (
      <div key={aspect} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{aspect}</span>
        <MediaFrameRoot aspect={aspect}>
          <MediaFrameImage src={sampleSrc} alt="" />
        </MediaFrameRoot>
      </div>
    ))}
  </div>
)

export const ContainFit: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <MediaFrameRoot aspect="square" fit="contain">
      <MediaFrameImage src={sampleSrc} alt="contain inherited from root" />
    </MediaFrameRoot>
  </div>
)

export const AutoAspect: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <MediaFrameRoot aspect="auto">
      <MediaFrameImage src={sampleSrc} alt="intrinsic aspect inherited from root" />
    </MediaFrameRoot>
  </div>
)
