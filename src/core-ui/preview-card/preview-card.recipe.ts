import { defineSlotRecipe } from "@pandacss/dev"

/**
 * PreviewCard slot recipe — hover で開く軽量プレビュー(リンク先の媒体 + メタ)。
 *
 * grammar 上の位置:Popover の hover 版。tooltip(単一行 hint)/ popover(click で開く補足)とは
 * 別の「**読み手の興味を促進する preview**」── リンクにカーソルを乗せると先の絵と要約が浮く。
 * portfolio や記事索引で「行きたいか確かめさせる」のに効く。Popover と同じ raised panel + lift。
 * 焦点的なテキストブロックなので opacity-only(scale-on-text snap 回避、popover/tooltip と同じ判断)。
 *
 * Slots: popup / media(cover image, aspectRatio で比率固定)/ body(title+description)/ title /
 *        description / footer(meta 行)。
 */
export const previewCardRecipe = defineSlotRecipe({
  className: "otibo-preview-card",
  jsx: ["PreviewCard"],
  slots: ["trigger", "popup", "media", "body", "title", "description", "footer"],
  base: {
    // Trigger に与える hover response(「hover で何か起こる」を予見させる principle)。Link の
    // treatment B と同じ文法 ── 平常は fg・下線なし、hover/focus で text と下線が同時に accent。
    // 下線の出現が「ここに何か潜んでいる」を予告する。
    trigger: {
      color: "fg",
      textDecoration: "none",
      textUnderlineOffset: "0.18em",
      textDecorationThickness: "1px",
      cursor: "pointer",
      transitionProperty: "color, text-decoration-color, text-decoration-line",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: {
        color: "accent",
        textDecoration: "underline",
        textDecorationColor: "{colors.accent}",
      },
      _focusVisible: {
        color: "accent",
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
        borderRadius: "xs",
      },
    },
    popup: {
      width: "20rem",
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      borderRadius: "lg",
      boxShadow: "lift",
      overflow: "hidden",
      outline: "none",
      // 焦点ブロック = opacity フェードのみ(tooltip/popover と同じ)。snap(90)で「スッと出る」。
      opacity: "1",
      transition: "opacity var(--durations-snap) var(--easings-decelerate)",
      "&[data-starting-style]": { opacity: "0" },
      "&[data-ending-style]": {
        opacity: "0",
        transition: "opacity var(--durations-snap) var(--easings-standard)",
      },
    },
    media: {
      width: "100%",
      aspectRatio: "16 / 10",
      objectFit: "cover",
      display: "block",
      // 画像が背景タイル(surface.muted)で待機 → 画像 load 完了で自然に現れる。
      bg: "surface.muted",
    },
    body: {
      padding: "4",
      display: "flex",
      flexDirection: "column",
      gap: "1",
    },
    title: {
      fontSize: "base",
      fontWeight: "semibold",
      lineHeight: "tight",
      color: "fg.strong",
    },
    description: {
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
    },
    footer: {
      paddingInline: "4",
      paddingBottom: "4",
      marginTop: "2",
      display: "flex",
      alignItems: "center",
      gap: "2",
      fontSize: "xs",
      color: "fg.subtle",
    },
  },
})
