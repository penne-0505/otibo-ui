import { Progress as BaseProgress } from "@base-ui/react/progress"
import { progress } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Progress — 進捗の表示(非対話)。slider と track 言語を共有(凹んだ rail + accent fill)。
 *
 * 使い方:
 *   <ProgressRoot value={42}>
 *     <div style={{ display: "flex", justifyContent: "space-between" }}>
 *       <ProgressLabel>ストレージ</ProgressLabel>
 *       <ProgressValue />
 *     </div>
 *     <ProgressTrack />
 *   </ProgressRoot>
 */

export const ProgressRoot = forwardRef<HTMLDivElement, BaseProgress.Root.Props>(
  function ProgressRoot({ className, ...props }, ref) {
    const slot = progress()
    return <BaseProgress.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
  },
)

export const ProgressLabel = forwardRef<HTMLSpanElement, BaseProgress.Label.Props>(
  function ProgressLabel({ className, ...props }, ref) {
    const slot = progress()
    return <BaseProgress.Label ref={ref} className={mergeClass(slot.label, className)} {...props} />
  },
)

export const ProgressValue = forwardRef<HTMLSpanElement, BaseProgress.Value.Props>(
  function ProgressValue({ className, ...props }, ref) {
    const slot = progress()
    return <BaseProgress.Value ref={ref} className={mergeClass(slot.value, className)} {...props} />
  },
)

// Track ── rail と fill を一体で描く(indicator は常に track の中)。
export const ProgressTrack = forwardRef<HTMLDivElement, BaseProgress.Track.Props>(
  function ProgressTrack({ className, ...props }, ref) {
    const slot = progress()
    return (
      <BaseProgress.Track ref={ref} className={mergeClass(slot.track, className)} {...props}>
        <BaseProgress.Indicator className={slot.indicator} />
      </BaseProgress.Track>
    )
  },
)
