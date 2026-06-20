import type { Story } from "@ladle/react"

import { Button } from "../core-ui/button/button"
import { Card as UICard } from "../core-ui/card/card"
import { Field } from "../core-ui/field/field"
import { Input } from "../core-ui/input/input"

/**
 * EXPLORATION — not a shipped component. Accent palette candidates for the
 * design system's deferred decision (token-semantic-usage-map.md §Deferred #7).
 *
 * 第5版。v4 から user が 6 本に絞り込み:
 *   確定寄り: Ultramarine(H265) / Peacock(H210) / Viridian(H172) / Sienna(H45)
 *   調整中:  Crimson(もう少し明るく) / Sapphire(くすみを抜く=彩度↑)
 * Crimson の明度と Sapphire の彩度は単一値で決め打たず、ラダーで数段並べて点を選ぶ。
 * 全 fill は white label 前提。
 */

const T = {
  surface: "oklch(1 0 0)",
  fg: "oklch(0.30 0.013 65)",
  fgSecondary: "oklch(0.38 0.014 65)",
  fgMuted: "oklch(0.58 0.018 65)",
  fgSubtle: "oklch(0.68 0.018 65)",
  fgStrong: "oklch(0.20 0.010 65)",
  surfaceMuted: "oklch(0.94 0.013 65)",
  danger: "oklch(0.58 0.13 30)",
  fieldShadow:
    "inset 0 0 0 1px color-mix(in oklch, oklch(0.12 0.03 260) 9%, transparent), inset 0 1.5px 2.5px color-mix(in oklch, oklch(0.12 0.03 260) 8%, transparent)",
}

const radius = "0.5rem"

const ok = (l: number, c: number, h: number, a?: number) =>
  a == null ? `oklch(${l} ${c} ${h})` : `oklch(${l} ${c} ${h} / ${a})`

type Seed = { name: string; tag: string; note: string; h: number; c: number; l: number }

// 6 本の finalist(調整版は当該パラメタを反映済の中央値)
const SEEDS: Seed[] = [
  {
    name: "Viridian",
    tag: "選択",
    note: "H172 顔料のビリジアン。緑と青緑の境、やや無機質。寒極の緑側。",
    h: 172,
    c: 0.11,
    l: 0.47,
  },
  {
    name: "Sapphire",
    tag: "確定",
    note: "H240 藍玉。くすみ抜きで彩度を最大へ(C0.13→0.19、sRGB は C0.16 付近で頭打ち)。",
    h: 240,
    c: 0.19,
    l: 0.47,
  },
  {
    name: "Ultramarine",
    tag: "選択",
    note: "H265 群青。青の最果て、紫の一歩手前。寒極の青側。",
    h: 265,
    c: 0.15,
    l: 0.46,
  },
]

type Accent = {
  name: string
  tag: string
  note: string
  solid: string
  onSolid: string
  link: string
  tint: string
  line: string
  ring: string
}

function derive(s: Seed): Accent {
  return {
    name: s.name,
    tag: s.tag,
    note: s.note,
    solid: ok(s.l, s.c, s.h),
    onSolid: "oklch(1 0 0)",
    link: ok(Math.min(s.l, 0.48), s.c, s.h),
    tint: ok(0.95, Math.min(s.c * 0.2, 0.03), s.h),
    line: ok(s.l, s.c, s.h),
    ring: ok(s.l, s.c, s.h, 0.3),
  }
}

function Btn({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "0.9375rem",
        lineHeight: 1.25,
        padding: "0.4375rem 1rem",
        minHeight: "2.25rem",
        borderRadius: radius,
        border: "none",
        background: bg,
        color,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}

function Card({ a }: { a: Accent }) {
  const adjusting = a.tag.startsWith("調整")
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        background: T.surface,
        boxShadow: `0 0 0 1.5px ${a.solid}, 0 1px 2px rgba(40,33,20,0.05), 0 8px 18px -14px rgba(40,33,20,0.25)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: a.solid,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          />
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: T.fgStrong }}>
            {a.name}
          </h3>
          <span
            style={{
              fontSize: "0.625rem",
              color: adjusting ? a.link : T.fgSubtle,
              fontWeight: 600,
            }}
          >
            {a.tag}
          </span>
          <code
            style={{
              marginLeft: "auto",
              fontSize: "0.6875rem",
              color: T.fgSubtle,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {a.solid}
          </code>
        </div>
        <p style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.5, color: T.fgMuted }}>
          {a.note}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <Btn bg={a.solid} color={a.onSolid}>
          送信する
        </Btn>
        <Btn bg={T.surfaceMuted} color={T.fgStrong}>
          下書き
        </Btn>
      </div>

      <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.5, color: T.fgSecondary }}>
        詳しくは{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ color: a.link, fontWeight: 500, textUnderlineOffset: 3 }}
        >
          制作ノート
        </a>{" "}
        を参照。
      </p>
      <span
        style={{
          display: "block",
          fontSize: "0.9375rem",
          color: T.fg,
          background: T.surface,
          borderRadius: radius,
          padding: "0.4375rem 0.75rem",
          minHeight: "2.25rem",
          boxSizing: "border-box",
          boxShadow: `inset 0 0 0 2px ${a.ring}`,
        }}
      >
        hello@otibo.dev
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
        <div
          style={{
            background: T.surface,
            borderRadius: radius,
            boxShadow: T.fieldShadow,
            overflow: "hidden",
            flex: "1 1 140px",
          }}
        >
          {["概要", "実装"].map((r, i) => {
            const sel = i === 1
            return (
              <div
                key={r}
                style={{
                  padding: "0.4375rem 0.625rem",
                  fontSize: "0.875rem",
                  color: sel ? T.fgStrong : T.fgSecondary,
                  fontWeight: sel ? 500 : 400,
                  background: sel ? a.tint : "transparent",
                  boxShadow: sel ? `inset 3px 0 0 0 ${a.line}` : "none",
                }}
              >
                {r}
              </div>
            )
          })}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: a.link,
            background: a.tint,
            borderRadius: "9999px",
            padding: "0.1875rem 0.625rem",
          }}
        >
          Design System
        </span>
      </div>
    </section>
  )
}

export default {
  title: "_explore / Accent Candidates",
}

export const OffCenterPopulation: Story = () => {
  const accents = SEEDS.map(derive)
  return (
    <div style={{ maxWidth: 1280, color: T.fg }}>
      <header style={{ marginBottom: "1.5rem", maxWidth: 780 }}>
        <h2
          style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 600, color: T.fgStrong }}
        >
          Accent 候補 — 3 本(寒極のみ / v7)
        </h2>
        <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: T.fgSecondary }}>
          暖極(Crimson/Sienna)と Peacock を削除し、緑〜青の寒極 3 本に。Sapphire は
          C0.19(彩度最大)。 実描画の deep 検証は別 story「Single Accent Deep」を参照。
        </p>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0.75rem 1rem",
          marginBottom: "1.75rem",
          background: T.surfaceMuted,
          borderRadius: radius,
          maxWidth: 780,
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: T.fgMuted }}>参照:</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            color: T.fgSecondary,
          }}
        >
          <span style={{ width: 14, height: 14, borderRadius: 4, background: T.danger }} /> danger
          (H30)
        </span>
        <span style={{ fontSize: "0.75rem", color: T.fgSubtle }}>
          ← Crimson(H8)/ Sienna(H45)が両隣。混同を要確認。
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {accents.map((a) => (
          <Card key={a.name} a={a} />
        ))}
      </div>
    </div>
  )
}

/* =========================================================================
 * Deep build — 単一 accent システムを実コンポーネント相当で検証。
 * バリエーションは accent 一色からの「白ランプ(to-white)」と「αランプ」で派生。
 * danger(既存)との同居も同一画面で確認する。
 * ========================================================================= */

const PAGE_BG = "oklch(0.97 0.011 65)"
const DANGER = "oklch(0.58 0.13 30)"
const DANGER_TINT = "oklch(0.96 0.015 30)"

const ACCENTS = [
  { name: "Ultramarine · C0.11(馴染む)", l: 0.46, c: 0.11, h: 265 },
  { name: "Ultramarine · C0.13(素性が残る)", l: 0.46, c: 0.13, h: 265 },
]

// 実 recipe metrics に寄せた md ボタン(button.recipe: fontSize base / padX 5 / padY 2 / minH 10 / radius sm / weight medium)
function MdBtn({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: 1.25,
        padding: "0.5rem 1.25rem",
        minHeight: "2.5rem",
        borderRadius: radius,
        border: "none",
        background: bg,
        color,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}

// input.recipe: fontSize md / padX 4 / padY 2 / minH 10 / radius sm / boxShadow field(rest)・field.focus(inset 2px)・field.error
function MdInput({
  label,
  value,
  state,
  accentSolid,
}: { label: string; value: string; state: "rest" | "focus" | "error"; accentSolid: string }) {
  const shadow =
    state === "focus"
      ? `inset 0 0 0 2px ${accentSolid}`
      : state === "error"
        ? `inset 0 0 0 2px ${DANGER}`
        : T.fieldShadow
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: T.fgStrong,
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "block",
          fontSize: "1.125rem",
          color: state === "rest" ? T.fgSubtle : T.fg,
          background: T.surface,
          borderRadius: radius,
          padding: "0.5rem 1rem",
          minHeight: "2.5rem",
          boxSizing: "border-box",
          boxShadow: shadow,
        }}
      >
        {value}
      </span>
    </label>
  )
}

function Swatch({ bg, label, dark }: { bg: string; label: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0 }}>
      <div
        style={{
          height: 40,
          borderRadius: 6,
          background: bg,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      />
      <span
        style={{
          fontSize: "0.625rem",
          color: dark ? T.fgMuted : T.fgSubtle,
          fontFamily: "ui-monospace, monospace",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function AccentBlock({ a }: { a: { name: string; l: number; c: number; h: number } }) {
  const solid = ok(a.l, a.c, a.h)
  const tw = (p: number) => `color-mix(in oklch, ${solid} ${p}%, white)`
  const al = (x: number) => ok(a.l, a.c, a.h, x)
  // 面は不透明 tint ではなく「半透明の薄いガラス」── α の微グラデ(上やや濃→下透ける)で
  // 透明感(マットなガラス感)を出す。地の white/warm が透けることで luminance が生まれる。
  const glass = (a1: number, a2: number) => `linear-gradient(180deg, ${al(a1)}, ${al(a2)})`
  const selectedBg = glass(0.12, 0.05)
  const hoverBg = glass(0.06, 0.025)
  const chipBg = glass(0.1, 0.04)
  const chipBorder = al(0.2)
  const band = glass(0.05, 0.02)

  // ランプ参照:両端に密・中間を空ける U 字分布
  const whiteRamp = [100, 70, 44, 9, 4, 2]
  const alphaRamp = [1, 0.68, 0.42, 0.12, 0.06, 0.02]

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingBottom: "1.75rem",
        borderBottom: "1px solid " + T.surfaceMuted,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem" }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: solid,
            alignSelf: "center",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        />
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: T.fgStrong }}>
          {a.name}
        </h3>
        <code
          style={{ fontSize: "0.75rem", color: T.fgSubtle, fontFamily: "ui-monospace, monospace" }}
        >
          {solid}
        </code>
        <span style={{ fontSize: "0.75rem", color: T.fgMuted }}>単一 accent → 派生ランプ</span>
      </div>

      {/* ramps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", color: T.fgMuted }}>
            白ランプ(to-white、U字分布):surface / selected / chip / band
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
            {whiteRamp.map((p) => (
              <Swatch key={p} bg={tw(p)} label={`${p}%`} dark={p >= 40} />
            ))}
          </div>
        </div>
        <div>
          <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", color: T.fgMuted }}>
            αランプ(over page bg、U字分布・中間帯を空ける):ring / divider / overlay
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.5rem",
              background: PAGE_BG,
              padding: "0.375rem",
              borderRadius: 8,
            }}
          >
            {alphaRamp.map((x) => (
              <Swatch key={x} bg={al(x)} label={`${Math.round(x * 100)}%`} dark={x >= 0.4} />
            ))}
          </div>
        </div>
      </div>

      {/* composite + danger cohabitation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {/* realistic panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            background: T.surface,
            borderRadius: "1rem",
            padding: "1.25rem",
            boxShadow:
              "0 0 0 1px color-mix(in oklch, oklch(0.20 0.01 65) 5%, transparent), 0 12px 28px -16px color-mix(in oklch, oklch(0.20 0.01 65) 14%, transparent)",
          }}
        >
          {/* subtle accent band behind a label */}
          <div
            style={{
              background: band,
              margin: "-1.25rem -1.25rem 0",
              padding: "0.5rem 1.25rem",
              borderRadius: "1rem 1rem 0 0",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: solid }}>
              制作ノート · Design System
            </span>
          </div>
          <h4
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: T.fgStrong,
              lineHeight: 1.25,
            }}
          >
            accent を実面に置く
          </h4>
          <p style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.49, color: T.fgSecondary }}>
            単一 accent から派生した tint だけで、selected・chip・band・ring まで賄えるか。 詳しくは{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ color: solid, fontWeight: 500, textUnderlineOffset: 3 }}
            >
              こちらのノート
            </a>{" "}
            を参照。
          </p>
          <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
            <MdBtn bg={solid} color="oklch(1 0 0)">
              送信する
            </MdBtn>
            <MdBtn bg={T.surfaceMuted} color={T.fgStrong}>
              下書き
            </MdBtn>
          </div>
          <MdInput
            label="メールアドレス(focus)"
            value="hello@otibo.dev"
            state="focus"
            accentSolid={solid}
          />
          {/* nav list with selected */}
          <div
            style={{
              background: T.surface,
              borderRadius: radius,
              boxShadow: T.fieldShadow,
              overflow: "hidden",
            }}
          >
            {["概要", "実装", "計測"].map((r, i) => {
              const sel = i === 1
              return (
                <div
                  key={r}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "1rem",
                    color: sel ? T.fgStrong : T.fgSecondary,
                    fontWeight: sel ? 500 : 400,
                    background: sel ? selectedBg : i === 2 ? hoverBg : "transparent",
                    boxShadow: sel ? `inset 3px 0 0 0 ${solid}` : "none",
                  }}
                >
                  {r}
                  {i === 2 && (
                    <span style={{ fontSize: "0.6875rem", color: T.fgMuted, marginLeft: 8 }}>
                      (hover 相当 = tint4%)
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {/* chips + meter */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            {["Panda", "Base UI", "OKLCH"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: solid,
                  background: chipBg,
                  boxShadow: `inset 0 0 0 1px ${chipBorder}`,
                  borderRadius: 9999,
                  padding: "0.1875rem 0.625rem",
                }}
              >
                {t}
              </span>
            ))}
            <span style={{ flex: 1 }} />
            <span
              style={{
                width: 120,
                height: 6,
                borderRadius: 9999,
                background: al(0.1),
                overflow: "hidden",
              }}
            >
              <span style={{ display: "block", width: "62%", height: "100%", background: solid }} />
            </span>
          </div>
        </div>

        {/* danger cohabitation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            background: T.surface,
            borderRadius: "1rem",
            padding: "1.25rem",
            boxShadow: "0 0 0 1px color-mix(in oklch, oklch(0.20 0.01 65) 5%, transparent)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: T.fgStrong }}>
            danger との同居
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.5, color: T.fgMuted }}>
            accent の selected / CTA と、error(danger H30)が隣り合っても役割が分かれて読めるか。
          </p>
          {/* accent selected vs danger error, adjacent */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.625rem",
              background: selectedBg,
              borderRadius: radius,
              boxShadow: `inset 3px 0 0 0 ${solid}`,
            }}
          >
            <span style={{ fontSize: "0.875rem", color: T.fgStrong, fontWeight: 500 }}>
              選択中の項目
            </span>
            <span style={{ marginLeft: "auto", fontSize: "0.6875rem", color: solid }}>accent</span>
          </div>
          <MdInput label="" value="不正な入力です" state="error" accentSolid={solid} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 0.625rem",
              background: DANGER_TINT,
              borderRadius: radius,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: DANGER }} />
            <span style={{ fontSize: "0.8125rem", color: DANGER, fontWeight: 500 }}>
              送信できませんでした
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <MdBtn bg={solid} color="oklch(1 0 0)">
              再送信
            </MdBtn>
            <span style={{ alignSelf: "center", fontSize: "0.6875rem", color: T.fgMuted }}>
              ← CTA は accent / error は danger
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export const SingleAccentDeep: Story = () => (
  <div
    style={{
      maxWidth: 1100,
      color: T.fg,
      display: "flex",
      flexDirection: "column",
      gap: "1.75rem",
    }}
  >
    <header style={{ maxWidth: 780 }}>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 600, color: T.fgStrong }}>
        単一 accent 最終確認 — Ultramarine(低彩度)
      </h2>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: T.fgSecondary }}>
        確定候補 oklch(0.46 0.11 265) / #395595 を全システムで最終確認。偏りは
        hue(紫一滴の藍)に、節度は低彩度に。 C0.11(馴染む)と
        C0.13(素性が少し残る)をガラスランプ・selected・danger 同居まで全面で見比べ、一色に決める。
        派生は α/白ランプのみ、semantic family は作らない。
      </p>
    </header>
    {ACCENTS.map((a) => (
      <AccentBlock key={a.name} a={a} />
    ))}
  </div>
)

/* =========================================================================
 * Focused study — Ultramarine 周辺で hue と chroma を一軸ずつ振り、
 * 「紫寄りの hue」と「低彩度」のどちらが効いているかを切り分ける。
 * ガラス treatment 込みで solid / chip / selected / focus を見る。
 * ========================================================================= */

function StudyCell({
  l,
  c,
  h,
  label,
  anchor,
  warn,
}: { l: number; c: number; h: number; label: string; anchor?: boolean; warn?: string }) {
  const solid = ok(l, c, h)
  const al2 = (x: number) => ok(l, c, h, x)
  const glass = (a: number, b: number) => `linear-gradient(180deg, ${al2(a)}, ${al2(b)})`
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          background: T.surface,
          borderRadius: "0.75rem",
          padding: "0.875rem",
          boxShadow: anchor
            ? `0 0 0 2px ${solid}, 0 8px 18px -14px rgba(40,33,20,0.25)`
            : "0 0 0 1px rgba(40,33,20,0.06), 0 8px 18px -14px rgba(40,33,20,0.2)",
        }}
      >
        <button
          type="button"
          style={{
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: "0.9375rem",
            lineHeight: 1.25,
            padding: "0.4375rem 1rem",
            minHeight: "2.25rem",
            borderRadius: radius,
            border: "none",
            background: solid,
            color: "oklch(1 0 0)",
            cursor: "pointer",
          }}
        >
          送信する
        </button>
        {/* glass chip + selected bar */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: solid,
              background: glass(0.1, 0.04),
              boxShadow: `inset 0 0 0 1px ${al2(0.2)}`,
              borderRadius: 9999,
              padding: "0.1875rem 0.625rem",
            }}
          >
            Aa
          </span>
          <span
            style={{
              flex: 1,
              height: 28,
              borderRadius: radius,
              background: glass(0.12, 0.05),
              boxShadow: `inset 3px 0 0 0 ${solid}`,
            }}
          />
        </div>
        {/* focus ring sample */}
        <span
          style={{
            display: "block",
            fontSize: "0.875rem",
            color: T.fgSubtle,
            background: T.surface,
            borderRadius: radius,
            padding: "0.375rem 0.625rem",
            boxShadow: `inset 0 0 0 2px ${solid}`,
          }}
        >
          focus
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: T.fgStrong }}>
          {label}
          {anchor && <span style={{ color: solid, fontWeight: 600 }}> ◀ 現</span>}
        </span>
        <code
          style={{
            fontSize: "0.6875rem",
            color: T.fgSubtle,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {solid}
        </code>
        {warn && <span style={{ fontSize: "0.6875rem", color: T.fgMuted }}>{warn}</span>}
      </div>
    </div>
  )
}

const HUE_SWEEP = [240, 250, 258, 265, 272].map((h) => ({
  l: 0.46,
  c: 0.15,
  h,
  label: `H${h}`,
  anchor: h === 265,
  warn: h >= 270 ? "除外帯(紫)入口" : undefined,
}))
const CHROMA_LADDER = [0.11, 0.13, 0.15, 0.17].map((c) => ({
  l: 0.46,
  c,
  h: 265,
  label: `C${c}`,
  anchor: c === 0.15,
  warn: c >= 0.17 ? "sRGB 頭打ち付近" : undefined,
}))

export const UltramarineStudy: Story = () => (
  <div
    style={{ maxWidth: 1100, color: T.fg, display: "flex", flexDirection: "column", gap: "2rem" }}
  >
    <header style={{ maxWidth: 780 }}>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 600, color: T.fgStrong }}>
        Ultramarine 周辺 — hue × chroma 切り分け
      </h2>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: T.fgSecondary }}>
        「Ultramarine &gt; Sapphire」の正体が、紫寄りの hue なのか低彩度なのかを分離する。
        各軸を一つだけ振り、他は固定。<strong style={{ color: T.fgStrong }}>◀ 現</strong> = 現
        Ultramarine(H265 / C0.15 / L0.46)。
      </p>
    </header>

    <div>
      <h3
        style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", fontWeight: 600, color: T.fgStrong }}
      >
        ① hue スイープ{" "}
        <span style={{ color: T.fgMuted, fontWeight: 400 }}>(C0.15 / L0.46 固定)</span>
      </h3>
      <p style={{ margin: "0 0 0.875rem", fontSize: "0.75rem", color: T.fgMuted }}>
        青(正補色 ≒H245)→ 紫一滴。どこで顔料的な深みが出て、どこで紫に倒れるか。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1rem",
        }}
      >
        {HUE_SWEEP.map((s) => (
          <StudyCell key={s.label} {...s} />
        ))}
      </div>
    </div>

    <div>
      <h3
        style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", fontWeight: 600, color: T.fgStrong }}
      >
        ② 彩度ラダー <span style={{ color: T.fgMuted, fontWeight: 400 }}>(H265 / L0.46 固定)</span>
      </h3>
      <p style={{ margin: "0 0 0.875rem", fontSize: "0.75rem", color: T.fgMuted }}>
        低彩度ほどガラス/透明感が素直に出る。濃さの最適点を探す。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1rem",
        }}
      >
        {CHROMA_LADDER.map((s) => (
          <StudyCell key={s.label} {...s} />
        ))}
      </div>
    </div>
  </div>
)

/* =========================================================================
 * Applied — accent を実 Core UI(本物の Button / Field / Card)に適用した姿。
 * accent = oklch(0.46 0.11 265)(#395595)。
 * 適用範囲(今回):Button intent="primary" / focus ring(field.focus・shadows.focus)。
 * 薄い tint バリエーション(selected / band)は派生方針確定後に追加するため未適用。
 * ========================================================================= */
export const AppliedRealUI: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: 640, color: T.fg }}
  >
    <header style={{ maxWidth: 600 }}>
      <h2
        style={{ margin: "0 0 0.375rem", fontSize: "1.5rem", fontWeight: 600, color: T.fgStrong }}
      >
        accent を実 Core UI に適用
      </h2>
      <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.55, color: T.fgSecondary }}>
        本物の Button / Field / Card に焼き込んだ accent(
        <code style={{ fontFamily: "ui-monospace, monospace" }}>oklch(0.46 0.11 265)</code> /
        #395595)。 今回は solid のロール(Button intent=accent・focus ring)のみ。薄い tint は保留。
      </p>
    </header>

    <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: T.fgMuted }}>
        Button ── primary が accent(2026-06-16 据え置き)
      </h3>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <Button intent="primary">送信する</Button>
        <Button intent="secondary">下書き</Button>
        <Button intent="ghost">履歴</Button>
      </div>
    </section>

    <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: T.fgMuted }}>
        focus ring ── accent 化(下の入力は autofocus)
      </h3>
      <Field.Root>
        <Field.Label>メールアドレス</Field.Label>
        <Field.Input autoFocus type="email" placeholder="hello@otibo.dev" />
        <Field.Description>確認メールをお送りします。</Field.Description>
      </Field.Root>
      <div>
        <span
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: T.fgStrong,
            marginBottom: "0.375rem",
          }}
        >
          standalone Input
        </span>
        <Input placeholder="focus してみてください" />
      </div>
    </section>

    <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: T.fgMuted }}>
        Card ── footer の CTA に accent
      </h3>
      <UICard.Root surface="paper" padding="md">
        <UICard.Header>
          <UICard.Title>通知設定</UICard.Title>
          <UICard.Description>静かな受け取りを基本に、必要なものだけ。</UICard.Description>
        </UICard.Header>
        <UICard.Body>
          <p>変更は次のセッションから反映されます。すでに開いている画面には影響しません。</p>
        </UICard.Body>
        <UICard.Footer>
          <Button intent="ghost">取り消す</Button>
          <Button intent="primary">変更を保存</Button>
        </UICard.Footer>
      </UICard.Root>
    </section>

    <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: T.fgMuted }}>
        accent を一画面に複数置く ── 薄い変奏(accent.subtle / muted)で「孤立した一点」を解消
      </h3>
      <div
        style={{
          background: "var(--colors-surface)",
          borderRadius: "1rem",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
          boxShadow:
            "0 0 0 1px color-mix(in oklch, oklch(0.20 0.01 65) 5%, transparent), 0 12px 28px -16px color-mix(in oklch, oklch(0.20 0.01 65) 14%, transparent)",
        }}
      >
        {/* band: accent.muted */}
        <div
          style={{
            background: "var(--colors-accent-muted)",
            margin: "-1.25rem -1.25rem 0",
            padding: "0.5rem 1.25rem",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--colors-accent)" }}>
            Design System
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: T.fgSecondary }}>
          詳しくは{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: "var(--colors-accent)", fontWeight: 500, textUnderlineOffset: 3 }}
          >
            制作ノート
          </a>{" "}
          を参照。
        </p>
        {/* selected nav: accent.subtle fill + accent line */}
        <div
          style={{
            background: "var(--colors-surface)",
            borderRadius: radius,
            boxShadow: "var(--shadows-field)",
            overflow: "hidden",
          }}
        >
          {["概要", "実装", "計測"].map((r, i) => {
            const sel = i === 1
            return (
              <div
                key={r}
                style={{
                  padding: "0.5rem 0.75rem",
                  fontSize: "1rem",
                  color: sel ? T.fgStrong : T.fgSecondary,
                  fontWeight: sel ? 500 : 400,
                  background: sel ? "var(--colors-accent-subtle)" : "transparent",
                  boxShadow: sel ? "inset 3px 0 0 0 var(--colors-accent)" : "none",
                }}
              >
                {r}
              </div>
            )
          })}
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <Button intent="primary">保存</Button>
          <Button intent="ghost">取り消す</Button>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: "0.75rem", color: T.fgMuted }}>
        この面では band / link / selected / CTA の 4 箇所に accent が乗る。値(subtle 12% / muted
        5%)は要詰め。
      </p>
    </section>
  </div>
)
