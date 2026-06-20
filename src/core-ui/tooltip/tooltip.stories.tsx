import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { Tooltip } from "./tooltip"

export default {
  title: "core-ui / Tooltip",
}

// 1. Default — hover / focus で warm dark chip。app 直下に Provider を 1 つ。
export const Default: Story = () => (
  <Tooltip.Provider>
    <div style={{ display: "flex", gap: "1.5rem", padding: "4rem 2rem", alignItems: "center" }}>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button intent="secondary">ホバーしてみる</Button>} />
        <Tooltip.Popup>これは補足のヒントです。</Tooltip.Popup>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger render={<Button intent="ghost">下に出る</Button>} />
        <Tooltip.Popup side="bottom">下側に表示されるヒント。</Tooltip.Popup>
      </Tooltip.Root>
    </div>
  </Tooltip.Provider>
)
