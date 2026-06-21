import { forwardRef } from "react"

import { hairline } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type HairlineVariants = NonNullable<Parameters<typeof hairline>[0]>

export interface HairlineProps
  extends Omit<React.HTMLAttributes<HTMLHRElement>, "color">,
    HairlineVariants {}

/**
 * Hairline — editorial の意図ある線。default tag は `<hr>` で a11y/semantics を担保。
 *
 * Separator(core-ui)が「構造の hairline」なら、こちらは「editorial の hairline」。
 * 章境/引用枠/SectionMark の rule など、線そのものに役を持たせたい場面で使う。
 */
export const Hairline = forwardRef<HTMLHRElement, HairlineProps>(function Hairline(
  { className, weight, orientation = "horizontal", length, role, ...props },
  ref,
) {
  // aria-orientation は plain string が要る ─ Panda の ConditionalValue を素で
  // 渡せないため、responsive な orientation を取った場合は default "horizontal"
  // に倒す。a11y は意味の主軸の方を伝えれば足りる。
  const ariaOrientation: "horizontal" | "vertical" =
    orientation === "vertical" ? "vertical" : "horizontal"
  return (
    <hr
      ref={ref}
      role={role ?? "separator"}
      aria-orientation={ariaOrientation}
      className={cx(hairline({ weight, orientation, length }), className)}
      {...props}
    />
  )
})
