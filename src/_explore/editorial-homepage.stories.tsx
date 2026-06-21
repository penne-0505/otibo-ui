import type { Story } from "@ladle/react"

import {
  Button,
  Container,
  Display,
  Eyebrow,
  Field,
  Figure,
  Hairline,
  Lede,
  Pull,
  Section,
  SignOff,
} from "../index"

export default {
  title: "explore / editorial / homepage",
}

/**
 * otibo.dev ── 実プロトタイプ。
 *
 * 「魅せるデモ」ではなく、otibo.dev のホームページとしてそのまま着地できる構成を目指す。
 * 教育的な大型タイポ展示や long-form の論考は demo から外した(理念 §3 §4 参照)。
 *
 * 構成:
 *   1. Hero        ── タグライン(6xl)+ Lede + CTA
 *   2. 短い理念    ── Pull 一行(理念 §1-三)
 *   3. プロダクト  ── 縦ストリップ、偶奇で figure 左右交互(雑誌的非対称)
 *   4. Newsletter  ── enter your email form(末尾、薄く)
 *   5. SignOff     ── otibo・年・著者
 *
 * Ladle Provider が story 周囲に padding: 3rem 2rem を付与する。Section の
 * bleed 性を見るため、root の `margin` で打ち消す。
 */

const bleedReset: React.CSSProperties = {
  margin: "-3rem -2rem",
  width: "calc(100% + 4rem)",
}

// プロダクト枠の仮素材。実物の screenshot / 動画に差し替わるまでの placeholder。
// 暖色の subtle gradient を 3 種類、隣接させても飽きないように hue / depth を微妙に
// ずらす(理念 §3 「無彩寄り中間色、わずかに温度がある」)。
const productSurfaces = [
  "linear-gradient(140deg, oklch(0.94 0.013 65) 0%, oklch(0.86 0.016 70) 100%)",
  "linear-gradient(160deg, oklch(0.92 0.014 50) 0%, oklch(0.84 0.018 80) 100%)",
  "linear-gradient(120deg, oklch(0.95 0.012 90) 0%, oklch(0.85 0.017 55) 100%)",
]

type Product = {
  num: string
  name: string
  lede: string
  status: string
  surface: string
}

const products: Product[] = [
  {
    num: "01",
    name: "(仮) プロダクト A",
    lede: "朝の準備のひと手間を、ひとつの道具で。準備に必要なものを、必要なだけ、その日の手順に並べる。",
    status: "現在制作中",
    surface: productSurfaces[0]!,
  },
  {
    num: "02",
    name: "(仮) プロダクト B",
    lede: "読みかけの記憶を、本の中で取り戻す。ページを開いた瞬間、前回の余韻が静かに戻ってくる。",
    status: "α 公開",
    surface: productSurfaces[1]!,
  },
  {
    num: "03",
    name: "(仮) プロダクト C",
    lede: "一人で作業する時間に、寄り添う机を。集中の始まりと終わりを、自分の感覚で区切る。",
    status: "構想",
    surface: productSurfaces[2]!,
  },
]

/**
 * otibo.dev ── ホームページ全面のプロトタイプ。
 */
export const Homepage: Story = () => (
  <div style={bleedReset}>
    {/* ───────────────────────────────────────── HERO */}
    <Section padding="xl" tone="default">
      <Container width="default">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
          {/* brand mark = 小文字絶対(otibo)── caps="literal" で case を保つ */}
          <Eyebrow caps="literal" size="md">
            otibo
          </Eyebrow>
          {/* 本タグライン(理念 §2 ブランドの顔)── 6xl の hero 帯 */}
          <Display size="6xl">
            誰かのひと手間に、
            <br />
            ぴったりの道具を。
          </Display>
          <Lede size="lg">
            万能は目指さない。特定の状況と、特定の姿勢にだけ、ぴったりはまる道具をつくる。
            otibo がやっているのは、それだけ。
          </Lede>
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-3)",
              marginTop: "var(--spacing-4)",
            }}
          >
            <Button intent="primary" size="md">
              プロダクトを見る
            </Button>
            <Button intent="ghost" size="md">
              考え方を読む
            </Button>
          </div>
        </div>
      </Container>
    </Section>

    {/* ───────────────────────────────────────── 短い理念(Pull 一行) */}
    <Section padding="xl" tone="sunken">
      <Container width="default">
        <Pull size="xl" align="center">
          <Pull.Body>ひとつのために、ひとつ。それが、いちばん。</Pull.Body>
          <Pull.Attribution>otibo 理念</Pull.Attribution>
        </Pull>
      </Container>
    </Section>

    {/* ───────────────────────────────────────── プロダクト ── 縦ストリップ・偶奇で左右交互 */}
    <Section padding="lg" tone="default">
      <Container width="default">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            <Eyebrow caps="upper" size="md">
              Products
            </Eyebrow>
            <Display size="4xl">いま、つくっているもの。</Display>
          </div>

          {products.map((p, i) => {
            const isOdd = i % 2 === 1
            return (
              <div
                key={p.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 5fr) minmax(0, 4fr)",
                  gap: "var(--spacing-12)",
                  alignItems: "center",
                  // 偶奇で figure を左右交互に置く。雑誌的非対称。
                  direction: isOdd ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <Figure aspect="video" tone="paper">
                    <Figure.Frame style={{ background: p.surface }} />
                  </Figure>
                </div>
                <div
                  style={{
                    direction: "ltr",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "var(--spacing-3)",
                      color: "var(--colors-fg-muted)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--fonts-mono)",
                        fontSize: "var(--font-sizes-sm)",
                        letterSpacing: "var(--letter-spacings-wide)",
                      }}
                    >
                      {p.num}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-sizes-xs)",
                        letterSpacing: "var(--letter-spacings-eyebrow)",
                        textTransform: "uppercase",
                        color: "var(--colors-fg-subtle)",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <Display size="3xl">{p.name}</Display>
                  <Lede size="md">{p.lede}</Lede>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>

    {/* ───────────────────────────────────────── Newsletter form(末尾、薄く) */}
    <Section padding="lg" tone="default">
      <Container width="narrow">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
          <Hairline weight="faint" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-2)",
              maxWidth: "var(--sizes-prose)",
            }}
          >
            <Eyebrow caps="upper" size="sm">
              Newsletter
            </Eyebrow>
            <p
              style={{
                margin: 0,
                fontSize: "var(--font-sizes-base)",
                lineHeight: "var(--line-heights-snug)",
                color: "var(--colors-fg-secondary)",
              }}
            >
              新しい道具が出来た時に、ひとこと知らせます。月に一度あるかどうか。
            </p>
          </div>
          <Field.Root>
            <Field.Label>メールアドレス</Field.Label>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-2)",
                alignItems: "stretch",
              }}
            >
              <div style={{ flex: 1 }}>
                <Field.Input type="email" placeholder="you@example.com" />
              </div>
              <Button intent="primary" size="md" type="submit">
                受け取る
              </Button>
            </div>
            <Field.Description>
              いつでも解除できます。アドレスは otibo 以外に渡しません。
            </Field.Description>
          </Field.Root>
        </div>
      </Container>
    </Section>

    {/* ───────────────────────────────────────── SignOff */}
    <Section padding="md" tone="default">
      <Container width="default">
        <SignOff align="right" caps="literal">
          <SignOff.Mark>otibo</SignOff.Mark>
          <SignOff.Detail>2026 · penne</SignOff.Detail>
        </SignOff>
      </Container>
    </Section>
  </div>
)

/**
 * Display 階調 ── 6xl / 5xl / 4xl / 3xl / 2xl の重さの差を見る。
 * 7xl は editorial-ui の Display から削除済み(2026-06-22、プロトタイプ駆動の判断)。
 */
export const TypographyScale: Story = () => (
  <Container width="wide">
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <Eyebrow size="sm">6xl ─ hero メイン</Eyebrow>
        <Display size="6xl">誰かのひと手間に、ぴったりの道具を。</Display>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <Eyebrow size="sm">5xl ─ section title</Eyebrow>
        <Display size="5xl">触ると応える、自走しない</Display>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <Eyebrow size="sm">4xl ─ chapter</Eyebrow>
        <Display size="4xl">ひとつのために、ひとつ。</Display>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <Eyebrow size="sm">3xl ─ product name</Eyebrow>
        <Display size="3xl">気づけば終わっている</Display>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <Eyebrow size="sm">2xl ─ inline heading</Eyebrow>
        <Display size="2xl">ひと手間に、ひとつの道具を。</Display>
      </div>
    </div>
  </Container>
)
