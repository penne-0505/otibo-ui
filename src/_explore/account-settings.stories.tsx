import type { Story } from "@ladle/react"
import { useState } from "react"

import { Badge, Button, Checkbox, Icon, InlineEdit, Link, Radio, RadioGroup, Slider, Spinner, Switch, AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel, AvatarRoot, AvatarImage, AvatarFallback, BreadcrumbRoot, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, CardRoot, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, ComboboxRoot, ComboboxInput, ComboboxPopup, ComboboxList, ComboboxItem, ComboboxEmpty, DialogRoot, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogClose, FieldRoot, FieldLabel, FieldInput, FieldDescription, MenuRoot, MenuTrigger, MenuPopup, MenuItem, MenuSeparator, MeterRoot, MeterLabel, MeterValue, MeterTrack, NumberFieldRoot, NumberFieldField, PaginationRoot, PaginationItem, PaginationPrev, PaginationNext, PaginationEllipsis, PopoverRoot, PopoverTrigger, PopoverPopup, PopoverTitle, PopoverDescription, SegmentedControlRoot, SegmentedControlItem, SelectRoot, SelectTrigger, SelectValue, SelectPopup, SelectItem, SelectItemText, TableRoot, TableHeader, TableBody, TableRow, TableHead, TableCell, TabsRoot, TabsList, TabsTab, TabsPanel, ToastProvider, ToastToaster, useToastManager, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPopup } from "../index"

export default {
  title: "explore / アプリ例",
}

/**
 * アカウント設定画面 ── Core UI 14 種で一つの実用 UI を組んだ review 面。
 * 「並べて見せる」ではなく「実際に使うと噛み合うか」を見るための画面。
 * 白い Card が warm.50 のページに浮く本来の構図で、影の tier(Card paper /
 * overlay lift)も実画面のまま比較できる。
 */

const timezones = [
  { value: "jst", label: "東京 (GMT+9)" },
  { value: "ict", label: "バンコク (GMT+7)" },
  { value: "cet", label: "ベルリン (GMT+1)" },
  { value: "pst", label: "サンフランシスコ (GMT-8)" },
]

const baseSessions = [
  { device: "MacBook Pro", place: "東京", last: "たった今" },
  { device: "iPhone 15", place: "東京", last: "2時間前" },
  { device: "Chrome / Windows", place: "大阪", last: "3日前" },
  { device: "iPad Air", place: "東京", last: "5日前" },
  { device: "Firefox / Linux", place: "福岡", last: "1週間前" },
  { device: "Safari / macOS", place: "札幌", last: "2週間前" },
  { device: "Pixel 8", place: "名古屋", last: "3週間前" },
]
// 「何十ページ」時の windowing を見るため、同じダミーを繰り返して件数を増やす(90 件 = 30 ページ)。
const countries = [
  "日本",
  "アメリカ",
  "イギリス",
  "ドイツ",
  "フランス",
  "中国",
  "韓国",
  "インド",
  "ブラジル",
  "カナダ",
  "オーストラリア",
  "イタリア",
  "スペイン",
  "オランダ",
  "スウェーデン",
  "シンガポール",
]

const sessions = Array.from({ length: 90 }, (_, i) => baseSessions[i % baseSessions.length]!)
const SESSIONS_PER_PAGE = 3
const sessionPageCount = Math.ceil(sessions.length / SESSIONS_PER_PAGE)

// 1 … 現在±1 … last で窓表示(端は詰める)。
function pageWindow(page: number, total: number): Array<number | "ellipsis"> {
  const out: Array<number | "ellipsis"> = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) out.push(i)
    else if (out[out.length - 1] !== "ellipsis") out.push("ellipsis")
  }
  return out
}

// help アイコン(Tooltip のトリガに使う、低 affordance の丸ボタン)
function HelpDot({ children }: { children: React.ReactNode }) {
  return (
    <TooltipRoot>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="補足"
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              border: "none",
              background: "var(--colors-surface-muted)",
              color: "var(--colors-fg-muted)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="help" size="14px" />
          </button>
        }
      />
      <TooltipPopup>{children}</TooltipPopup>
    </TooltipRoot>
  )
}

const labelRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  fontSize: "1rem",
  color: "var(--colors-fg)",
}

const switchRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
}

// 2 行ラベルの radio。ラジオは 2 行ブロック全体の縦中央に揃える。
const radioItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  cursor: "pointer",
}
const radioText: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
}
const radioHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "var(--colors-fg)",
}
const radioSub: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--colors-fg-muted)",
}

export const AccountSettings: Story = () => (
  <ToastProvider>
    <AccountSettingsBody />
    <ToastToaster />
  </ToastProvider>
)

function AccountSettingsBody() {
  const [name, setName] = useState("penne")
  const [volume, setVolume] = useState(70)
  const [theme, setTheme] = useState("system")
  const [saving, setSaving] = useState(false)
  const [sessionPage, setSessionPage] = useState(1)
  const toast = useToastManager()

  return (
    <TooltipProvider>
      <div style={{ background: "var(--colors-bg)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* breadcrumb は本体の上に置く nav ストリップ。一律 gap でなく、下に追加の余白で分節する。 */}
          <BreadcrumbRoot style={{ marginBottom: "1.5rem" }}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">設定</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbCurrent>アカウント</BreadcrumbCurrent>
            </BreadcrumbItem>
          </BreadcrumbRoot>

          {/* App header */}
          <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <AvatarRoot size="lg">
              <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="penne" />
              <AvatarFallback>
                <Icon name="user" size="24px" />
              </AvatarFallback>
            </AvatarRoot>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "var(--colors-fg-strong)",
                    minWidth: 0,
                  }}
                >
                  <InlineEdit value={name} onCommit={setName} aria-label="表示名を編集" />
                </div>
                <Badge tone="accent">Pro</Badge>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--colors-fg-muted)",
                  marginTop: "0.125rem",
                }}
              >
                claude@otibo.dev
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Button
                intent="primary"
                disabled={saving}
                onClick={() => {
                  setSaving(true)
                  setTimeout(() => {
                    setSaving(false)
                    toast.add({
                      title: "保存しました",
                      description: "プロフィールの変更を反映しました。",
                    })
                  }, 1100)
                }}
              >
                {saving ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <Spinner size="sm" />
                    保存中
                  </span>
                ) : (
                  "保存"
                )}
              </Button>
              <MenuRoot>
                <MenuTrigger
                  render={
                    <Button intent="ghost" size="sm" aria-label="その他の操作">
                      <Icon name="more" size="1.25rem" />
                    </Button>
                  }
                />
                <MenuPopup>
                  <MenuItem onClick={() => toast.add({ title: "プロフィールを表示しました" })}>
                    プロフィールを表示
                  </MenuItem>
                  <MenuItem onClick={() => toast.add({ title: "リンクをコピーしました" })}>
                    公開リンクをコピー
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem onClick={() => toast.add({ title: "ログアウトしました" })}>
                    ログアウト
                  </MenuItem>
                </MenuPopup>
              </MenuRoot>
            </div>
          </header>

          {/* プロフィール */}
          <CardRoot>
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
              <CardDescription>他のユーザーに表示される情報です。</CardDescription>
            </CardHeader>
            <CardBody>
              <FieldRoot>
                <FieldLabel>メールアドレス</FieldLabel>
                <FieldInput type="email" defaultValue="claude@otibo.dev" />
                <FieldDescription>
                  確認メールを<Link href="#">再送</Link>できます。
                </FieldDescription>
              </FieldRoot>
              <FieldRoot>
                <FieldLabel>タイムゾーン</FieldLabel>
                <SelectRoot items={timezones} defaultValue="jst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    {timezones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <SelectItemText>{t.label}</SelectItemText>
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </SelectRoot>
              </FieldRoot>
              <FieldRoot>
                <FieldLabel>国 / 地域</FieldLabel>
                <ComboboxRoot items={countries} defaultValue="日本">
                  <ComboboxInput placeholder="国を検索…" />
                  <ComboboxPopup>
                    <ComboboxEmpty>該当する国がありません</ComboboxEmpty>
                    <ComboboxList>
                      {(country: string) => (
                        <ComboboxItem key={country} value={country}>
                          {country}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </ComboboxRoot>
              </FieldRoot>
              <FieldRoot>
                <FieldLabel>外観</FieldLabel>
                <SegmentedControlRoot value={theme} onValueChange={(v) => setTheme(v as string)}>
                  <SegmentedControlItem value="light">ライト</SegmentedControlItem>
                  <SegmentedControlItem value="dark">ダーク</SegmentedControlItem>
                  <SegmentedControlItem value="system">システム</SegmentedControlItem>
                </SegmentedControlRoot>
              </FieldRoot>
              <div style={switchRow}>
                <span style={labelRow}>
                  公開プロフィール
                  <HelpDot>あなたのページが検索結果に表示されます。</HelpDot>
                </span>
                <PopoverRoot>
                  <PopoverTrigger
                    render={
                      <Button intent="ghost" size="sm">
                        リンクを確認
                      </Button>
                    }
                  />
                  <PopoverPopup>
                    <PopoverTitle>公開URL</PopoverTitle>
                    <PopoverDescription>
                      otibo.dev/@penne で公開されます。変更は次のセッションから反映されます。
                    </PopoverDescription>
                  </PopoverPopup>
                </PopoverRoot>
              </div>
            </CardBody>
          </CardRoot>

          {/* 通知 */}
          <CardRoot>
            <CardHeader>
              <CardTitle>通知</CardTitle>
            </CardHeader>
            <CardBody>
              <TabsRoot defaultValue="all">
                <TabsList>
                  <TabsTab value="all">すべて</TabsTab>
                  <TabsTab value="important">重要のみ</TabsTab>
                  <TabsTab value="off">オフ</TabsTab>
                </TabsList>
                <TabsPanel value="all">すべての通知を受け取ります。</TabsPanel>
                <TabsPanel value="important">メンションと返信のみ受け取ります。</TabsPanel>
                <TabsPanel value="off">通知は届きません。</TabsPanel>
              </TabsRoot>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                <label style={switchRow}>
                  <span>メール通知</span>
                  <Switch defaultChecked />
                </label>
                <label style={switchRow}>
                  <span>プッシュ通知</span>
                  <Switch />
                </label>
                <label style={{ ...labelRow, gap: "0.625rem", cursor: "pointer" }}>
                  <Checkbox defaultChecked />
                  製品アップデートのお知らせを受け取る
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "var(--colors-fg)" }}>通知音量</span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--colors-fg-muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {volume}
                  </span>
                </div>
                <Slider value={volume} onValueChange={setVolume} aria-label="通知音量" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "0.25rem",
                }}
              >
                <span style={{ color: "var(--colors-fg)" }}>通知の保持日数</span>
                <div style={{ width: "9rem" }}>
                  <NumberFieldRoot defaultValue={30} min={1} max={90} allowWheelScrub>
                    <NumberFieldField />
                  </NumberFieldRoot>
                </div>
              </div>
            </CardBody>
          </CardRoot>

          {/* プラン */}
          <CardRoot>
            <CardHeader>
              <CardTitle>プラン</CardTitle>
              <CardDescription>いつでも変更・解約できます。</CardDescription>
            </CardHeader>
            <CardBody>
              {/* ストレージ使用量は「進捗」でなく「現在の度合い」なので Meter が semantic に正しい。
                  Progress とは視覚言語を共有(凹んだ track + accent fill)、意味だけ別。 */}
              <MeterRoot value={42}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <MeterLabel>ストレージ使用量</MeterLabel>
                  <MeterValue />
                </div>
                <MeterTrack />
              </MeterRoot>
              <RadioGroup defaultValue="yearly">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <label style={radioItem}>
                    <Radio value="monthly" />
                    <span style={radioText}>
                      <span style={{ color: "var(--colors-fg)" }}>月額プラン</span>
                      <span style={radioSub}>¥980 / 月</span>
                    </span>
                  </label>
                  <label style={radioItem}>
                    <Radio value="yearly" />
                    <span style={radioText}>
                      <span style={radioHead}>
                        年額プラン
                        <Badge tone="accent">2か月分お得</Badge>
                      </span>
                      <span style={radioSub}>¥9,800 / 年</span>
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </CardBody>
            <CardFooter>
              <DialogRoot>
                <DialogTrigger render={<Button intent="ghost">アカウントを停止</Button>} />
                <DialogPopup>
                  <DialogTitle>アカウントを停止しますか</DialogTitle>
                  <DialogDescription>
                    停止中は公開ページが非表示になります。再開はいつでもできます。
                  </DialogDescription>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <DialogClose render={<Button intent="ghost">やめておく</Button>} />
                    <DialogClose render={<Button intent="primary">停止する</Button>} />
                  </div>
                </DialogPopup>
              </DialogRoot>
              <Button intent="primary">プランを変更</Button>
            </CardFooter>
          </CardRoot>

          {/* ログインアクティビティ */}
          <CardRoot>
            <CardHeader>
              <CardTitle>ログインアクティビティ</CardTitle>
              <CardDescription>最近アクセスしたデバイスです。</CardDescription>
            </CardHeader>
            <CardBody>
              <TableRoot>
                <TableHeader>
                  <TableRow>
                    <TableHead>デバイス</TableHead>
                    <TableHead>場所</TableHead>
                    <TableHead>最終アクセス</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions
                    .slice((sessionPage - 1) * SESSIONS_PER_PAGE, sessionPage * SESSIONS_PER_PAGE)
                    .map((s, i) => (
                      <TableRow key={(sessionPage - 1) * SESSIONS_PER_PAGE + i}>
                        <TableCell>{s.device}</TableCell>
                        <TableCell>{s.place}</TableCell>
                        <TableCell>{s.last}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </TableRoot>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                <PaginationRoot>
                  <PaginationPrev
                    disabled={sessionPage === 1}
                    onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
                  />
                  {pageWindow(sessionPage, sessionPageCount).map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationEllipsis key={`e${i}`} />
                    ) : (
                      <PaginationItem
                        key={p}
                        active={sessionPage === p}
                        onClick={() => setSessionPage(p)}
                      >
                        {p}
                      </PaginationItem>
                    ),
                  )}
                  <PaginationNext
                    disabled={sessionPage === sessionPageCount}
                    onClick={() => setSessionPage((p) => Math.min(sessionPageCount, p + 1))}
                  />
                </PaginationRoot>
              </div>
            </CardBody>
          </CardRoot>

          {/* 詳細設定 */}
          <CardRoot>
            <CardHeader>
              <CardTitle>詳細設定</CardTitle>
            </CardHeader>
            <CardBody>
              <AccordionRoot>
                <AccordionItem>
                  <AccordionTrigger>データのエクスポート</AccordionTrigger>
                  <AccordionPanel>
                    アカウントのデータを JSON
                    でダウンロードできます。生成には数分かかることがあります。
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionTrigger>セキュリティ</AccordionTrigger>
                  <AccordionPanel>
                    <label style={{ ...switchRow, marginTop: "0.25rem" }}>
                      <span style={{ color: "var(--colors-fg)" }}>二段階認証</span>
                      <Switch />
                    </label>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionTrigger>接続済みのアプリ</AccordionTrigger>
                  <AccordionPanel>現在、連携している外部アプリはありません。</AccordionPanel>
                </AccordionItem>
              </AccordionRoot>
            </CardBody>
          </CardRoot>

          <footer
            style={{
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              paddingBlock: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Link href="#">利用規約</Link>
            <Link href="#">プライバシーポリシー</Link>
            <Link href="#">ヘルプ</Link>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
