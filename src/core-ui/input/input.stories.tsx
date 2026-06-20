import type { Story } from "@ladle/react"

import { Input } from "./input"

export default {
  title: "core-ui / Input",
}

// 1. Default — standalone, md size。
export const Default: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Input placeholder="メールアドレス" />
  </div>
)

// 2. Sizes — sm と md の対比。
export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 360 }}>
    <Input size="sm" placeholder="sm: 検索キーワード" />
    <Input size="md" placeholder="md: メールアドレス" />
  </div>
)

// 3. Disabled — opacity 一括。
export const Disabled: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Input defaultValue="claude@otibo.dev" disabled />
  </div>
)

// 4. Error — aria-invalid="true" で inset shadow が赤系に。
export const Error: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Input defaultValue="claude@otibo" aria-invalid="true" placeholder="メールアドレス" />
  </div>
)
