import { Slider as BaseSlider } from "@base-ui-components/react/slider"
import { forwardRef } from "react"

import { slider } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Slider — 連続値の直接操作 control。
 *
 * a11y / keyboard / drag / value 管理は Base UI Slider に委譲、見た目は otibo recipe。
 * 内部構造(Control > Track > Indicator + Thumb)は固定なので composed の単一 component で
 * 提供する(checkbox / switch と同じ方針)。値表示は呼び出し側で `value`/`onValueChange` を
 * 制御して行う(Slider 自体は control のみ)。
 *
 * 使い方:
 *   <Slider defaultValue={50} aria-label="音量" />
 *   <Slider value={v} onValueChange={setV} min={0} max={100} step={5} aria-label="音量" />
 */
// 単一つまみ前提で value / onValueChange を number に絞る(Base UI は range 対応で
// number | number[] を取るが、この component は単一値専用)。
export interface SliderProps
  extends Omit<BaseSlider.Root.Props, "value" | "defaultValue" | "onValueChange"> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { className, onValueChange, ...props },
  ref,
) {
  const slot = slider()
  return (
    <BaseSlider.Root
      ref={ref}
      className={mergeClass(slot.root, className)}
      onValueChange={
        onValueChange
          ? (value) => onValueChange(typeof value === "number" ? value : value[0])
          : undefined
      }
      {...props}
    >
      <BaseSlider.Control className={slot.control}>
        <BaseSlider.Track className={slot.track}>
          <BaseSlider.Indicator className={slot.indicator} />
          <BaseSlider.Thumb className={slot.thumb} />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
})
