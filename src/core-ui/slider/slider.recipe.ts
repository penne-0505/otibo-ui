import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Slider slot recipe — 連続値の直接操作 control。
 *
 * grammar 上の位置:checkbox / radio / switch と同じ直接操作 control の「連続値版」。
 *   - rail(track)= surface.muted の凹んだ軌道(switch の off track と同系)
 *   - 値の塗り(indicator)= accent(switch の on と同系)
 *   - つまみ(thumb)= surface の白い円 + 接地影(switch thumb と同じ contact shadow)
 *
 * motion(可動部が色域を横断する系):thumb が rail 上を動き、accent fill が追う。
 * ただし fill は thumb の位置で終わる=両者は構造的に連動しており、switch の「色が先走る」
 * 問題は起きない(switch は track 全体が即色変わりするが、slider の fill は thumb と同じ縁)。
 * よって連れ添わせる小細工は不要。keyboard step では thumb の inset-inline-start と
 * indicator の width を同尺で glide させ、ドラッグ中(data-dragging)は pointer 追従のため
 * transition を切る(transition があると thumb が pointer に遅れる)。
 *
 * Slots: root / value / control(操作領域)/ track(rail)/ indicator(fill)/ thumb。
 */
export const sliderRecipe = defineSlotRecipe({
  className: "otibo-slider",
  jsx: ["Slider"],
  slots: ["root", "value", "control", "track", "indicator", "thumb"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "2",
      width: "100%",
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    value: {
      fontSize: "sm",
      lineHeight: "tight",
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
    },
    control: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      // touch target(rail 6px に対し操作域は広く取る)。
      height: "20px",
      cursor: "pointer",
      "&[data-disabled]": { cursor: "not-allowed" },
    },
    track: {
      position: "relative",
      width: "100%",
      height: "6px",
      borderRadius: "full",
      bg: "surface.muted",
      // 溝として軽く凹ませる(depth source = Input の field と同じ shadow.depth の cool-dark)。
      // 視認性は accent つまみが担うので、ここは純粋に物理感(凹んだ溝に値が満ち、円盤が乗る)。
      boxShadow: "inset 0 1px 2px color-mix(in oklch, {colors.shadow.depth} 9%, transparent)",
    },
    indicator: {
      // 値の塗り = accent(width は Base UI が値%で inline 設定)。
      borderRadius: "full",
      bg: "accent",
      // keyboard step で thumb と同尺 glide(連動)。drag 中は追従のため切る。
      transitionProperty: "width",
      transitionDuration: "quick",
      transitionTimingFunction: "expressive",
      "&[data-dragging]": { transitionProperty: "none" },
      "@media (prefers-reduced-motion: reduce)": { transitionProperty: "none" },
    },
    thumb: {
      width: "18px",
      height: "18px",
      borderRadius: "full",
      // つまみ = accent(値の点)。白いつまみは白いカード上で上縁が溶けるため、彩度で視認性を
      // 構造的に確保する。card(白)・rail(muted)に対し accent の彩度で立ち、左の fill(同 accent)
      // とは太い円が thin な fill bar から張り出すことで分離される。affordance(操作の点)= accent。
      bg: "accent",
      // soft な drop shadow は浮き(grab affordance)。視認性は色が担うので影は控えめでよい。
      boxShadow: "0 1.5px 4px color-mix(in srgb, {colors.fg.strong} 15%, transparent)",
      outline: "none",
      cursor: "grab",
      // 位置(inset-inline-start)を keyboard step で glide。drag 中は切る(pointer 追従)。
      // transform(scale)も transition して hover で滑らかに拡大。Base UI は中央寄せに
      // translate プロパティを使うため、私の transform(scale)とは別プロパティで非干渉。
      transitionProperty: "inset-inline-start, box-shadow, transform",
      transitionDuration: "quick",
      transitionTimingFunction: "expressive",
      // engaged(hover / 掴み / focus)= つまみ自体を拡大 + 濃い lift へ持ち上げる。
      // 影だけでは小さなつまみで変化が知覚しづらいので、scale を主たる lift 合図にする。
      // control hover でも効くよう祖先を見る。focus は accent リングを足す。
      "&[data-dragging], .otibo-slider__control:hover &": {
        transform: "scale(1.15)",
        boxShadow: "0 3px 8px color-mix(in srgb, {colors.fg.strong} 20%, transparent)",
      },
      _focusVisible: {
        transform: "scale(1.15)",
        boxShadow:
          "0 3px 8px color-mix(in srgb, {colors.fg.strong} 20%, transparent), 0 0 0 3px color-mix(in oklch, {colors.accent} 30%, transparent)",
      },
      "&[data-dragging]": {
        transitionProperty: "box-shadow, transform",
        cursor: "grabbing",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transitionProperty: "box-shadow, transform",
      },
    },
  },
})
