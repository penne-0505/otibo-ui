import type { Story } from "@ladle/react"

import { Tabs } from "./tabs"

export default {
  title: "core-ui / Tabs",
}

// 1. Default — active タブが accent 下線。section 切替。
export const Default: Story = () => (
  <div style={{ maxWidth: 520 }}>
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">概要</Tabs.Tab>
        <Tabs.Tab value="impl">実装</Tabs.Tab>
        <Tabs.Tab value="metrics">計測</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        単一 accent を active タブの下線に当てる。滑る indicator
        は使わず、静的な下線で「いま開いている section」を示す。
      </Tabs.Panel>
      <Tabs.Panel value="impl">
        Base UI Tabs に a11y / keyboard(矢印キー)/ active 管理を委譲し、見た目は otibo recipe。
      </Tabs.Panel>
      <Tabs.Panel value="metrics">計測タブの内容。</Tabs.Panel>
    </Tabs.Root>
  </div>
)

// 2. WithDisabled — 個別 disabled タブ。
export const WithDisabled: Story = () => (
  <div style={{ maxWidth: 520 }}>
    <Tabs.Root defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">利用可能</Tabs.Tab>
        <Tabs.Tab value="b">準備中</Tabs.Tab>
        <Tabs.Tab value="c" disabled>
          無効
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">利用可能なタブの内容。</Tabs.Panel>
      <Tabs.Panel value="b">準備中タブの内容。</Tabs.Panel>
      <Tabs.Panel value="c">無効タブの内容。</Tabs.Panel>
    </Tabs.Root>
  </div>
)
