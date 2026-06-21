import type { Story } from "@ladle/react"
import { useEffect, useRef, useState } from "react"

import { Container, Display, Eyebrow, Lede, Section } from "../index"

export default {
  title: "explore / editorial / 光の場 prototype",
}

/**
 * 光の場 prototype ─ unseen terrain × two lights × stipple plate。
 *
 * 設計の根拠:
 *   写真(山茶花の葉、海面の波、廊下の床、雲の塊)はいずれも「不可視の地形が
 *   光に向いて反射している」結果。点描を散らすのではなく、surface を作って光らせる。
 *
 * shader 構造:
 *   1. gradient noise の fbm と ridge fbm を `ridge` ratio で mix した height map。
 *   2. 二段 domain warping(q → r → 本計算)で起伏に流れを与える。
 *   3. central difference で gradient → 法線を推定。
 *   4. 2 光源 ─ 時刻でゆっくり巡回する orbiting light(常時動く)+ cursor light(preview)。
 *   5. 六角千鳥格子(行で半セル offset)で stipple を切り、流線方向に楕円化(flow)して描く。
 *
 * palette は ground(地)+ inkA(影 ink)+ inkB(光 ink)+ hi(highlight)の 4 色構造。
 * sepia 系の paper mode(白地に暗 ink)は uPaper で切替えるが、ここでは graphite のみ。
 *
 * 画像 (Plate Controls) の値を default として採用 ─ warp 0 / ridge 0 の素朴な fbm に
 * relief 3 / contrast 3.12 を効かせ、spacing 3 の密な点描で表現する。
 */

// ─────────────────────────────────────────────────────────────
// Shader
// ─────────────────────────────────────────────────────────────

const VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uLight1;
uniform vec2  uSeed;
uniform float uScale;
uniform float uDetail;
uniform float uWarp;
uniform float uRelief;
uniform float uContrast;
uniform float uRidge;
uniform float uLightH;
uniform float uSharp;
uniform float uDS;
uniform float uSpacing;
uniform float uRadius;
uniform float uThreshold;
uniform float uFlow;
uniform float uSoft;
uniform float uZoom;
uniform float uGrain;
uniform float uPaper;
uniform float uHalo;             // 高光部のエネルギーが点の隙間に漏れる
uniform float uVeil;             // 光源近傍に放射状の霞(ベーリンググレア)
uniform vec3  uGround;
uniform vec3  uInkA;
uniform vec3  uInkB;
uniform vec3  uHi;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 grd(vec2 i) {
  float a = hash(i) * 6.2831853;
  return vec2(cos(a), sin(a));
}

// gradient noise(perlin 系)
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(grd(i),                  f);
  float b = dot(grd(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(grd(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(grd(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 4 octave 固定の warp 用 fbm
float fbmW(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * gnoise(p);
    p = p * 2.03 + vec2(1.7, -3.1);
    a *= 0.5;
  }
  return v;
}

// 通常 fbm(octave 数を uDetail で可変)
float fbmF(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uDetail) break;
    v += a * gnoise(p);
    p = p * 2.03 + vec2(1.7, -3.1);
    a *= 0.5;
  }
  return v;
}

// ridge fbm ─ 1 - |2n-1| で折り返した山稜
float ridF(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uDetail) break;
    float n = gnoise(p);
    n = 1.0 - abs(2.0 * n - 1.0);
    n *= n;
    v += a * n;
    p = p * 2.03 + vec2(1.7, -3.1);
    a *= 0.5;
  }
  return v;
}

float height(vec2 p) {
  // 二段 domain warping
  vec2 q = vec2(fbmW(p), fbmW(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbmW(p + uWarp * q + vec2(1.7, 9.2)),
                fbmW(p + uWarp * q + vec2(8.3, 2.8)));
  float base = mix(fbmF(p + uWarp * r), ridF(p + uWarp * r), uRidge);
  return pow(clamp(base, 0.0, 1.0), uContrast);
}

float hgt(vec2 sv) { return height(sv * uScale + uSeed); }

// 画面 px → 画面正規化ベクトル(中心 0、y で正規化)
vec2 toSv(vec2 px) { return (px - 0.5 * uRes) / uRes.y / uZoom; }

float lit(vec3 n, vec2 sv, vec2 lsv, float attK) {
  vec3 d = vec3(lsv - sv, uLightH);
  float dist = length(d);
  vec3 L = d / dist;
  float diff = max(dot(n, L), 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), uSharp);
  float at = 1.0 / (1.0 + dist * dist * attK);
  return mix(diff, spec, uDS) * at;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float sp = uSpacing;
  // 六角千鳥 ─ 奇行を半セル offset
  float row = floor(frag.y / sp);
  float xoff = mod(row, 2.0) * 0.5 * sp;
  float coln = floor((frag.x - xoff) / sp);
  vec2 cc = vec2((coln + 0.5) * sp + xoff, (row + 0.5) * sp);
  vec2 sv = toSv(cc);

  // 中央差分で normal
  float e = 0.0024;
  float hc = hgt(sv);
  float hx = hgt(sv + vec2(e, 0.0)) - hc;
  float hy = hgt(sv + vec2(0.0, e)) - hc;
  vec3 n = normalize(vec3(-hx * uRelief, -hy * uRelief, e));

  // 2 光源 ─ 巡回 + cursor
  float tS = lit(n, sv, toSv(uLight1), 0.14);
  float tC = lit(n, sv, toSv(uMouse),  0.7);
  float t = 0.035 + 0.66 * tS + 1.5 * tC;
  float tn = clamp(t, 0.0, 1.0);
  // cursor 由来の光の割合 ─ 色相 mix で「触れた所だけ温度が変わる」
  float warmth = (1.5 * tC) / (0.66 * tS + 1.5 * tC + 1e-4);

  // 被覆率 ─ paper mode は反転(白地に暗 ink)
  float cov = (uPaper > 0.5) ? (1.0 - tn) : tn;
  cov = pow(clamp((cov - uThreshold) / (1.0 - uThreshold), 0.0, 1.0), 1.35);
  float r = uRadius * sqrt(cov);

  // 流線方向に楕円化 ─ normal の xy 成分を流線として採用
  vec2 qd = (frag - cc) / sp;
  vec2 dir = length(n.xy) > 1e-4 ? normalize(n.xy) : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 lq = vec2(dot(qd, dir), dot(qd, perp));
  lq.x /= (1.0 + uFlow * 1.8);
  float d = length(lq);
  float aa = (1.0 / sp) * (1.0 + uSoft * 7.0) + 0.004;
  float m = 1.0 - smoothstep(r - aa, r + aa, d);

  vec3 col;
  if (uPaper > 0.5) {
    vec3 ink = mix(uInkB, uInkA, 1.0 - tn);
    col = mix(uGround, ink, m);
  } else {
    vec3 ink = mix(uInkA, uInkB, warmth);
    vec3 litc = mix(ink * 0.16, ink, tn);
    litc = mix(litc, uHi, smoothstep(0.86, 1.0, tn) * 0.55);
    col = mix(uGround, litc, m);
  }
  // 光が「面として広がる」二段の処理 ─ paper mode(白地に暗 ink)では逆位相になるので
  // ここでは light mode のみに適用。将来 sepia 系を入れるときに paper 側の式を別途用意する。
  if (uPaper < 0.5) {
    // halation ── 高光部の cell ほど、点の隙間(1-m)にも光が滲み出る。
    // tn が cell discretized なので隣 cell 境界で段が出るが、grain と vignette に紛れて目立たない。
    col += uHi * smoothstep(0.55, 1.0, tn) * (1.0 - m) * uHalo;
    // veiling glare ── 光源(orbit + cursor)の連続的な距離減衰でベールを乗せる。
    // cell discretized な sv ではなく、ピクセル連続値の svP を使って滑らかに。
    vec2 svP = (frag - 0.5 * uRes) / uRes.y / uZoom;
    float gl1 = exp(-length(svP - toSv(uLight1)) * 1.8);
    float glC = exp(-length(svP - toSv(uMouse))  * 2.6);
    col += uHi * (gl1 + glC) * uVeil;
  }
  // grain ── per-frame noise(時間に非依存)
  float g = hash(frag * 0.37 + frag.yx * 0.11);
  col += (g - 0.5) * uGrain;
  // 中央 vignette(画面のみ、shader 内で完結)
  vec2 vv = (frag - 0.5 * uRes) / uRes;
  col *= 1.0 - dot(vv, vv) * 0.5;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

// ─────────────────────────────────────────────────────────────
// GL helpers
// ─────────────────────────────────────────────────────────────

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, source)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[shader]", gl.getShaderInfoLog(sh))
  }
  return sh
}

function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const prog = gl.createProgram()!
  gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER, vert))
  gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[program]", gl.getProgramInfoLog(prog))
  }
  return prog
}

// ─────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────

type RGB = readonly [number, number, number]

interface Palette {
  name: string
  ground: RGB
  inkA: RGB
  inkB: RGB
  hi: RGB
  paper: 0 | 1
}

// graphite ─ 暖色を抑えた銀板 plate。将来 bronze / verdigris / sepia を追加する余地は
// この Record に並べる(sepia は paper:1 で白地に暗 ink)。
const PALETTES: Record<"graphite", Palette> = {
  graphite: {
    name: "Graphite",
    ground: [0.027, 0.028, 0.036],
    inkA:   [0.40, 0.43, 0.49],
    inkB:   [0.78, 0.80, 0.84],
    hi:     [1.0, 1.0, 1.0],
    paper:  0,
  },
}

function hueRotate(rgb: RGB, h: number): RGB {
  const c = Math.cos(h), s = Math.sin(h)
  const m = [
    0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
    0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
    0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 0.203 * s,
  ]
  const r = rgb[0], g = rgb[1], b = rgb[2]
  const cx = (x: number) => Math.min(1, Math.max(0, x))
  return [
    cx(m[0]! * r + m[1]! * g + m[2]! * b),
    cx(m[3]! * r + m[4]! * g + m[5]! * b),
    cx(m[6]! * r + m[7]! * g + m[8]! * b),
  ]
}

// ─────────────────────────────────────────────────────────────
// LightField component
// ─────────────────────────────────────────────────────────────

interface LightFieldProps {
  palette: Palette
  // terrain
  scale: number
  detail: number
  warp: number
  relief: number
  contrast: number
  ridge: number
  // light
  height: number
  sharpness: number
  ds: number
  // stipple
  spacing: number
  radius: number
  threshold: number
  flow: number
  softness: number
  // screen
  zoom: number
  hue: number
  grain: number
  // haze ─ 光が「面として広がる」二段
  halo: number
  veil: number
  // 変更されると再シード(値そのものは使わない、変化検知用)
  seedKey?: number
  // cursor を 2 光源目として使うか(false なら画面外に飛ばし実質オフ)
  cursorAsLight?: boolean
}

function LightField(props: LightFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // 毎フレーム最新 props を読みたいので ref に同期
  const propsRef = useRef(props)
  propsRef.current = props

  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  // seed は React state にせず ref で保持。seedKey の変更で更新。
  const seedRef = useRef<[number, number]>([
    Math.random() * 60 - 30,
    Math.random() * 60 - 30,
  ])
  useEffect(() => {
    seedRef.current = [Math.random() * 80 - 40, Math.random() * 80 - 40]
  }, [props.seedKey])

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const gl = cv.getContext("webgl2", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) {
      console.warn("WebGL2 unavailable")
      return
    }

    const prog = createProgram(gl, VERT, FRAG)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uNames = [
      "uRes", "uTime", "uMouse", "uLight1", "uSeed",
      "uScale", "uDetail", "uWarp", "uRelief", "uContrast", "uRidge",
      "uLightH", "uSharp", "uDS",
      "uSpacing", "uRadius", "uThreshold", "uFlow", "uSoft",
      "uZoom", "uGrain", "uPaper", "uHalo", "uVeil",
      "uGround", "uInkA", "uInkB", "uHi",
    ] as const
    const U = {} as Record<(typeof uNames)[number], WebGLUniformLocation | null>
    for (const n of uNames) U[n] = gl.getUniformLocation(prog, n)

    let w = 0, h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const nw = Math.round(cv.clientWidth * dpr)
      const nh = Math.round(cv.clientHeight * dpr)
      if (cv.width !== nw || cv.height !== nh) {
        cv.width = nw
        cv.height = nh
      }
      gl.viewport(0, 0, cv.width, cv.height)
      w = cv.width
      h = cv.height
    }
    resize()
    window.addEventListener("resize", resize)

    const onPointerMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (rect.height - (e.clientY - rect.top)) * dpr,
      }
    }
    cv.addEventListener("pointermove", onPointerMove)

    const start = performance.now()
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      resize()
      const t = (performance.now() - start) / 1000
      const p = propsRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)

      const m = mouseRef.current ?? { x: w * 0.6, y: h * 0.62 }
      // cursor を切るときは光源計算が事実上 0 になるよう、画面外に飛ばす(attenuation 0.7)。
      const mx = p.cursorAsLight === false ? -9.0e6 : m.x
      const my = p.cursorAsLight === false ? -9.0e6 : m.y

      // orbiting light ─ 緩やかに巡回する補助光
      const orad = (0.30 + 0.05 * Math.sin(t * 0.07)) * h
      const l1x = 0.5 * w + orad * Math.cos(t * 0.12)
      const l1y = 0.5 * h + orad * Math.sin(t * 0.12 * 1.27)

      const hr = (p.hue || 0) * 6.2831853
      const inkA = hueRotate(p.palette.inkA, hr)
      const inkB = hueRotate(p.palette.inkB, hr)
      const hi = p.palette.paper ? p.palette.hi : hueRotate(p.palette.hi, hr)

      gl.uniform2f(U.uRes, w, h)
      gl.uniform1f(U.uTime, t)
      gl.uniform2f(U.uMouse, mx, my)
      gl.uniform2f(U.uLight1, l1x, l1y)
      gl.uniform2f(U.uSeed, seedRef.current[0], seedRef.current[1])
      gl.uniform1f(U.uScale, p.scale)
      gl.uniform1f(U.uDetail, p.detail)
      gl.uniform1f(U.uWarp, p.warp)
      gl.uniform1f(U.uRelief, p.relief)
      gl.uniform1f(U.uContrast, p.contrast)
      gl.uniform1f(U.uRidge, p.ridge)
      gl.uniform1f(U.uLightH, p.height)
      gl.uniform1f(U.uSharp, p.sharpness)
      gl.uniform1f(U.uDS, p.ds)
      gl.uniform1f(U.uSpacing, p.spacing * dpr)
      gl.uniform1f(U.uRadius, p.radius)
      gl.uniform1f(U.uThreshold, p.threshold)
      gl.uniform1f(U.uFlow, p.flow)
      gl.uniform1f(U.uSoft, p.softness)
      gl.uniform1f(U.uZoom, p.zoom)
      gl.uniform1f(U.uGrain, p.grain)
      gl.uniform1f(U.uPaper, p.palette.paper)
      gl.uniform1f(U.uHalo, p.halo)
      gl.uniform1f(U.uVeil, p.veil)
      gl.uniform3f(U.uGround, p.palette.ground[0], p.palette.ground[1], p.palette.ground[2])
      gl.uniform3f(U.uInkA, inkA[0], inkA[1], inkA[2])
      gl.uniform3f(U.uInkB, inkB[0], inkB[1], inkB[2])
      gl.uniform3f(U.uHi, hi[0], hi[1], hi[2])

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      cv.removeEventListener("pointermove", onPointerMove)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
    // 初期化は 1 回のみ。props は ref 経由で逐次反映。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// Preset
// ─────────────────────────────────────────────────────────────

interface ParamPreset {
  name: string
  hint?: string
  scale: number
  detail: number
  warp: number
  relief: number
  contrast: number
  ridge: number
  height: number
  sharpness: number
  ds: number
  spacing: number
  radius: number
  threshold: number
  flow: number
  softness: number
  zoom: number
  hue: number
  grain: number
  halo: number
  veil: number
}

// 画像 (Plate Controls) の値を default として採用。palette は graphite。
// halo / veil は逆光フィルム的な「光が侵食する湿度」を控えめに乗せる初期値。
const DEFAULT_PRESET: ParamPreset = {
  name: "Plate / default",
  hint: "warp 0 / ridge 0 ─ 素朴な fbm、起伏と明暗を強めに",
  scale: 0.90, detail: 4, warp: 0.00, relief: 3.00, contrast: 3.12, ridge: 0.00,
  height: 0.50, sharpness: 40, ds: 0.34,
  spacing: 3.0, radius: 0.72, threshold: 0.20, flow: 0.30, softness: 0.30,
  zoom: 1.00, hue: 0.000, grain: 0.05,
  halo: 0.25, veil: 0.06,
}

const PARAM_PRESETS: ParamPreset[] = [DEFAULT_PRESET]

// preset → LightField props
function presetToProps(p: ParamPreset, palette: Palette, extras?: { seedKey?: number; cursorAsLight?: boolean }): LightFieldProps {
  return {
    palette,
    scale: p.scale, detail: p.detail, warp: p.warp,
    relief: p.relief, contrast: p.contrast, ridge: p.ridge,
    height: p.height, sharpness: p.sharpness, ds: p.ds,
    spacing: p.spacing, radius: p.radius, threshold: p.threshold,
    flow: p.flow, softness: p.softness,
    zoom: p.zoom, hue: p.hue, grain: p.grain,
    halo: p.halo, veil: p.veil,
    ...extras,
  }
}

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

const bleedReset: React.CSSProperties = {
  margin: "-3rem -2rem",
  width: "calc(100% + 4rem)",
}

/**
 * Hero 想定 ─ default preset を Section に額装、cursor は 2 光源目として常時 ON。
 */
export const HeroDefault: Story = () => {
  return (
    <div style={bleedReset}>
      <div
        style={{
          background: "var(--colors-bg)",
          padding: "1.25rem",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Section
          padding="xl"
          tone="default"
          style={{
            background: "oklch(0.22 0.012 65)",
            // 角丸/影をやめ、矩形 + 内側 hairline frame に。
            // 1px の白い線が「景色を額装している」と読ませる ─ 外周の warm.50 余白と対比で frame 化。
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)",
          }}
        >
          <LightField {...presetToProps(DEFAULT_PRESET, PALETTES.graphite, { cursorAsLight: true })} />
          {/* ガラス層 ─ 景色を直接ではなく「ガラス越し」に見せる */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(3px) saturate(108%)",
              WebkitBackdropFilter: "blur(3px) saturate(108%)",
              background: "oklch(0.95 0.008 65 / 0.04)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* vignette ─ 中央透明、四隅を控えめに沈める */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 110% 120% at 50% 50%, transparent 55%, oklch(0.08 0 0 / 0.25) 92%, oklch(0.05 0 0 / 0.45) 100%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <Container width="default">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-8)",
                position: "relative",
              }}
            >
              <div style={{ position: "relative", zIndex: 1 }}>
                <Eyebrow caps="literal" size="md" style={{ color: "oklch(0.92 0.012 65)" }}>
                  otibo
                </Eyebrow>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <Display
                  size="5xl"
                  style={{
                    color: "oklch(0.96 0.012 65)",
                    maskImage: "linear-gradient(to bottom, black 92%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 92%, transparent 100%)",
                  }}
                >
                  誰かの
                  <span style={{ fontWeight: 600, color: "oklch(0.94 0.045 75)" }}>
                    ひと手間
                  </span>
                  に、
                  <br />
                  ぴったりの道具を。
                </Display>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <Lede size="lg" style={{ color: "oklch(0.82 0.012 65)" }}>
                  見過ごされる小さな手間に、光をあてる。その形が浮かびあがったところに、ぴったりの道具をつくる。
                </Lede>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </div>
  )
}

/**
 * default を基点に、地形系 3 軸(warp / ridge / spacing)を一つずつ振った 4 枚。
 * 同じシステムでもパラメータひとつで印象がどう動くかを並べて見るための grid。
 */
export const TuningGrid: Story = () => {
  const variants: Array<{ label: string; preset: ParamPreset }> = [
    {
      label: "default ── warp 0 / ridge 0",
      preset: DEFAULT_PRESET,
    },
    {
      label: "warp 1.5 ── 流れと歪み",
      preset: { ...DEFAULT_PRESET, warp: 1.5 },
    },
    {
      label: "ridge 0.7 ── 山稜状",
      preset: { ...DEFAULT_PRESET, ridge: 0.7 },
    },
    {
      label: "spacing 8 / radius 0.5 ── 疎な点",
      preset: { ...DEFAULT_PRESET, spacing: 8, radius: 0.5, threshold: 0.04 },
    },
  ]

  return (
    <div style={bleedReset}>
      <p
        style={{
          padding: "var(--spacing-3) var(--spacing-6)",
          margin: 0,
          fontFamily: "var(--fonts-mono)",
          fontSize: "var(--font-sizes-xs)",
          color: "var(--colors-fg-muted)",
          background: "var(--colors-bg)",
        }}
      >
        cursor を canvas 上で動かしてください ── 巡回光と合わせて二つの光が地形を撫でます。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridAutoRows: "min(45vh, 380px)",
          gap: "1px",
          background: "var(--colors-border-subtle)",
        }}
      >
        {variants.map((v) => (
          <div
            key={v.label}
            style={{
              position: "relative",
              background: "oklch(0.05 0.004 250)",
              overflow: "hidden",
            }}
          >
            <LightField {...presetToProps(v.preset, PALETTES.graphite, { cursorAsLight: true })} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "var(--spacing-6)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                pointerEvents: "none",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--fonts-mono)",
                  fontSize: "var(--font-sizes-xs)",
                  letterSpacing: "var(--letter-spacings-wide)",
                  color: "oklch(0.85 0.013 65)",
                  background: "color-mix(in oklch, oklch(0.05 0.004 250) 80%, transparent)",
                  padding: "var(--spacing-2)",
                  width: "fit-content",
                }}
              >
                {v.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Interactive
// ─────────────────────────────────────────────────────────────

export const Interactive: Story = () => {
  // terrain
  const [scale, setScale] = useState(DEFAULT_PRESET.scale)
  const [detail, setDetail] = useState(DEFAULT_PRESET.detail)
  const [warp, setWarp] = useState(DEFAULT_PRESET.warp)
  const [relief, setRelief] = useState(DEFAULT_PRESET.relief)
  const [contrast, setContrast] = useState(DEFAULT_PRESET.contrast)
  const [ridge, setRidge] = useState(DEFAULT_PRESET.ridge)
  // light
  const [height, setHeight] = useState(DEFAULT_PRESET.height)
  const [sharpness, setSharpness] = useState(DEFAULT_PRESET.sharpness)
  const [ds, setDs] = useState(DEFAULT_PRESET.ds)
  // stipple
  const [spacing, setSpacing] = useState(DEFAULT_PRESET.spacing)
  const [radius, setRadius] = useState(DEFAULT_PRESET.radius)
  const [threshold, setThreshold] = useState(DEFAULT_PRESET.threshold)
  const [flow, setFlow] = useState(DEFAULT_PRESET.flow)
  const [softness, setSoftness] = useState(DEFAULT_PRESET.softness)
  // screen
  const [zoom, setZoom] = useState(DEFAULT_PRESET.zoom)
  const [hue, setHue] = useState(DEFAULT_PRESET.hue)
  const [grain, setGrain] = useState(DEFAULT_PRESET.grain)
  // haze
  const [halo, setHalo] = useState(DEFAULT_PRESET.halo)
  const [veil, setVeil] = useState(DEFAULT_PRESET.veil)
  // misc
  const [seedKey, setSeedKey] = useState(0)
  const [cursorAsLight, setCursorAsLight] = useState(true)

  const applyPreset = (p: ParamPreset) => {
    setScale(p.scale); setDetail(p.detail); setWarp(p.warp)
    setRelief(p.relief); setContrast(p.contrast); setRidge(p.ridge)
    setHeight(p.height); setSharpness(p.sharpness); setDs(p.ds)
    setSpacing(p.spacing); setRadius(p.radius); setThreshold(p.threshold)
    setFlow(p.flow); setSoftness(p.softness)
    setZoom(p.zoom); setHue(p.hue); setGrain(p.grain)
    setHalo(p.halo); setVeil(p.veil)
  }

  return (
    <div style={bleedReset}>
      <div
        style={{
          padding: "var(--spacing-3) var(--spacing-6)",
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-4)",
          fontFamily: "var(--fonts-mono)",
          fontSize: "var(--font-sizes-xs)",
          color: "var(--colors-fg-muted)",
          background: "var(--colors-bg)",
        }}
      >
        <span>
          cursor を canvas 上で動かしてください ── 巡回光と合わせて二つの光が地形を撫でます。
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "var(--spacing-2)", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-1)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={cursorAsLight}
              onChange={(e) => setCursorAsLight(e.target.checked)}
            />
            cursor light
          </label>
          <button
            type="button"
            onClick={() => setSeedKey((v) => v + 1)}
            style={{
              padding: "2px 10px",
              border: "1px solid var(--colors-border)",
              background: "transparent",
              color: "var(--colors-fg-secondary)",
              fontFamily: "inherit",
              fontSize: "11px",
              cursor: "pointer",
              borderRadius: "var(--radii-xs)",
            }}
          >
            ↺ seed
          </button>
          <span style={{ color: "var(--colors-fg-subtle)" }}>preset:</span>
          {PARAM_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              title={p.hint}
              style={{
                padding: "2px 10px",
                border: "1px solid var(--colors-border)",
                background: "transparent",
                color: "var(--colors-fg-secondary)",
                fontFamily: "inherit",
                fontSize: "11px",
                cursor: "pointer",
                borderRadius: "var(--radii-xs)",
              }}
            >
              {p.name}
            </button>
          ))}
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: "70vh",
          overflow: "hidden",
          background: "oklch(0.05 0.004 250)",
        }}
      >
        <LightField
          palette={PALETTES.graphite}
          scale={scale} detail={detail} warp={warp}
          relief={relief} contrast={contrast} ridge={ridge}
          height={height} sharpness={sharpness} ds={ds}
          spacing={spacing} radius={radius} threshold={threshold}
          flow={flow} softness={softness}
          zoom={zoom} hue={hue} grain={grain}
          halo={halo} veil={veil}
          seedKey={seedKey}
          cursorAsLight={cursorAsLight}
        />
      </div>
      <div
        style={{
          padding: "var(--spacing-4) var(--spacing-6)",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridAutoRows: "min-content",
          gap: "var(--spacing-3) var(--spacing-5)",
          background: "var(--colors-bg)",
          borderTop: "1px solid var(--colors-border-subtle)",
          fontFamily: "var(--fonts-mono)",
          fontSize: "var(--font-sizes-xs)",
          color: "var(--colors-fg-secondary)",
        }}
      >
        {/* TERRAIN */}
        <Slider label="scale"    category="地形" value={scale}    onChange={setScale}    min={0.5} max={8}   step={0.1}  format={(v) => v.toFixed(2)} hint="周波数 ─ 小=なだらか / 大=ざらつき" />
        <Slider label="detail"   category="地形" value={detail}   onChange={setDetail}   min={1}   max={8}   step={1}    format={(v) => v.toString()} hint="fbm octave ─ 小=単純 / 大=多層" />
        <Slider label="warp"     category="地形" value={warp}     onChange={setWarp}     min={0}   max={2.2} step={0.01} format={(v) => v.toFixed(2)} hint="歪み(domain warp) ─ 0=均質 / 高=うねる" />
        <Slider label="relief"   category="地形" value={relief}   onChange={setRelief}   min={0.2} max={3}   step={0.01} format={(v) => v.toFixed(2)} hint="法線の立ち具合 ─ 低=平坦 / 高=急峻" />
        <Slider label="contrast" category="地形" value={contrast} onChange={setContrast} min={0.5} max={3.2} step={0.01} format={(v) => v.toFixed(2)} hint="振幅 ─ 高低差の絶対量。<1=平坦 / >1=起伏強" />
        <Slider label="ridge"    category="地形" value={ridge}    onChange={setRidge}    min={0}   max={1}   step={0.01} format={(v) => v.toFixed(2)} hint="山稜混合 ─ 0=滑らか fbm / 1=ridge(山稜)" />

        {/* LIGHT */}
        <Slider label="height"    category="光" value={height}    onChange={setHeight}    min={0.05} max={1.6} step={0.01} format={(v) => v.toFixed(2)} hint="光源の高さ ─ 0=斜光(撫でる) / 1=真上" />
        <Slider label="sharpness" category="光" value={sharpness} onChange={setSharpness} min={2}    max={160} step={1}    format={(v) => v.toFixed(0)} hint="反射の鋭さ ─ 低=面光 / 高=ピンスポット" />
        <Slider label="diff↔spec" category="光" value={ds}        onChange={setDs}        min={0}    max={1}   step={0.01} format={(v) => v.toFixed(2)} hint="0=純 diffuse(紙布石) / 1=純 specular(金属)" />
        <Slider label="halo"      category="光" value={halo}      onChange={setHalo}      min={0}    max={1}   step={0.01} format={(v) => v.toFixed(2)} hint="halation ─ 高光部が点の隙間を侵食する強さ" />
        <Slider label="veil"      category="光" value={veil}      onChange={setVeil}      min={0}    max={0.3} step={0.005} format={(v) => v.toFixed(3)} hint="ベーリンググレア ─ 光源近傍に放射状の霞" />

        {/* STIPPLE */}
        <Slider label="spacing"   category="点" value={spacing}   onChange={setSpacing}   min={3}   max={22}   step={0.5}  format={(v) => v.toFixed(1)} hint="セル幅 ─ 小=密 / 大=疎" />
        <Slider label="radius"    category="点" value={radius}    onChange={setRadius}    min={0.1} max={0.72} step={0.01} format={(v) => v.toFixed(2)} hint="点の最大半径 ─ cell 比率" />
        <Slider label="threshold" category="点" value={threshold} onChange={setThreshold} min={0}   max={0.85} step={0.01} format={(v) => v.toFixed(2)} hint="切り捨て ─ これ未満は消える(無地担保)" />
        <Slider label="flow"      category="点" value={flow}      onChange={setFlow}      min={0}   max={1}    step={0.01} format={(v) => v.toFixed(2)} hint="流線方向に楕円化 ─ 0=円 / 1=長い楕円" />
        <Slider label="softness"  category="点" value={softness}  onChange={setSoftness}  min={0}   max={1}    step={0.01} format={(v) => v.toFixed(2)} hint="縁の柔らかさ ─ 0=硬 / 1=ぼやけ" />

        {/* SCREEN */}
        <Slider label="zoom"  category="画" value={zoom}  onChange={setZoom}  min={0.3} max={3.2} step={0.01}  format={(v) => v.toFixed(2)} hint="視点の遠近 ─ >1=広く写る" />
        <Slider label="hue"   category="画" value={hue}   onChange={setHue}   min={0}   max={1}   step={0.001} format={(v) => v.toFixed(3)} hint="色相シフト ─ 0=palette 素のまま" />
        <Slider label="grain" category="画" value={grain} onChange={setGrain} min={0}   max={0.2} step={0.005} format={(v) => v.toFixed(3)} hint="ノイズ ─ 軽い粒子感" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slider
// ─────────────────────────────────────────────────────────────

interface SliderProps {
  label: string
  category: "地形" | "光" | "点" | "画"
  value: number
  format: (v: number) => string
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  hint: string
}

const CATEGORY_COLOR: Record<SliderProps["category"], string> = {
  地形: "oklch(0.55 0.04 70)",
  光:   "oklch(0.58 0.08 80)",
  点:   "oklch(0.55 0.05 50)",
  画:   "oklch(0.55 0.06 200)",
}

function Slider({ label, category, value, format, onChange, min, max, step, hint }: SliderProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: CATEGORY_COLOR[category],
            minWidth: "2.4em",
          }}
        >
          {category}
        </span>
        <span style={{ color: "var(--colors-fg-strong)", fontSize: "var(--font-sizes-xs)" }}>{label}</span>
        <span style={{ marginLeft: "auto", color: "var(--colors-fg-muted)", fontVariantNumeric: "tabular-nums" }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
      <div
        style={{
          fontSize: "10px",
          lineHeight: 1.35,
          color: "var(--colors-fg-subtle)",
          letterSpacing: "0.01em",
        }}
      >
        {hint}
      </div>
    </label>
  )
}
