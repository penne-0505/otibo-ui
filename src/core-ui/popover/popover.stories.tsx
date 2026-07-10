import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { PopoverRoot, PopoverTrigger, PopoverPopup, PopoverTitle, PopoverDescription, PopoverClose } from "./popover"

export default {
  title: "core-ui / Popover",
}

// 1. Default — click で明るい raised panel。Title / Description / Close。
export const Default: Story = () => (
  <div style={{ padding: "4rem 2rem" }}>
    <PopoverRoot>
      <PopoverTrigger render={<Button intent="primary">詳細を開く</Button>} />
      <PopoverPopup>
        <PopoverTitle>通知設定</PopoverTitle>
        <PopoverDescription>
          静かな受け取りを基本に、必要なものだけ。変更は次のセッションから反映されます。
        </PopoverDescription>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          <PopoverClose
            render={
              <Button intent="ghost" size="sm">
                閉じる
              </Button>
            }
          />
        </div>
      </PopoverPopup>
    </PopoverRoot>
  </div>
)
