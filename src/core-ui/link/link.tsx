import { forwardRef } from "react"

import { link } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

/**
 * Link — テキストリンク。平常は fg + 控えめな下線、hover/focus で accent。
 *
 * 使い方:
 *   <Link href="/about">会社概要</Link>
 *   文中に <Link href="...">こう</Link> 置く。
 *
 * router 統合が要る場合は className を自分の Link に渡すか、消費側で wrap する。
 */

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(link(), className)} {...props} />
})
