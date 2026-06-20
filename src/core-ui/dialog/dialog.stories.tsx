import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { Dialog } from "./dialog"

export default {
  title: "core-ui / Dialog",
}

// 1. Default — click で scrim + 中央 paper。Title / Description / footer。
export const Default: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <Dialog.Root>
      <Dialog.Trigger render={<Button intent="primary">公開する</Button>} />
      <Dialog.Popup>
        <Dialog.Title>この記事を公開しますか</Dialog.Title>
        <Dialog.Description>
          公開すると一覧に表示されます。あとから下書きに戻すこともできます。
        </Dialog.Description>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          <Dialog.Close render={<Button intent="ghost">下書きに戻す</Button>} />
          <Dialog.Close render={<Button intent="primary">公開する</Button>} />
        </div>
      </Dialog.Popup>
    </Dialog.Root>
  </div>
)

// 2. LongContent — 本文が長く、popup 内スクロール(maxHeight)に収まることの確認。
export const LongContent: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <Dialog.Root>
      <Dialog.Trigger render={<Button intent="secondary">利用規約を読む</Button>} />
      <Dialog.Popup>
        <Dialog.Title>利用規約</Dialog.Title>
        <Dialog.Description>最終更新:2026 年 6 月</Dialog.Description>
        <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} style={{ margin: 0 }}>
              第 {i + 1} 条。これはスクロール挙動を確認するためのダミー本文です。静かな受け取りを
              基本に、必要なものだけを、必要なときに。
            </p>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          <Dialog.Close render={<Button intent="primary">同意する</Button>} />
        </div>
      </Dialog.Popup>
    </Dialog.Root>
  </div>
)
