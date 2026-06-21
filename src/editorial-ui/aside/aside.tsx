import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { aside } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type AsideVariants = NonNullable<Parameters<typeof aside>[0]>

interface AsideProps extends Omit<useRender.ComponentProps<"aside">, "render">, AsideVariants {
  render?: useRender.ComponentProps<"aside">["render"]
}

/**
 * Aside — 本文の脇に並走する補足。default tag は `<aside>`。背景はなく、左線だけ。
 */
export const Aside = forwardRef<HTMLElement, AsideProps>(function Aside(
  { className, render, tone, ...props },
  ref,
) {
  const classes = aside({ tone })
  return useRender({
    ref,
    defaultTagName: "aside",
    render,
    props: mergeProps<"aside">({ className: cx(classes, className) }, props),
    state: { tone: tone ?? "default" },
  })
})

export type { AsideProps }
