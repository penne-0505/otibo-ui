import { Dialog as BaseDialog } from "@base-ui-components/react/dialog"
import { forwardRef } from "react"

import { dialog } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Dialog — 最上位の modal。scrim で背景を落とし、中央に paper を浮かせる。
 * a11y / focus-trap / scroll-lock / outside-dismiss は Base UI Dialog.Root
 * (modal 既定)に委譲、見た目は otibo recipe。
 *
 * 使い方:
 *   <Dialog.Root>
 *     <Dialog.Trigger render={<Button>開く</Button>} />
 *     <Dialog.Popup>
 *       <Dialog.Title>...</Dialog.Title>
 *       <Dialog.Description>...</Dialog.Description>
 *       <Dialog.Close render={<Button>閉じる</Button>} />
 *     </Dialog.Popup>
 *   </Dialog.Root>
 *
 * Popup は内部で Portal + Backdrop を含むので、呼び出し側は中身だけ置けばよい。
 */
const DialogPopup = forwardRef<HTMLDivElement, BaseDialog.Popup.Props>(function DialogPopup(
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

const DialogTitle = forwardRef<HTMLHeadingElement, BaseDialog.Title.Props>(function DialogTitle(
  { className, ...props },
  ref,
) {
  const slot = dialog()
  return <BaseDialog.Title ref={ref} className={mergeClass(slot.title, className)} {...props} />
})

const DialogDescription = forwardRef<HTMLParagraphElement, BaseDialog.Description.Props>(
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

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: BaseDialog.Close,
}
