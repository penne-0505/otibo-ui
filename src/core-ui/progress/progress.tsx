import { Progress as BaseProgress } from "@base-ui-components/react/progress"
import { forwardRef } from "react"

import { progress } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Progress — 進捗の表示(非対話)。slider と track 言語を共有(凹んだ rail + accent fill)。
 *
 * 使い方:
 *   <Progress.Root value={42}>
 *     <div style={{ display: "flex", justifyContent: "space-between" }}>
 *       <Progress.Label>ストレージ</Progress.Label>
 *       <Progress.Value />
 *     </div>
 *     <Progress.Track />
 *   </Progress.Root>
 */

const ProgressRoot = forwardRef<HTMLDivElement, BaseProgress.Root.Props>(function ProgressRoot(
  { className, ...props },
  ref,
) {
  const slot = progress()
  return <BaseProgress.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

const ProgressLabel = forwardRef<HTMLSpanElement, BaseProgress.Label.Props>(function ProgressLabel(
  { className, ...props },
  ref,
) {
  const slot = progress()
  return <BaseProgress.Label ref={ref} className={mergeClass(slot.label, className)} {...props} />
})

const ProgressValue = forwardRef<HTMLSpanElement, BaseProgress.Value.Props>(function ProgressValue(
  { className, ...props },
  ref,
) {
  const slot = progress()
  return <BaseProgress.Value ref={ref} className={mergeClass(slot.value, className)} {...props} />
})

// Track ── rail と fill を一体で描く(indicator は常に track の中)。
const ProgressTrack = forwardRef<HTMLDivElement, BaseProgress.Track.Props>(function ProgressTrack(
  { className, ...props },
  ref,
) {
  const slot = progress()
  return (
    <BaseProgress.Track ref={ref} className={mergeClass(slot.track, className)} {...props}>
      <BaseProgress.Indicator className={slot.indicator} />
    </BaseProgress.Track>
  )
})

export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack,
}
