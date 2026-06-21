import { type HTMLAttributes, type ReactNode, forwardRef } from "react"

import { footnote } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type FootnoteRootProps = HTMLAttributes<HTMLOListElement>

const FootnoteRoot = forwardRef<HTMLOListElement, FootnoteRootProps>(function FootnoteRoot(
  { className, ...props },
  ref,
) {
  const slot = footnote()
  return <ol ref={ref} className={cx(slot.root, className)} {...props} />
})
FootnoteRoot.displayName = "Footnote.Root"

interface FootnoteItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "children"> {
  /** 注番号。文字列で受ける("1" / "i" / "*" 等)。 */
  index: string
  children?: ReactNode
}

const FootnoteItem = forwardRef<HTMLLIElement, FootnoteItemProps>(function FootnoteItem(
  { className, index, children, ...props },
  ref,
) {
  const slot = footnote()
  return (
    <li ref={ref} className={cx(slot.item, className)} {...props}>
      <span className={slot.marker} aria-hidden>
        {index}
      </span>
      <span className={slot.body}>{children}</span>
    </li>
  )
})
FootnoteItem.displayName = "Footnote.Item"

/**
 * Footnote — ページ末尾の番号付き注。
 *
 *   <Footnote>
 *     <Footnote.Item index="1">注の本文</Footnote.Item>
 *     <Footnote.Item index="2">続く</Footnote.Item>
 *   </Footnote>
 */
export const Footnote = Object.assign(FootnoteRoot, {
  Root: FootnoteRoot,
  Item: FootnoteItem,
})

export { FootnoteRoot, FootnoteItem }
export type { FootnoteRootProps, FootnoteItemProps }
