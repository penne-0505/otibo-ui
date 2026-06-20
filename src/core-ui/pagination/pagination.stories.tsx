import type { Story } from "@ladle/react"
import { useState } from "react"

import { Pagination } from "./pagination"

export default {
  title: "core-ui / Pagination",
}

// Windowed — 10 ページを 1 … 周辺 … 10 で窓表示(ellipsis を含む実動作)。
export const Windowed: Story = () => {
  const total = 10
  const [page, setPage] = useState(4)

  const pages: Array<number | "ellipsis"> = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <div style={{ padding: "3rem 2rem" }}>
      <Pagination.Root>
        <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Ellipsis key={`e${i}`} />
          ) : (
            <Pagination.Item key={p} active={page === p} onClick={() => setPage(p)}>
              {p}
            </Pagination.Item>
          ),
        )}
        <Pagination.Next
          disabled={page === total}
          onClick={() => setPage((p) => Math.min(total, p + 1))}
        />
      </Pagination.Root>
    </div>
  )
}
