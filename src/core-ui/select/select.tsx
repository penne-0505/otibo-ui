import { Select as BaseSelect } from "@base-ui-components/react/select"
import { forwardRef } from "react"

import { select } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Select — 値を一つ選ぶ listbox。a11y / positioning / keyboard は Base UI に委譲、
 * 見た目は otibo recipe(trigger=input 同形、popup=raised panel)。
 *
 * 使い方:
 *   <Select.Root items={items}>
 *     <Select.Trigger>
 *       <Select.Value placeholder="選択してください" />
 *     </Select.Trigger>
 *     <Select.Popup>
 *       <Select.Item value="a">
 *         <Select.ItemText>A</Select.ItemText>
 *       </Select.Item>
 *     </Select.Popup>
 *   </Select.Root>
 */

// Trigger ── Value を内包し、右端に chevron(Icon slot)を自前で付ける。
const SelectTrigger = forwardRef<HTMLButtonElement, BaseSelect.Trigger.Props>(
  function SelectTrigger({ className, children, ...props }, ref) {
    const slot = select()
    return (
      <BaseSelect.Trigger ref={ref} className={mergeClass(slot.trigger, className)} {...props}>
        {children}
        <BaseSelect.Icon className={slot.icon}>
          <Icon name="chevron-down" size="0.875em" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
    )
  },
)

// Popup ── Portal + Positioner で浮かせる。
interface SelectPopupProps extends BaseSelect.Popup.Props {
  side?: BaseSelect.Positioner.Props["side"]
  align?: BaseSelect.Positioner.Props["align"]
  sideOffset?: BaseSelect.Positioner.Props["sideOffset"]
}

const SelectPopup = forwardRef<HTMLDivElement, SelectPopupProps>(function SelectPopup(
  { className, side = "bottom", align = "start", sideOffset = 6, children, ...props },
  ref,
) {
  const slot = select()
  return (
    <BaseSelect.Portal>
      {/* alignItemWithTrigger=false:選択項目を trigger に重ねる native 風挙動を切り、trigger の
          下に開く標準 dropdown にする(上にせり上がって被る問題の解消、Combobox と挙動を揃える)。 */}
      <BaseSelect.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignItemWithTrigger={false}
      >
        <BaseSelect.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
})

// Item ── ItemText(呼び出し側)+ 右端 ItemIndicator(check)を内包。
const SelectItem = forwardRef<HTMLDivElement, BaseSelect.Item.Props>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  const slot = select()
  return (
    <BaseSelect.Item ref={ref} className={mergeClass(slot.item, className)} {...props}>
      {children}
      <BaseSelect.ItemIndicator className={slot.itemIndicator}>
        <Icon name="check" size="0.875em" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
})

export const Select = {
  Root: BaseSelect.Root,
  Trigger: SelectTrigger,
  Value: BaseSelect.Value,
  Popup: SelectPopup,
  Item: SelectItem,
  ItemText: BaseSelect.ItemText,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
  Separator: BaseSelect.Separator,
}
