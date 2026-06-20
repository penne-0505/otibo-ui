import type { Story } from "@ladle/react"
import { useState } from "react"

import { Radio, RadioGroup } from "./radio"

export default {
  title: "core-ui / Radio",
}

function Item({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.625rem",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      <Radio value={value} />
      {children}
    </label>
  )
}

// 1. Default — 排他選択。checked = accent(ring + dot)。
export const Default: Story = () => {
  const [value, setValue] = useState("monthly")
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(String(v))}>
      <Item value="monthly">月額プラン</Item>
      <Item value="yearly">年額プラン(2 か月分お得)</Item>
      <Item value="lifetime">買い切り</Item>
    </RadioGroup>
  )
}

// 2. Disabled — 個別 disabled。
export const WithDisabled: Story = () => {
  const [value, setValue] = useState("a")
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(String(v))}>
      <Item value="a">選択肢 A</Item>
      <Item value="b">選択肢 B</Item>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.625rem",
          fontSize: "1rem",
          opacity: 0.55,
        }}
      >
        <Radio value="c" disabled />
        選択肢 C(無効)
      </label>
    </RadioGroup>
  )
}
