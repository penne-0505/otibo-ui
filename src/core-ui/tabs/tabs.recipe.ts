import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Tabs slot recipe.
 *
 * grammar 上の位置:section 切替の nav。active タブを accent の下線で示す
 * (滑る indicator は使わず、静的な下線=otibo の簡素志向)。active 状態は
 * Base UI が付与する `aria-selected="true"` で判定する。
 *
 * Slots:
 *   - root: Tabs.Root
 *   - list: Tabs.List(下端に hairline、tab はこの線に乗る)
 *   - tab: Tabs.Tab(text + 下線。inactive は透明下線で高さ予約)
 *   - panel: Tabs.Panel(中身)
 */
export const tabsRecipe = defineSlotRecipe({
  className: "otibo-tabs",
  jsx: ["Tabs"],
  slots: ["root", "list", "tab", "panel"],
  base: {
    root: {
      display: "block",
      width: "100%",
    },
    list: {
      display: "flex",
      gap: "5",
      position: "relative",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "border.subtle",
    },
    tab: {
      appearance: "none",
      bg: "transparent",
      border: "none",
      fontFamily: "body",
      fontSize: "base",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "normal",
      color: "fg.secondary",
      cursor: "pointer",
      paddingBlock: "2",
      paddingInline: "0",
      // 下線は 2px。inactive は透明で高さ予約、list の 1px 線に乗せるため -1px。
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: "transparent",
      marginBottom: "-1px",
      transitionProperty: "color, border-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&:hover": {
        color: "fg.strong",
      },
      "&[aria-selected='true']": {
        color: "fg.strong",
        borderBottomColor: "accent",
      },
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
        borderRadius: "xs",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    panel: {
      paddingBlock: "4",
      color: "fg",
      fontSize: "md",
      lineHeight: "body",
      // crossfade:切替で新パネルが mount される(keepMounted=false)たびに fade-in。
      // slide はしない=内容は替わっただけで「移動」の嘘をつかない。decelerate で現れる。
      animationName: "fadeIn",
      // tier=snap(90ms):navigate した content は gate しない。light(120)でも「読みに
      // 行ったのにまだ読めない」阻害が出たため、最軽の snap 枠に置く。
      animationDuration: "snap",
      animationTimingFunction: "expressive",
      animationFillMode: "both",
      "@media (prefers-reduced-motion: reduce)": {
        animationName: "none",
      },
    },
  },
})
