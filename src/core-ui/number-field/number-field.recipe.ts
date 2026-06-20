import { defineSlotRecipe } from "@pandacss/dev"

/**
 * NumberField slot recipe — stepper つき数値入力。
 *
 * grammar 上の位置:Input のフィールド言語を踏襲(group = 白い受け皿 + field inset shadow、
 * focus-within で field.focus)。中身は `[−] 値 [＋]` の横並び。値は tabular-nums で中央。
 * stepper は ghost(fg.muted → hover surface.muted)。色は使わない in-grain。
 *
 * Slots: group(受け皿)/ input(中央の値)/ button(±、inc/dec 共通)。
 */
export const numberFieldRecipe = defineSlotRecipe({
  className: "otibo-number-field",
  jsx: ["NumberField"],
  slots: ["group", "input", "button"],
  base: {
    group: {
      display: "flex",
      alignItems: "stretch",
      width: "100%",
      bg: "surface",
      borderRadius: "sm",
      boxShadow: "field",
      // button の hover 塗りを角丸で clip。
      overflow: "hidden",
      transitionProperty: "box-shadow, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&:hover": { boxShadow: "field.hover" },
      "&:focus-within": { boxShadow: "field.focus" },
      "&:has(input:disabled)": { cursor: "not-allowed", opacity: "disabled" },
    },
    input: {
      flex: "1",
      minWidth: "0",
      width: "100%",
      border: "none",
      bg: "transparent",
      outline: "none",
      textAlign: "center",
      paddingBlock: "2",
      paddingInline: "2",
      fontFamily: "body",
      fontSize: "md",
      lineHeight: "tight",
      fontVariantNumeric: "tabular-nums",
      color: "fg",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      paddingInline: "3",
      appearance: "none",
      border: "none",
      bg: "transparent",
      color: "fg.muted",
      cursor: "pointer",
      userSelect: "none",
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { bg: "surface.muted", color: "fg.strong" },
      // 受け皿が overflow:hidden なので focus ring は内側に出す。
      _focusVisible: { outline: "2px solid {colors.accent}", outlineOffset: "-2px" },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
        _hover: { bg: "transparent", color: "fg.muted" },
      },
    },
  },
})
