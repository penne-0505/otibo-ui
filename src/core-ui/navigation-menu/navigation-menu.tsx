import { NavigationMenu as BaseNav } from "@base-ui/react/navigation-menu"
import { navigationMenu } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { cx, mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * NavigationMenu — top nav(dropdown つきヘッダー nav)。Viewport が共有 box で Content が swap。
 *
 * 使い方:
 *   <NavigationMenuRoot>
 *     <NavigationMenuList>
 *       <NavigationMenuItem>
 *         <NavigationMenuTrigger>作品</NavigationMenuTrigger>
 *         <NavigationMenuContent>
 *           <NavigationMenuGrid>
 *             <NavigationMenuLink href="#">2026</NavigationMenuLink>
 *             …
 *           </NavigationMenuGrid>
 *         </NavigationMenuContent>
 *       </NavigationMenuItem>
 *       <NavigationMenuItem>
 *         <NavigationMenuLink href="#" plain>About</NavigationMenuLink>
 *       </NavigationMenuItem>
 *     </NavigationMenuList>
 *     <NavigationMenuViewport />
 *   </NavigationMenuRoot>
 */

export const NavigationMenuRoot = forwardRef<HTMLElement, BaseNav.Root.Props>(
  function NavigationMenuRoot({ className, ...props }, ref) {
    return <BaseNav.Root ref={ref} className={className} {...props} />
  },
)

export const NavigationMenuList = forwardRef<HTMLUListElement, BaseNav.List.Props>(
  function NavigationMenuList({ className, ...props }, ref) {
    const slot = navigationMenu()
    return <BaseNav.List ref={ref} className={mergeClass(slot.list, className)} {...props} />
  },
)

export const NavigationMenuItem = forwardRef<HTMLLIElement, BaseNav.Item.Props>(
  function NavigationMenuItem({ className, ...props }, ref) {
    const slot = navigationMenu()
    return <BaseNav.Item ref={ref} className={mergeClass(slot.item, className)} {...props} />
  },
)

// Trigger ── 右端に open で 180° 反転する chevron を内蔵。
export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, BaseNav.Trigger.Props>(
  function NavigationMenuTrigger({ className, children, ...props }, ref) {
    const slot = navigationMenu()
    return (
      <BaseNav.Trigger ref={ref} className={mergeClass(slot.trigger, className)} {...props}>
        {children}
        <span className={slot.icon}>
          <Icon name="chevron-down" size="0.75em" />
        </span>
      </BaseNav.Trigger>
    )
  },
)

interface NavLinkProps extends BaseNav.Link.Props {
  /** dropdown 無しの「直リンク」として使うとき(trigger と同じ見た目に揃える)。 */
  plain?: boolean
}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavigationMenuLink({ className, plain, ...props }, ref) {
    const slot = navigationMenu()
    // plain は nav bar の直リンク(trigger と同形)。既定は content 内の grid 行(link slot)。
    return (
      <BaseNav.Link
        ref={ref}
        className={mergeClass(plain ? slot.trigger : slot.link, className)}
        {...props}
      />
    )
  },
)

export const NavigationMenuContent = forwardRef<HTMLDivElement, BaseNav.Content.Props>(
  function NavigationMenuContent({ className, ...props }, ref) {
    const slot = navigationMenu()
    return <BaseNav.Content ref={ref} className={mergeClass(slot.content, className)} {...props} />
  },
)

// Grid ── Content 内のリンク列を一定の grid に。素の div(slot だけ)。
export const NavigationMenuGrid = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function NavigationMenuGrid({ className, ...props }, ref) {
    const slot = navigationMenu()
    return <div ref={ref} className={cx(slot.grid, className)} {...props} />
  },
)

// Viewport ── Portal + Positioner + Popup + Viewport(Base UI の共有 box)。
interface NavViewportProps extends BaseNav.Viewport.Props {
  side?: BaseNav.Positioner.Props["side"]
  align?: BaseNav.Positioner.Props["align"]
  sideOffset?: BaseNav.Positioner.Props["sideOffset"]
}

export const NavigationMenuViewport = forwardRef<HTMLDivElement, NavViewportProps>(
  function NavigationMenuViewport(
    { className, side = "bottom", align = "center", sideOffset = 6, ...props },
    ref,
  ) {
    const slot = navigationMenu()
    return (
      <BaseNav.Portal>
        <BaseNav.Positioner side={side} align={align} sideOffset={sideOffset}>
          <BaseNav.Popup>
            <BaseNav.Viewport
              ref={ref}
              className={mergeClass(slot.viewport, className)}
              {...props}
            />
          </BaseNav.Popup>
        </BaseNav.Positioner>
      </BaseNav.Portal>
    )
  },
)
