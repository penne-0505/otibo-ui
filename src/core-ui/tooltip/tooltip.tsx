import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { tooltip } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Tooltip — transient な補足。a11y / delay / positioning は Base UI に委譲、
 * 見た目は otibo recipe(warm dark chip)。
 *
 * 使い方(app 直下に 1 つ TooltipProvider を置く):
 *   <TooltipProvider>
 *     <TooltipRoot>
 *       <TooltipTrigger render={<Button>?</Button>} />
 *       <TooltipPopup>補足テキスト</TooltipPopup>
 *     </TooltipRoot>
 *   </TooltipProvider>
 */
interface TooltipPopupProps extends BaseTooltip.Popup.Props {
  side?: BaseTooltip.Positioner.Props["side"]
  align?: BaseTooltip.Positioner.Props["align"]
  sideOffset?: BaseTooltip.Positioner.Props["sideOffset"]
}

/**
 * Provider — delay / positioning の共有点。
 * - delay=250:Base UI 既定(600ms)より短く、補足が素早く出る。
 * - timeout=0:「一度開くと timeout(≈400ms)内の次の表示は delay を飛ばす」
 *   グループ化(warm-up)を無効化し、毎回 delay を効かせる(同じ trigger の
 *   再 hover でも即時に出てしまうのを防ぐ)。
 * いずれも props で上書き可。toolbar で warm-up が欲しければ timeout を渡す。
 */
export function TooltipProvider(props: BaseTooltip.Provider.Props) {
  return <BaseTooltip.Provider delay={250} timeout={0} {...props} />
}

export const TooltipRoot = BaseTooltip.Root
export const TooltipTrigger = BaseTooltip.Trigger

export const TooltipPopup = forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup(
  { className, side = "top", align = "center", sideOffset = 6, children, ...props },
  ref,
) {
  const slot = tooltip()
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseTooltip.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
})
