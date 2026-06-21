import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { section } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type SectionVariants = NonNullable<Parameters<typeof section>[0]>

interface SectionProps
  extends Omit<useRender.ComponentProps<"section">, "render">,
    SectionVariants {
  render?: useRender.ComponentProps<"section">["render"]
}

/**
 * Section — 章の垂直枠。default tag は `<section>`。`tone` で背景帯、`padding` で上下呼吸。
 * 横幅は持たない ─ Container と組み合わせて使う。
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { className, render, tone, padding, ...props },
  ref,
) {
  const classes = section({ tone, padding })
  return useRender({
    ref,
    defaultTagName: "section",
    render,
    props: mergeProps<"section">({ className: cx(classes, className) }, props),
    state: {
      tone: tone ?? "default",
      padding: padding ?? "md",
    },
  })
})

export type { SectionProps }
