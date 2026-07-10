import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { chip } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { mergeClass } from "../../lib/utils"

/**
 * Chip / ChipGroup — フィルタチップ(角丸ピルの toggle)。on = accent 塗り + 白。a11y は Base UI Toggle。
 *
 * 使い方(複数選択フィルタ):
 *   <ChipGroup value={tags} onValueChange={setTags} multiple>
 *     <Chip value="写真">写真</Chip>
 *     <Chip value="3D">3D</Chip>
 *   </ChipGroup>
 */

export const Chip = forwardRef<HTMLButtonElement, BaseToggle.Props>(function Chip(
  { className, ...props },
  ref,
) {
  const slot = chip()
  return <BaseToggle ref={ref} className={mergeClass(slot.chip, className)} {...props} />
})

export const ChipGroup = forwardRef<HTMLDivElement, BaseToggleGroup.Props>(function ChipGroup(
  { className, ...props },
  ref,
) {
  const slot = chip()
  return <BaseToggleGroup ref={ref} className={mergeClass(slot.group, className)} {...props} />
})
