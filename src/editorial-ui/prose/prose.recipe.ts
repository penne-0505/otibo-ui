import { defineRecipe } from "@pandacss/dev"

/**
 * Prose recipe ─ 本文段組の wrapper。
 *
 * 中身の `<p>` / `<h2-h4>` / `<ul>` / `<blockquote>` / `<code>` 等を、descendant selector で
 * editorial の声に揃える。MDX や生 markdown の本文をそのまま流し込んで使う想定。
 *
 * grain:
 *   regular = 一般長文(default)。本文 18px、leading 1.49、段間は 1 行ぶん。
 *   tight   = dense な技術文 / 仕様書面。leading は snug、段間を詰める。
 *
 * size:
 *   md = 本文 18px。default。
 *   lg = 20px。読書面(blog / about)で「画面を奪う」読みを作る時。
 *
 * 幅は持たない ─ Container or 親が決める(prose を 60ch に絞りたい場合は親で maxWidth="prose")。
 */
export const proseRecipe = defineRecipe({
  className: "otibo-prose",
  jsx: ["Prose"],
  base: {
    color: "fg",
    fontFamily: "body",
    "& > * + *": {
      marginTop: "5", // 段間 = 20px。tight variant で詰める。
    },
    "& h2, & h3, & h4": {
      color: "fg.strong",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "tight",
      // heading 直前は気持ち多めに空ける(章境のリズム)
      marginTop: "12",
      marginBottom: "0",
    },
    "& h2": { fontSize: "2xl" }, // 36px
    "& h3": { fontSize: "xl" }, // 28px
    "& h4": { fontSize: "lg" }, // 24px
    "& p": {
      margin: "0",
    },
    "& a": {
      color: "accent",
      textUnderlineOffset: "0.2em",
      textDecorationThickness: "1px",
      transitionProperty: "color, text-decoration-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "&:hover": { color: "accent.hover" },
    },
    "& strong": { fontWeight: "semibold", color: "fg.strong" },
    "& em": { fontStyle: "italic", color: "fg.strong" },
    "& code": {
      fontFamily: "mono",
      fontSize: "0.9em",
      bg: "surface.muted",
      paddingInline: "1.5",
      paddingBlock: "0.5",
      borderRadius: "xs",
    },
    "& ul, & ol": {
      paddingLeft: "5",
      "& > * + *": { marginTop: "2" },
    },
    "& ul": { listStyleType: "disc" },
    "& ol": { listStyleType: "decimal" },
    "& blockquote": {
      paddingLeft: "5",
      borderLeft: "2px solid",
      borderColor: "border.strong",
      color: "fg.secondary",
      fontStyle: "italic",
    },
    "& hr": {
      border: "none",
      bg: "border",
      height: "1px",
      marginBlock: "10",
    },
  },
  variants: {
    size: {
      md: { fontSize: "md", lineHeight: "body" }, // 18px
      lg: { fontSize: "1.25rem", lineHeight: "body" }, // 20px
    },
    grain: {
      regular: {},
      tight: {
        lineHeight: "snug",
        "& > * + *": { marginTop: "3" },
      },
    },
  },
  defaultVariants: {
    size: "md",
    grain: "regular",
  },
})
