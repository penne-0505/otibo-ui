import { defineSlotRecipe } from "@pandacss/dev"

/**
 * SegmentedControl slot recipe — 単一選択の compact toggle。
 *
 * grammar 上の位置:radio/select と同じ「一つ選ぶ」だが、選択肢が少なく即時に切替える
 * 設定向け。Base UI Tabs を primitive に使い(Tabs.Indicator が active 位置を自動追従)、
 * 「凹んだ溝に白い pill が滑る」表現にする。
 *
 * motion(答え合わせ中):pill(indicator)が active 位置へ滑る。ラベル色(active=fg.strong /
 * inactive=fg.muted)は **まず instant**(素朴版)で置き、「色が pill を追い越して先走るか」を
 * 実機で確認する ── motion-grammar の予言「可動部が色域を横断する系(segmented control)は
 * switch の trick(色を連れ添わせる)が要る」の検証。先走るなら item の color を pill と同尺で
 * transition して連れ添わせる。
 *
 * Slots: root / list(凹んだ track)/ indicator(滑る pill)/ item(各セグメント)。
 */
export const segmentedControlRecipe = defineSlotRecipe({
  className: "otibo-segmented",
  jsx: ["SegmentedControl"],
  slots: ["root", "list", "indicator", "item"],
  base: {
    root: {
      display: "inline-block",
    },
    list: {
      position: "relative",
      // pill(zIndex 0)と item(zIndex 1)の z-index を list 内に閉じる。これが無いとルートの
      // stacking に漏れ、z-index を持たない portal popup(select/combobox 等)を突き抜ける。
      isolation: "isolate",
      display: "inline-flex",
      alignItems: "stretch",
      padding: "1",
      borderRadius: "md",
      bg: "surface.muted",
      // 溝として軽く凹ませる(slider track と同じ shadow.depth、薄め)。
      boxShadow: "inset 0 1px 1.5px color-mix(in oklch, {colors.shadow.depth} 6%, transparent)",
    },
    indicator: {
      // Base UI が供給する active tab の位置/サイズに pill を合わせ、left/width を transition
      // して滑らせる。
      position: "absolute",
      left: "var(--active-tab-left)",
      top: "var(--active-tab-top)",
      width: "var(--active-tab-width)",
      height: "var(--active-tab-height)",
      zIndex: "0", // ラベルの下
      bg: "surface.raised", // 凹んだ溝に浮く白い pill
      borderRadius: "sm",
      boxShadow: "0 1px 3px color-mix(in srgb, {colors.fg.strong} 10%, transparent)",
      transitionProperty: "left, width",
      transitionDuration: "medium",
      transitionTimingFunction: "expressive",
      "@media (prefers-reduced-motion: reduce)": { transitionProperty: "none" },
    },
    item: {
      position: "relative",
      zIndex: "1", // pill の上
      appearance: "none",
      border: "none",
      bg: "transparent",
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "normal",
      color: "fg.muted",
      cursor: "pointer",
      paddingInline: "3",
      paddingBlock: "1.5",
      borderRadius: "sm",
      whiteSpace: "nowrap",
      userSelect: "none",
      // native focus ring(OS アクセント色 ── 環境により緑等)を抑制。keyboard は _focusVisible で出す。
      outline: "none",
      // 色/bg は quiet な hover/選択 feedback(standard・quick)。answer-check 結果:選択色を
      // pill に連れ添わせる「switch trick」は不要だった ── pill が主たる選択 signal で label 色は
      // 脇役なので、instant でも色は先走って見えない(motion-grammar の予言は外れ、slider に続く例外)。
      transitionProperty: "color, background-color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      // hover の応答(response):背景は触らず、文字を最濃まで firm させるだけ(fg.muted → fg.strong)。
      // 選択字と同じ濃さに達するが、選択との差は pill 一枚に委ねる(層を増やさない=情報量を抑える)。
      // quiet register のまま既存の color・quick・standard に乗る。inactive のみ(選択は pill が示す)。
      "&:hover:not([aria-selected='true'])": {
        color: "fg.strong",
      },
      "&[aria-selected='true']": {
        color: "fg.strong",
      },
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "1px",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
  },
})
