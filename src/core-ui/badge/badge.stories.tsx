import type { Story } from "@ladle/react"

import { Badge } from "./badge"

export default {
  title: "core-ui / Badge",
}

// 1. Tones — accent(default)/ neutral / danger。
export const Tones: Story = () => (
  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
    <Badge>Design System</Badge>
    <Badge tone="accent">accent</Badge>
    <Badge tone="neutral">neutral</Badge>
    <Badge tone="danger">danger</Badge>
  </div>
)

// 2. In context — タグの束。accent tint が画面に複数点入る。
export const InContext: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 420 }}>
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Badge>Panda CSS</Badge>
      <Badge>Base UI</Badge>
      <Badge>OKLCH</Badge>
      <Badge>React 18</Badge>
    </div>
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <span style={{ fontSize: "1rem", color: "var(--colors-fg)" }}>ステータス</span>
      <Badge tone="neutral">下書き</Badge>
      <Badge tone="danger">期限切れ</Badge>
    </div>
  </div>
)
