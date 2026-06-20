import type { Story } from "@ladle/react"

import { Button } from "../button"
import { Spinner } from "./spinner"

export default {
  title: "core-ui / Spinner",
}

// 1. Sizes — sm / md / lg。色は文脈(ここでは fg.muted)に追従。
export const Sizes: Story = () => (
  <div
    style={{
      padding: "3rem 2rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      color: "var(--colors-fg-muted)",
    }}
  >
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>
)

// 2. In context — currentColor で文脈に追従。accent 単体 / primary button 内(白 on 色)。
export const InContext: Story = () => (
  <div style={{ padding: "3rem 2rem", display: "flex", alignItems: "center", gap: "2rem" }}>
    <span style={{ color: "var(--colors-accent)" }}>
      <Spinner />
    </span>
    <Button intent="primary" disabled>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
        <Spinner size="sm" />
        保存中
      </span>
    </Button>
  </div>
)
