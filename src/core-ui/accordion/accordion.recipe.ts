import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Accordion slot recipe — 開閉できる詳細セクション(disclosure)。
 *
 * grammar 上の新領域:これまでの motion は opacity / transform / scale を扱ってきたが、
 * Accordion は初めて **高さ(サイズ)を animate** する。Base UI が panel の実高さを
 * `--accordion-panel-height` で供給するので、height をそれと 0 の間で transition する。
 *
 * height animation の鉄則:**padding を animate する要素に乗せない**(畳んでも padding 分の
 * 高さが残り 0 にならない)。panel は height/overflow だけを持ち、余白は内側の panelContent
 * に逃がす。これで panel は 0 まできれいに畳み、中身は上から clip されて現れる。
 *
 * motion(答え合わせ):reveal なので medium(240)・expressive(署名カーブの decelerate 尾)で
 * 開く。height 特有の問題(中身テキストの reflow ガタつき)が出ないかを実機で見る ── 出れば
 * tier/easing を quick や decelerate へ振り直す。
 *
 * Slots: root / item(区切り hairline)/ header / trigger(見出し行 + chevron)/ icon /
 *        panel(高さを animate)/ panelContent(余白を持つ内側)。
 */
export const accordionRecipe = defineSlotRecipe({
  className: "otibo-accordion",
  jsx: ["Accordion"],
  slots: ["root", "item", "header", "trigger", "icon", "panel", "panelContent"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
    },
    item: {
      // 項目間は hairline で仕切る。最後は引かない(card 等の容器の縁と二重にしない)。
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "border.subtle",
      "&:last-of-type": { borderBottomWidth: "0" },
    },
    header: {
      margin: "0",
    },
    trigger: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "3",
      paddingBlock: "3",
      paddingInline: "0",
      appearance: "none",
      border: "none",
      bg: "transparent",
      fontFamily: "body",
      fontSize: "md",
      fontWeight: "medium",
      lineHeight: "tight",
      letterSpacing: "normal",
      textAlign: "start",
      color: "fg.strong",
      cursor: "pointer",
      outline: "none",
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "2px",
        borderRadius: "xs",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "disabled",
      },
    },
    icon: {
      flexShrink: "0",
      color: "fg.muted",
      // open で 180° 反転。ancestor の trigger が data-panel-open を持つ。
      transitionProperty: "transform, color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      "[data-panel-open] &": {
        transform: "rotate(180deg)",
      },
    },
    panel: {
      // 高さを実測値(--accordion-panel-height)と 0 の間で animate。余白は持たない(panelContent へ)。
      overflow: "hidden",
      height: "var(--accordion-panel-height)",
      transitionProperty: "height",
      transitionDuration: "medium",
      transitionTimingFunction: "expressive",
      "&[data-starting-style], &[data-ending-style]": {
        height: "0",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
    panelContent: {
      // panel が clip するので、余白はここに持たせて 0 まで畳めるようにする。
      paddingBottom: "3",
      color: "fg",
      fontSize: "sm",
      lineHeight: "normal",
    },
  },
})
