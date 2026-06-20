import { NumberField as BaseNumberField } from "@base-ui-components/react/number-field"
import { forwardRef } from "react"

import { numberField } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * NumberField — stepper つき数値入力。a11y / 値の clamp / scrub は Base UI NumberField。
 *
 * 使い方:
 *   <NumberField.Root defaultValue={3} min={0} max={10}>
 *     <NumberField.Field />
 *   </NumberField.Root>
 */

// Field ── 受け皿に [−] 値 [＋] を収めた一体。props は中央の input へ。
const NumberFieldField = forwardRef<HTMLInputElement, BaseNumberField.Input.Props>(
  function NumberFieldField({ className, ...props }, ref) {
    const slot = numberField()
    return (
      <BaseNumberField.Group className={slot.group}>
        <BaseNumberField.Decrement className={slot.button}>
          <Icon name="minus" size="0.875em" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input ref={ref} className={mergeClass(slot.input, className)} {...props} />
        <BaseNumberField.Increment className={slot.button}>
          <Icon name="plus" size="0.875em" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    )
  },
)

export const NumberField = {
  Root: BaseNumberField.Root,
  Field: NumberFieldField,
}
