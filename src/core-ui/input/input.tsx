import { input } from "@otibo/ui/styled-system/recipes"
import { forwardRef, type InputHTMLAttributes } from "react"
import { cx } from "../../lib/utils"

type InputVariants = NonNullable<Parameters<typeof input>[0]>

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, InputVariants {}

/**
 * Input — standalone text input.
 *
 * FieldRoot の中で使う場合は Base UI field control 経由で a11y を任せる
 * 形に書き換える(field.tsx 側で対応)。standalone のときは plain <input>
 * に recipe className を当てるだけで足りる。
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, type, ...props },
  ref,
) {
  return (
    <input ref={ref} type={type ?? "text"} className={cx(input({ size }), className)} {...props} />
  )
})

export type { InputProps }
