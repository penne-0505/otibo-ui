import { forwardRef } from "react"

import { table } from "@otibo/ui/styled-system/recipes"
import { cx } from "../../lib/utils"

/**
 * Table — データ表示の表。native の table 要素を otibo recipe で styled。色は使わず hairline と
 * 余白で構造を語り、body 行 hover にだけ quiet な明度差を敷く。
 *
 * 使い方:
 *   <Table.Root>
 *     <Table.Header>
 *       <Table.Row>
 *         <Table.Head>デバイス</Table.Head>
 *         <Table.Head>最終アクセス</Table.Head>
 *       </Table.Row>
 *     </Table.Header>
 *     <Table.Body>
 *       <Table.Row>
 *         <Table.Cell>MacBook Pro</Table.Cell>
 *         <Table.Cell>たった今</Table.Cell>
 *       </Table.Row>
 *     </Table.Body>
 *   </Table.Root>
 */

const TableRoot = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  function TableRoot({ className, ...props }, ref) {
    const slot = table()
    return <table ref={ref} className={cx(slot.root, className)} {...props} />
  },
)

// thead / tbody は素の要素(row の hover/最終行 scope に tbody タグを使う)。
const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={className} {...props} />
})

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={className} {...props} />
})

const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    const slot = table()
    return <tr ref={ref} className={cx(slot.row, className)} {...props} />
  },
)

const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  function TableHead({ className, scope = "col", ...props }, ref) {
    const slot = table()
    return <th ref={ref} scope={scope} className={cx(slot.head, className)} {...props} />
  },
)

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  function TableCell({ className, ...props }, ref) {
    const slot = table()
    return <td ref={ref} className={cx(slot.cell, className)} {...props} />
  },
)

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
}
