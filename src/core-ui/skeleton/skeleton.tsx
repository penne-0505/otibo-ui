import { forwardRef } from "react"

import { skeleton } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

/**
 * Skeleton — content 到着前の neutral な placeholder。形は width/height/style で与える。
 *
 * 使い方:
 *   <Skeleton style={{ width: "12rem", height: "1rem" }} />        // テキスト行
 *   <Skeleton circle style={{ width: "2.5rem", height: "2.5rem" }} />  // アバター等の丸
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 丸(avatar 等)にする。 */
  circle?: boolean
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, circle, ...props },
  ref,
) {
  return <div ref={ref} aria-hidden className={cx(skeleton({ circle }), className)} {...props} />
})
