import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { pageContainer } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type ContainerVariants = NonNullable<Parameters<typeof pageContainer>[0]>

interface ContainerProps
  extends Omit<useRender.ComponentProps<"div">, "render">,
    ContainerVariants {
  render?: useRender.ComponentProps<"div">["render"]
}

/**
 * Container — editorial layout の中央寄せ枠。
 *
 * `width` で maxWidth 帯を選ぶ(narrow / default / wide / bleed)。
 * 垂直 padding は持たない ─ Section に任せる。色も border も持たない ─ 純構造。
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, render, width, ...props },
  ref,
) {
  const classes = pageContainer({ width })
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    props: mergeProps<"div">({ className: cx(classes, className) }, props),
    state: { width: width ?? "default" },
  })
})

export type { ContainerProps }
