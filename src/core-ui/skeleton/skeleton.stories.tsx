import type { Story } from "@ladle/react"

import { Skeleton } from "./skeleton"

export default {
  title: "core-ui / Skeleton",
}

// 1. ProfileHeader — avatar の丸 + 2 行。account-settings ヘッダーの loading 版。
export const ProfileHeader: Story = () => (
  <div
    style={{
      padding: "3rem 2rem",
      maxWidth: "20rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    }}
  >
    <Skeleton circle style={{ width: "3rem", height: "3rem" }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Skeleton style={{ width: "60%", height: "0.875rem" }} />
      <Skeleton style={{ width: "40%", height: "0.75rem" }} />
    </div>
  </div>
)

// 2. TextBlock — 段落の loading(最終行を短く)。脈動が同期して呼吸する。
export const TextBlock: Story = () => (
  <div
    style={{
      padding: "3rem 2rem",
      maxWidth: "24rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    }}
  >
    <Skeleton style={{ width: "100%", height: "0.8rem" }} />
    <Skeleton style={{ width: "100%", height: "0.8rem" }} />
    <Skeleton style={{ width: "70%", height: "0.8rem" }} />
  </div>
)

// 3. Media — 画像コンテンツの placeholder。専用部品ではなく、rect を画像の比率(aspect-ratio)で
//    置くだけ。角丸は画像/card に合わせて md。下にタイトル/メタ行。
export const Media: Story = () => (
  <div
    style={{
      padding: "3rem 2rem",
      maxWidth: "20rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}
  >
    <Skeleton style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--radii-md)" }} />
    <Skeleton style={{ width: "70%", height: "0.9rem" }} />
    <Skeleton style={{ width: "45%", height: "0.75rem" }} />
  </div>
)
