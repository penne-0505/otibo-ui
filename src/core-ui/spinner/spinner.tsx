import { forwardRef } from "react"

import { spinner } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

/**
 * Spinner — loading の自走インジケータ。色は currentColor(文脈に追従)。
 *
 * 使い方:
 *   <Spinner />                          // 単体(置いた文脈の色)
 *   <Button intent="primary">{saving ? <Spinner size="sm" /> : "保存"}</Button>  // 白on色
 */

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg"
  /** スクリーンリーダー向けの状態テキスト(既定「読み込み中」)。 */
  label?: string
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, size, label = "読み込み中", ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cx(spinner({ size }), className)}
      {...props}
    />
  )
})
