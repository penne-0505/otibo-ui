import type { Story } from "@ladle/react"

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  TableScroll,
} from "./table"

export default {
  title: "core-ui / Table",
}

const rows = [
  ["MacBook Pro 16", "東京", "管理者", "2026-07-11 21:04", "active"],
  ["iPhone 15", "大阪", "編集者", "2026-07-10 09:12", "active"],
  ["iPad Air", "福岡", "閲覧のみ", "2026-07-08 18:40", "idle"],
  ["Windows Desktop", "札幌", "管理者", "2026-07-01 11:22", "revoked"],
]

export const Default: Story = () => (
  <div style={{ maxWidth: "40rem" }}>
    <TableRoot>
      <TableHeader>
        <TableRow>
          <TableHead>デバイス</TableHead>
          <TableHead>場所</TableHead>
          <TableHead>役割</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row[0]}>
            <TableCell>{row[0]}</TableCell>
            <TableCell>{row[1]}</TableCell>
            <TableCell>{row[2]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  </div>
)

export const NarrowScroll: Story = () => (
  <div style={{ maxWidth: "22rem", border: "1px dashed rgba(0,0,0,0.12)", padding: "0.5rem" }}>
    <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", opacity: 0.6 }}>
      viewport ≈ 352px — TableScroll で横スクロール
    </p>
    <TableScroll>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableHead>デバイス</TableHead>
            <TableHead>場所</TableHead>
            <TableHead>役割</TableHead>
            <TableHead>最終アクセス</TableHead>
            <TableHead>状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell) => (
                <TableCell key={cell} style={{ whiteSpace: "nowrap" }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableScroll>
  </div>
)
