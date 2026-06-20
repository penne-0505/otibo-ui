import { Menu as BaseMenu } from "@base-ui-components/react/menu"
import { forwardRef } from "react"

import { menu } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"

/**
 * Menu — trigger から開く action リスト(dropdown)。a11y / positioning / keyboard は
 * Base UI Menu に委譲、見た目は otibo recipe(popover / select と同じ raised panel)。
 *
 * 使い方:
 *   <Menu.Root>
 *     <Menu.Trigger render={<Button intent="ghost" size="sm">…</Button>} />
 *     <Menu.Popup>
 *       <Menu.Item onClick={…}>プロフィール</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.Item onClick={…}>ログアウト</Menu.Item>
 *     </Menu.Popup>
 *   </Menu.Root>
 */

// Popup ── Portal + Positioner で浮かせる。trigger 隣接の action なので既定は下・右寄せ。
interface MenuPopupProps extends BaseMenu.Popup.Props {
  side?: BaseMenu.Positioner.Props["side"]
  align?: BaseMenu.Positioner.Props["align"]
  sideOffset?: BaseMenu.Positioner.Props["sideOffset"]
}

const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup(
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

const MenuItem = forwardRef<HTMLDivElement, BaseMenu.Item.Props>(function MenuItem(
  { className, ...props },
  ref,
) {
  const slot = menu()
  return <BaseMenu.Item ref={ref} className={mergeClass(slot.item, className)} {...props} />
})

const MenuSeparator = forwardRef<HTMLDivElement, BaseMenu.Separator.Props>(function MenuSeparator(
  { className, ...props },
  ref,
) {
  const slot = menu()
  return (
    <BaseMenu.Separator ref={ref} className={mergeClass(slot.separator, className)} {...props} />
  )
})

const MenuGroupLabel = forwardRef<HTMLDivElement, BaseMenu.GroupLabel.Props>(
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

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: BaseMenu.Group,
  GroupLabel: MenuGroupLabel,
}
