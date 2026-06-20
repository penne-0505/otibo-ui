import type { Story } from "@ladle/react"
import { useState } from "react"

import {
  Badge,
  Chip,
  ChipGroup,
  Icon,
  NavigationMenu,
  PreviewCard,
  Toggle,
  ToggleGroup,
} from "../index"

export default {
  title: "explore / ギャラリー",
}

/**
 * 作品ギャラリー ── Toggle が本領を発揮する画面。
 *   - 表示切替(グリッド / リスト)= 単一選択の ToggleGroup。実際にレイアウトが変わる。
 *   - 各作品の ★お気に入り = 単体 Toggle(押し込み状態を保持)。
 * account-settings(設定 = Switch の領分)とは別の、toolbar/コンテンツ系の実例。
 */

type Work = { id: number; title: string; tag: string; seed: string }

const works: Work[] = [
  { id: 1, title: "Mountain Pass", tag: "写真", seed: "otibo-a" },
  { id: 2, title: "Neon District", tag: "3D", seed: "otibo-b" },
  { id: 3, title: "Paper Studies", tag: "グラフィック", seed: "otibo-c" },
  { id: 4, title: "Coast at Dawn", tag: "写真", seed: "otibo-d" },
  { id: 5, title: "Type Specimen", tag: "タイポ", seed: "otibo-e" },
  { id: 6, title: "Quiet Interior", tag: "写真", seed: "otibo-f" },
]

const tags = ["写真", "3D", "グラフィック", "タイポ"]

const cardShadow =
  "0 0 0 1px color-mix(in oklch, var(--colors-fg-strong) 5%, transparent), 0 8px 20px -14px color-mix(in oklch, var(--colors-fg-strong) 12%, transparent)"

const titleStyle: React.CSSProperties = {
  fontSize: "0.9375rem",
  color: "var(--colors-fg-strong)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

// PreviewCard を仕込んだ作品タイトル。recipe の trigger slot が hover response(accent + 下線)を
// 自動で乗せるので、消費側は href と中身だけ渡す。
function TitleWithPreview({ work }: { work: Work }) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger render={<a href="#">{work.title}</a>} />
      <PreviewCard.Popup>
        <PreviewCard.Media
          src={`https://picsum.photos/seed/${work.seed}/640/400`}
          alt={work.title}
        />
        <PreviewCard.Body>
          <PreviewCard.Title>{work.title}</PreviewCard.Title>
          <PreviewCard.Description>2026 / {work.tag}</PreviewCard.Description>
        </PreviewCard.Body>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  )
}

function FavoriteToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <Toggle pressed={on} onPressedChange={onChange} aria-label="お気に入り">
      <Icon name="star" size="1rem" />
    </Toggle>
  )
}

function GridCard({ work, on, onFav }: { work: Work; on: boolean; onFav: (v: boolean) => void }) {
  return (
    <div
      style={{
        background: "var(--colors-surface)",
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: cardShadow,
      }}
    >
      <img
        src={`https://picsum.photos/seed/${work.seed}/400/260`}
        alt={work.title}
        style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }}
      />
      <div
        style={{
          padding: "0.75rem 0.875rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={titleStyle}>
            <TitleWithPreview work={work} />
          </div>
          <div style={{ marginTop: "0.3rem" }}>
            <Badge tone="neutral">{work.tag}</Badge>
          </div>
        </div>
        <FavoriteToggle on={on} onChange={onFav} />
      </div>
    </div>
  )
}

function ListRow({ work, on, onFav }: { work: Work; on: boolean; onFav: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: "var(--colors-surface)",
        borderRadius: "0.75rem",
        padding: "0.625rem",
        boxShadow: cardShadow,
      }}
    >
      <img
        src={`https://picsum.photos/seed/${work.seed}/120/120`}
        alt={work.title}
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "0.5rem",
          objectFit: "cover",
          flexShrink: 0,
          display: "block",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={titleStyle}>{work.title}</div>
        <div style={{ marginTop: "0.3rem" }}>
          <Badge tone="neutral">{work.tag}</Badge>
        </div>
      </div>
      <FavoriteToggle on={on} onChange={onFav} />
    </div>
  )
}

export const Gallery: Story = () => {
  const [view, setView] = useState<string[]>(["grid"])
  const [filters, setFilters] = useState<string[]>([])
  const [favorites, setFavorites] = useState<number[]>([2])
  const isGrid = view.includes("grid")

  const setFav = (id: number) => (v: boolean) =>
    setFavorites((f) => (v ? [...f, id] : f.filter((x) => x !== id)))

  // 非排他フィルタ:選んだタグ(複数可)に一致する作品だけ。未選択なら全部。
  const shown = filters.length ? works.filter((w) => filters.includes(w.tag)) : works

  return (
    <div style={{ background: "var(--colors-bg)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        {/* portfolio 風 top nav。作品/ブログに dropdown、About は直リンク。Viewport は共有 box。 */}
        <NavigationMenu.Root style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--fonts-body)",
                fontWeight: 600,
                color: "var(--colors-fg-strong)",
              }}
            >
              otibo
            </span>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>作品</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <NavigationMenu.Grid>
                    <NavigationMenu.Link href="#">2026 すべて</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">写真</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">3D</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">グラフィック</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">タイポ</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">アーカイブ</NavigationMenu.Link>
                  </NavigationMenu.Grid>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>ブログ</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <NavigationMenu.Grid>
                    <NavigationMenu.Link href="#">最新の記事</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">デザイン</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">技術ノート</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">読みもの</NavigationMenu.Link>
                  </NavigationMenu.Grid>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#" plain>
                  About
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </div>
          <NavigationMenu.Viewport />
        </NavigationMenu.Root>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--colors-fg-strong)",
              margin: 0,
            }}
          >
            作品
          </h1>
          {/* 表示切替:単一選択(空にはしない=必ず一つ)。 */}
          <ToggleGroup value={view} onValueChange={(v) => v.length && setView(v as string[])}>
            <Toggle value="grid" aria-label="グリッド表示">
              <Icon name="grid" size="1.125rem" />
            </Toggle>
            <Toggle value="list" aria-label="リスト表示">
              <Icon name="list" size="1.125rem" />
            </Toggle>
          </ToggleGroup>
        </div>

        {/* 非排他フィルタ:Chip(角丸ピル)で、タグを好きなだけ重ねて絞り込む(複数 on 可)。 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <ChipGroup value={filters} onValueChange={(v) => setFilters(v as string[])} multiple>
            {tags.map((t) => (
              <Chip key={t} value={t} aria-label={`${t}で絞り込み`}>
                {t}
              </Chip>
            ))}
          </ChipGroup>
          {filters.length > 0 && (
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--colors-fg-muted)",
                marginInlineStart: "0.25rem",
              }}
            >
              {shown.length} 件
            </span>
          )}
        </div>

        <div
          style={
            isGrid
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1.25rem",
                }
              : { display: "flex", flexDirection: "column", gap: "0.75rem" }
          }
        >
          {shown.map((w) =>
            isGrid ? (
              <GridCard key={w.id} work={w} on={favorites.includes(w.id)} onFav={setFav(w.id)} />
            ) : (
              <ListRow key={w.id} work={w} on={favorites.includes(w.id)} onFav={setFav(w.id)} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
