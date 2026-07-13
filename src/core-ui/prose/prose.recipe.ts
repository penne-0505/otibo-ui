import { defineRecipe } from "@pandacss/dev"

/**
 * Prose — 読み面。measure と段落リズムを持ち、子の声は textStyles 梯子に寄せる。
 *
 * reading:
 *   ui      — app / portfolio 本文（md 18px）
 *   article — 長文リファレンス（base 16px + normal leading）
 *
 * HTML 見出しレベルは消費側。ここは見た目の role だけを CSS で当てる。
 */
export const proseRecipe = defineRecipe({
  className: "otibo-prose",
  jsx: ["Prose"],
  base: {
    maxWidth: "prose",
    width: "100%",
    color: "fg.secondary",
    fontFamily: "body",
    "& > * + *": {
      marginBlockStart: "4",
    },
    "& > h1, & > h2, & > h3, & > h4": {
      color: "fg.strong",
      fontWeight: "semibold",
      letterSpacing: "tight",
      lineHeight: "tight",
      marginBlockStart: "8",
      marginBlockEnd: "3",
    },
    "& > h1": { textStyle: "heading.lg" },
    "& > h2": { textStyle: "heading.md" },
    "& > h3": { textStyle: "heading.sm" },
    "& > h4": { textStyle: "eyebrow" },
    "& > p": {
      textStyle: "body",
      marginBlock: "0",
    },
    "& > ul, & > ol": {
      paddingInlineStart: "5",
      display: "flex",
      flexDirection: "column",
      gap: "2",
    },
    "& > ul": {
      listStyleType: "disc",
    },
    "& > ol": {
      listStyleType: "decimal",
    },
    "& > ul > li, & > ol > li": {
      textStyle: "body",
    },
    "& > blockquote": {
      marginInline: "0",
      paddingInlineStart: "4",
      borderInlineStartWidth: "2px",
      borderInlineStartStyle: "solid",
      borderInlineStartColor: "border.subtle",
      color: "fg.muted",
    },
    "& > figcaption, & > .caption": {
      textStyle: "caption",
    },
    "& a": {
      color: "fg",
      textUnderlineOffset: "0.18em",
    },
  },
  variants: {
    reading: {
      ui: {
        fontSize: "md",
        lineHeight: "body",
        "& > p, & > ul > li, & > ol > li": {
          fontSize: "md",
          lineHeight: "body",
        },
      },
      article: {
        fontSize: "base",
        lineHeight: "normal",
        color: "fg",
        "& > p, & > ul > li, & > ol > li": {
          fontSize: "base",
          lineHeight: "normal",
          color: "fg",
        },
      },
    },
  },
  defaultVariants: {
    reading: "ui",
  },
})
