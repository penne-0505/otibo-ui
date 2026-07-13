import { defineTextStyles } from "@pandacss/dev"

/**
 * Typography roles — named textStyles（正本）。
 *
 * React の `<Text>` は置かない。見た目の role と HTML 見出しレベルは分離する。
 * 消費側は `css({ textStyle: "heading.md" })` 等で載せ、要素は `<h2>` / `<p>` 等を自分で選ぶ。
 *
 * ladder:
 *   display          editorial 上位（hero / overscale に近い塊）
 *   heading.sm|md|lg 見出し帯（md が Card title 相当）
 *   body             UI 本文（md / 18px）。長文面は Prose reading="article" 側で base に落とす
 *   eyebrow          小型 kicker（uppercase + wide tracking）
 *   caption          補助・注釈
 */
export const textStyles = defineTextStyles({
  display: {
    description: "Editorial display — hero / overscale に近い上位の塊",
    value: {
      fontFamily: "display",
      fontSize: "5xl",
      fontWeight: "semibold",
      lineHeight: "displaySnug",
      letterSpacing: "display",
      color: "fg.strong",
    },
  },
  heading: {
    DEFAULT: {
      value: {
        fontFamily: "body",
        fontSize: "xl",
        fontWeight: "semibold",
        lineHeight: "tight",
        letterSpacing: "tight",
        color: "fg.strong",
      },
    },
    sm: {
      value: {
        fontFamily: "body",
        fontSize: "lg",
        fontWeight: "semibold",
        lineHeight: "tight",
        letterSpacing: "tight",
        color: "fg.strong",
      },
    },
    md: {
      value: {
        fontFamily: "body",
        fontSize: "xl",
        fontWeight: "semibold",
        lineHeight: "tight",
        letterSpacing: "tight",
        color: "fg.strong",
      },
    },
    lg: {
      value: {
        fontFamily: "body",
        fontSize: "2xl",
        fontWeight: "semibold",
        lineHeight: "tight",
        letterSpacing: "tight",
        color: "fg.strong",
      },
    },
  },
  body: {
    description: "UI body（md / 18px）。長文は Prose article 面で調整",
    value: {
      fontFamily: "body",
      fontSize: "md",
      fontWeight: "regular",
      lineHeight: "body",
      letterSpacing: "normal",
      color: "fg.secondary",
    },
  },
  eyebrow: {
    description: "Kicker / label — 小型 caps 風",
    value: {
      fontFamily: "body",
      fontSize: "xs",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "eyebrow",
      textTransform: "uppercase",
      color: "fg.muted",
    },
  },
  caption: {
    description: "Caption / metadata / 注釈",
    value: {
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "regular",
      lineHeight: "snug",
      letterSpacing: "normal",
      color: "fg.muted",
    },
  },
})
