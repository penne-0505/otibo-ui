import type { Story } from "@ladle/react"

import { Button } from "../button/button"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPopup } from "./tooltip"

export default {
  title: "core-ui / Tooltip",
}

// 1. Default — hover / focus で warm dark chip。app 直下に Provider を 1 つ。
export const Default: Story = () => (
  <TooltipProvider>
    <div style={{ display: "flex", gap: "1.5rem", padding: "4rem 2rem", alignItems: "center" }}>
      <TooltipRoot>
        <TooltipTrigger render={<Button intent="secondary">ホバーしてみる</Button>} />
        <TooltipPopup>これは補足のヒントです。</TooltipPopup>
      </TooltipRoot>

      <TooltipRoot>
        <TooltipTrigger render={<Button intent="ghost">下に出る</Button>} />
        <TooltipPopup side="bottom">下側に表示されるヒント。</TooltipPopup>
      </TooltipRoot>
    </div>
  </TooltipProvider>
)
