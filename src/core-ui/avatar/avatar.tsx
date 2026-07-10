import { Avatar as BaseAvatar } from "@base-ui/react/avatar"
import { avatar } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Avatar — 人/主体を表す円形の像。image を載せ、無い/読み込み中は fallback を出す。
 * load 判定・swap は Base UI Avatar。
 *
 * 使い方:
 *   <AvatarRoot size="lg">
 *     <AvatarImage src={url} alt="penne" />
 *     <AvatarFallback>PE</AvatarFallback>
 *   </AvatarRoot>
 */

interface AvatarRootProps extends BaseAvatar.Root.Props {
  size?: "sm" | "md" | "lg"
}

export const AvatarRoot = forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  { className, size, ...props },
  ref,
) {
  const slot = avatar({ size })
  return <BaseAvatar.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

export const AvatarImage = forwardRef<HTMLImageElement, BaseAvatar.Image.Props>(
  function AvatarImage({ className, ...props }, ref) {
    const slot = avatar()
    return <BaseAvatar.Image ref={ref} className={mergeClass(slot.image, className)} {...props} />
  },
)

export const AvatarFallback = forwardRef<HTMLSpanElement, BaseAvatar.Fallback.Props>(
  function AvatarFallback({ className, ...props }, ref) {
    const slot = avatar()
    return (
      <BaseAvatar.Fallback ref={ref} className={mergeClass(slot.fallback, className)} {...props} />
    )
  },
)
