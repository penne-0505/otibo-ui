import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Chip / ChipGroup slot recipe — フィルタチップ(角丸ピルの toggle)。
 *
 * grammar 上の位置:Toggle と同じ「選択/非選択」の primitive(Base UI Toggle)だが、**用途と
 * 見た目が別** ── タグ/ファセットの絞り込み・入力 token 用の角丸ピル。off = 透明 + hairline +
 * fg、on(data-pressed)= **accent 塗り + 白**(白 on 色の blessed pattern、Toggle/pagination と同系)。
 * Badge(静的表示)との差:Chip は押せる。Toggle(四角の toolbar ボタン)との差:Chip は丸ピルで
 * フィルタ/タグ文脈。
 *
 * Slots: group(ChipGroup の行)/ chip(本体)。
 */
export const chipRecipe = defineSlotRecipe({
  className: "otibo-chip",
  jsx: ["Chip", "ChipGroup"],
  slots: ["group", "chip"],
  base: {
    group: {
      display: "inline-flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1.5",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1",
      flexShrink: "0",
      paddingInline: "3",
      paddingBlock: "1",
      appearance: "none",
      border: "none",
      // off は白い面 + ごく小さい影。warm.50 と白(surface.raised)の明度差(0.97→1.00)だけでは
      // 平らに沈むので、紙が乗っている物理感だけを伝える最小の影を足す。装飾の浮きではない。
      // tight blur + srgb で諧調を出さない([[shadow-banding-fix]])。
      bg: "surface.raised",
      boxShadow: "0 1px 1px color-mix(in srgb, {colors.fg.strong} 6%, transparent)",
      color: "fg.secondary",
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "tight",
      borderRadius: "full",
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
      outline: "none",
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // hover は地を一段沈めて feedback(影に頼らない明度差だけ)。
      _hover: { bg: "surface.muted", color: "fg.strong" },
      // on = accent 塗り + 白(影なし)。
      "&[data-pressed]": {
        bg: "accent",
        color: "surface",
        _hover: { bg: "accent.hover", color: "surface" },
      },
      _focusVisible: { outline: "2px solid {colors.accent}", outlineOffset: "1px" },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
        _hover: { bg: "transparent", color: "fg.secondary" },
      },
    },
  },
})
