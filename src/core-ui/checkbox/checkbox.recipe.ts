import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Checkbox slot recipe.
 *
 * grammar 上の位置:
 *   - native checkbox は border-radius が GNOME/GTK で効かない等の環境依存があるため、
 *     見た目は 100% custom 描画(Base UI Checkbox.Root を素の box として使う)。
 *   - checked は単一 accent を当てる(affordance の「オン」= accent)。box-tint shift。
 *   - 境界は inset box-shadow(Input と同系の「線ではなく面の縁」表現ではなく、ここは
 *     identity outline としての hairline)。unchecked = border.strong、checked = accent。
 *
 * Slots:
 *   - root: クリック可能な box(Base UI Checkbox.Root、role=checkbox)
 *   - indicator: check / dash glyph の容器(Base UI Checkbox.Indicator、checked 時に出る)
 */
export const checkboxRecipe = defineSlotRecipe({
  className: "otibo-checkbox",
  slots: ["root", "indicator"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      // 偶数 px の箱(18px root だと 1.25rem=22.5px の半端ピクセルになるため px 固定)。
      // sizes スケール不在で数値 token は px 化する件は別途 TODO。
      width: "22px",
      height: "22px",
      borderRadius: "xs",
      bg: "surface",
      color: "surface", // indicator(checkmark)の色 = 面の上の白
      boxShadow: "inset 0 0 0 1.5px {colors.border.strong}",
      cursor: "pointer",
      transitionProperty: "background-color, box-shadow",
      transitionDuration: "0ms", // 試し:箱の recolor アニメを外す(色は変わるが瞬時。stroke だけを動かす)
      transitionTimingFunction: "standard",
      // checked / indeterminate = accent(オン状態の affordance)
      "&[data-checked], &[data-indeterminate]": {
        bg: "accent",
        boxShadow: "inset 0 0 0 1.5px {colors.accent}",
      },
      // check は「描く」。pathLength 正規化済みなので offset 1→0 で一筆。
      // オン(到着)= 印を打って手応えを持って着地。直接操作に許す一匙の生命感。
      // カーブは署名 easing(expressive)。tier = heavy(320ms):checkbox の描画は
      // 「線を描く」最も濃い presence で、dialog と並ぶ heavy tier。
      "&[data-checked] svg path, &[data-indeterminate] svg path": {
        strokeDashoffset: "0",
        transitionDuration: "heavy",
        transitionTimingFunction: "expressive",
      },
      // 動きを望まない人には travel を抜く(状態は即時、描画演出だけ無効化)。
      "@media (prefers-reduced-motion: reduce)": {
        "& svg path": { transition: "none" },
      },
      // focus は outline(inset box-shadow の border と競合しないため)
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
      },
      // disabled は opacity 一括(grammar §Disabled As Quiet Surface)
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      color: "inherit",
      // 既定(オフ)= 線を引っ込めた状態。offset 1 = 完全に隠れる(dasharray 1 と対)。
      // オフへ戻るとき(去る)= 一払いでパッと消す。描画より明確に速く(quick)、accelerate。
      // 描く/消すの非対称:印を打つのは手応えを持って、消すのは速い払い。
      "& svg path": {
        strokeDasharray: "1",
        strokeDashoffset: "1",
        transitionProperty: "stroke-dashoffset",
        transitionDuration: "45ms", // 試し:消去をさらに速い払いに
        transitionTimingFunction: "accelerate",
      },
    },
  },
})
