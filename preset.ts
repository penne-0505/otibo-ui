import { definePreset } from "@pandacss/dev"

import { accordionRecipe } from "./src/core-ui/accordion/accordion.recipe"
import { avatarRecipe } from "./src/core-ui/avatar/avatar.recipe"
import { badgeRecipe } from "./src/core-ui/badge/badge.recipe"
import { breadcrumbRecipe } from "./src/core-ui/breadcrumb/breadcrumb.recipe"
import { buttonRecipe } from "./src/core-ui/button/button.recipe"
import { cardRecipe } from "./src/core-ui/card/card.recipe"
import { checkboxRecipe } from "./src/core-ui/checkbox/checkbox.recipe"
import { chipRecipe } from "./src/core-ui/chip/chip.recipe"
import { comboboxRecipe } from "./src/core-ui/combobox/combobox.recipe"
import { dialogRecipe } from "./src/core-ui/dialog/dialog.recipe"
import { fieldRecipe } from "./src/core-ui/field/field.recipe"
import { inlineEditRecipe } from "./src/core-ui/inline-edit/inline-edit.recipe"
import { inputRecipe } from "./src/core-ui/input/input.recipe"
import { linkRecipe } from "./src/core-ui/link/link.recipe"
import { menuRecipe } from "./src/core-ui/menu/menu.recipe"
import { meterRecipe } from "./src/core-ui/meter/meter.recipe"
import { navigationMenuRecipe } from "./src/core-ui/navigation-menu/navigation-menu.recipe"
import { numberFieldRecipe } from "./src/core-ui/number-field/number-field.recipe"
import { paginationRecipe } from "./src/core-ui/pagination/pagination.recipe"
import { popoverRecipe } from "./src/core-ui/popover/popover.recipe"
import { previewCardRecipe } from "./src/core-ui/preview-card/preview-card.recipe"
import { progressRecipe } from "./src/core-ui/progress/progress.recipe"
import { radioRecipe } from "./src/core-ui/radio/radio.recipe"
import { scrollAreaRecipe } from "./src/core-ui/scroll-area/scroll-area.recipe"
import { segmentedControlRecipe } from "./src/core-ui/segmented-control/segmented-control.recipe"
import { selectRecipe } from "./src/core-ui/select/select.recipe"
import { separatorRecipe } from "./src/core-ui/separator/separator.recipe"
import { skeletonRecipe } from "./src/core-ui/skeleton/skeleton.recipe"
import { sliderRecipe } from "./src/core-ui/slider/slider.recipe"
import { spinnerRecipe } from "./src/core-ui/spinner/spinner.recipe"
import { switchRecipe } from "./src/core-ui/switch/switch.recipe"
import { tableRecipe } from "./src/core-ui/table/table.recipe"
import { tabsRecipe } from "./src/core-ui/tabs/tabs.recipe"
import { toastRecipe } from "./src/core-ui/toast/toast.recipe"
import { toggleRecipe } from "./src/core-ui/toggle/toggle.recipe"
import { tooltipRecipe } from "./src/core-ui/tooltip/tooltip.recipe"

/**
 * otibo Design System — Panda CSS preset.
 *
 * 内側 repo(otibo-ui)と consumer(otibo-dev 等)が theme を共有するための
 * preset 形式。consumer の panda.config.ts は `presets: [otiboPreset]` で
 * これを継承し、必要に応じて `theme.extend` で上書きする。
 *
 * 含まれるもの:
 *   - tokens(warm scale、radii、spacing、fontSizes、fontWeights、lineHeights、
 *     letterSpacings、opacity、fonts、durations、easings)
 *   - semanticTokens(bg / surface / fg / border / shadow.depth / danger、
 *     shadows.paper / lift / focus / field)
 *   - recipes(button、input)
 *   - slotRecipes(card、field、inlineEdit)
 *   - globalCss(html / body のベース styling)
 *
 * 含まれないもの:
 *   - preflight / include / outdir / jsxFramework / importMap / layers
 *     (これらは consumer の panda.config.ts で個別に設定する)
 */
export const otiboPreset = definePreset({
  name: "otibo-ui",
  theme: {
    extend: {
      tokens: {
        colors: {
          // Primitive warm scale, H≈65, derived from concept visual sampling.
          // Chroma stays in [0.009, 0.019] to keep the "barely tinted neutral"
          // character the brand calls for.
          warm: {
            "0": { value: "oklch(1 0 0)" }, // pure white, top surface only
            "50": { value: "oklch(0.97 0.011 65)" }, // page bg
            "100": { value: "oklch(0.94 0.013 65)" }, // subtle band
            "200": { value: "oklch(0.88 0.015 65)" }, // hairline / muted surface
            "300": { value: "oklch(0.78 0.017 65)" }, // border default
            "400": { value: "oklch(0.68 0.018 65)" }, // disabled fg
            "500": { value: "oklch(0.58 0.018 65)" }, // subtle fg
            "600": { value: "oklch(0.48 0.016 65)" }, // muted fg
            "700": { value: "oklch(0.38 0.014 65)" }, // secondary fg
            "800": { value: "oklch(0.30 0.013 65)" }, // primary fg
            "900": { value: "oklch(0.20 0.010 65)" }, // strongest fg
          },
        },
        radii: {
          xs: { value: "0.25rem" },
          sm: { value: "0.5rem" },
          md: { value: "0.75rem" },
          lg: { value: "1rem" },
          xl: { value: "1.5rem" },
          "2xl": { value: "2rem" },
          full: { value: "9999px" },
        },
        spacing: {
          // Slightly looser than Tailwind defaults. Reflects the brand's
          // "ゆったり余白" stance (理念.md §3) without committing to a final scale yet.
          "0": { value: "0" },
          "0.5": { value: "0.125rem" },
          "1": { value: "0.25rem" },
          "1.5": { value: "0.375rem" },
          "2": { value: "0.5rem" },
          "3": { value: "0.75rem" },
          "4": { value: "1rem" },
          "5": { value: "1.25rem" },
          "6": { value: "1.5rem" },
          "7": { value: "1.75rem" },
          "8": { value: "2rem" },
          "10": { value: "2.5rem" },
          "12": { value: "3rem" },
          "16": { value: "4rem" },
          "20": { value: "5rem" },
          "24": { value: "6rem" },
        },
        // width / height / minHeight 等(sizes カテゴリ)。spacing と同値で揃える ── これが無いと
        // 数値トークン(例 minHeight: "10")が token 解決されず literal "10px" に化ける既知バグが出る。
        // 定義により button/input/select の minHeight が intended の 32/40px floor に戻る。
        sizes: {
          "0": { value: "0" },
          "0.5": { value: "0.125rem" },
          "1": { value: "0.25rem" },
          "1.5": { value: "0.375rem" },
          "2": { value: "0.5rem" },
          "3": { value: "0.75rem" },
          "4": { value: "1rem" },
          "5": { value: "1.25rem" },
          "6": { value: "1.5rem" },
          "7": { value: "1.75rem" },
          "8": { value: "2rem" },
          "10": { value: "2.5rem" },
          "12": { value: "3rem" },
          "16": { value: "4rem" },
          "20": { value: "5rem" },
          "24": { value: "6rem" },
          full: { value: "100%" },
        },
        fontSizes: {
          // hierarchy gap from md (body 18px) to xl (title 28px) ≈ 1.55×。
          // 20px は editorial / brand surface 用の領域で、app の core-ui Card
          // 本文としては大きすぎたため 18px に戻した(目視判定)。
          xs: { value: "0.75rem" }, // 12px
          sm: { value: "0.875rem" }, // 14px
          base: { value: "1rem" }, // 16px — description / lead
          md: { value: "1.125rem" }, // 18px — body
          lg: { value: "1.5rem" }, // 24px — secondary heading
          xl: { value: "1.75rem" }, // 28px — card title
          "2xl": { value: "2.25rem" }, // 36px — section heading
          "3xl": { value: "3rem" }, // 48px — display heading
        },
        fontWeights: {
          regular: { value: "400" },
          medium: { value: "500" }, // bootstrapped from preview's warm structure; reviewed post-prototype
          semibold: { value: "600" },
        },
        lineHeights: {
          tight: { value: "1.25" }, // headings(card title 等)
          snug: { value: "1.4" }, // description / dense text
          body: { value: "1.49" }, // body / prose。
          // 1.45-1.55 を 0.02 刻み 6 段階で目視
          // 比較し 1.49 に確定。Anthropic 1.40 と
          // iA Writer 1.65 の中間、AAA(1.5 以上)
          // は意図的に外す。Gen Interface JP の
          // 漢字行は Latin 単体より縦に詰まって
          // 見える傾向に合わせ、Inter 慣習値より
          // やや tight 寄り。WCAG 1.4.12 は user
          // override を妨げなければ満たす。
          normal: { value: "1.55" }, // 汎用
          relaxed: { value: "1.7" }, // 余白を取りたい場面(未使用)
        },
        letterSpacings: {
          tight: { value: "-0.01em" },
          normal: { value: "0" },
          wide: { value: "0.005em" }, // warm-structure microadjustment
          wider: { value: "0.02em" },
        },
        // opacity: disabled 表現の token 化。grammar §Disabled As Quiet Surface
        // 参照。otibo は disabled を「surface 全体が静かになる」と定義し、
        // 個別の token shift(fg.disabled 等)ではなく opacity 一括で表現する。
        opacity: {
          disabled: { value: "0.55" },
        },
        fonts: {
          // Gen Interface JP (山戸飯塚氏作, SIL OFL 1.1) を本文・display 共通で使う。
          body: {
            value: '"Gen Interface JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          },
          display: {
            value: '"Gen Interface JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          },
          mono: {
            value: '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          },
        },
        durations: {
          // motion の tier ── duration を「中断の重さ」に比例させる。register(easing /
          // 段階化)と直交し、全 component が同じ tier 軸に乗る(2026-06-17 統一)。
          //   snap(=feather):in-place の content 入替(tabs パネル)。navigate した content
          //                   は gate してはいけない=最軽の interruption。
          //   quick(=light) :form feedback / transient / 頻繁な hover・focus、tooltip
          //   medium        :標準の event(radio・switch・popover・select)・card lift
          //   heavy         :画面を奪う dialog・checkbox の描画(最も濃い presence)
          // 影のグラマー(光源共通・段数 ∝ elevation)の時間軸版:カーブ共通・尺 ∝ weight。
          snap: { value: "90ms" },
          quick: { value: "120ms" }, // light tier(名は据え置き=多数箇所で参照)
          medium: { value: "240ms" },
          heavy: { value: "320ms" },
        },
        easings: {
          standard: { value: "cubic-bezier(0.2, 0, 0, 1)" },
          decelerate: { value: "cubic-bezier(0, 0, 0, 1)" },
          accelerate: { value: "cubic-bezier(0.3, 0, 1, 1)" },
          // 直接操作の「到着」を司る署名カーブ。checkbox の描画で手で詰めて確定した
          // motion のリファレンス。立ち上がりは速いが一拍寝かせ、長い尾でそっと置く。
          // ── motion 文法(2026-06-17 確立)── 二軸:tier(duration)× register(easing)─
          // ・動きは物理であれ(瞬間遷移=不自然を禁じる)。
          // ・【tier 軸 = duration】中断の重さに比例(durations の quick/medium/heavy)。
          //   全 component 共通の軸。tier 割り当て:
          //     snap   : tabs パネル切替(navigate した content は gate しない=最軽)
          //     light  : button/input/inline-edit の hover・focus、tooltip
          //     medium : radio・switch・popover・select、card の lift
          //     heavy  : dialog(画面を奪う)、checkbox の描画
          // ・【register 軸 = easing + 段階化】tier と直交:
          //   expressive register = easings.expressive + 段階的 motion(応答/feedback 分離)。
          //     直接操作 control(checkbox/radio/switch)と overlay の出現。
          //   quiet register = easings.standard、段階化なし。form/hover の state 遷移
          //     (button/input/inline-edit/card)。無口に保つ ── 全部に生命感を盛ると玩具になる。
          // ・【段階的 motion(expressive register のみ)】応答を 0ms〜quick で即返し、その上に
          //   遅い feedback を重ねる。即時応答が responsiveness を確定するので遅い層は「見もの」に。
          //   control: 色/状態=瞬時、形/動き=tier 尺。overlay: opacity=quick、transform=tier 尺。
          //   例外:可動部が色域を横断する control(switch の thumb)は色を瞬時にすると「先走り」に
          //   見えるため、色を 80ms 連れ添わせて協調動作にする。
          // ・exit は要素種別で分ける(非対称):
          //   直接操作(checkbox/radio/switch)= accelerate の速い払い+状態色は瞬時。
          //   システム応答(overlay)= standard(quick)で去る。anchor(--transform-origin)
          //   から scale して連続性を保つ。
          //   ※overlay の去る側に accelerate(ease-in)は使わない:その場の fade では出だしの
          //   停滞が「閉じが遅い」として露呈する。accelerate は尺の短い直接操作 wipe 専用。
          // ・reduced-motion では travel(scale/transform)を抜き opacity だけ残す。
          expressive: { value: "cubic-bezier(0.25, 0.85, 0.4, 1)" },
        },
      },

      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: { value: "{colors.warm.50}" },
            subtle: { value: "{colors.warm.100}" },
            sunken: { value: "{colors.warm.200}" },
          },
          surface: {
            DEFAULT: { value: "{colors.warm.0}" },
            muted: { value: "{colors.warm.100}" },
            raised: { value: "{colors.warm.0}" },
          },
          fg: {
            // 役割は token-semantic-usage-map.md §Foreground Subroles 参照。
            // fg.disabled は grammar §Disabled As Quiet Surface 採用に伴い廃止。
            DEFAULT: { value: "{colors.warm.800}" },
            secondary: { value: "{colors.warm.700}" },
            muted: { value: "{colors.warm.500}" },
            subtle: { value: "{colors.warm.400}" },
            strong: { value: "{colors.warm.900}" },
          },
          border: {
            subtle: { value: "{colors.warm.200}" },
            DEFAULT: { value: "{colors.warm.300}" },
            strong: { value: "{colors.warm.400}" },
          },
          // shadow source は cast / depth の二系統。grammar §Shadow Source 参照。
          //   - cast(paper / lift / focus outer)→ `fg.strong` 参照
          //   - depth(field inset)→ `shadow.depth`(独立 source)
          shadow: {
            depth: { value: "oklch(0.12 0.03 260)" },
          },
          // Danger は error state という affordance 表現の専用 source。
          // semantic family(success / warning / info)は意図的に作らない。
          // grammar §Danger Is A State, Not A Semantic Family 参照。
          danger: {
            DEFAULT: { value: "oklch(0.58 0.13 30)" },
          },
          // Accent ── 単一 accent。danger と同じく semantic family を作らずフラット配置。
          // oklch(0.40 0.11 265):紫を一滴含む低彩度の藍。偏りは hue(正補色から外した顔料的な藍)に、
          // 節度は低彩度に置く。深みは彩度でなく明度(暗さ)で出す。薄い tint バリエーション
          // (selected / band 等)は α 派生。hover は同 hue を一段沈めた値。
          // ※ L=0.46→0.40 への再校正は HDR OFF=素の sRGB 基準で実施(当初 0.46 は HDR 下で決定)。
          accent: {
            DEFAULT: { value: "oklch(0.40 0.11 265)" },
            hover: { value: "oklch(0.35 0.11 265)" },
            // 薄いバリエーション(2026-06-16 採用)── 派生は単一 accent の α。selected /
            // band 等を賄い「画面に accent が一点しかない」状態を解消する。
            subtle: { value: "oklch(0.40 0.11 265 / 0.12)" }, // selected / chip fill
            muted: { value: "oklch(0.40 0.11 265 / 0.05)" }, // band / subtle surface
          },
        },
        shadows: {
          paper: {
            sm: {
              value:
                "0 0 0 1px color-mix(in oklch, {colors.fg.strong} 5%, transparent), 0 1px 0 0 color-mix(in oklch, {colors.fg.strong} 3%, transparent), 0 8px 20px -14px color-mix(in oklch, {colors.fg.strong} 12%, transparent)",
            },
            md: {
              value:
                "0 0 0 1px color-mix(in oklch, {colors.fg.strong} 5%, transparent), 0 1px 0 0 color-mix(in oklch, {colors.fg.strong} 3%, transparent), 0 12px 28px -16px color-mix(in oklch, {colors.fg.strong} 14%, transparent)",
            },
          },
          // lift ── 浮く要素の cast shadow。階層(sm/md/lg を段数で刻む)はやめ、
          //   単一の非諧調 shadow に統一(2026-06-17)。多段 penumbra ramp は「どうしても
          //   諧調化する」ため廃止。真上光(X=0)+ warm 源(fg.strong)の 1 段だけ。
          //   overlay(tooltip / popover / select)共通で使う。switch thumb の接地影は
          //   elevation ではなく contact なので switch 側に inline で持つ。
          // 単一・非階層(elevation を段で刻まない方針は維持)。ただし一段の影を物理二成分で表す:
          //   近接の contact(縁の定義)+ 遠くの soft penumbra(浮き)。borderless な popover は
          //   影が唯一の縁なので、contact 層で上縁(真上光 X=0 で最も淡くなる側)も拾わせる。
          // 補間は oklch:本来やりたかった soft falloff に戻す。2026-06-17 に srgb + tight blur へ
          //   詰めたのは popover で見えた諧調バンドへの応急処置だったが、その諧調は HDR(ディスプレイ
          //   のトーンマッピング)由来だった疑いが濃い(同経路で実在しない緑も生成していた)。SDR を
          //   基準に置き直し、まず本来の soft 版へ戻して実機確認する(2026-06-19)。
          // ※ SDR でなお段が見えるなら banding は実在 ── その時のみ短い blur + 高め alpha + srgb の
          //   処方([[shadow-banding-fix]])へ再び詰める。判断材料は「素の sRGB で出るか」。
          lift: {
            value:
              "0 1px 2px color-mix(in oklch, {colors.fg.strong} 10%, transparent), 0 8px 24px -6px color-mix(in oklch, {colors.fg.strong} 16%, transparent)",
          },
          focus: {
            DEFAULT: {
              value: "0 0 0 3px color-mix(in oklch, {colors.accent} 30%, transparent)",
            },
          },
          field: {
            DEFAULT: {
              value:
                "inset 0 0 0 1px color-mix(in oklch, {colors.shadow.depth} 9%, transparent), inset 0 1.5px 2.5px color-mix(in oklch, {colors.shadow.depth} 8%, transparent)",
            },
            // hover ── inset を一段弱めて「受け皿が少し浮いてくる」feedback(外側影は持たない)。
            // 凹みが浅くなることで触れたら応える感触を出す(focus 未満の中間状態)。
            hover: {
              value:
                "inset 0 0 0 1px color-mix(in oklch, {colors.shadow.depth} 6%, transparent), inset 0 1px 1.5px color-mix(in oklch, {colors.shadow.depth} 5%, transparent)",
            },
            focus: {
              value: "inset 0 0 0 2px {colors.accent}",
            },
            error: {
              value: "inset 0 0 0 2px {colors.danger}",
            },
          },
        },
      },

      keyframes: {
        // Tabs パネル切替の crossfade(新パネルが現れる側だけ。slide は使わない=
        // 内容は切り替わっただけで「移動」の嘘をつかない)。
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Spinner の連続回転。loading の自走は「作業継続の証言」=装飾でないので no-self-running
        // -animation の例外として認める(motion-grammar §Loading)。linear=等速(非線形だと揺れる)。
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        // Skeleton の穏やかな呼吸(opacity breathe)。trendy な shimmer sweep は採らない。
        // 「中身が来る」を静かに告げる loading 証言(§Loading)。
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      recipes: {
        button: buttonRecipe,
        input: inputRecipe,
        badge: badgeRecipe,
        spinner: spinnerRecipe,
        skeleton: skeletonRecipe,
        link: linkRecipe,
        separator: separatorRecipe,
        scrollArea: scrollAreaRecipe,
      },
      slotRecipes: {
        accordion: accordionRecipe,
        avatar: avatarRecipe,
        breadcrumb: breadcrumbRecipe,
        card: cardRecipe,
        field: fieldRecipe,
        inlineEdit: inlineEditRecipe,
        checkbox: checkboxRecipe,
        chip: chipRecipe,
        combobox: comboboxRecipe,
        // key は `switch`(JS 予約語=生成関数名に使えない)を避けて `switchRecipe`。jsx: ["Switch"] で検出。
        switchRecipe: switchRecipe,
        radio: radioRecipe,
        tabs: tabsRecipe,
        tooltip: tooltipRecipe,
        popover: popoverRecipe,
        previewCard: previewCardRecipe,
        dialog: dialogRecipe,
        segmentedControl: segmentedControlRecipe,
        progress: progressRecipe,
        table: tableRecipe,
        pagination: paginationRecipe,
        numberField: numberFieldRecipe,
        toggle: toggleRecipe,
        menu: menuRecipe,
        meter: meterRecipe,
        navigationMenu: navigationMenuRecipe,
        select: selectRecipe,
        slider: sliderRecipe,
        toast: toastRecipe,
      },
    },
  },

  globalCss: {
    "html, body, #root": {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
      fontSize: "md",
      lineHeight: "body",
      letterSpacing: "normal",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    body: {
      margin: "0",
      minHeight: "100dvh",
    },
  },
})
