import { Tabs as BaseTabs } from "@base-ui-components/react/tabs"
import { forwardRef } from "react"

import { segmentedControl } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * SegmentedControl — 単一選択の compact toggle。
 *
 * Base UI Tabs を primitive に使う(Tabs.Indicator が active セグメントの位置を自動追従し、
 * 滑る pill を供給する)。a11y は tablist semantics。panel は持たず、値選択 selector として使う。
 *
 * 使い方:
 *   <SegmentedControl.Root value={v} onValueChange={setV}>
 *     <SegmentedControl.Item value="light">ライト</SegmentedControl.Item>
 *     <SegmentedControl.Item value="dark">ダーク</SegmentedControl.Item>
 *   </SegmentedControl.Root>
 */
const SegmentedRoot = forwardRef<HTMLDivElement, BaseTabs.Root.Props>(function SegmentedRoot(
  { className, children, ...props },
  ref,
) {
  const slot = segmentedControl()
  return (
    <BaseTabs.Root ref={ref} className={mergeClass(slot.root, className)} {...props}>
      <BaseTabs.List className={slot.list}>
        <BaseTabs.Indicator className={slot.indicator} />
        {children}
      </BaseTabs.List>
    </BaseTabs.Root>
  )
})

const SegmentedItem = forwardRef<HTMLButtonElement, BaseTabs.Tab.Props>(function SegmentedItem(
  { className, ...props },
  ref,
) {
  const slot = segmentedControl()
  return <BaseTabs.Tab ref={ref} className={mergeClass(slot.item, className)} {...props} />
})

export const SegmentedControl = {
  Root: SegmentedRoot,
  Item: SegmentedItem,
}
