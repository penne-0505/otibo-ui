import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Radio slot recipe.
 *
 * grammar 上の位置:
 *   - 排他選択(複数から一つ)。checked = 単一 accent。
 *   - 円環 + 内側の dot。checked で ring が accent、dot(accent)が現れる。
 *   - native の見た目に依存せず custom 描画。
 *
 * Slots:
 *   - root: 円(Base UI Radio.Root、role=radio)
 *   - indicator: 内側の dot(Base UI Radio.Indicator、checked 時に出る)
 */
export const radioRecipe = defineSlotRecipe({
  className: "otibo-radio",
  slots: ["root", "indicator"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      // 偶数 px の箱(中心が整数 px に乗り、dot のサブピクセルずれを防ぐ)。
      // 18px root だと 1.25rem=22.5px の半端ピクセルになり dot が右上に寄って見えるため px 固定。
      // sizes スケール不在で数値 token は px 化する件は別途 TODO。
      width: "22px",
      height: "22px",
      borderRadius: "full",
      bg: "surface",
      boxShadow: "inset 0 0 0 1.5px {colors.border.strong}",
      cursor: "pointer",
      // 段階的 motion の「応答」channel:ring の accent 化は瞬時(0ms)。
      // 「効いた」を即返し、dot の bloom(feedback)に時間を稼がせる(checkbox の箱と同型)。
      transitionProperty: "background-color, box-shadow",
      transitionDuration: "0ms",
      transitionTimingFunction: "standard",
      "&[data-checked]": {
        boxShadow: "inset 0 0 0 1.5px {colors.accent}",
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
    indicator: {
      display: "block",
      // 偶数 px。箱 22px 内で (22-8)/2=7px → 中心が整数に乗りクリスプに中央化する。
      width: "8px",
      height: "8px",
      borderRadius: "full",
      bg: "accent",
      // dot を「咲かせる」。直接操作なので checkbox と同じ非対称:
      //   選択(到着)= 署名カーブ expressive で base かけて scale 0→1。
      //   解除(離脱)= accelerate の速い払い(別 radio を選ぶと前の dot が素早く萎む)。
      transform: "scale(0)",
      transformOrigin: "center",
      transitionProperty: "transform",
      transitionDuration: "90ms",
      transitionTimingFunction: "accelerate",
      "&[data-checked]": {
        transform: "scale(1)",
        transitionDuration: "medium", // tier=medium(240)+ expressive register
        transitionTimingFunction: "expressive",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },
})
