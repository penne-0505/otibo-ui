import { defineRecipe } from "@pandacss/dev"

/**
 * TableScroll — 狭い幅で表を横スクロールさせる wrapper。
 *
 * 行カード化はしない。端フェードで「続きがある」を quiet に示す。
 * フェードは scroll 位置に追従する（Lea Verou の local/scroll 背景技法）:
 *   - 開始位置では左のフェードは出ない
 *   - 右端まで送ると右のフェードが消える
 *
 * cover 色は「表の背後の面」に一致させる必要がある。既定は app canvas の `bg`。
 * Card（surface）等に載せる場合は `--otibo-table-scroll-bg` を上書きする:
 *   <TableScroll style={{ "--otibo-table-scroll-bg": "var(--colors-surface)" }}>
 *
 * 本体の Table 純構造（hairline / 端 padding 0）は触らない。
 */
export const tableScrollRecipe = defineRecipe({
  className: "otibo-table-scroll",
  jsx: ["TableScroll"],
  base: {
    "--otibo-table-scroll-bg": "token(colors.bg)",
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
    // スクロールバーを過度に主張しない
    scrollbarWidth: "thin",
    backgroundColor: "var(--otibo-table-scroll-bg)",
    // 4層: cover左 / cover右（local=内容に追従）+ shadow左 / shadow右（scroll=枠に固定）。
    // cover が端に居る間は shadow を隠し、スクロールで cover が退くと shadow が現れる。
    backgroundImage:
      "linear-gradient(to right, var(--otibo-table-scroll-bg) 40%, transparent), linear-gradient(to left, var(--otibo-table-scroll-bg) 40%, transparent), radial-gradient(farthest-side at 0 50%, color-mix(in oklch, {colors.shadow.depth} 16%, transparent), transparent), radial-gradient(farthest-side at 100% 50%, color-mix(in oklch, {colors.shadow.depth} 16%, transparent), transparent)",
    backgroundPosition: "left center, right center, left center, right center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "36px 100%, 36px 100%, 14px 100%, 14px 100%",
    backgroundAttachment: "local, local, scroll, scroll",
  },
})
