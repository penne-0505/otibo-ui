import type { Story } from "@ladle/react"
import { textStyle } from "../../theme/typography"

export default {
  title: "core-ui / Typography",
}

const sample =
  "誰かのひと手間に基づく。架空のペルソナや調査の数字を出発点にしない。"

export const Roles: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      maxWidth: "40rem",
    }}
  >
    <p className={textStyle("eyebrow")}>Eyebrow / kicker</p>
    <p className={textStyle("display")}>Display</p>
    <p className={textStyle("heading.lg")}>Heading lg</p>
    <p className={textStyle("heading.md")}>Heading md</p>
    <p className={textStyle("heading.sm")}>Heading sm</p>
    <p className={textStyle("body")}>{sample}</p>
    <p className={textStyle("caption")}>Caption — 補助・注釈・メタデータ</p>
  </div>
)
