import { type HTMLAttributes, type ReactNode, forwardRef } from "react"

import { pull } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type PullVariants = NonNullable<Parameters<typeof pull>[0]>

interface PullRootProps extends HTMLAttributes<HTMLQuoteElement>, PullVariants {
  /** body の font-size 帯。md / lg(default) / xl。 */
  size?: "md" | "lg" | "xl"
  /** body の color tone。DEFAULT / accent / muted。 */
  tone?: "DEFAULT" | "accent" | "muted"
  /** 引用本文。直書きでも構わないが、`<Pull.Body>` を使えば slot styling が当たる。 */
  children?: ReactNode
}

const PullRoot = forwardRef<HTMLQuoteElement, PullRootProps>(function PullRoot(
  { className, size = "lg", tone = "DEFAULT", align, ...props },
  ref,
) {
  const slot = pull({ align })
  // size / tone は body slot に効くため data-attribute で descendant に伝える
  // (panda slot recipe の variant は別 slot に伝播しない)
  return (
    <blockquote
      ref={ref}
      data-size={size}
      data-tone={tone}
      className={cx(slot.root, className)}
      {...props}
    />
  )
})
PullRoot.displayName = "Pull.Root"

type PullSlotProps = HTMLAttributes<HTMLParagraphElement>

function makePullSlot(slotKey: "body" | "attribution", defaultTag: "p" = "p") {
  const Component = forwardRef<HTMLParagraphElement, PullSlotProps>(function PullSlot(
    { className, ...props },
    ref,
  ) {
    const slot = pull({})
    const TagName = defaultTag
    return <TagName ref={ref} className={cx(slot[slotKey], className)} {...props} />
  })
  Component.displayName = `Pull.${slotKey[0]!.toUpperCase()}${slotKey.slice(1)}`
  return Component
}

const PullBody = makePullSlot("body", "p")
const PullAttribution = makePullSlot("attribution", "p")

/**
 * Pull — 本文を引き上げる引用。size で「引き上げの強さ」を選ぶ。
 *
 *   <Pull size="lg">
 *     <Pull.Body>引用本文</Pull.Body>
 *     <Pull.Attribution>出典</Pull.Attribution>
 *   </Pull>
 */
export const Pull = Object.assign(PullRoot, {
  Root: PullRoot,
  Body: PullBody,
  Attribution: PullAttribution,
})

export { PullRoot, PullBody, PullAttribution }
export type { PullRootProps }
