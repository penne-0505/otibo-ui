import { Field as BaseField } from "@base-ui-components/react/field"
import { forwardRef } from "react"

import { mergeClass } from "@/lib/utils"
import { field, input } from "@/styled-system/recipes"

type FieldVariants = NonNullable<Parameters<typeof field>[0]>
type InputSize = NonNullable<Parameters<typeof input>[0]>["size"]

/**
 * Field.Root — Internal boundary that ties Label / Input / Description / Error
 * to the same a11y context (aria-labelledby / describedby / invalid).
 *
 * Powered by Base UI Field primitive. otibo recipe only paints the surface;
 * a11y wiring is delegated.
 */
const FieldRoot = forwardRef<HTMLDivElement, BaseField.Root.Props & FieldVariants>(
  function FieldRoot({ className, density, ...props }, ref) {
    const slot = field({ density })
    return (
      <BaseField.Root
        ref={ref}
        className={mergeClass(slot.root, className)}
        {...props}
      />
    )
  },
)

const FieldLabel = forwardRef<HTMLLabelElement, BaseField.Label.Props>(
  function FieldLabel({ className, ...props }, ref) {
    const slot = field()
    return (
      <BaseField.Label
        ref={ref}
        className={mergeClass(slot.label, className)}
        {...props}
      />
    )
  },
)

interface FieldInputProps extends Omit<BaseField.Control.Props, "size"> {
  size?: InputSize
}

const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(function FieldInput(
  { className, size, ...props },
  ref,
) {
  return (
    <BaseField.Control
      ref={ref}
      className={mergeClass(input({ size }), className)}
      {...props}
    />
  )
})

const FieldDescription = forwardRef<HTMLParagraphElement, BaseField.Description.Props>(
  function FieldDescription({ className, ...props }, ref) {
    const slot = field()
    return (
      <BaseField.Description
        ref={ref}
        className={mergeClass(slot.description, className)}
        {...props}
      />
    )
  },
)

const FieldError = forwardRef<HTMLDivElement, BaseField.Error.Props>(function FieldError(
  { className, ...props },
  ref,
) {
  const slot = field()
  return (
    <BaseField.Error
      ref={ref}
      className={mergeClass(slot.error, className)}
      {...props}
    />
  )
})

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  Description: FieldDescription,
  Error: FieldError,
}

export { FieldRoot, FieldLabel, FieldInput, FieldDescription, FieldError }
export type { FieldInputProps }
