import { Avatar as BaseAvatar } from "@base-ui/react/avatar"
import { logoFrame } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * LogoFrame — ブランド / マーク。load 判定は Base UI Avatar に委譲。
 *
 * shape="square"（既定）はアイコン / モノグラム向けの 1:1 枠。
 * shape="auto" は横長ワードマーク向けで、高さを size で固定し幅はロゴ比率に追従する。
 *
 * 使い方:
 *   <LogoFrameRoot size="lg" shape="auto">
 *     <LogoFrameImage src={url} alt="otibo" />
 *     <LogoFrameFallback>OT</LogoFrameFallback>
 *   </LogoFrameRoot>
 */

interface LogoFrameRootProps extends BaseAvatar.Root.Props {
  size?: "sm" | "md" | "lg"
  shape?: "square" | "auto"
}

export const LogoFrameRoot = forwardRef<HTMLSpanElement, LogoFrameRootProps>(function LogoFrameRoot(
  { className, size, shape, ...props },
  ref,
) {
  const slot = logoFrame({ size, shape })
  return <BaseAvatar.Root ref={ref} className={mergeClass(slot.root, className)} {...props} />
})

export const LogoFrameImage = forwardRef<HTMLImageElement, BaseAvatar.Image.Props>(
  function LogoFrameImage({ className, ...props }, ref) {
    const slot = logoFrame()
    return <BaseAvatar.Image ref={ref} className={mergeClass(slot.image, className)} {...props} />
  },
)

export const LogoFrameFallback = forwardRef<HTMLSpanElement, BaseAvatar.Fallback.Props>(
  function LogoFrameFallback({ className, ...props }, ref) {
    const slot = logoFrame()
    return (
      <BaseAvatar.Fallback ref={ref} className={mergeClass(slot.fallback, className)} {...props} />
    )
  },
)
