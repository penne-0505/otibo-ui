import type { Story } from "@ladle/react"
import { useState } from "react"

import { Switch } from "./switch"

export default {
  title: "core-ui / Switch",
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        cursor: "pointer",
        fontSize: "1rem",
        maxWidth: 360,
      }}
    >
      {children}
    </label>
  )
}

// 1. States — オン = accent。thumb が滑る。
export const States: Story = () => {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Row>
        <span>通知を受け取る(オン = accent)</span>
        <Switch checked={a} onCheckedChange={setA} />
      </Row>
      <Row>
        <span>ダークモード</span>
        <Switch checked={b} onCheckedChange={setB} />
      </Row>
      <Row>
        <span style={{ opacity: 0.55 }}>同期(無効・オフ)</span>
        <Switch disabled />
      </Row>
      <Row>
        <span style={{ opacity: 0.55 }}>同期(無効・オン)</span>
        <Switch disabled checked />
      </Row>
    </div>
  )
}
