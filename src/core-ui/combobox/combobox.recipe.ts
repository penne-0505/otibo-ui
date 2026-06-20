import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Combobox slot recipe — 検索で絞り込める select(Select の上位互換)。
 *
 * grammar 上の位置:Select と視覚言語を共有する ── control は input/field と同じ「白い受け皿 +
 * field inset shadow」、popup は popover/select と同じ raised panel + 同じ出現 motion(list 型なので
 * opacity 即時 + scale medium、§Overlay Appearance)。active(data-highlighted)= accent.subtle、
 * selected(data-selected)= check + fg.strong。Select との差は control が text 入力で、Root が
 * 入力でリストを filter すること。
 *
 * Slots: control(受け皿)/ input(検索テキスト)/ icon(chevron)/ popup / list / item /
 *        itemIndicator(check)/ empty(該当なし)。
 */
export const comboboxRecipe = defineSlotRecipe({
  className: "otibo-combobox",
  jsx: ["Combobox"],
  slots: [
    "control",
    "searchIcon",
    "input",
    "icon",
    "popup",
    "list",
    "item",
    "itemIndicator",
    "empty",
  ],
  base: {
    // 受け皿は relative な箱。中の input を全幅にし、アイコンは absolute で重ねる。これで Base UI が
    // 基準にする input = フィールド全体になり、popup の横幅・出現位置が Select と揃う。
    control: {
      position: "relative",
      width: "100%",
      bg: "surface",
      borderRadius: "sm",
      boxShadow: "field",
      cursor: "text",
      transitionProperty: "box-shadow, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&:hover": { boxShadow: "field.hover" },
      // 入力中(=popup open 相当)は focus affordance。
      "&:focus-within": { boxShadow: "field.focus" },
      "&:has(input:disabled)": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    input: {
      // 全幅。アイコン分はパディングで空ける。高さは padding + 文字の自然高(floor は持たない=
      // select 等と揃えて sizes 定義で背が変わらないように)。
      width: "full",
      border: "none",
      bg: "transparent",
      outline: "none",
      paddingBlock: "2",
      paddingInlineStart: "10",
      paddingInlineEnd: "2.25rem",
      fontFamily: "body",
      fontSize: "md",
      lineHeight: "tight",
      color: "fg",
      "&::placeholder": { color: "fg.subtle" },
    },
    // 先頭の検索アイコン(常時表示=値があっても「打って探せる」を示す。Select との見た目の差にもなる)。
    searchIcon: {
      position: "absolute",
      insetInlineStart: "0.875rem",
      top: "50%",
      transform: "translateY(-50%)",
      display: "inline-flex",
      alignItems: "center",
      color: "fg.muted",
      pointerEvents: "none",
    },
    icon: {
      position: "absolute",
      // Select(trigger paddingInline 4 = 1rem で右端から 1rem)に揃える。
      insetInlineEnd: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      // Trigger は button なので既定 padding/border/appearance をリセット(位置を Select と一致させる)。
      appearance: "none",
      border: "none",
      padding: "0",
      bg: "transparent",
      color: "fg.muted",
      cursor: "pointer",
      transitionProperty: "transform",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // Trigger が open で data-popup-open を持てば回転(無ければ静止のまま=無害)。
      "&[data-popup-open]": { transform: "translateY(-50%) rotate(180deg)" },
    },
    popup: {
      minWidth: "var(--anchor-width)",
      // --available-height は viewport の空き(flip 時に上側の広い空きを返すと巨大化)。ほどよい
      // dropdown 高さに cap して中で scroll させる。
      maxHeight: "min(var(--available-height), 18rem)",
      overflowY: "auto",
      padding: "1",
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      borderRadius: "md",
      boxShadow: "lift",
      outline: "none",
      // select と同じ出現 motion(list 型 → opacity 即時 + scale medium、exit quick)。
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
    list: {
      display: "flex",
      flexDirection: "column",
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
      "&[data-highlighted]": {
        bg: "accent.subtle",
        color: "fg.strong",
      },
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
    empty: {
      paddingInline: "3",
      paddingBlock: "3",
      fontSize: "sm",
      color: "fg.muted",
    },
  },
})
