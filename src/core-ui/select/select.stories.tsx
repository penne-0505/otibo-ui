import type { Story } from "@ladle/react"

import { Select } from "./select"

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
    <Select.Root items={prefectures} defaultValue="kyoto">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popup>
        {prefectures.map((p) => (
          <Select.Item key={p.value} value={p.value}>
            <Select.ItemText>{p.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  </div>
)

// 2. Placeholder — 未選択。trigger は fg.subtle の placeholder を表示。
export const Placeholder: Story = () => (
  <div style={{ padding: "4rem 2rem", maxWidth: "16rem" }}>
    <Select.Root items={prefectures}>
      <Select.Trigger>
        <Select.Value>
          {(value: string | null) =>
            value ? prefectures.find((p) => p.value === value)?.label : "都道府県を選択"
          }
        </Select.Value>
      </Select.Trigger>
      <Select.Popup>
        {prefectures.map((p) => (
          <Select.Item key={p.value} value={p.value}>
            <Select.ItemText>{p.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  </div>
)
