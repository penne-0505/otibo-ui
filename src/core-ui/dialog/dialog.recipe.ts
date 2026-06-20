import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Dialog slot recipe.
 *
 * grammar 上の位置:最上位の overlay。世界を一段暗く落とし(scrim)、その上に
 * paper を一枚浮かせて注意を集中させる modal。focus-trap / scroll-lock /
 * outside-dismiss は Base UI Dialog.Root(modal 既定)に委譲。
 * Popover との違いは「背景を奪う」こと ── trigger に紐づかず画面中央に固定。
 *
 * Slots:
 *   - backdrop: 背景を落とす scrim(fixed inset:0)
 *   - popup: 中央固定で浮く本体(surface.raised + lift.xl)
 *   - title: 見出し
 *   - description: 補足文
 */
export const dialogRecipe = defineSlotRecipe({
  className: "otibo-dialog",
  jsx: ["Dialog"],
  slots: ["backdrop", "popup", "title", "description"],
  base: {
    backdrop: {
      position: "fixed",
      inset: "0",
      zIndex: "50",
      // 暖色ダークの scrim。純黒ではなく fg.strong を薄く敷いて世界観に揃える。
      bg: "color-mix(in oklch, {colors.fg.strong} 21%, transparent)",
      // 段階的 motion の「応答」channel:scrim は quick で素早く dim =「modal が起動した」
      // を即返す。paper(popup)のせり上げ(feedback)に時間を稼がせる。exit も quick で決定化。
      opacity: "1",
      transitionProperty: "opacity",
      transitionDuration: "quick",
      transitionTimingFunction: "decelerate",
      "&[data-starting-style]": { opacity: "0" },
      "&[data-ending-style]": {
        opacity: "0",
        transitionTimingFunction: "standard",
      },
    },
    popup: {
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: "50",
      width: "calc(100% - 2rem)",
      maxWidth: "28rem",
      maxHeight: "calc(100dvh - 4rem)",
      overflowY: "auto",
      bg: "surface.raised",
      color: "fg",
      fontFamily: "body",
      fontSize: "base",
      lineHeight: "body",
      padding: "6",
      borderRadius: "lg",
      // 影は持たない。modal は scrim が分離を担うので drop shadow は redundant で、
      // 暗い scrim の上に暗い影を落とすと角丸の濃い halo(島)になって濁る。
      // 白カード対 scrim のコントラストで浮きは成立する。
      outline: "none",
      // tier=heavy:dialog は画面を奪う最重量。opacity は quick(light)で即「現れた」応答、
      // transform(センタリング維持の 8px せり上げ + scale)は heavy(320)でゆっくり立ち上がる
      // (feedback)。遅さが最も正当化される唯一の overlay。scrim(quick)と歩調を合わせる。
      opacity: "1",
      transform: "translate(-50%, -50%) scale(1)",
      transformOrigin: "center",
      transition:
        "opacity var(--durations-quick) var(--easings-decelerate), transform var(--durations-heavy) var(--easings-expressive)",
      "&[data-starting-style]": {
        opacity: "0",
        transform: "translate(-50%, calc(-50% + 8px)) scale(0.98)",
      },
      "&[data-ending-style]": {
        opacity: "0",
        transform: "translate(-50%, calc(-50% + 8px)) scale(0.98)",
        transition:
          "opacity var(--durations-quick) var(--easings-standard), transform var(--durations-quick) var(--easings-standard)",
      },
      // reduced-motion:せり上げ/scale を抜き、センタリングは維持して opacity だけ。
      "@media (prefers-reduced-motion: reduce)": {
        transform: "translate(-50%, -50%)",
        transition: "opacity var(--durations-quick) var(--easings-standard)",
        "&[data-starting-style], &[data-ending-style]": {
          transform: "translate(-50%, -50%)",
        },
      },
    },
    title: {
      fontSize: "lg",
      fontWeight: "semibold",
      lineHeight: "tight",
      color: "fg.strong",
      marginBottom: "2",
    },
    description: {
      fontSize: "sm",
      lineHeight: "snug",
      color: "fg.muted",
    },
  },
})
