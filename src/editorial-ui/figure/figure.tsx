import { type HTMLAttributes, forwardRef } from "react"

import { figure } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type FigureVariants = NonNullable<Parameters<typeof figure>[0]>

interface FigureRootProps extends HTMLAttributes<HTMLElement>, FigureVariants {}

const FigureRoot = forwardRef<HTMLElement, FigureRootProps>(function FigureRoot(
  { className, tone, aspect, ...props },
  ref,
) {
  const slot = figure({ tone, aspect })
  return <figure ref={ref} className={cx(slot.root, className)} {...props} />
})
FigureRoot.displayName = "Figure.Root"

type FigureSlotProps = HTMLAttributes<HTMLDivElement>

function makeFigureSlot(
  slotKey: "frame" | "caption" | "number",
  defaultTag: "div" | "figcaption" | "span" = "div",
) {
  const Component = forwardRef<HTMLDivElement, FigureSlotProps>(function FigureSlot(
    { className, ...props },
    ref,
  ) {
    const slot = figure({})
    const TagName = defaultTag as "div"
    return <TagName ref={ref} className={cx(slot[slotKey], className)} {...props} />
  })
  Component.displayName = `Figure.${slotKey[0]!.toUpperCase()}${slotKey.slice(1)}`
  return Component
}

const FigureFrame = makeFigureSlot("frame", "div")
const FigureCaption = makeFigureSlot("caption", "figcaption")
const FigureNumber = makeFigureSlot("number", "span")

/**
 * Figure — 額装図版。
 *
 *   <Figure aspect="video">
 *     <Figure.Frame>
 *       <img src="..." alt="..." />
 *     </Figure.Frame>
 *     <Figure.Caption>
 *       <Figure.Number>Fig 03</Figure.Number>
 *       本文の caption
 *     </Figure.Caption>
 *   </Figure>
 */
export const Figure = Object.assign(FigureRoot, {
  Frame: FigureFrame,
  Caption: FigureCaption,
  Number: FigureNumber,
})

export { FigureRoot, FigureFrame, FigureCaption, FigureNumber }
export type { FigureRootProps }
