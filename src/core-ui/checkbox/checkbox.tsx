import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox"
import { forwardRef } from "react"

import { checkbox } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Checkbox — custom 描画の二値選択 control。
 *
 * a11y / state(checked / indeterminate / focus / disabled)は Base UI Checkbox に委譲し、
 * 見た目は otibo recipe で 100% 自前(native の border-radius 非対応等を回避)。
 * checked = 単一 accent。
 *
 * label は consumer 側で `<label>` 等に紐付ける(Field と同様、control を素で提供)。
 */
export interface CheckboxProps extends BaseCheckbox.Root.Props {}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, indeterminate, ...props },
  ref,
) {
  const slot = checkbox()
  return (
    <BaseCheckbox.Root
      ref={ref}
      indeterminate={indeterminate}
      className={mergeClass(slot.root, className)}
      {...props}
    >
      {/* keepMounted: 常時マウントして data-checked への CSS transition で stroke を引く。
          CSS transition は初期レンダーでは走らないため、defaultChecked がページロードで
          自分を描く「到着の演技」を避けつつ、ユーザー操作のときだけ描く/消す。 */}
      <BaseCheckbox.Indicator className={slot.indicator} keepMounted>
        <Icon name={indeterminate ? "dash" : "check"} size="0.875em" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
})
