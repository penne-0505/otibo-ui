import { Toggle as BaseToggle } from "@base-ui-components/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group"
import { forwardRef } from "react"

import { toggle } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Toggle / ToggleGroup — 押し込みトグル。on(data-pressed)= accent 塗り + 白。a11y は Base UI。
 *
 * 単体:
 *   <Toggle aria-label="太字"><b>B</b></Toggle>
 * グループ(複数 on 可):
 *   <ToggleGroup defaultValue={["bold"]} multiple>
 *     <Toggle value="bold" aria-label="太字"><b>B</b></Toggle>
 *     <Toggle value="italic" aria-label="斜体"><i>I</i></Toggle>
 *   </ToggleGroup>
 */

export const Toggle = forwardRef<HTMLButtonElement, BaseToggle.Props>(function Toggle(
  { className, ...props },
  ref,
) {
  const slot = toggle()
  return <BaseToggle ref={ref} className={mergeClass(slot.button, className)} {...props} />
})

export const ToggleGroup = forwardRef<HTMLDivElement, BaseToggleGroup.Props>(function ToggleGroup(
  { className, ...props },
  ref,
) {
  const slot = toggle()
  return <BaseToggleGroup ref={ref} className={mergeClass(slot.group, className)} {...props} />
})
