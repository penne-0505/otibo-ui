import { Popover as BasePopover } from "@base-ui/react/popover"
import { popover } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Popover — click で開く浮く面。a11y / positioning / outside-click / focus は
 * Base UI に委譲、見た目は otibo recipe(明るい raised panel)。
 *
 * 使い方:
 *   <PopoverRoot>
 *     <PopoverTrigger render={<Button>開く</Button>} />
 *     <PopoverPopup>
 *       <PopoverTitle>...</PopoverTitle>
 *       <PopoverDescription>...</PopoverDescription>
 *     </PopoverPopup>
 *   </PopoverRoot>
 */
interface PopoverPopupProps extends BasePopover.Popup.Props {
  side?: BasePopover.Positioner.Props["side"]
  align?: BasePopover.Positioner.Props["align"]
  sideOffset?: BasePopover.Positioner.Props["sideOffset"]
}

export const PopoverRoot = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup(
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

export const PopoverTitle = forwardRef<HTMLHeadingElement, BasePopover.Title.Props>(
  function PopoverTitle({ className, ...props }, ref) {
    const slot = popover()
    return <BasePopover.Title ref={ref} className={mergeClass(slot.title, className)} {...props} />
  },
)

export const PopoverDescription = forwardRef<HTMLParagraphElement, BasePopover.Description.Props>(
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
