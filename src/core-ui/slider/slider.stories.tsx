import type { Story } from "@ladle/react"
import { useState } from "react"

import { Slider } from "./slider"

export default {
  title: "core-ui / Slider",
}

const wrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "360px",
  padding: "2rem",
}

export const Default: Story = () => {
  const [v, setV] = useState(70)
  return (
    <div style={wrap}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
          <span>音量</span>
          <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--colors-fg-muted)" }}>
            {v}
          </span>
        </div>
        <Slider value={v} onValueChange={setV} aria-label="音量" />
      </div>
      <Slider defaultValue={30} aria-label="既定 30" />
      <Slider defaultValue={50} step={10} aria-label="step 10(矢印キーで glide 確認)" />
      <Slider defaultValue={40} disabled aria-label="disabled" />
    </div>
  )
}
