import type { Story } from "@ladle/react"
import { useEffect, useState } from "react"

import { Button } from "../button"
import { Progress } from "./progress"

export default {
  title: "core-ui / Progress",
}

const wrap: React.CSSProperties = {
  padding: "3rem 2rem",
  maxWidth: "24rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
}
const row: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
}
const buttons: React.CSSProperties = { display: "flex", gap: "0.5rem" }

// 1. Controls — ボタンで値を動かし、fill の motion(width を medium・expressive で滑らか)を見る。
export const Controls: Story = () => {
  const [value, setValue] = useState(40)
  const clamp = (n: number) => Math.max(0, Math.min(100, n))
  return (
    <div style={wrap}>
      <Progress.Root value={value}>
        <div style={row}>
          <Progress.Label>ダウンロード</Progress.Label>
          <Progress.Value />
        </div>
        <Progress.Track />
      </Progress.Root>
      <div style={buttons}>
        <Button intent="ghost" size="sm" onClick={() => setValue((v) => clamp(v - 10))}>
          −10
        </Button>
        <Button intent="ghost" size="sm" onClick={() => setValue((v) => clamp(v + 10))}>
          +10
        </Button>
        <Button intent="ghost" size="sm" onClick={() => setValue(0)}>
          0
        </Button>
        <Button intent="ghost" size="sm" onClick={() => setValue(100)}>
          100
        </Button>
      </div>
    </div>
  )
}

// 2. Auto — 定期的に自動で進み、100 で 0 に戻る。fill が満ちていく様子を passively 観察できる。
export const Auto: Story = () => {
  const [value, setValue] = useState(0)
  const [running, setRunning] = useState(true)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 500)
    return () => clearInterval(id)
  }, [running])
  return (
    <div style={wrap}>
      <Progress.Root value={value}>
        <div style={row}>
          <Progress.Label>同期中</Progress.Label>
          <Progress.Value />
        </div>
        <Progress.Track />
      </Progress.Root>
      <div style={buttons}>
        <Button intent="ghost" size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? "一時停止" : "再開"}
        </Button>
      </div>
    </div>
  )
}
