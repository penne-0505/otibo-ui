import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { prose } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type ProseVariants = NonNullable<Parameters<typeof prose>[0]>

interface ProseProps extends Omit<useRender.ComponentProps<"div">, "render">, ProseVariants {
  render?: useRender.ComponentProps<"div">["render"]
}

/**
 * Prose — 本文段組 wrapper。中の `<p>` / `<h2-h4>` / `<ul>` / `<blockquote>` 等が
 * editorial の声に揃う。MDX や手書き markdown body にそのまま被せる想定。
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { className, render, size, grain, ...props },
  ref,
) {
  const classes = prose({ size, grain })
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    props: mergeProps<"div">({ className: cx(classes, className) }, props),
    state: {
      size: size ?? "md",
      grain: grain ?? "regular",
    },
  })
})

export type { ProseProps }
