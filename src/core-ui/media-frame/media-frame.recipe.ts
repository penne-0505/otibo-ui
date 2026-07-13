import { defineSlotRecipe } from "@pandacss/dev"

/**
 * MediaFrame — 図版・サムネ等の枠。
 *
 * empty slot は「メディアが無い」表示（Skeleton=来る前、とは別）。
 * image は Avatar と同じ load fade 処方（medium / decelerate / 40ms / backwards）。
 *
 * Slots: root / image / empty。
 */
export const mediaFrameRecipe = defineSlotRecipe({
  className: "otibo-media-frame",
  jsx: ["MediaFrame"],
  slots: ["root", "image", "empty"],
  base: {
    root: {
      position: "relative",
      display: "block",
      width: "100%",
      overflow: "hidden",
      borderRadius: "lg",
      bg: "surface.muted",
      color: "fg.muted",
    },
    image: {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      animationName: "fadeIn",
      animationDuration: "medium",
      animationTimingFunction: "decelerate",
      animationDelay: "40ms",
      animationFillMode: "backwards",
      "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
    },
    empty: {
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "2",
      padding: "4",
      textAlign: "center",
      textStyle: "caption",
      color: "fg.muted",
      bg: "surface.muted",
      userSelect: "none",
    },
  },
  variants: {
    aspect: {
      auto: {
        root: { aspectRatio: "auto", minHeight: "12" },
        image: { position: "relative", inset: "auto", height: "auto" },
      },
      square: {
        root: { aspectRatio: "1 / 1" },
      },
      photo: {
        root: { aspectRatio: "4 / 3" },
      },
      video: {
        root: { aspectRatio: "16 / 9" },
      },
      wide: {
        root: { aspectRatio: "21 / 9" },
      },
    },
    fit: {
      cover: {
        image: { objectFit: "cover" },
      },
      contain: {
        image: { objectFit: "contain" },
      },
    },
  },
  defaultVariants: {
    aspect: "video",
    fit: "cover",
  },
})
