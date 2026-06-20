import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef } from "react"

import { button } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type ButtonVariants = NonNullable<Parameters<typeof button>[0]>

interface ButtonProps extends Omit<useRender.ComponentProps<"button">, "render">, ButtonVariants {
  render?: useRender.ComponentProps<"button">["render"]
}

/**
 * Button — polymorphic interactive Control.
 *
 * Default tag is `button`. Use `render` to land the affordance on `<a>`,
 * `<Link>`, etc. without re-implementing the recipe.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, render, intent, size, type, ...props },
  ref,
) {
  const classes = button({ intent, size })
  return useRender({
    ref,
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        className: cx(classes, className),
        type: type ?? "button",
      },
      props,
    ),
    state: {
      intent: intent ?? "secondary",
      size: size ?? "md",
    },
  })
})

export type { ButtonProps }
