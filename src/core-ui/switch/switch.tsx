import { Switch as BaseSwitch } from "@base-ui-components/react/switch"
import { forwardRef } from "react"

import { switchRecipe } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Switch — 二値のオン/オフ control。
 *
 * a11y / state は Base UI Switch に委譲、見た目は otibo recipe(track + thumb)。
 * オン = 単一 accent。label は consumer 側で紐付ける。
 */
export interface SwitchProps extends BaseSwitch.Root.Props {}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, ...props },
  ref,
) {
  const slot = switchRecipe()
  return (
    <BaseSwitch.Root ref={ref} className={mergeClass(slot.root, className)} {...props}>
      <BaseSwitch.Thumb className={slot.thumb} />
    </BaseSwitch.Root>
  )
})
