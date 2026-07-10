import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { dialog } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Dialog — 最上位の modal。scrim で背景を落とし、中央に paper を浮かせる。
 * a11y / focus-trap / scroll-lock / outside-dismiss は Base UI DialogRoot
 * (modal 既定)に委譲、見た目は otibo recipe。
 *
 * 使い方:
 *   <DialogRoot>
 *     <DialogTrigger render={<Button>開く</Button>} />
 *     <DialogPopup>
 *       <DialogTitle>...</DialogTitle>
 *       <DialogDescription>...</DialogDescription>
 *       <DialogClose render={<Button>閉じる</Button>} />
 *     </DialogPopup>
 *   </DialogRoot>
 *
 * Popup は内部で Portal + Backdrop を含むので、呼び出し側は中身だけ置けばよい。
 */
export const DialogRoot = BaseDialog.Root
export const DialogTrigger = BaseDialog.Trigger
export const DialogClose = BaseDialog.Close

export const DialogPopup = forwardRef<HTMLDivElement, BaseDialog.Popup.Props>(function DialogPopup(
  { className, children, ...props },
  ref,
) {
  const slot = dialog()
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={slot.backdrop} />
      <BaseDialog.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
})

export const DialogTitle = forwardRef<HTMLHeadingElement, BaseDialog.Title.Props>(
  function DialogTitle({ className, ...props }, ref) {
    const slot = dialog()
    return <BaseDialog.Title ref={ref} className={mergeClass(slot.title, className)} {...props} />
  },
)

export const DialogDescription = forwardRef<HTMLParagraphElement, BaseDialog.Description.Props>(
  function DialogDescription({ className, ...props }, ref) {
    const slot = dialog()
    return (
      <BaseDialog.Description
        ref={ref}
        className={mergeClass(slot.description, className)}
        {...props}
      />
    )
  },
)
