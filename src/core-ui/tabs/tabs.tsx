import { Tabs as BaseTabs } from "@base-ui-components/react/tabs"
import { forwardRef } from "react"

import { tabs } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Tabs — section 切替の nav。a11y / keyboard / active 管理は Base UI に委譲、
 * 見た目は otibo recipe(active = accent 下線)。
 *
 * 使い方:
 *   <Tabs.Root defaultValue="a">
 *     <Tabs.List>
 *       <Tabs.Tab value="a">概要</Tabs.Tab>
 *       <Tabs.Tab value="b">実装</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="a">...</Tabs.Panel>
 *     <Tabs.Panel value="b">...</Tabs.Panel>
 *   </Tabs.Root>
 */
const TabsRoot = forwardRef<HTMLDivElement, BaseTabs.Root.Props>(function TabsRoot(
  { className, ...props },
  ref,
) {
  const slot = tabs()
  return <BaseTabs.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

const TabsList = forwardRef<HTMLDivElement, BaseTabs.List.Props>(function TabsList(
  { className, ...props },
  ref,
) {
  const slot = tabs()
  return <BaseTabs.List ref={ref} className={mergeClass(slot.list, className)} {...props} />
})

const TabsTab = forwardRef<HTMLButtonElement, BaseTabs.Tab.Props>(function TabsTab(
  { className, ...props },
  ref,
) {
  const slot = tabs()
  return <BaseTabs.Tab ref={ref} className={mergeClass(slot.tab, className)} {...props} />
})

const TabsPanel = forwardRef<HTMLDivElement, BaseTabs.Panel.Props>(function TabsPanel(
  { className, ...props },
  ref,
) {
  const slot = tabs()
  return <BaseTabs.Panel ref={ref} className={mergeClass(slot.panel, className)} {...props} />
})

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
}

export { TabsRoot, TabsList, TabsTab, TabsPanel }
