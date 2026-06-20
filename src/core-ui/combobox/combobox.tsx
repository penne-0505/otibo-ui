import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox"
import { forwardRef } from "react"

import { combobox } from "@otibo/ui/styled-system/recipes"
import { cx, mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Combobox — 検索で絞り込める select。a11y / filtering / positioning は Base UI Combobox。
 *
 * 使い方:
 *   <Combobox.Root items={items}>
 *     <Combobox.Input placeholder="検索…" />
 *     <Combobox.Popup>
 *       <Combobox.Empty>該当なし</Combobox.Empty>
 *       <Combobox.List>
 *         {(item) => (
 *           <Combobox.Item key={item} value={item}>{item}</Combobox.Item>
 *         )}
 *       </Combobox.List>
 *     </Combobox.Popup>
 *   </Combobox.Root>
 */

// Input ── 受け皿(control)に検索 input と chevron(Trigger=クリックで開閉)を収める。
const ComboboxInput = forwardRef<HTMLInputElement, BaseCombobox.Input.Props>(function ComboboxInput(
  { className, ...props },
  ref,
) {
  const slot = combobox()
  return (
    <div className={slot.control}>
      <span className={slot.searchIcon}>
        <Icon name="search" size="1em" />
      </span>
      <BaseCombobox.Input ref={ref} className={mergeClass(slot.input, className)} {...props} />
      <BaseCombobox.Trigger className={cx(slot.icon)} aria-label="候補を開く">
        <Icon name="chevron-down" size="0.875em" />
      </BaseCombobox.Trigger>
    </div>
  )
})

interface ComboboxPopupProps extends BaseCombobox.Popup.Props {
  side?: BaseCombobox.Positioner.Props["side"]
  align?: BaseCombobox.Positioner.Props["align"]
  sideOffset?: BaseCombobox.Positioner.Props["sideOffset"]
}

const ComboboxPopup = forwardRef<HTMLDivElement, ComboboxPopupProps>(function ComboboxPopup(
  { className, side = "bottom", align = "start", sideOffset = 6, children, ...props },
  ref,
) {
  const slot = combobox()
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseCombobox.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
})

const ComboboxList = forwardRef<HTMLDivElement, BaseCombobox.List.Props>(function ComboboxList(
  { className, ...props },
  ref,
) {
  const slot = combobox()
  return <BaseCombobox.List ref={ref} className={mergeClass(slot.list, className)} {...props} />
})

const ComboboxItem = forwardRef<HTMLDivElement, BaseCombobox.Item.Props>(function ComboboxItem(
  { className, children, ...props },
  ref,
) {
  const slot = combobox()
  return (
    <BaseCombobox.Item ref={ref} className={mergeClass(slot.item, className)} {...props}>
      {children}
      <BaseCombobox.ItemIndicator className={slot.itemIndicator}>
        <Icon name="check" size="0.875em" />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  )
})

const ComboboxEmpty = forwardRef<HTMLDivElement, BaseCombobox.Empty.Props>(function ComboboxEmpty(
  { className, ...props },
  ref,
) {
  const slot = combobox()
  return <BaseCombobox.Empty ref={ref} className={mergeClass(slot.empty, className)} {...props} />
})

export const Combobox = {
  Root: BaseCombobox.Root,
  Input: ComboboxInput,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  Value: BaseCombobox.Value,
}
