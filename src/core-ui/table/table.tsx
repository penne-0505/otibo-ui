import { table, tableScroll } from "@otibo/ui/styled-system/recipes"
import { forwardRef } from "react"
import { cx } from "../../lib/utils"

/**
 * Table — データ表示の表。native の table 要素を otibo recipe で styled。色は使わず hairline と
 * 余白で構造を語り、body 行 hover にだけ quiet な明度差を敷く。
 *
 * 狭い幅では TableScroll で横スクロールする（行カード化しない）。
 *
 * 使い方:
 *   <TableScroll>
 *     <TableRoot>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>デバイス</TableHead>
 *           <TableHead>最終アクセス</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         <TableRow>
 *           <TableCell>MacBook Pro</TableCell>
 *           <TableCell>たった今</TableCell>
 *         </TableRow>
 *       </TableBody>
 *     </TableRoot>
 *   </TableScroll>
 */

export const TableScroll = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function TableScroll({ className, ...props }, ref) {
    return <div ref={ref} className={cx(tableScroll(), className)} {...props} />
  },
)

export const TableRoot = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  function TableRoot({ className, ...props }, ref) {
    const slot = table()
    return <table ref={ref} className={cx(slot.root, className)} {...props} />
  },
)

// thead / tbody は素の要素(row の hover/最終行 scope に tbody タグを使う)。
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={className} {...props} />
})

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={className} {...props} />
})

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    const slot = table()
    return <tr ref={ref} className={cx(slot.row, className)} {...props} />
  },
)

export const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHead({ className, scope = "col", ...props }, ref) {
  const slot = table()
  return <th ref={ref} scope={scope} className={cx(slot.head, className)} {...props} />
})

export const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  const slot = table()
  return <td ref={ref} className={cx(slot.cell, className)} {...props} />
})
