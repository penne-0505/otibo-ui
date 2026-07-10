import type { Story } from "@ladle/react"

import { SelectRoot, SelectTrigger, SelectValue, SelectPopup, SelectItem, SelectItemText } from "./select"

export default {
  title: "core-ui / Select",
}

const prefectures = [
  { value: "hokkaido", label: "北海道" },
  { value: "tokyo", label: "東京都" },
  { value: "kyoto", label: "京都府" },
  { value: "osaka", label: "大阪府" },
  { value: "fukuoka", label: "福岡県" },
  { value: "okinawa", label: "沖縄県" },
]

// 1. Default — 既定値あり。selected = check + fg.strong、active = accent.subtle。
export const Default: Story = () => (
  <div style={{ padding: "4rem 2rem", maxWidth: "16rem" }}>
    <SelectRoot items={prefectures} defaultValue="kyoto">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {prefectures.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            <SelectItemText>{p.label}</SelectItemText>
          </SelectItem>
        ))}
      </SelectPopup>
    </SelectRoot>
  </div>
)

// 2. Placeholder — 未選択。trigger は fg.subtle の placeholder を表示。
export const Placeholder: Story = () => (
  <div style={{ padding: "4rem 2rem", maxWidth: "16rem" }}>
    <SelectRoot items={prefectures}>
      <SelectTrigger>
        <SelectValue>
          {(value: string | null) =>
            value ? prefectures.find((p) => p.value === value)?.label : "都道府県を選択"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {prefectures.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            <SelectItemText>{p.label}</SelectItemText>
          </SelectItem>
        ))}
      </SelectPopup>
    </SelectRoot>
  </div>
)
