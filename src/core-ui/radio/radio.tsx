import { Radio as BaseRadio } from "@base-ui-components/react/radio"
import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group"
import { forwardRef } from "react"

import { css } from "@otibo/ui/styled-system/css"
import { radio } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Radio / RadioGroup — 排他選択の control。
 *
 * a11y / roving tabindex / value 管理は Base UI に委譲、見た目は otibo recipe。
 * checked = 単一 accent(ring + dot)。RadioGroup は縦並びの最小レイアウトを持つ。
 * label は consumer 側で各 Radio に紐付ける。
 */
export interface RadioProps extends BaseRadio.Root.Props {}
export interface RadioGroupProps extends BaseRadioGroup.Props {}

const groupClass = css({ display: "flex", flexDirection: "column", gap: "3" })

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, ...props },
  ref,
) {
  return <BaseRadioGroup ref={ref} className={mergeClass(groupClass, className)} {...props} />
})

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { className, ...props },
  ref,
) {
  const slot = radio()
  return (
    <BaseRadio.Root ref={ref} className={mergeClass(slot.root, className)} {...props}>
      {/* keepMounted: 常時マウントして data-checked への CSS transition で dot を scale させる。
          初期 checked がロード時に bloom する「到着の演技」を避け、操作のときだけ咲かせる。 */}
      <BaseRadio.Indicator className={slot.indicator} keepMounted />
    </BaseRadio.Root>
  )
})
