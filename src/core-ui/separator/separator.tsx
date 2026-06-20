import { Separator as BaseSeparator } from "@base-ui-components/react/separator"
import { forwardRef } from "react"

import { separator } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Separator — section/inline の hairline 区切り。a11y(role="separator")は Base UI。
 *
 * 使い方:
 *   <Separator />                       // 水平
 *   <Separator orientation="vertical" /> // 垂直(inline 文字列の区切り等)
 */

export interface SeparatorProps extends BaseSeparator.Props {
  orientation?: "horizontal" | "vertical"
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  return (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      className={mergeClass(separator({ orientation }), className)}
      {...props}
    />
  )
})
