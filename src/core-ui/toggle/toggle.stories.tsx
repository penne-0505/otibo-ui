import type { Story } from "@ladle/react"
import { useState } from "react"

import { Toggle, ToggleGroup } from "./toggle"

export default {
  title: "core-ui / Toggle",
}

const wrap: React.CSSProperties = {
  padding: "3rem 2rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  alignItems: "flex-start",
}

// 1. Exclusive — 一択(必ず一つ on)。otibo の Toggle の標準用途。表示単位・ツール選択など。
//    複数選択(フィルタ/タグ)は Chip の領分なので、Toggle は排他で positioning する。
export const Exclusive: Story = () => {
  const [value, setValue] = useState<string[]>(["week"])
  return (
    <div style={wrap}>
      <ToggleGroup value={value} onValueChange={(v) => v.length && setValue(v as string[])}>
        <Toggle value="day">日</Toggle>
        <Toggle value="week">週</Toggle>
        <Toggle value="month">月</Toggle>
      </ToggleGroup>
    </div>
  )
}

// 2. Single — 単体トグル(押すと on のまま保持)。お気に入り・ミュート・ピン留め等。
export const Single: Story = () => (
  <div style={wrap}>
    <Toggle aria-label="ミュート" defaultPressed>
      ミュート
    </Toggle>
  </div>
)
