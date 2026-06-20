import { defineSlotRecipe } from "@pandacss/dev"

/**
 * ScrollArea slot recipe — カスタムスクロール領域。
 *
 * grammar 上の位置:ブラウザ既定の太い scrollbar を、otibo の細い hairline に置き換える。色なし、
 * thumb は通常 fg を 25% に薄めた線(地と馴染む)、scrollbar hover/scrolling で fg.muted へ濃く。
 * scroll は機能であり装飾ではないので、自走の脈動は持たない。
 *
 * Slots: root(scroll を持つコンテナ)/ viewport(実際にスクロールする面)/ scrollbar(細い軸)/
 *        thumb(掴み)。
 */
export const scrollAreaRecipe = defineSlotRecipe({
  className: "otibo-scroll-area",
  jsx: ["ScrollArea"],
  slots: ["root", "viewport", "scrollbar", "thumb"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
    },
    viewport: {
      width: "100%",
      height: "100%",
      overflow: "auto",
      // ネイティブ scrollbar を隠す(Base UI が overlay の細い scrollbar を別途描く)。
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    },
    scrollbar: {
      display: "flex",
      touchAction: "none",
      userSelect: "none",
      transitionProperty: "background-color, opacity",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // 垂直/水平の太さ。padding なし(細い 0.5rem 軌道に内側 padding を入れると端で thumb の上下が
      // 詰まって「最上部/最下部で thumb が短く見える」=端の表示が不自然 になる)。
      "&[data-orientation='vertical']": { width: "0.5rem" },
      "&[data-orientation='horizontal']": {
        flexDirection: "column",
        height: "0.5rem",
      },
      // thumb 色は CSS 変数で疎通(クラス名 hardcode 回避)。Base UI の `data-hovering` は Root の
      // pointer 状態(コンテナ全体 hover で true)= overlay scrollbar 風で otibo の意図と違う。代わりに
      // scrollbar 自身の `:hover`(= scrollbar 軌道に pointer が直接乗った時)で変数を切り替える。
      "--scroll-thumb": "color-mix(in oklch, {colors.fg} 15%, transparent)",
      "&:hover": { "--scroll-thumb": "{colors.fg.muted}" },
    },
    thumb: {
      flex: "1",
      borderRadius: "full",
      bg: "var(--scroll-thumb)",
      transitionProperty: "background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
    },
  },
})
