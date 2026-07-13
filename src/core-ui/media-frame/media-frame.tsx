import { mediaFrame } from "@otibo/ui/styled-system/recipes"
import { createContext, forwardRef, useContext } from "react"
import { cx } from "../../lib/utils"

/**
 * MediaFrame — 図版の枠。無いときは Empty slot。
 *
 * 使い方:
 *   <MediaFrameRoot aspect="video">
 *     <MediaFrameImage src={url} alt="作品サムネ" />
 *   </MediaFrameRoot>
 *
 *   <MediaFrameRoot aspect="square">
 *     <MediaFrameEmpty>画像がありません</MediaFrameEmpty>
 *   </MediaFrameRoot>
 */

type MediaFrameVariantProps = {
  aspect?: "auto" | "square" | "photo" | "video" | "wide"
  fit?: "cover" | "contain"
}

const MediaFrameVariantContext = createContext<MediaFrameVariantProps>({})

export interface MediaFrameRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    MediaFrameVariantProps {}

export const MediaFrameRoot = forwardRef<HTMLDivElement, MediaFrameRootProps>(
  function MediaFrameRoot({ className, aspect, fit, ...props }, ref) {
    const slot = mediaFrame({ aspect, fit })
    return (
      <MediaFrameVariantContext.Provider value={{ aspect, fit }}>
        <div ref={ref} className={cx(slot.root, className)} {...props} />
      </MediaFrameVariantContext.Provider>
    )
  },
)

export interface MediaFrameImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fit?: "cover" | "contain"
}

export const MediaFrameImage = forwardRef<HTMLImageElement, MediaFrameImageProps>(
  function MediaFrameImage({ className, alt = "", fit, ...props }, ref) {
    const rootVariants = useContext(MediaFrameVariantContext)
    // intent: INV-006 (DesignSystem/editorial-media-typography) — Root owns the
    // frame variants; an Image-level fit remains an explicit local override.
    const slot = mediaFrame({ aspect: rootVariants.aspect, fit: fit ?? rootVariants.fit })
    return <img ref={ref} alt={alt} className={cx(slot.image, className)} {...props} />
  },
)

export interface MediaFrameEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MediaFrameEmpty = forwardRef<HTMLDivElement, MediaFrameEmptyProps>(
  function MediaFrameEmpty({ className, ...props }, ref) {
    const slot = mediaFrame()
    return <div ref={ref} className={cx(slot.empty, className)} {...props} />
  },
)
