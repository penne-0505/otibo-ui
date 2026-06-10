import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { forwardRef, type HTMLAttributes } from "react"

import { card } from "../../../styled-system/recipes"
import { cx } from "../../lib/utils"

type CardVariants = NonNullable<Parameters<typeof card>[0]>

interface CardRootProps
  extends Omit<useRender.ComponentProps<"div">, "render">,
    CardVariants {
  render?: useRender.ComponentProps<"div">["render"]
}

/**
 * Card.Root — polymorphic container.
 *
 * Render-prop driven so the same recipe can land on <article>, <section>,
 * <button>, <a>, etc. without re-implementing the surface. Variants control
 * the boundary expression; the host decides the semantic element.
 *
 * See `card.recipe.ts` for the variant rationale and
 * `_docs/reference/DesignSystem/components/card.md` (otibo_ds) for the
 * Context Matrix it serves.
 */
const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  { className, render, surface, padding, interactive, ...props },
  ref,
) {
  const slot = card({ surface, padding, interactive })
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cx(slot.root, className) },
      props,
    ),
    state: {
      surface: surface ?? "paper",
      padding: padding ?? "md",
      interactive: Boolean(interactive),
    },
  })
})

type CardSlotComponentProps = HTMLAttributes<HTMLDivElement>

function makeCardSlot(
  slotKey: "header" | "title" | "description" | "body" | "footer",
  defaultTag: "div" | "h3" | "p" = "div",
) {
  const Component = forwardRef<HTMLDivElement, CardSlotComponentProps>(function CardSlot(
    { className, ...props },
    ref,
  ) {
    const slot = card({})
    const TagName = defaultTag as "div"
    return (
      <TagName ref={ref} className={cx(slot[slotKey], className)} {...props} />
    )
  })
  Component.displayName = `Card.${slotKey[0]!.toUpperCase()}${slotKey.slice(1)}`
  return Component
}

const CardHeader = makeCardSlot("header", "div")
const CardTitle = makeCardSlot("title", "h3")
const CardDescription = makeCardSlot("description", "p")
const CardBody = makeCardSlot("body", "div")
const CardFooter = makeCardSlot("footer", "div")

/**
 * Public surface. The dot-notation is for readability at the call site;
 * importing `CardRoot` etc. directly also works.
 */
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
}

export {
  CardRoot,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
}

export type { CardRootProps }
