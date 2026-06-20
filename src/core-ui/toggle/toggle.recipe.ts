import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Toggle / ToggleGroup slot recipe — 押し込みトグル(ツールバー型)。
 *
 * grammar 上の位置:on(data-pressed)は DS の「選択 / on」表現に統一 = **accent 塗り + 白**
 * (checkbox checked / switch on / pagination active と同系、白 on 色の blessed pattern)。off は
 * ghost(透明・fg.muted)、hover で surface.muted + fg.strong。ToggleGroup は separated な
 * 個別ボタンの flex 行(segmented の連結 pill とは別 ── こちらは toolbar の独立した四角ボタン)。
 *
 * **positioning(otibo 約束)**:Toggle = 一択(排他)/ 単体押し込み(表示切替・ツール選択・★お気に入り)。
 * **複数選択(フィルタ/タグ)は Chip の領分**。`multiple` prop は primitive として残す(整形ツールバー
 * = B/I/U を独立に重ねる、は Toggle の正当な非排他用途)が、otibo の標準では排他で使う。
 *
 * Slots: group(ToggleGroup の行)/ button(Toggle 本体、単体・group 内 共通)。
 */
export const toggleRecipe = defineSlotRecipe({
  className: "otibo-toggle",
  jsx: ["Toggle", "ToggleGroup"],
  slots: ["group", "button"],
  base: {
    group: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      minWidth: "2.25rem",
      paddingInline: "2",
      paddingBlock: "2",
      appearance: "none",
      border: "none",
      bg: "transparent",
      color: "fg.muted",
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "1",
      borderRadius: "sm",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { bg: "surface.muted", color: "fg.strong" },
      // on = accent 塗り + 白(白 on 色)。
      "&[data-pressed]": {
        bg: "accent",
        color: "surface",
        _hover: { bg: "accent.hover", color: "surface" },
      },
      _focusVisible: { outline: "2px solid {colors.accent}", outlineOffset: "1px" },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
        _hover: { bg: "transparent", color: "fg.muted" },
      },
    },
  },
})
