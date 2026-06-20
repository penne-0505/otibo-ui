import type { Story } from "@ladle/react"

import { ScrollArea } from "./scroll-area"

export default {
  title: "core-ui / ScrollArea",
}

// 1. List — 縦長リストの内 scroll。otibo の細い hairline scrollbar。
export const List: Story = () => (
  <div style={{ padding: "3rem 2rem", display: "flex", justifyContent: "center" }}>
    <ScrollArea.Root
      style={{
        height: "16rem",
        width: "20rem",
        background: "var(--colors-surface-raised)",
        borderRadius: "0.75rem",
        boxShadow: "var(--shadows-paper-sm)",
      }}
    >
      <ScrollArea.Viewport>
        <div style={{ padding: "1rem" }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: "0.625rem 0.75rem",
                borderRadius: "0.25rem",
                color: "var(--colors-fg)",
                fontSize: "0.9375rem",
              }}
            >
              項目 {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  </div>
)

// 2. Paragraph — 長文の内 scroll(規約や release note の典型)。
export const Paragraph: Story = () => (
  <div style={{ padding: "3rem 2rem", display: "flex", justifyContent: "center" }}>
    <ScrollArea.Root
      style={{
        height: "12rem",
        width: "24rem",
        background: "var(--colors-surface-raised)",
        borderRadius: "0.75rem",
        boxShadow: "var(--shadows-paper-sm)",
      }}
    >
      <ScrollArea.Viewport>
        <div
          style={{
            padding: "1rem",
            lineHeight: 1.7,
            color: "var(--colors-fg)",
            fontSize: "0.9375rem",
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i} style={{ margin: "0 0 0.75rem 0" }}>
              段落 {i + 1}。otibo の細い hairline scrollbar が、長い content を quiet に内蔵する。
              太いブラウザ既定 scrollbar の代わりに、地と馴染む半透明の細線。hover/scrolling
              で一段濃くなる。
            </p>
          ))}
        </div>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  </div>
)
