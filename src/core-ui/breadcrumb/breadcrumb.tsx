import { forwardRef } from "react"

import { breadcrumb } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

/**
 * Breadcrumb — 階層内の現在地を示す navigation。separator は自動(CSS ::before)。
 *
 * 使い方:
 *   <Breadcrumb.Root>
 *     <Breadcrumb.Item><Breadcrumb.Link href="/">ホーム</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Item><Breadcrumb.Link href="/settings">設定</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Item><Breadcrumb.Current>アカウント</Breadcrumb.Current></Breadcrumb.Item>
 *   </Breadcrumb.Root>
 */

interface BreadcrumbRootProps extends React.HTMLAttributes<HTMLOListElement> {
  /** nav の aria-label(既定「パンくずリスト」)。 */
  label?: string
}

const BreadcrumbRoot = forwardRef<HTMLOListElement, BreadcrumbRootProps>(function BreadcrumbRoot(
  { className, label = "パンくずリスト", children, ...props },
  ref,
) {
  const slot = breadcrumb()
  return (
    <nav aria-label={label}>
      <ol ref={ref} className={cx(slot.root, className)} {...props}>
        {children}
      </ol>
    </nav>
  )
})

const BreadcrumbItem = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  function BreadcrumbItem({ className, ...props }, ref) {
    const slot = breadcrumb()
    return <li ref={ref} className={cx(slot.item, className)} {...props} />
  },
)

const BreadcrumbLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function BreadcrumbLink({ className, ...props }, ref) {
    const slot = breadcrumb()
    return <a ref={ref} className={cx(slot.link, className)} {...props} />
  },
)

const BreadcrumbCurrent = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function BreadcrumbCurrent({ className, ...props }, ref) {
    const slot = breadcrumb()
    return <span ref={ref} aria-current="page" className={cx(slot.current, className)} {...props} />
  },
)

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
}
