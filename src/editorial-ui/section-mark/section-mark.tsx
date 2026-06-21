import { type HTMLAttributes, forwardRef } from "react"

import { sectionMark } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

type SectionMarkVariants = NonNullable<Parameters<typeof sectionMark>[0]>

interface SectionMarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    SectionMarkVariants {
  /** 章番号(文字列で受ける。"03" / "I" / "一" 等)。 */
  number: string
  /** 章名。caps 化は recipe 側で行う ─ 与える値は原文のままで良い。 */
  title: string
}

/**
 * SectionMark — 章の頭印「03 ── CHAPTER NAME」。`<div role="doc-subtitle">` で組む。
 *
 * Display と組み合わせる時は、SectionMark をその直前に置く。SectionMark 自身が
 * 「ここから新しい章だ」を告げる ── Display は内容を告げる。
 */
export const SectionMark = forwardRef<HTMLDivElement, SectionMarkProps>(function SectionMark(
  { className, align, number, title, ...props },
  ref,
) {
  const slot = sectionMark({ align })
  // role は意図的に持たない ─ SectionMark は Display の上に置く印で、heading 構造は
  // 親(Display = <h1>)が担う。caller が `<header>` の中に置く想定。
  return (
    <div ref={ref} className={cx(slot.root, className)} {...props}>
      <span className={slot.number} aria-hidden>
        {number}
      </span>
      <span className={slot.rule} aria-hidden />
      <span className={slot.title}>{title}</span>
    </div>
  )
})

export type { SectionMarkProps }
