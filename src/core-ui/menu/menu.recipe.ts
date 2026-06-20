import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Menu slot recipe — trigger から開く action リスト(dropdown)。
 *
 * grammar 上の位置:Select が「値を一つ選ぶ listbox」なのに対し、Menu は「動作を起こす」
 * action 群。選択状態を持たない(check indicator なし)。a11y / positioning / keyboard /
 * typeahead は Base UI Menu に委譲、見た目は popover / select と同じ raised panel。
 *
 * motion(答え合わせ):motion-grammar の Deferred #2「list 型 overlay は select 側
 * (opacity 即時 + scale)」の検証台。Menu は複数 item を読みで attention が散るので、
 * scale settle を非焦点化でき終端 snap が知覚から外れる ── select と同じ式を当て、実機で
 * 「単一焦点 overlay(tooltip/popover の opacity-only)側に倒れないか」を確認する。
 *
 * Slots: popup(浮く panel)/ item(各 action 行)/ separator(区切り)/ groupLabel(群見出し)。
 */
export const menuRecipe = defineSlotRecipe({
  className: "otibo-menu",
  jsx: ["Menu"],
  slots: ["popup", "item", "separator", "groupLabel"],
  base: {
    popup: {
      // popover / select と同じ raised panel。action リストなので content 幅に素直に従う。
      minWidth: "9rem",
      maxHeight: "var(--available-height)",
      overflowY: "auto",
      padding: "1",
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      borderRadius: "md",
      boxShadow: "lift",
      outline: "none",
      // overlay enter/exit(select と同じ文法)。list 型なので opacity を gate せず、
      // opacity は完全即時(0s)で出し、scale だけを feedback として medium(240)で trigger
      // 起点に settle。exit は閉じをきれいに見せる quick の fade+scale(ending-style)。
      transformOrigin: "var(--transform-origin)",
      opacity: "1",
      transform: "scale(1)",
      transition: "opacity 0s, transform var(--durations-medium) var(--easings-expressive)",
      "&[data-starting-style]": { opacity: "0", transform: "scale(0.96)" },
      "&[data-ending-style]": {
        opacity: "0",
        transform: "scale(0.96)",
        transition:
          "opacity var(--durations-quick) var(--easings-standard), transform var(--durations-quick) var(--easings-standard)",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transform: "none",
        transition: "none",
        "&[data-starting-style], &[data-ending-style]": { transform: "none" },
      },
    },
    item: {
      // action 行。select item と違い check を持たないので左揃え(先頭 icon 用に gap)。
      display: "flex",
      alignItems: "center",
      gap: "2",
      paddingInline: "3",
      paddingBlock: "2",
      fontSize: "md",
      lineHeight: "tight",
      color: "fg",
      borderRadius: "xs",
      cursor: "default",
      userSelect: "none",
      outline: "none",
      scrollMarginBlock: "1",
      // active(キーボード/ポインタの居場所)── select と同じ最強の手がかり。
      "&[data-highlighted]": {
        bg: "accent.subtle",
        color: "fg.strong",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    separator: {
      // full-bleed にせず、端を item テキストの列に合わせた「内側の線」。marginInline は item の
      // paddingInline(3)と同値 ── 線の左右端が各行の文字に揃い、行群をまとめる区切りに見える。
      height: "1px",
      marginBlock: "1",
      marginInline: "3",
      bg: "border.subtle",
    },
    groupLabel: {
      paddingInline: "3",
      paddingBlock: "1",
      fontSize: "xs",
      fontWeight: "medium",
      letterSpacing: "wide",
      color: "fg.muted",
      userSelect: "none",
    },
  },
})
