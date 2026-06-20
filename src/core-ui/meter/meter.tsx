import { Meter as BaseMeter } from "@base-ui-components/react/meter"
import { forwardRef } from "react"

import { meter } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Meter — 現在値の度合いを示すバー(容量・強度・評価)。Progress と視覚共有、semantic で分ける。
 *
 * 使い方:
 *   <Meter.Root value={62}>
 *     <div style={{ display: "flex", justifyContent: "space-between" }}>
 *       <Meter.Label>ストレージ</Meter.Label>
 *       <Meter.Value />
 *     </div>
 *     <Meter.Track />
 *   </Meter.Root>
 */

const MeterRoot = forwardRef<HTMLDivElement, BaseMeter.Root.Props>(function MeterRoot(
  { className, ...props },
  ref,
) {
  const slot = meter()
  return <BaseMeter.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

const MeterLabel = forwardRef<HTMLSpanElement, BaseMeter.Label.Props>(function MeterLabel(
  { className, ...props },
  ref,
) {
  const slot = meter()
  return <BaseMeter.Label ref={ref} className={mergeClass(slot.label, className)} {...props} />
})

const MeterValue = forwardRef<HTMLSpanElement, BaseMeter.Value.Props>(function MeterValue(
  { className, ...props },
  ref,
) {
  const slot = meter()
  return <BaseMeter.Value ref={ref} className={mergeClass(slot.value, className)} {...props} />
})

// Track ── rail と fill を一体で描く(indicator は常に track の中)。
const MeterTrack = forwardRef<HTMLDivElement, BaseMeter.Track.Props>(function MeterTrack(
  { className, ...props },
  ref,
) {
  const slot = meter()
  return (
    <BaseMeter.Track ref={ref} className={mergeClass(slot.track, className)} {...props}>
      <BaseMeter.Indicator className={slot.indicator} />
    </BaseMeter.Track>
  )
})

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
}
