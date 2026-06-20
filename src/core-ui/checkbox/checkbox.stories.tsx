import type { Story } from "@ladle/react"
import { useState } from "react"

import { Checkbox } from "./checkbox"

export default {
  title: "core-ui / Checkbox",
}

function Item({ children }: { children: React.ReactNode }) {
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
      {children}
    </label>
  )
}

// 1. States — checked = accent。未チェック / チェック / 中間 / disabled。
export const States: Story = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 360 }}>
      <Item>
        <Checkbox checked={a} onCheckedChange={setA} />
        利用規約に同意する
      </Item>
      <Item>
        <Checkbox checked={b} onCheckedChange={setB} />
        ニュースレターを受け取る(チェック済 = accent)
      </Item>
      <Item>
        <Checkbox indeterminate checked />
        一部選択(indeterminate)
      </Item>
      <Item>
        <Checkbox disabled />
        無効(未チェック)
      </Item>
      <Item>
        <Checkbox disabled checked />
        無効(チェック済)
      </Item>
    </div>
  )
}

// 2. Group — 複数選択の束。accent が画面に複数点入る様子。
export const Group: Story = () => {
  const [v, setV] = useState({ a: true, b: false, c: true })
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 360 }}>
      <Item>
        <Checkbox checked={v.a} onCheckedChange={(c) => setV({ ...v, a: c })} />
        Panda CSS
      </Item>
      <Item>
        <Checkbox checked={v.b} onCheckedChange={(c) => setV({ ...v, b: c })} />
        Base UI
      </Item>
      <Item>
        <Checkbox checked={v.c} onCheckedChange={(c) => setV({ ...v, c: c })} />
        OKLCH tokens
      </Item>
    </div>
  )
}
