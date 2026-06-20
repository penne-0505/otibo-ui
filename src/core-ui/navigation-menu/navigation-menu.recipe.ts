import { defineSlotRecipe } from "@pandacss/dev"

/**
 * NavigationMenu slot recipe — top nav(dropdown つきヘッダー nav)。
 *
 * grammar 上の位置:既存の Menu(action 群、trigger ボタンから)/ Tabs(panel 切替)/ Link(prose)
 * とは別の **「ヘッダー nav」専用** の overlay。Base UI のモデルは「**Viewport が共有 box で、Content が
 * その中身として swap**」── 開いた item ごとに中身が入れ替わり、Viewport は寸法を滑らかに animate する。
 *
 * 視覚言語:Viewport = popover/select と同じ raised panel(surface.raised + lift)。Trigger は
 * 下線なしの nav リンク(fg.muted → hover/open で accent)、Link は item 内の grid 行。色を撒かず、
 * accent は interaction/open 時だけ。
 *
 * motion:
 *   - Viewport 出現 = opacity quick(fade のみ。scale や slide は使わない=共有 box の質量感に合わせる)。
 *   - Viewport の width/height は medium・expressive で滑らかに(item を別の幅の dropdown に切り替えても
 *     箱がスーッとリサイズする ── これが nav menu の見どころ)。
 *   - Content の swap(data-activation-direction)は方向ある opacity fade(初版は左右スライドなしの
 *     crossfade に留めて、Viewport のサイズ変化に焦点を当てる)。
 *
 * Slots: list(横並びの nav 行)/ item / trigger / icon(chevron)/ link(直リンク or content 内の grid 行)/
 *        viewport(共有 box)/ content(item ごとの中身)/ grid(content の grid container)。
 */
export const navigationMenuRecipe = defineSlotRecipe({
  className: "otibo-nav-menu",
  jsx: ["NavigationMenu"],
  slots: ["list", "item", "trigger", "icon", "link", "viewport", "content", "grid"],
  base: {
    list: {
      display: "flex",
      alignItems: "center",
      gap: "1",
      listStyle: "none",
      margin: "0",
      padding: "0",
      fontFamily: "body",
      fontSize: "sm",
    },
    item: {
      position: "relative",
    },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1",
      paddingInline: "3",
      paddingBlock: "2",
      appearance: "none",
      border: "none",
      bg: "transparent",
      color: "fg.muted",
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "tight",
      borderRadius: "sm",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { color: "fg.strong" },
      // open の trigger は accent(interaction 時だけ precious に出す)。
      "&[data-popup-open]": { color: "accent" },
      _focusVisible: { outline: "2px solid {colors.accent}", outlineOffset: "1px" },
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "currentColor",
      transitionProperty: "transform",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "[data-popup-open] &": { transform: "rotate(180deg)" },
    },
    viewport: {
      // 共有 box。中身(Content)が swap、寸法は Base UI が --positioner-width/height で供給。
      position: "relative",
      width: "var(--positioner-width)",
      height: "var(--positioner-height)",
      bg: "surface.raised",
      borderRadius: "md",
      boxShadow: "lift",
      overflow: "hidden",
      // 寸法の滑らかなリサイズ(item 切替で箱がスーッと変わる)。
      transitionProperty: "width, height",
      transitionDuration: "medium",
      transitionTimingFunction: "expressive",
      // 開閉の opacity(quick・fade のみ)。
      opacity: "1",
      "&[data-starting-style], &[data-ending-style]": { opacity: "0" },
      transitionDelay: "0ms",
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
        "&[data-starting-style], &[data-ending-style]": { opacity: "0" },
      },
    },
    content: {
      // Viewport 内の中身。**普通の block(absolute にしない)** ── そうしないと中身の実寸が Popup に
      // 伝わらず、Viewport が依存する `--positioner-width/height` が 0 に縮んで何も見えなくなる。
      // swap 時は crossfade(初版は slide なし=シンプルに)。
      padding: "3",
      transitionProperty: "opacity",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&[data-starting-style], &[data-ending-style]": { opacity: "0" },
    },
    grid: {
      // 各 item の content 内の grid(リンク列)。
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "1",
      minWidth: "20rem",
    },
    link: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5",
      paddingInline: "3",
      paddingBlock: "2",
      borderRadius: "xs",
      textDecoration: "none",
      color: "fg",
      outline: "none",
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { bg: "accent.subtle", color: "fg.strong" },
      _focusVisible: { outline: "2px solid {colors.accent}", outlineOffset: "-2px" },
    },
  },
})
