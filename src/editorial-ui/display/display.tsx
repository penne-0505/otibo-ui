import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { display } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type DisplayVariants = NonNullable<Parameters<typeof display>[0]>

interface DisplayProps extends Omit<useRender.ComponentProps<"h1">, "render">, DisplayVariants {
  render?: useRender.ComponentProps<"h1">["render"]
}

/**
 * Display — editorial の大型タイポ(2xl-7xl)。default tag は `<h1>`。
 *
 * 異なる heading 階層に置きたい場合は `render={<h2 />}` 等で element を差し替える。
 * recipe が `font-weight: medium` を固定するので、`<h1>` をそのまま使っても太字にならない。
 */
export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(function Display(
  { className, render, size, tone, ...props },
  ref,
) {
  const classes = display({ size, tone })
  return useRender({
    ref,
    defaultTagName: "h1",
    render,
    props: mergeProps<"h1">({ className: cx(classes, className) }, props),
    state: {
      size: size ?? "5xl",
      tone: tone ?? "strong",
    },
  })
})

export type { DisplayProps }
