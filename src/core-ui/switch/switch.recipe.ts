import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Switch slot recipe — オン = 単一 accent、thumb が滑る。
 *
 * Slots: root(track / Base UI Switch.Root)、thumb(Base UI Switch.Thumb)。
 *
 * 注意:slotRecipes の key を `switch`(JS 予約語=生成関数名に使えない)にできないため、
 * Panda の「JSX 名 = recipe の jsxName」一致による usage 検出が効かない。`jsx: ["Switch"]` を
 * 明示して `<Switch>` の使用で CSS が emit されるようにする(これが無いと CSS が生成されない)。
 */
export const switchRecipe = defineSlotRecipe({
  className: "otibo-switch",
  jsx: ["Switch"],
  slots: ["root", "thumb"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      // 整数 px の geometry(18px root だと rem は半端ピクセルになり thumb が上下にずれて
      // 見えるため px 固定)。track 40×24 / padding 4 → 内寸 32×16、thumb 16 が縦に gap 4px
      // (整数)で中央化、横は off で左 4px・on で右 4px の整数対称。sizes 不在の件は別途 TODO。
      width: "40px",
      height: "24px",
      padding: "4px",
      borderRadius: "full",
      // 枠線(inset ring)は持たず、track の塗りだけで off/on を読ませる。
      // off = surface.muted の面、on = accent の面。輪郭線は引かない。
      bg: "surface.muted",
      cursor: "pointer",
      // 段階的 motion の例外:switch は track 上を thumb が横断するため、track と thumb が
      // 同じ「状態」を二重に語る。色を瞬時にすると色が thumb(物理)を追い越して先走り、
      // 「色が着いてから thumb が追いつく」二分された動きに見える。そこで track の accent 化を
      // 80ms だけ animate し、thumb の glide に連れ添わせて一つの協調動作にする。
      // (checkbox/radio は可動部が色域を横断しないので瞬時で破綻しない。)
      transitionProperty: "background-color, box-shadow",
      transitionDuration: "80ms",
      transitionTimingFunction: "standard",
      "&[data-checked]": {
        bg: "accent",
      },
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    thumb: {
      display: "block",
      width: "16px",
      height: "16px",
      borderRadius: "full",
      bg: "surface",
      // thumb の接地影(contact)。elevation 階層ではなく「track に乗っている」表現なので
      // lift token(overlay 用)とは別に、ここに 1 段だけ inline で持つ。
      boxShadow: "0 1px 2px color-mix(in oklch, {colors.fg.strong} 8%, transparent)",
      // 直接操作の非対称(checkbox/radio と同じ家系):
      //   OFF(離脱)= accelerate の速い retract。ON は data-checked で上書き。
      transitionProperty: "transform",
      transitionDuration: "quick",
      transitionTimingFunction: "accelerate",
      // 内寸 32px − thumb 16px = 16px 移動(整数)
      "&[data-checked]": {
        transform: "translateX(16px)",
        // ON(到着)= 署名カーブ expressive で glide して着地。tier=medium(240)。
        transitionDuration: "medium",
        transitionTimingFunction: "expressive",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },
})
