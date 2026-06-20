import { ScrollArea as BaseScrollArea } from "@base-ui-components/react/scroll-area"
import { forwardRef } from "react"

import { scrollArea } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * ScrollArea — カスタムスクロール領域(otibo の細い hairline scrollbar)。a11y は Base UI。
 *
 * 使い方:
 *   <ScrollArea.Root style={{ height: "20rem" }}>
 *     <ScrollArea.Viewport>
 *       …長い content…
 *     </ScrollArea.Viewport>
 *   </ScrollArea.Root>
 *
 * 既定で縦スクロールバーを表示。横も要れば <ScrollArea.Scrollbar orientation="horizontal" /> を追加。
 */

const Root = forwardRef<HTMLDivElement, BaseScrollArea.Root.Props>(function Root(
  { className, ...props },
  ref,
) {
  const slot = scrollArea()
  return <BaseScrollArea.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

const Viewport = forwardRef<HTMLDivElement, BaseScrollArea.Viewport.Props>(function Viewport(
  { className, children, ...props },
  ref,
) {
  const slot = scrollArea()
  return (
    <>
      <BaseScrollArea.Viewport
        ref={ref}
        className={mergeClass(slot.viewport, className)}
        {...props}
      >
        {children}
      </BaseScrollArea.Viewport>
      {/* 既定の Scrollbar(縦)。横も要れば消費側で追加。 */}
      <BaseScrollArea.Scrollbar orientation="vertical" className={slot.scrollbar}>
        <BaseScrollArea.Thumb className={slot.thumb} />
      </BaseScrollArea.Scrollbar>
    </>
  )
})

const Scrollbar = forwardRef<HTMLDivElement, BaseScrollArea.Scrollbar.Props>(function Scrollbar(
  { className, children, ...props },
  ref,
) {
  const slot = scrollArea()
  return (
    <BaseScrollArea.Scrollbar
      ref={ref}
      className={mergeClass(slot.scrollbar, className)}
      {...props}
    >
      {children ?? <BaseScrollArea.Thumb className={slot.thumb} />}
    </BaseScrollArea.Scrollbar>
  )
})

export const ScrollArea = {
  Root,
  Viewport,
  Scrollbar,
}
