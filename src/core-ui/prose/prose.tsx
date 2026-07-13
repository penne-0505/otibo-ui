import { prose } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { cx } from "../../lib/utils"

/**
 * Prose — 読み面。maxWidth=prose と段落リズム。子の声は textStyles。
 *
 * 使い方:
 *   <Prose>
 *     <h2>見出し</h2>
 *     <p>本文…</p>
 *   </Prose>
 *   <Prose reading="article">…</Prose>
 */

export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  reading?: "ui" | "article"
  as?: "div" | "article" | "section"
}

export const Prose = forwardRef<HTMLElement, ProseProps>(function Prose(
  { className, reading = "ui", as: Comp = "div", ...props },
  ref,
) {
  return <Comp ref={ref as never} className={cx(prose({ reading }), className)} {...props} />
})
