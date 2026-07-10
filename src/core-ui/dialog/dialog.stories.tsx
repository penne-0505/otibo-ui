import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { DialogRoot, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogClose } from "./dialog"

export default {
  title: "core-ui / Dialog",
}

// 1. Default — click で scrim + 中央 paper。Title / Description / footer。
export const Default: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <DialogRoot>
      <DialogTrigger render={<Button intent="primary">公開する</Button>} />
      <DialogPopup>
        <DialogTitle>この記事を公開しますか</DialogTitle>
        <DialogDescription>
          公開すると一覧に表示されます。あとから下書きに戻すこともできます。
        </DialogDescription>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          <DialogClose render={<Button intent="ghost">下書きに戻す</Button>} />
          <DialogClose render={<Button intent="primary">公開する</Button>} />
        </div>
      </DialogPopup>
    </DialogRoot>
  </div>
)

// 2. LongContent — 本文が長く、popup 内スクロール(maxHeight)に収まることの確認。
export const LongContent: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <DialogRoot>
      <DialogTrigger render={<Button intent="secondary">利用規約を読む</Button>} />
      <DialogPopup>
        <DialogTitle>利用規約</DialogTitle>
        <DialogDescription>最終更新:2026 年 6 月</DialogDescription>
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
          <DialogClose render={<Button intent="primary">同意する</Button>} />
        </div>
      </DialogPopup>
    </DialogRoot>
  </div>
)
