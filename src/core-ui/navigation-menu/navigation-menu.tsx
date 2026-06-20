import { NavigationMenu as BaseNav } from "@base-ui-components/react/navigation-menu"
import { forwardRef } from "react"

import { navigationMenu } from "@otibo/ui/styled-system/recipes"
import { cx, mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * NavigationMenu — top nav(dropdown つきヘッダー nav)。Viewport が共有 box で Content が swap。
 *
 * 使い方:
 *   <NavigationMenu.Root>
 *     <NavigationMenu.List>
 *       <NavigationMenu.Item>
 *         <NavigationMenu.Trigger>作品</NavigationMenu.Trigger>
 *         <NavigationMenu.Content>
 *           <NavigationMenu.Grid>
 *             <NavigationMenu.Link href="#">2026</NavigationMenu.Link>
 *             …
 *           </NavigationMenu.Grid>
 *         </NavigationMenu.Content>
 *       </NavigationMenu.Item>
 *       <NavigationMenu.Item>
 *         <NavigationMenu.Link href="#" plain>About</NavigationMenu.Link>
 *       </NavigationMenu.Item>
 *     </NavigationMenu.List>
 *     <NavigationMenu.Viewport />
 *   </NavigationMenu.Root>
 */

const NavRoot = forwardRef<HTMLElement, BaseNav.Root.Props>(function NavRoot(
  { className, ...props },
  ref,
) {
  return <BaseNav.Root ref={ref} className={className} {...props} />
})

const NavList = forwardRef<HTMLDivElement, BaseNav.List.Props>(function NavList(
  { className, ...props },
  ref,
) {
  const slot = navigationMenu()
  return <BaseNav.List ref={ref} className={mergeClass(slot.list, className)} {...props} />
})

const NavItem = forwardRef<HTMLDivElement, BaseNav.Item.Props>(function NavItem(
  { className, ...props },
  ref,
) {
  const slot = navigationMenu()
  return <BaseNav.Item ref={ref} className={mergeClass(slot.item, className)} {...props} />
})

// Trigger ── 右端に open で 180° 反転する chevron を内蔵。
const NavTrigger = forwardRef<HTMLButtonElement, BaseNav.Trigger.Props>(function NavTrigger(
  { className, children, ...props },
  ref,
) {
  const slot = navigationMenu()
  return (
    <BaseNav.Trigger ref={ref} className={mergeClass(slot.trigger, className)} {...props}>
      {children}
      <span className={slot.icon}>
        <Icon name="chevron-down" size="0.75em" />
      </span>
    </BaseNav.Trigger>
  )
})

interface NavLinkProps extends BaseNav.Link.Props {
  /** dropdown 無しの「直リンク」として使うとき(trigger と同じ見た目に揃える)。 */
  plain?: boolean
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { className, plain, ...props },
  ref,
) {
  const slot = navigationMenu()
  // plain は nav bar の直リンク(trigger と同形)。既定は content 内の grid 行(link slot)。
  return (
    <BaseNav.Link
      ref={ref}
      className={mergeClass(plain ? slot.trigger : slot.link, className)}
      {...props}
    />
  )
})

const NavContent = forwardRef<HTMLDivElement, BaseNav.Content.Props>(function NavContent(
  { className, ...props },
  ref,
) {
  const slot = navigationMenu()
  return <BaseNav.Content ref={ref} className={mergeClass(slot.content, className)} {...props} />
})

// Grid ── Content 内のリンク列を一定の grid に。素の div(slot だけ)。
const NavGrid = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function NavGrid(
  { className, ...props },
  ref,
) {
  const slot = navigationMenu()
  return <div ref={ref} className={cx(slot.grid, className)} {...props} />
})

// Viewport ── Portal + Positioner + Popup + Viewport(Base UI の共有 box)。
interface NavViewportProps extends BaseNav.Viewport.Props {
  side?: BaseNav.Positioner.Props["side"]
  align?: BaseNav.Positioner.Props["align"]
  sideOffset?: BaseNav.Positioner.Props["sideOffset"]
}

const NavViewport = forwardRef<HTMLDivElement, NavViewportProps>(function NavViewport(
  { className, side = "bottom", align = "center", sideOffset = 6, ...props },
  ref,
) {
  const slot = navigationMenu()
  return (
    <BaseNav.Portal>
      <BaseNav.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseNav.Popup>
          <BaseNav.Viewport ref={ref} className={mergeClass(slot.viewport, className)} {...props} />
        </BaseNav.Popup>
      </BaseNav.Positioner>
    </BaseNav.Portal>
  )
})

export const NavigationMenu = {
  Root: NavRoot,
  List: NavList,
  Item: NavItem,
  Trigger: NavTrigger,
  Content: NavContent,
  Grid: NavGrid,
  Link: NavLink,
  Viewport: NavViewport,
}
