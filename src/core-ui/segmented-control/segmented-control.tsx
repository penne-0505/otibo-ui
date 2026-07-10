import { Tabs as BaseTabs } from "@base-ui/react/tabs"
import { segmentedControl } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * SegmentedControl — 単一選択の compact toggle。
 *
 * Base UI Tabs を primitive に使う(indicator slotがactiveセグメントの位置を自動追従し、
 * 滑る pill を供給する)。a11y は tablist semantics。panel は持たず、値選択 selector として使う。
 *
 * 使い方:
 *   <SegmentedControlRoot value={v} onValueChange={setV}>
 *     <SegmentedControlItem value="light">ライト</SegmentedControlItem>
 *     <SegmentedControlItem value="dark">ダーク</SegmentedControlItem>
 *   </SegmentedControlRoot>
 */
export const SegmentedControlRoot = forwardRef<HTMLDivElement, BaseTabs.Root.Props>(
  function SegmentedControlRoot({ className, children, ...props }, ref) {
    const slot = segmentedControl()
    return (
      <BaseTabs.Root ref={ref} className={mergeClass(slot.root, className)} {...props}>
        <BaseTabs.List className={slot.list}>
          <BaseTabs.Indicator className={slot.indicator} />
          {children}
        </BaseTabs.List>
      </BaseTabs.Root>
    )
  },
)

export const SegmentedControlItem = forwardRef<HTMLButtonElement, BaseTabs.Tab.Props>(
  function SegmentedControlItem({ className, ...props }, ref) {
    const slot = segmentedControl()
    return <BaseTabs.Tab ref={ref} className={mergeClass(slot.item, className)} {...props} />
  },
)
