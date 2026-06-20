import { defineSlotRecipe } from "@pandacss/dev"

/**
 * InlineEdit slot recipe.
 *
 * grammar 上の位置:
 *   - Input は「ここは form field です」と明示するため inset shadow が signature
 *   - InlineEdit は「ここは text だが触ると編集できる」ため bg-tint shift が
 *     signature(shadow は持たない)
 *
 * 周囲との同化が本義なので、font-size / line-height / color / font-weight /
 * letter-spacing は全て継承する(recipe で固定しない)。配置先の文脈に従う。
 *
 * Slots:
 *   - root: 状態切替を内包する wrapper(layout 安定のため)
 *   - read: 読み専用表示(`<button>` でレンダリング)
 *   - edit: 編集中表示(`<input>` でレンダリング)
 */
export const inlineEditRecipe = defineSlotRecipe({
  className: "otibo-inline-edit",
  slots: ["root", "read", "edit"],
  base: {
    root: {
      display: "block",
      width: "100%",
    },
    read: {
      // button reset:周囲 text と完全に同化させる
      display: "block",
      // 文頭を周囲の通常文に揃える(bleed パターン):hover/focus 領域の余白として
      // paddingInline は残しつつ、同量の負 marginInline で外へ逃がす。これで「文字の
      // 開始位置」は親の content 端と一致し、hover bg は左右に 1 段はみ出す。
      // width は負 margin 分を足し戻して row を満たす(border-box)。
      // marginInline -2 = -0.5rem ×2 / 足し戻し +1rem = spacing.2 ×2。
      width: "calc(100% + 1rem)",
      marginBlock: "0",
      marginInline: "-2",
      paddingInline: "2",
      paddingBlock: "1",
      bg: "transparent",
      border: "none",
      borderRadius: "sm",
      color: "inherit",
      font: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit",
      textAlign: "left",
      cursor: "text",
      transitionProperty: "background-color, box-shadow",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // 触れる領域を「ギリギリ告知する」強度で hover bg を当てる
      _hover: {
        bg: "bg.subtle",
      },
      // keyboard focus:pointer hover と同じ bg + 外周に focus ring
      _focusVisible: {
        outline: "none",
        bg: "bg.subtle",
        boxShadow: "focus",
      },
      // 空値時:fg.subtle で「未設定」を absent content として弱く提示する。
      // ここは support text ではなく placeholder semantics(grammar §Foreground
      // Subroles 参照)。
      "&[data-empty='true']": {
        color: "fg.subtle",
      },
    },
    edit: {
      display: "block",
      // read と同じ bleed。read↔edit で文頭が動かず、かつ周囲文と揃う。
      width: "calc(100% + 1rem)",
      marginBlock: "0",
      marginInline: "-2",
      paddingInline: "2",
      paddingBlock: "1",
      // edit signature:bottom underline。bg-tint は使わず、純粋に下線で
      // 「ここを編集している」を伝える。Input が inset shadow / Field が
      // border / InlineEdit が underline、と三者の signature が分離する。
      // edit mode は常に focused のため、underline が focus 表現も兼ねる。
      bg: "transparent",
      border: "none",
      // underline 端を sharp に保つため radius は切る(read の sm との差は
      // 「bg を持たない edit」では視覚的な不連続にならない)
      borderRadius: "0",
      color: "inherit",
      font: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit",
      outline: "none",
      appearance: "none",
      boxShadow: "inset 0 -2px 0 0 {colors.fg.strong}",
      transitionProperty: "box-shadow",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _placeholder: {
        color: "fg.subtle",
      },
    },
  },
})
