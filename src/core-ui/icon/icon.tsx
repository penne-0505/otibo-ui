import type { ReactNode, SVGProps } from "react"

/**
 * Icon ── 汎用アイコン。`<Icon name="check" />` で引く。
 *
 * 方針:
 *   - すべて viewBox 16 の stroke ベース(fill ではなく線)。色は currentColor を
 *     継承するので、置いた文脈の color がそのまま乗る(checkbox の白、accent 等)。
 *   - round cap / join で otibo の柔らかい線質に揃える。strokeWidth は icon ごとの
 *     最適値を registry に持ち、必要なら prop で上書き。
 *   - size 既定は 1em(文脈の font-size 追従)。
 *
 * 新しいアイコンは REGISTRY に body(中身の path / circle)と strokeWidth を足すだけ。
 */
const REGISTRY = {
  // pathLength={1} で幾何長を 1 に正規化 → checkbox の「描く」アニメは dasharray:1 /
  // offset 1→0 だけで扱える(stroke の実長に依らず描画完了が末尾でぴたり揃う)。
  // 通常描画には影響しない(dash 系プロパティを使う文脈でのみ効く)。
  check: { body: <path d="M3.5 8.5L6.5 11.5L12.5 5" pathLength={1} />, strokeWidth: 2 },
  dash: { body: <path d="M4 8h8" pathLength={1} />, strokeWidth: 2 },
  plus: { body: <path d="M8 4V12M4 8H12" />, strokeWidth: 1.5 },
  minus: { body: <path d="M4 8H12" />, strokeWidth: 1.5 },
  grid: {
    body: (
      <>
        <rect x="2.75" y="2.75" width="4" height="4" rx="1" />
        <rect x="9.25" y="2.75" width="4" height="4" rx="1" />
        <rect x="2.75" y="9.25" width="4" height="4" rx="1" />
        <rect x="9.25" y="9.25" width="4" height="4" rx="1" />
      </>
    ),
    strokeWidth: 1.3,
  },
  list: { body: <path d="M3 4.5H13M3 8H13M3 11.5H13" />, strokeWidth: 1.5 },
  star: {
    body: (
      <path d="M8 2.5l1.7 3.45 3.8.55-2.75 2.68.65 3.79L8 11.18l-3.4 1.79.65-3.79L2.5 6.5l3.8-.55z" />
    ),
    strokeWidth: 1.2,
  },
  "chevron-down": { body: <path d="M4 6L8 10L12 6" />, strokeWidth: 1.75 },
  search: {
    body: (
      <>
        <circle cx="7" cy="7" r="3.4" />
        <path d="M9.7 9.7L13.2 13.2" />
      </>
    ),
    strokeWidth: 1.5,
  },
  "chevron-left": { body: <path d="M10 4L6 8L10 12" />, strokeWidth: 1.75 },
  "chevron-right": { body: <path d="M6 4L10 8L6 12" />, strokeWidth: 1.75 },
  close: { body: <path d="M4 4L12 12M12 4L4 12" />, strokeWidth: 1.5 },
  more: {
    body: (
      <>
        <circle cx="4" cy="8" r="1.05" fill="currentColor" stroke="none" />
        <circle cx="8" cy="8" r="1.05" fill="currentColor" stroke="none" />
        <circle cx="12" cy="8" r="1.05" fill="currentColor" stroke="none" />
      </>
    ),
    strokeWidth: 0,
  },
  user: {
    body: (
      <>
        <circle cx="8" cy="5.8" r="2.6" />
        <path d="M3.6 13.2c.5-2.6 2.3-4.1 4.4-4.1s3.9 1.5 4.4 4.1" />
      </>
    ),
    strokeWidth: 1.4,
  },
  help: {
    body: (
      <>
        <path d="M6.1 6.2a1.9 1.9 0 1 1 2.6 1.8c-.6.3-.9.7-.9 1.3v.3" />
        <circle cx="8" cy="11.4" r="0.65" fill="currentColor" stroke="none" />
      </>
    ),
    strokeWidth: 1.5,
  },
} satisfies Record<string, { body: ReactNode; strokeWidth?: number }>

export type IconName = keyof typeof REGISTRY

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName
  /** 既定 1em(文脈の font-size に追従)。px や em を渡せる。 */
  size?: string | number
}

export function Icon({ name, size = "1em", strokeWidth, ...props }: IconProps) {
  const icon = REGISTRY[name]
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? icon.strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {icon.body}
    </svg>
  )
}
