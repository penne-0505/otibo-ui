import { Menu as BaseMenu } from "@base-ui/react/menu"
import { menu } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Menu — trigger から開く action リスト(dropdown)。a11y / positioning / keyboard は
 * Base UI Menu に委譲、見た目は otibo recipe(popover / select と同じ raised panel)。
 *
 * 使い方:
 *   <MenuRoot>
 *     <MenuTrigger render={<Button intent="ghost" size="sm">…</Button>} />
 *     <MenuPopup>
 *       <MenuItem onClick={…}>プロフィール</MenuItem>
 *       <MenuSeparator />
 *       <MenuItem onClick={…}>ログアウト</MenuItem>
 *     </MenuPopup>
 *   </MenuRoot>
 */

// Popup ── Portal + Positioner で浮かせる。trigger 隣接の action なので既定は下・右寄せ。
interface MenuPopupProps extends BaseMenu.Popup.Props {
  side?: BaseMenu.Positioner.Props["side"]
  align?: BaseMenu.Positioner.Props["align"]
  sideOffset?: BaseMenu.Positioner.Props["sideOffset"]
}

export const MenuRoot = BaseMenu.Root
export const MenuTrigger = BaseMenu.Trigger
export const MenuGroup = BaseMenu.Group

export const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup(
  { className, side = "bottom", align = "end", sideOffset = 6, children, ...props },
  ref,
) {
  const slot = menu()
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseMenu.Popup ref={ref} className={mergeClass(slot.popup, className)} {...props}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
})

export const MenuItem = forwardRef<HTMLDivElement, BaseMenu.Item.Props>(function MenuItem(
  { className, ...props },
  ref,
) {
  const slot = menu()
  return <BaseMenu.Item ref={ref} className={mergeClass(slot.item, className)} {...props} />
})

export const MenuSeparator = forwardRef<HTMLDivElement, BaseMenu.Separator.Props>(
  function MenuSeparator({ className, ...props }, ref) {
    const slot = menu()
    return (
      <BaseMenu.Separator ref={ref} className={mergeClass(slot.separator, className)} {...props} />
    )
  },
)

export const MenuGroupLabel = forwardRef<HTMLDivElement, BaseMenu.GroupLabel.Props>(
  function MenuGroupLabel({ className, ...props }, ref) {
    const slot = menu()
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        className={mergeClass(slot.groupLabel, className)}
        {...props}
      />
    )
  },
)
