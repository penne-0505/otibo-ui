import { forwardRef } from "react"

import { pagination } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Pagination — リスト送りの navigation。現在ページは accent 塗り + 白文字。
 *
 * 使い方(消費側が page list を組む):
 *   <Pagination.Root>
 *     <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
 *     <Pagination.Item active={page === 1} onClick={() => setPage(1)}>1</Pagination.Item>
 *     <Pagination.Item active={page === 2} onClick={() => setPage(2)}>2</Pagination.Item>
 *     <Pagination.Ellipsis />
 *     <Pagination.Item onClick={() => setPage(10)}>10</Pagination.Item>
 *     <Pagination.Next disabled={page === 10} onClick={() => setPage(page + 1)} />
 *   </Pagination.Root>
 */

interface PaginationRootProps extends React.HTMLAttributes<HTMLElement> {
  /** nav の aria-label(既定「ページネーション」)。 */
  label?: string
}

const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
  { className, label = "ページネーション", ...props },
  ref,
) {
  const slot = pagination()
  return <nav ref={ref} aria-label={label} className={cx(slot.root, className)} {...props} />
})

interface PaginationItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 現在ページ。 */
  active?: boolean
}

const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(function PaginationItem(
  { className, active, ...props },
  ref,
) {
  const slot = pagination({ active })
  return (
    <button
      ref={ref}
      type="button"
      aria-current={active ? "page" : undefined}
      className={cx(slot.item, className)}
      {...props}
    />
  )
})

const PaginationPrev = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PaginationPrev({ className, "aria-label": ariaLabel = "前のページ", ...props }, ref) {
    const slot = pagination()
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cx(slot.item, className)}
        {...props}
      >
        <Icon name="chevron-left" size="1.125em" />
      </button>
    )
  },
)

const PaginationNext = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PaginationNext({ className, "aria-label": ariaLabel = "次のページ", ...props }, ref) {
    const slot = pagination()
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cx(slot.item, className)}
        {...props}
      >
        <Icon name="chevron-right" size="1.125em" />
      </button>
    )
  },
)

const PaginationEllipsis = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function PaginationEllipsis({ className, ...props }, ref) {
    const slot = pagination()
    return (
      <span ref={ref} aria-hidden className={cx(slot.ellipsis, className)} {...props}>
        …
      </span>
    )
  },
)

export const Pagination = {
  Root: PaginationRoot,
  Item: PaginationItem,
  Prev: PaginationPrev,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
}
