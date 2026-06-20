import { Toast as BaseToast } from "@base-ui-components/react/toast"

import { toast } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Toast — 系から自発的に提示される feedback overlay。
 *
 * a11y / queue / auto-dismiss / swipe は Base UI Toast に委譲、見た目・motion は otibo recipe。
 *
 * 使い方:
 *   1) アプリ直下に Provider と Toaster を 1 つずつ置く
 *      <Toast.Provider>
 *        <App />
 *        <Toast.Toaster />
 *      </Toast.Provider>
 *   2) 任意の場所で発火
 *      const toast = Toast.useToastManager()
 *      toast.add({ title: "保存しました", description: "..." })
 */
function ToastProvider(props: BaseToast.Provider.Props) {
  // otibo 既定:5s で自動退場、最大 3 つ同時表示(超過は古いものから畳む)。
  return <BaseToast.Provider timeout={5000} limit={3} {...props} />
}

// Viewport 内で queue を map して描画する list。Toaster が内包する。
function ToastList() {
  const { toasts } = BaseToast.useToastManager()
  const slot = toast()
  return toasts.map((item) => (
    <BaseToast.Root key={item.id} toast={item} className={slot.root}>
      <div className={slot.content}>
        {item.title ? <BaseToast.Title className={slot.title} /> : null}
        {item.description ? <BaseToast.Description className={slot.description} /> : null}
      </div>
      <BaseToast.Close className={slot.close} aria-label="閉じる">
        <Icon name="close" size="0.875rem" />
      </BaseToast.Close>
    </BaseToast.Root>
  ))
}

// Toaster — Portal + Viewport + list。アプリに 1 つ置く。
function Toaster(props: BaseToast.Viewport.Props) {
  const slot = toast()
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={mergeClass(slot.viewport, props.className)} {...props}>
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  )
}

export const Toast = {
  Provider: ToastProvider,
  Toaster,
  useToastManager: BaseToast.useToastManager,
  createToastManager: BaseToast.createToastManager,
}
