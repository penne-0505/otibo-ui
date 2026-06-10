import { forwardRef, type InputHTMLAttributes } from "react"

import { cx } from "../../lib/utils"
import { input } from "../../../styled-system/recipes"

type InputVariants = NonNullable<Parameters<typeof input>[0]>

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariants {}

/**
 * Input — standalone text input.
 *
 * Field.Root の中で使う場合は Base UI Field.Control 経由で a11y を任せる
 * 形に書き換える(field.tsx 側で対応)。standalone のときは plain <input>
 * に recipe className を当てるだけで足りる。
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, type, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type ?? "text"}
      className={cx(input({ size }), className)}
      {...props}
    />
  )
})

export type { InputProps }
