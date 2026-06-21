import { type HTMLAttributes, forwardRef } from "react"

import { callout } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type CalloutVariants = NonNullable<Parameters<typeof callout>[0]>

interface CalloutRootProps extends HTMLAttributes<HTMLDivElement>, CalloutVariants {}

const CalloutRoot = forwardRef<HTMLDivElement, CalloutRootProps>(function CalloutRoot(
  { className, tone, ...props },
  ref,
) {
  const slot = callout({ tone })
  return <div ref={ref} className={cx(slot.root, className)} role="note" {...props} />
})
CalloutRoot.displayName = "Callout.Root"

type CalloutSlotProps = HTMLAttributes<HTMLDivElement>

function makeCalloutSlot(slotKey: "title" | "body", defaultTag: "div" | "p" = "div") {
  const Component = forwardRef<HTMLDivElement, CalloutSlotProps>(function CalloutSlot(
    { className, ...props },
    ref,
  ) {
    const slot = callout({})
    const TagName = defaultTag as "div"
    return <TagName ref={ref} className={cx(slot[slotKey], className)} {...props} />
  })
  Component.displayName = `Callout.${slotKey[0]!.toUpperCase()}${slotKey.slice(1)}`
  return Component
}

const CalloutTitle = makeCalloutSlot("title", "p")
const CalloutBody = makeCalloutSlot("body", "div")

/**
 * Callout — 本文の流れに割り込む箱。
 *
 *   <Callout tone="accent">
 *     <Callout.Title>タイトル</Callout.Title>
 *     <Callout.Body>本文</Callout.Body>
 *   </Callout>
 */
export const Callout = Object.assign(CalloutRoot, {
  Root: CalloutRoot,
  Title: CalloutTitle,
  Body: CalloutBody,
})

export { CalloutRoot, CalloutTitle, CalloutBody }
export type { CalloutRootProps }
