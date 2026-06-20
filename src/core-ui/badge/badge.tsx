import { type HTMLAttributes, forwardRef } from "react"

import { cx } from "@otibo/ui/styled-system/css"
import { badge } from "@otibo/ui/styled-system/recipes"

type BadgeVariants = NonNullable<Parameters<typeof badge>[0]>

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {}

/**
 * Badge — 小さな identity チップ。tone で accent / neutral / danger を切り替える。
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, ...props },
  ref,
) {
  return <span ref={ref} className={cx(badge({ tone }), className)} {...props} />
})

export type { BadgeProps }
