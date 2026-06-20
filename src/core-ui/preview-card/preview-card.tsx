import { PreviewCard as BasePreviewCard } from "@base-ui-components/react/preview-card"
import { cloneElement, forwardRef, isValidElement } from "react"

import { previewCard } from "@otibo/ui/styled-system/recipes"
import { cx, mergeClass } from "../../lib/utils"

/**
 * PreviewCard — hover で開く軽量プレビュー(リンク先の cover + タイトル + 補足)。
 *
 * 使い方:
 *   <PreviewCard.Root>
 *     <PreviewCard.Trigger render={<Link href="/works/mountain-pass">Mountain Pass</Link>} />
 *     <PreviewCard.Popup>
 *       <PreviewCard.Media src={src} alt="…" />
 *       <PreviewCard.Body>
 *         <PreviewCard.Title>Mountain Pass</PreviewCard.Title>
 *         <PreviewCard.Description>2026 / 写真</PreviewCard.Description>
 *       </PreviewCard.Body>
 *     </PreviewCard.Popup>
 *   </PreviewCard.Root>
 */

// Trigger ── 非対称の delay:出るのは「ためてから(意図的に lingering した時だけ)」=350ms、消えは
// 「離れたら即(留まりすぎを避れる)」=100ms。Base UI 既定(open 600 / close 300)はどちらも otibo の
// 手触りに合わない。「出るのは慎重、消えは速い」が正しい preview の体験。
//
// さらに `render` 要素に trigger slot の className を **自動 merge** する ── 「hover で何か起こる
// 要素は予見させるべき」原則を満たすため、消費側が hover style を書かなくても accent + 下線出現の
// response が乗る(Link の treatment B と同じ文法)。
const Trigger = forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Trigger>,
  BasePreviewCard.Trigger.Props
>(function PreviewCardTrigger({ delay = 350, closeDelay = 100, render, ...props }, ref) {
  const slot = previewCard()
  const enhancedRender = isValidElement<{ className?: string }>(render)
    ? cloneElement(render, { className: cx(slot.trigger, render.props.className) })
    : render
  return (
    <BasePreviewCard.Trigger
      ref={ref}
      delay={delay}
      closeDelay={closeDelay}
      render={enhancedRender}
      {...props}
    />
  )
})

interface PopupProps extends BasePreviewCard.Popup.Props {
  side?: BasePreviewCard.Positioner.Props["side"]
  align?: BasePreviewCard.Positioner.Props["align"]
  sideOffset?: BasePreviewCard.Positioner.Props["sideOffset"]
}

const Popup = forwardRef<HTMLDivElement, PopupProps>(function PreviewCardPopup(
  { className, side = "top", align = "center", sideOffset = 8, children, ...props },
  ref,
) {
  const slot = previewCard()
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BasePreviewCard.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BasePreviewCard.Popup>
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  )
})

const Media = forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  function PreviewCardMedia({ className, alt, ...props }, ref) {
    const slot = previewCard()
    // intent: default to decorative (alt="") since preview media is supplementary;
    // consumers pass alt as a destructured prop to keep biome's static a11y check satisfied
    // (spread before alt would let `{...props}` shadow the literal alt, defeating the analysis).
    return <img ref={ref} {...props} alt={alt ?? ""} className={cx(slot.media, className)} />
  },
)

const Body = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function PreviewCardBody({ className, ...props }, ref) {
    const slot = previewCard()
    return <div ref={ref} className={cx(slot.body, className)} {...props} />
  },
)

const Title = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function PreviewCardTitle({ className, ...props }, ref) {
    const slot = previewCard()
    return <div ref={ref} className={cx(slot.title, className)} {...props} />
  },
)

const Description = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function PreviewCardDescription({ className, ...props }, ref) {
    const slot = previewCard()
    return <p ref={ref} className={cx(slot.description, className)} {...props} />
  },
)

const Footer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function PreviewCardFooter({ className, ...props }, ref) {
    const slot = previewCard()
    return <div ref={ref} className={cx(slot.footer, className)} {...props} />
  },
)

export const PreviewCard = {
  Root: BasePreviewCard.Root,
  Trigger,
  Popup,
  Media,
  Body,
  Title,
  Description,
  Footer,
}
