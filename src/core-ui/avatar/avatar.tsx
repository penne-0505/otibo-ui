import { Avatar as BaseAvatar } from "@base-ui-components/react/avatar"
import { forwardRef } from "react"

import { avatar } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Avatar — 人/主体を表す円形の像。image を載せ、無い/読み込み中は fallback を出す。
 * load 判定・swap は Base UI Avatar。
 *
 * 使い方:
 *   <Avatar.Root size="lg">
 *     <Avatar.Image src={url} alt="penne" />
 *     <Avatar.Fallback>PE</Avatar.Fallback>
 *   </Avatar.Root>
 */

interface AvatarRootProps extends BaseAvatar.Root.Props {
  size?: "sm" | "md" | "lg"
}

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  { className, size, ...props },
  ref,
) {
  const slot = avatar({ size })
  return <BaseAvatar.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

const AvatarImage = forwardRef<HTMLImageElement, BaseAvatar.Image.Props>(function AvatarImage(
  { className, ...props },
  ref,
) {
  const slot = avatar()
  return <BaseAvatar.Image ref={ref} className={mergeClass(slot.image, className)} {...props} />
})

const AvatarFallback = forwardRef<HTMLSpanElement, BaseAvatar.Fallback.Props>(
  function AvatarFallback({ className, ...props }, ref) {
    const slot = avatar()
    return (
      <BaseAvatar.Fallback ref={ref} className={mergeClass(slot.fallback, className)} {...props} />
    )
  },
)

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
}
