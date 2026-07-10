import type { Story } from "@ladle/react"

import { TabsRoot, TabsList, TabsTab, TabsPanel } from "./tabs"

export default {
  title: "core-ui / Tabs",
}

// 1. Default — active タブが accent 下線。section 切替。
export const Default: Story = () => (
  <div style={{ maxWidth: 520 }}>
    <TabsRoot defaultValue="overview">
      <TabsList>
        <TabsTab value="overview">概要</TabsTab>
        <TabsTab value="impl">実装</TabsTab>
        <TabsTab value="metrics">計測</TabsTab>
      </TabsList>
      <TabsPanel value="overview">
        単一 accent を active タブの下線に当てる。滑る indicator
        は使わず、静的な下線で「いま開いている section」を示す。
      </TabsPanel>
      <TabsPanel value="impl">
        Base UI Tabs に a11y / keyboard(矢印キー)/ active 管理を委譲し、見た目は otibo recipe。
      </TabsPanel>
      <TabsPanel value="metrics">計測タブの内容。</TabsPanel>
    </TabsRoot>
  </div>
)

// 2. WithDisabled — 個別 disabled タブ。
export const WithDisabled: Story = () => (
  <div style={{ maxWidth: 520 }}>
    <TabsRoot defaultValue="a">
      <TabsList>
        <TabsTab value="a">利用可能</TabsTab>
        <TabsTab value="b">準備中</TabsTab>
        <TabsTab value="c" disabled>
          無効
        </TabsTab>
      </TabsList>
      <TabsPanel value="a">利用可能なタブの内容。</TabsPanel>
      <TabsPanel value="b">準備中タブの内容。</TabsPanel>
      <TabsPanel value="c">無効タブの内容。</TabsPanel>
    </TabsRoot>
  </div>
)
