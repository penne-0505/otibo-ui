import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { Popover } from "./popover"

export default {
  title: "core-ui / Popover",
}

// 1. Default — click で明るい raised panel。Title / Description / Close。
export const Default: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <Popover.Root>
      <Popover.Trigger render={<Button intent="primary">詳細を開く</Button>} />
      <Popover.Popup>
        <Popover.Title>通知設定</Popover.Title>
        <Popover.Description>
          静かな受け取りを基本に、必要なものだけ。変更は次のセッションから反映されます。
        </Popover.Description>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          <Popover.Close
            render={
              <Button intent="ghost" size="sm">
                閉じる
              </Button>
            }
          />
        </div>
      </Popover.Popup>
    </Popover.Root>
  </div>
)
