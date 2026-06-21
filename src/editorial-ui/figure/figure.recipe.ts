import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Figure slot recipe ─ 図版を「貼った紙片」として展示する額装。
 *
 * 構造:
 *   <Figure>
 *     <Figure.Frame>  ← 額。背景・影・border-radius を持つ
 *       (image / video / iframe / その他 visual content)
 *     </Figure.Frame>
 *     <Figure.Caption>  ← 額の下の caption(plate)
 *       <Figure.Number /> Fig 03
 *       本文
 *     </Figure.Caption>
 *   </Figure>
 *
 * 影は preset の lift を踏襲(画面全体の光源と一致)。frame は中身を bleed して
 * border-radius を保つ ─ 中身に rounded を持たせない設計。
 *
 * tone:
 *   paper = 白い surface(default)。screenshot / UI mockup 用。
 *   sunken = warm.200。暗めの図(dark-mode preview 等)を浮かせる時。
 */
export const figureRecipe = defineSlotRecipe({
  className: "otibo-figure",
  slots: ["root", "frame", "caption", "number"],
  jsx: ["Figure"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "4",
      margin: "0",
    },
    frame: {
      position: "relative",
      width: "full",
      overflow: "hidden",
      borderRadius: "lg",
      bg: "surface",
      boxShadow: "lift",
      // 中身の img/video が直接 frame の corner に来る ─ 二重 radius を避ける。
      "& > img, & > video, & > iframe, & > picture, & > picture > img": {
        display: "block",
        width: "full",
        height: "auto",
      },
    },
    caption: {
      display: "flex",
      alignItems: "baseline",
      gap: "3",
      fontFamily: "body",
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
      maxWidth: "prose",
    },
    number: {
      fontFamily: "mono",
      fontSize: "xs",
      letterSpacing: "wide",
      color: "fg.subtle",
      fontVariantNumeric: "tabular-nums",
      flexShrink: "0",
    },
  },
  variants: {
    tone: {
      paper: { frame: { bg: "surface" } },
      sunken: { frame: { bg: "bg.sunken" } },
      transparent: { frame: { bg: "transparent", boxShadow: "none" } },
    },
    aspect: {
      auto: {},
      square: { frame: { aspectRatio: "1 / 1" } },
      video: { frame: { aspectRatio: "16 / 9" } },
      portrait: { frame: { aspectRatio: "3 / 4" } },
      // wide は editorial 横長 ─ pull-quote の隣に置く図版で使う。
      wide: { frame: { aspectRatio: "21 / 9" } },
    },
  },
  defaultVariants: {
    tone: "paper",
    aspect: "auto",
  },
})
