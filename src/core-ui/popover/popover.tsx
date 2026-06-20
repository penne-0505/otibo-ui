import { Popover as BasePopover } from "@base-ui-components/react/popover"
import { forwardRef } from "react"

import { popover } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Popover — click で開く浮く面。a11y / positioning / outside-click / focus は
 * Base UI に委譲、見た目は otibo recipe(明るい raised panel)。
 *
 * 使い方:
 *   <Popover.Root>
 *     <Popover.Trigger render={<Button>開く</Button>} />
 *     <Popover.Popup>
 *       <Popover.Title>...</Popover.Title>
 *       <Popover.Description>...</Popover.Description>
 *     </Popover.Popup>
 *   </Popover.Root>
 */
interface PopoverPopupProps extends BasePopover.Popup.Props {
  side?: BasePopover.Positioner.Props["side"]
  align?: BasePopover.Positioner.Props["align"]
  sideOffset?: BasePopover.Positioner.Props["sideOffset"]
}

const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup(
  { className, side = "bottom", align = "center", sideOffset = 8, children, ...props },
  ref,
) {
  const slot = popover()
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BasePopover.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
})

const PopoverTitle = forwardRef<HTMLHeadingElement, BasePopover.Title.Props>(function PopoverTitle(
  { className, ...props },
  ref,
) {
  const slot = popover()
  return <BasePopover.Title ref={ref} className={mergeClass(slot.title, className)} {...props} />
})

const PopoverDescription = forwardRef<HTMLParagraphElement, BasePopover.Description.Props>(
  function PopoverDescription({ className, ...props }, ref) {
    const slot = popover()
    return (
      <BasePopover.Description
        ref={ref}
        className={mergeClass(slot.description, className)}
        {...props}
      />
    )
  },
)

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Popup: PopoverPopup,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: BasePopover.Close,
}
