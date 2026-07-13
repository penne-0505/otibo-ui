import type { Story } from "@ladle/react"
import { css } from "@otibo/ui/styled-system/css"
import { type CSSProperties, useState } from "react"

import {
  Badge,
  BreadcrumbCurrent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbRoot,
  Button,
  CardBody,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
  LogoFrameFallback,
  LogoFrameImage,
  LogoFrameRoot,
  MediaFrameEmpty,
  MediaFrameImage,
  MediaFrameRoot,
  Prose,
  SegmentedControlItem,
  SegmentedControlRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  TableScroll,
} from "../index"

export default {
  title: "explore / アプリ例",
}

/**
 * プロジェクト概要 ── MediaFrame / LogoFrame / Prose / textStyles / TableScroll が
 * 一つの画面で噛み合うかを見る review 面。account-settings(設定)や gallery(作品一覧)
 * とは別の、editorial + 資産管理寄りの実用 UI。
 */

const logoSrc =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48">
      <text x="4" y="34" fill="#3d3a36" font-family="system-ui,sans-serif" font-size="28" font-weight="600">otibo</text>
    </svg>`,
  )

const coverSrc =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#cfc8be"/>
          <stop offset="55%" stop-color="#8f877c"/>
          <stop offset="100%" stop-color="#5c564e"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#g)"/>
      <text x="64" y="600" fill="#f5f1eb" font-family="system-ui,sans-serif" font-size="42" font-weight="600">Quiet Interior</text>
    </svg>`,
  )

const assets = [
  { name: "cover-hero.svg", kind: "図版", updated: "2026-07-11", owner: "penne", status: "公開" },
  { name: "logo-lockup.svg", kind: "ロゴ", updated: "2026-07-09", owner: "penne", status: "公開" },
  { name: "type-specimen.pdf", kind: "資料", updated: "2026-07-08", owner: "aya", status: "下書き" },
  { name: "moodboard-03.png", kind: "図版", updated: "2026-07-02", owner: "ken", status: "欠落" },
  { name: "press-kit.zip", kind: "配布", updated: "2026-06-28", owner: "penne", status: "公開" },
]

export const ProjectBrief: Story = () => {
  const [reading, setReading] = useState<"ui" | "article">("ui")
  const [hasCover, setHasCover] = useState(true)

  return (
    <div style={{ background: "var(--colors-bg)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div
        style={{
          maxWidth: "44rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <BreadcrumbRoot style={{ marginBottom: "0.5rem" }}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">プロジェクト</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbCurrent>Quiet Interior</BreadcrumbCurrent>
          </BreadcrumbItem>
        </BreadcrumbRoot>

        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
            <LogoFrameRoot size="lg" shape="auto">
              <LogoFrameImage src={logoSrc} alt="otibo" />
              <LogoFrameFallback>OT</LogoFrameFallback>
            </LogoFrameRoot>
            <div style={{ minWidth: 0 }}>
              <p className={css({ textStyle: "eyebrow", margin: "0 0 0.35rem" })}>Brand kit</p>
              <h1 className={css({ textStyle: "heading.md", margin: 0 })}>Quiet Interior</h1>
              <p className={css({ textStyle: "caption", margin: "0.35rem 0 0" })}>
                2026 · 写真 / editorial surface
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <Button intent="secondary" size="sm">
              共有
            </Button>
            <Button intent="primary" size="sm">
              編集
            </Button>
          </div>
        </header>

        <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <p className={css({ textStyle: "eyebrow", margin: 0 })}>Cover</p>
            <Button intent="ghost" size="sm" onClick={() => setHasCover((v) => !v)}>
              {hasCover ? "カバーを外す" : "カバーを戻す"}
            </Button>
          </div>
          <MediaFrameRoot aspect="video">
            {hasCover ? (
              <MediaFrameImage src={coverSrc} alt="Quiet Interior カバー" />
            ) : (
              <MediaFrameEmpty>
                カバー画像がありません
                <span className={css({ textStyle: "caption", display: "block", marginTop: "0.25rem" })}>
                  アップロードするか、既存アセットから選んでください
                </span>
              </MediaFrameEmpty>
            )}
          </MediaFrameRoot>
        </section>

        <CardRoot surface="flat" padding="lg">
          <CardHeader>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <CardDescription>Brief</CardDescription>
                <CardTitle>読み面としての概要</CardTitle>
              </div>
              <SegmentedControlRoot
                value={reading}
                onValueChange={(v) => {
                  if (v === "ui" || v === "article") setReading(v)
                }}
              >
                <SegmentedControlItem value="ui">UI</SegmentedControlItem>
                <SegmentedControlItem value="article">長文</SegmentedControlItem>
              </SegmentedControlRoot>
            </div>
          </CardHeader>
          <CardBody>
            <Prose reading={reading}>
              <h2>ひと手間から始める</h2>
              <p>
                otibo
                は誰かのひと手間に基づきます。架空のペルソナや調査の数字を出発点にしません。このプロジェクトでは、静かな室内写真を軸に、余白と明度差だけで面を組み立てます。
              </p>
              <h3>枠と読みの役割</h3>
              <p>
                カバーは MediaFrame、マークは LogoFrame、本文は
                Prose。見た目の声は textStyles の梯子に載せ、見出しの HTML
                レベルは文書構造側で選びます。
              </p>
              <blockquote>
                構造の区切りは線より先に余白。色の段差と間隔だけで領域を語り、content が前に出る面を保つ。
              </blockquote>
              <figcaption>プロジェクト原則メモ</figcaption>
            </Prose>
          </CardBody>
        </CardRoot>

        <CardRoot surface="flat" padding="lg">
          <CardHeader>
            <CardDescription>Assets</CardDescription>
            <CardTitle>公開アセット</CardTitle>
          </CardHeader>
          <CardBody>
            <p className={css({ textStyle: "caption", margin: "0 0 1rem" })}>
              狭い幅では TableScroll で横に送る。行カード化はしない。
            </p>
            <div style={{ maxWidth: "100%" }}>
              <TableScroll
                style={{ "--otibo-table-scroll-bg": "var(--colors-surface)" } as CSSProperties}
              >
                <TableRoot>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名前</TableHead>
                      <TableHead>種別</TableHead>
                      <TableHead>更新</TableHead>
                      <TableHead>担当</TableHead>
                      <TableHead>状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell style={{ whiteSpace: "nowrap" }}>{row.name}</TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>{row.kind}</TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>{row.updated}</TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>{row.owner}</TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          <Badge tone={row.status === "欠落" ? "danger" : "neutral"}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableRoot>
              </TableScroll>
            </div>
          </CardBody>
        </CardRoot>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p className={css({ textStyle: "eyebrow", margin: 0 })}>Lockup</p>
            <MediaFrameRoot aspect="square" fit="contain">
              <MediaFrameImage src={logoSrc} alt="otibo lockup" fit="contain" />
            </MediaFrameRoot>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p className={css({ textStyle: "eyebrow", margin: 0 })}>Missing still</p>
            <MediaFrameRoot aspect="square">
              <MediaFrameEmpty>moodboard-03.png</MediaFrameEmpty>
            </MediaFrameRoot>
          </div>
        </section>
      </div>
    </div>
  )
}
