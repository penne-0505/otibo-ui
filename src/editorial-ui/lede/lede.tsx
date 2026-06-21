import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { lede } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type LedeVariants = NonNullable<Parameters<typeof lede>[0]>

interface LedeProps extends Omit<useRender.ComponentProps<"p">, "render">, LedeVariants {
  render?: useRender.ComponentProps<"p">["render"]
}

/**
 * Lede — Display 直後の導入文。default tag は `<p>`。
 */
export const Lede = forwardRef<HTMLParagraphElement, LedeProps>(function Lede(
  { className, render, size, ...props },
  ref,
) {
  const classes = lede({ size })
  return useRender({
    ref,
    defaultTagName: "p",
    render,
    props: mergeProps<"p">({ className: cx(classes, className) }, props),
    state: { size: size ?? "md" },
  })
})

export type { LedeProps }
