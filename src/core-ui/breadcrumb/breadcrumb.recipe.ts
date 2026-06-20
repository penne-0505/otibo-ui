import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Breadcrumb slot recipe — 階層内の現在地を示す navigation。
 *
 * grammar 上の位置:純構造(色を塗らず text と separator で語る in-grain)。separator は
 * 専用部品を増やさず CSS `::before` で自動挿入(`/`、fg.subtle)。crumb リンクは nav なので
 * **下線なし**(Link の prose 下線とは別 ── breadcrumb で全項目に下線は noisy)で fg.muted、
 * hover/focus で accent(interaction 時だけ precious)。最終 = current(fg.strong, aria-current)。
 *
 * Slots: root(ol)/ item(li、separator を ::before で持つ)/ link(中間の crumb)/ current(現在地)。
 */
export const breadcrumbRecipe = defineSlotRecipe({
  className: "otibo-breadcrumb",
  jsx: ["Breadcrumb"],
  slots: ["root", "item", "link", "current"],
  base: {
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      listStyle: "none",
      margin: "0",
      padding: "0",
      fontFamily: "body",
      fontSize: "sm",
      lineHeight: "tight",
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
      // 2 番目以降の前に separator を CSS で挿す(separator 部品を増やさない)。
      "&:not(:first-of-type)::before": {
        content: '"/"',
        color: "fg.subtle",
        marginInline: "2",
        userSelect: "none",
      },
    },
    link: {
      color: "fg.muted",
      textDecoration: "none",
      borderRadius: "xs",
      cursor: "pointer",
      transitionProperty: "color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: { color: "accent" },
      _focusVisible: {
        color: "accent",
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
      },
    },
    current: {
      color: "fg.strong",
      fontWeight: "medium",
    },
  },
})
