import { defineSlotRecipe } from "@pandacss/dev"

/**
 * Toast slot recipe — trigger に紐づかず自発的に現れる feedback overlay。
 *
 * grammar 上の位置:popover/dialog と違い「自分で開く」のではなく、操作の結果として
 * 系から提示される。surface.raised の小さな paper が画面隅に積み上がる(stack)。
 *
 * motion(新領域):
 *   - 出入りは opacity + translateY(slide)。**scale は使わない** ── toast はテキストを
 *     持つので scale=1 終端の再ラスタライズ snap が出る(motion-grammar §scale-on-text)。
 *     slide ならサイズ不変で snap が起きない。
 *   - stack(重なり)も scale でなく translateY + opacity:後ろの toast は上へ少しずらして
 *     淡く(index 比例)。hover/focus で展開(data-expanded)= offset-y の列に開く。
 *   - Base UI が `--toast-index`/`--toast-offset-y`/`--toast-height` と data 属性
 *     (starting/ending/expanded/swiping)を供給。位置と stack は CSS 側で組む。
 *
 * Slots: viewport(画面隅の固定枠)/ root(各 toast の paper)/ content(text 列)/
 *        title / description / close。
 */
export const toastRecipe = defineSlotRecipe({
  className: "otibo-toast",
  jsx: ["Toast", "Toaster"],
  slots: ["viewport", "root", "content", "title", "description", "close"],
  base: {
    viewport: {
      position: "fixed",
      bottom: "4",
      right: "4",
      zIndex: "60", // dialog(50)より上
      width: "min(360px, calc(100vw - 2rem))",
      outline: "none",
    },
    root: {
      // Base UI Viewport を基準に右下へ重ねる。stack は transform で作る。
      position: "absolute",
      bottom: "0",
      insetInlineEnd: "0",
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "flex-start",
      gap: "3",
      bg: "surface.raised",
      color: "fg",
      borderRadius: "lg",
      boxShadow: "lift",
      padding: "4",
      // 前面(index 0 = 最新)を最上位に。
      zIndex: "calc(100 - var(--toast-index))",
      transformOrigin: "bottom center",
      // collapsed:後ろの toast は上へ 14px ずつずらし、index 比例で淡く(scale 不使用)。
      transform: "translateY(calc(var(--toast-index) * -14px))",
      opacity: "calc(1 - var(--toast-index) * 0.28)",
      transitionProperty: "transform, opacity",
      transitionDuration: "medium",
      transitionTimingFunction: "decelerate",
      // 展開(hover/focus)= offset-y の列に開き、全て不透明に。bottom 配置なので offset-y
      // (正の量)を負方向に適用して**上へ**開く(collapsed の `* -14px` と方向を揃える)。
      // offset-y は高さの累積(toast 同士が密着)。index 比例の追加ギャップ(12px)で間隔を開ける。
      "&[data-expanded]": {
        transform: "translateY(calc(var(--toast-offset-y) * -1 - var(--toast-index) * 12px))",
        opacity: "1",
      },
      // 出現:下からスライドアップ + fade(bottom 配置なので下=画面外から)。
      "&[data-starting-style]": {
        transform: "translateY(150%)",
        opacity: "0",
      },
      // 退場:下へスライド + fade、quick で素早く。
      "&[data-ending-style]": {
        transform: "translateY(150%)",
        opacity: "0",
        transitionDuration: "quick",
        transitionTimingFunction: "standard",
      },
      // swipe-to-dismiss:指に追従(transition 切る)。
      "&[data-swiping]": {
        transform: "translate(var(--toast-swipe-movement-x), var(--toast-swipe-movement-y))",
        transitionProperty: "none",
      },
      // reduced-motion:travel(slide)を抜き opacity だけ(transform は即時=位置のみ)。
      "@media (prefers-reduced-motion: reduce)": {
        transitionProperty: "opacity",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "1",
      flex: "1",
      minWidth: "0",
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
    close: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      // 24px の tap target(sizes トークン 6 = 1.5rem)。
      width: "6",
      height: "6",
      marginTop: "-0.5",
      marginInlineEnd: "-1",
      borderRadius: "sm",
      border: "none",
      bg: "transparent",
      color: "fg.muted",
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: "quick",
      transitionTimingFunction: "standard",
      _hover: {
        bg: "surface.muted",
        color: "fg.strong",
      },
      _focusVisible: {
        outline: "2px solid {colors.accent}",
        outlineOffset: "1px",
      },
    },
  },
})
