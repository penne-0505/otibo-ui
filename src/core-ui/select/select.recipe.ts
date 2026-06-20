import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Select slot recipe.
 *
 * grammar 上の位置:値を一つ選ぶ listbox。trigger は input と同じ「受け皿」
 * 表現(surface + field inset shadow)で form control 列に馴染ませ、popup は
 * popover と同じ raised panel。a11y / positioning / keyboard は Base UI Select。
 *
 * 単一 accent の運用:
 *   - active(data-highlighted、キーボード/ポインタの居場所)に accent.subtle を
 *     乗せる ── フォーカスの手がかりは最も強くする。
 *   - selected(data-selected、現在値)は check indicator(accent)+ fg.strong で
 *     示す ── 永続的だが静かなマーク。
 *
 * Slots:
 *   - trigger: 閉じた状態のコントロール(Value + Icon を内包)
 *   - icon: 右端の chevron(open で反転)
 *   - popup: 浮く listbox 本体
 *   - item: 各行
 *   - itemIndicator: selected 行の check
 */
export const selectRecipe = defineSlotRecipe({
  className: "otibo-select",
  jsx: ["Select"],
  slots: ["trigger", "icon", "popup", "item", "itemIndicator"],
  base: {
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2",
      width: "100%",
      paddingInline: "4",
      paddingBlock: "2",
      fontFamily: "body",
      fontSize: "md",
      fontWeight: "regular",
      lineHeight: "tight",
      letterSpacing: "normal",
      textAlign: "start",
      color: "fg",
      // input と同じ「白い受け皿が暗いページに沈む」構図。凹みは field inset shadow。
      bg: "surface",
      border: "none",
      borderRadius: "sm",
      outline: "none",
      cursor: "pointer",
      boxShadow: "field",
      transitionProperty: "box-shadow, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // 未選択時(placeholder 表示)は文字を沈める。
      "&[data-placeholder]": {
        color: "fg.subtle",
      },
      // hover ── input と同じく inset を弱めて浮き上がる feedback(open / focus 未満)。
      "&:not([data-popup-open]):hover": {
        boxShadow: "field.hover",
      },
      _focusVisible: {
        boxShadow: "field.focus",
      },
      // open 中も focus 相当の affordance を出す。
      "&[data-popup-open]": {
        boxShadow: "field.focus",
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      color: "fg.muted",
      transitionProperty: "transform",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&[data-popup-open]": {
        transform: "rotate(180deg)",
      },
    },
    popup: {
      // popover と同じ raised panel。listbox なので padding は小さく。
      minWidth: "var(--anchor-width)",
      // --available-height は viewport の空き(flip 時に巨大化しうる)。ほどよい dropdown 高さに cap。
      maxHeight: "min(var(--available-height), 18rem)",
      overflowY: "auto",
      padding: "1",
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      borderRadius: "md",
      boxShadow: "lift",
      outline: "none",
      // overlay enter/exit(popover と同じ文法)。trigger 起点で scale+fade。
      transformOrigin: "var(--transform-origin)",
      opacity: "1",
      transform: "scale(1)",
      // 段階的 motion(select は「即・選ぶ」content なので opacity を gate しない):
      // opacity は完全即時(0s)で全部出し、scale だけを feedback として medium(240)で
      // trigger 起点に settle。「もう在る、今ちょうど trigger から開きつつある」。
      // exit は閉じをきれいに見せるため quick の fade+scale を残す(ending-style)。
      transition: "opacity 0s, transform var(--durations-medium) var(--easings-expressive)",
      "&[data-starting-style]": { opacity: "0", transform: "scale(0.96)" },
      "&[data-ending-style]": {
        opacity: "0",
        transform: "scale(0.96)",
        transition:
          "opacity var(--durations-quick) var(--easings-standard), transform var(--durations-quick) var(--easings-standard)",
      },
      // reduced-motion:通常が既に opacity 即時なので、travel(scale)を抜けば全て即時。
      "@media (prefers-reduced-motion: reduce)": {
        transform: "none",
        transition: "none",
        "&[data-starting-style], &[data-ending-style]": { transform: "none" },
      },
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "3",
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
      // active(キーボード/ポインタの居場所)── 最も強い手がかり。
      "&[data-highlighted]": {
        bg: "accent.subtle",
        color: "fg.strong",
      },
      // selected(現在値)── 文字を締める。塗りではなく check で示す。
      "&[data-selected]": {
        color: "fg.strong",
        fontWeight: "medium",
      },
    },
    itemIndicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      color: "accent",
    },
  },
})
