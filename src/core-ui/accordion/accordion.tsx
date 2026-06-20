import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion"
import { forwardRef } from "react"

import { accordion } from "@otibo/ui/styled-system/recipes"
import { mergeClass } from "../../lib/utils"
import { Icon } from "../icon/icon"

/**
 * Accordion — 開閉できる詳細セクション(disclosure)。a11y / keyboard / 高さ実測は
 * Base UI Accordion に委譲、見た目と height animation は otibo recipe。
 *
 * 使い方:
 *   <Accordion.Root>
 *     <Accordion.Item>
 *       <Accordion.Trigger>セキュリティ</Accordion.Trigger>
 *       <Accordion.Panel>…</Accordion.Panel>
 *     </Accordion.Item>
 *   </Accordion.Root>
 */

const AccordionRoot = forwardRef<HTMLDivElement, BaseAccordion.Root.Props>(function AccordionRoot(
  { className, multiple = true, ...props },
  ref,
) {
  // otibo 既定は非排他(multiple)。理念「阻害しない / 意図していないことをしない」── ユーザーが
  // 触っていない section を勝手に閉じない。Base UI 既定は multiple=false なのでここで反転させ、
  // 消費側は無指定で理念どおりに使える。排他にしたい時だけ multiple={false} で opt-in。
  const slot = accordion()
  return (
    <BaseAccordion.Root
      ref={ref}
      multiple={multiple}
      className={mergeClass(slot.root, className)}
      {...props}
    />
  )
})

const AccordionItem = forwardRef<HTMLDivElement, BaseAccordion.Item.Props>(function AccordionItem(
  { className, ...props },
  ref,
) {
  const slot = accordion()
  return <BaseAccordion.Item ref={ref} className={mergeClass(slot.item, className)} {...props} />
})

// Trigger ── Header(見出し要素)に包み、右端に open で反転する chevron を自前で付ける。
const AccordionTrigger = forwardRef<HTMLButtonElement, BaseAccordion.Trigger.Props>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    const slot = accordion()
    return (
      <BaseAccordion.Header className={slot.header}>
        <BaseAccordion.Trigger ref={ref} className={mergeClass(slot.trigger, className)} {...props}>
          {children}
          <Icon name="chevron-down" size="1em" className={slot.icon} />
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
    )
  },
)

// Panel ── 高さを animate する外側。余白は内側の panelContent に逃がす(0 まで畳むため)。
const AccordionPanel = forwardRef<HTMLDivElement, BaseAccordion.Panel.Props>(
  function AccordionPanel({ className, children, ...props }, ref) {
    const slot = accordion()
    return (
      <BaseAccordion.Panel ref={ref} className={mergeClass(slot.panel, className)} {...props}>
        <div className={slot.panelContent}>{children}</div>
      </BaseAccordion.Panel>
    )
  },
)

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
}
