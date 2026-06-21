import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { eyebrow } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type EyebrowVariants = NonNullable<Parameters<typeof eyebrow>[0]>

interface EyebrowProps extends Omit<useRender.ComponentProps<"p">, "render">, EyebrowVariants {
  render?: useRender.ComponentProps<"p">["render"]
}

/**
 * Eyebrow — display の頭に置く短い kicker。default tag は `<p>`。
 */
export const Eyebrow = forwardRef<HTMLParagraphElement, EyebrowProps>(function Eyebrow(
  { className, render, size, tone, caps, ...props },
  ref,
) {
  const classes = eyebrow({ size, tone, caps })
  return useRender({
    ref,
    defaultTagName: "p",
    render,
    props: mergeProps<"p">({ className: cx(classes, className) }, props),
    state: {
      size: size ?? "md",
      tone: tone ?? "muted",
      caps: caps ?? "upper",
    },
  })
})

export type { EyebrowProps }
