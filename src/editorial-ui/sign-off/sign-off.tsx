import { type HTMLAttributes, forwardRef } from "react"

import { signOff } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type SignOffVariants = NonNullable<Parameters<typeof signOff>[0]>

interface SignOffRootProps extends HTMLAttributes<HTMLDivElement>, SignOffVariants {
  /**
   * Mark slot の case。default は literal(otibo の brand mark = 小文字絶対)。
   * 屋号や caps で見せたい mark の時のみ "upper"。
   */
  caps?: "literal" | "upper"
}

const SignOffRoot = forwardRef<HTMLDivElement, SignOffRootProps>(function SignOffRoot(
  { className, align, caps = "literal", ...props },
  ref,
) {
  const slot = signOff({ align })
  // data-caps は recipe の descendant selector(sign-off.recipe.ts §mark)が拾い、
  // Mark slot に caps 切り替えを反映する。
  return <div ref={ref} data-caps={caps} className={cx(slot.root, className)} {...props} />
})
SignOffRoot.displayName = "SignOff.Root"

type SignOffSlotProps = HTMLAttributes<HTMLSpanElement>

function makeSignOffSlot(slotKey: "mark" | "detail") {
  const Component = forwardRef<HTMLSpanElement, SignOffSlotProps>(function SignOffSlot(
    { className, ...props },
    ref,
  ) {
    const slot = signOff({})
    return <span ref={ref} className={cx(slot[slotKey], className)} {...props} />
  })
  Component.displayName = `SignOff.${slotKey[0]!.toUpperCase()}${slotKey.slice(1)}`
  return Component
}

const SignOffMark = makeSignOffSlot("mark")
const SignOffDetail = makeSignOffSlot("detail")

/**
 * SignOff — editorial の終わりに置く著者サイン。
 *
 *   <SignOff align="right">
 *     <SignOff.Mark>otibo</SignOff.Mark>
 *     <SignOff.Detail>2026 · penne</SignOff.Detail>
 *   </SignOff>
 */
export const SignOff = Object.assign(SignOffRoot, {
  Root: SignOffRoot,
  Mark: SignOffMark,
  Detail: SignOffDetail,
})

export { SignOffRoot, SignOffMark, SignOffDetail }
export type { SignOffRootProps }
