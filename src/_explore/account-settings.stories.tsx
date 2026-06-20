import type { Story } from "@ladle/react"
import { useState } from "react"

import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Combobox,
  Dialog,
  Field,
  Icon,
  InlineEdit,
  Link,
  Menu,
  Meter,
  NumberField,
  Pagination,
  Popover,
  Radio,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Spinner,
  Switch,
  Table,
  Tabs,
  Toast,
  Tooltip,
} from "../index"

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
    <Tooltip.Root>
      <Tooltip.Trigger
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
      <Tooltip.Popup>{children}</Tooltip.Popup>
    </Tooltip.Root>
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
  <Toast.Provider>
    <AccountSettingsBody />
    <Toast.Toaster />
  </Toast.Provider>
)

function AccountSettingsBody() {
  const [name, setName] = useState("penne")
  const [volume, setVolume] = useState(70)
  const [theme, setTheme] = useState("system")
  const [saving, setSaving] = useState(false)
  const [sessionPage, setSessionPage] = useState(1)
  const toast = Toast.useToastManager()

  return (
    <Tooltip.Provider>
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
          <Breadcrumb.Root style={{ marginBottom: "1.5rem" }}>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">ホーム</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">設定</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Current>アカウント</Breadcrumb.Current>
            </Breadcrumb.Item>
          </Breadcrumb.Root>

          {/* App header */}
          <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Avatar.Root size="lg">
              <Avatar.Image src="https://i.pravatar.cc/96?img=12" alt="penne" />
              <Avatar.Fallback>
                <Icon name="user" size="24px" />
              </Avatar.Fallback>
            </Avatar.Root>
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
              <Menu.Root>
                <Menu.Trigger
                  render={
                    <Button intent="ghost" size="sm" aria-label="その他の操作">
                      <Icon name="more" size="1.25rem" />
                    </Button>
                  }
                />
                <Menu.Popup>
                  <Menu.Item onClick={() => toast.add({ title: "プロフィールを表示しました" })}>
                    プロフィールを表示
                  </Menu.Item>
                  <Menu.Item onClick={() => toast.add({ title: "リンクをコピーしました" })}>
                    公開リンクをコピー
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item onClick={() => toast.add({ title: "ログアウトしました" })}>
                    ログアウト
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Root>
            </div>
          </header>

          {/* プロフィール */}
          <Card.Root>
            <Card.Header>
              <Card.Title>プロフィール</Card.Title>
              <Card.Description>他のユーザーに表示される情報です。</Card.Description>
            </Card.Header>
            <Card.Body>
              <Field.Root>
                <Field.Label>メールアドレス</Field.Label>
                <Field.Input type="email" defaultValue="claude@otibo.dev" />
                <Field.Description>
                  確認メールを<Link href="#">再送</Link>できます。
                </Field.Description>
              </Field.Root>
              <Field.Root>
                <Field.Label>タイムゾーン</Field.Label>
                <Select.Root items={timezones} defaultValue="jst">
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popup>
                    {timezones.map((t) => (
                      <Select.Item key={t.value} value={t.value}>
                        <Select.ItemText>{t.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Popup>
                </Select.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>国 / 地域</Field.Label>
                <Combobox.Root items={countries} defaultValue="日本">
                  <Combobox.Input placeholder="国を検索…" />
                  <Combobox.Popup>
                    <Combobox.Empty>該当する国がありません</Combobox.Empty>
                    <Combobox.List>
                      {(country: string) => (
                        <Combobox.Item key={country} value={country}>
                          {country}
                        </Combobox.Item>
                      )}
                    </Combobox.List>
                  </Combobox.Popup>
                </Combobox.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>外観</Field.Label>
                <SegmentedControl.Root value={theme} onValueChange={(v) => setTheme(v as string)}>
                  <SegmentedControl.Item value="light">ライト</SegmentedControl.Item>
                  <SegmentedControl.Item value="dark">ダーク</SegmentedControl.Item>
                  <SegmentedControl.Item value="system">システム</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Field.Root>
              <div style={switchRow}>
                <span style={labelRow}>
                  公開プロフィール
                  <HelpDot>あなたのページが検索結果に表示されます。</HelpDot>
                </span>
                <Popover.Root>
                  <Popover.Trigger
                    render={
                      <Button intent="ghost" size="sm">
                        リンクを確認
                      </Button>
                    }
                  />
                  <Popover.Popup>
                    <Popover.Title>公開URL</Popover.Title>
                    <Popover.Description>
                      otibo.dev/@penne で公開されます。変更は次のセッションから反映されます。
                    </Popover.Description>
                  </Popover.Popup>
                </Popover.Root>
              </div>
            </Card.Body>
          </Card.Root>

          {/* 通知 */}
          <Card.Root>
            <Card.Header>
              <Card.Title>通知</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tabs.Root defaultValue="all">
                <Tabs.List>
                  <Tabs.Tab value="all">すべて</Tabs.Tab>
                  <Tabs.Tab value="important">重要のみ</Tabs.Tab>
                  <Tabs.Tab value="off">オフ</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="all">すべての通知を受け取ります。</Tabs.Panel>
                <Tabs.Panel value="important">メンションと返信のみ受け取ります。</Tabs.Panel>
                <Tabs.Panel value="off">通知は届きません。</Tabs.Panel>
              </Tabs.Root>
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
                  <NumberField.Root defaultValue={30} min={1} max={90} allowWheelScrub>
                    <NumberField.Field />
                  </NumberField.Root>
                </div>
              </div>
            </Card.Body>
          </Card.Root>

          {/* プラン */}
          <Card.Root>
            <Card.Header>
              <Card.Title>プラン</Card.Title>
              <Card.Description>いつでも変更・解約できます。</Card.Description>
            </Card.Header>
            <Card.Body>
              {/* ストレージ使用量は「進捗」でなく「現在の度合い」なので Meter が semantic に正しい。
                  Progress とは視覚言語を共有(凹んだ track + accent fill)、意味だけ別。 */}
              <Meter.Root value={42}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Meter.Label>ストレージ使用量</Meter.Label>
                  <Meter.Value />
                </div>
                <Meter.Track />
              </Meter.Root>
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
            </Card.Body>
            <Card.Footer>
              <Dialog.Root>
                <Dialog.Trigger render={<Button intent="ghost">アカウントを停止</Button>} />
                <Dialog.Popup>
                  <Dialog.Title>アカウントを停止しますか</Dialog.Title>
                  <Dialog.Description>
                    停止中は公開ページが非表示になります。再開はいつでもできます。
                  </Dialog.Description>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <Dialog.Close render={<Button intent="ghost">やめておく</Button>} />
                    <Dialog.Close render={<Button intent="primary">停止する</Button>} />
                  </div>
                </Dialog.Popup>
              </Dialog.Root>
              <Button intent="primary">プランを変更</Button>
            </Card.Footer>
          </Card.Root>

          {/* ログインアクティビティ */}
          <Card.Root>
            <Card.Header>
              <Card.Title>ログインアクティビティ</Card.Title>
              <Card.Description>最近アクセスしたデバイスです。</Card.Description>
            </Card.Header>
            <Card.Body>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>デバイス</Table.Head>
                    <Table.Head>場所</Table.Head>
                    <Table.Head>最終アクセス</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sessions
                    .slice((sessionPage - 1) * SESSIONS_PER_PAGE, sessionPage * SESSIONS_PER_PAGE)
                    .map((s, i) => (
                      <Table.Row key={(sessionPage - 1) * SESSIONS_PER_PAGE + i}>
                        <Table.Cell>{s.device}</Table.Cell>
                        <Table.Cell>{s.place}</Table.Cell>
                        <Table.Cell>{s.last}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                <Pagination.Root>
                  <Pagination.Prev
                    disabled={sessionPage === 1}
                    onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
                  />
                  {pageWindow(sessionPage, sessionPageCount).map((p, i) =>
                    p === "ellipsis" ? (
                      <Pagination.Ellipsis key={`e${i}`} />
                    ) : (
                      <Pagination.Item
                        key={p}
                        active={sessionPage === p}
                        onClick={() => setSessionPage(p)}
                      >
                        {p}
                      </Pagination.Item>
                    ),
                  )}
                  <Pagination.Next
                    disabled={sessionPage === sessionPageCount}
                    onClick={() => setSessionPage((p) => Math.min(sessionPageCount, p + 1))}
                  />
                </Pagination.Root>
              </div>
            </Card.Body>
          </Card.Root>

          {/* 詳細設定 */}
          <Card.Root>
            <Card.Header>
              <Card.Title>詳細設定</Card.Title>
            </Card.Header>
            <Card.Body>
              <Accordion.Root>
                <Accordion.Item>
                  <Accordion.Trigger>データのエクスポート</Accordion.Trigger>
                  <Accordion.Panel>
                    アカウントのデータを JSON
                    でダウンロードできます。生成には数分かかることがあります。
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <Accordion.Trigger>セキュリティ</Accordion.Trigger>
                  <Accordion.Panel>
                    <label style={{ ...switchRow, marginTop: "0.25rem" }}>
                      <span style={{ color: "var(--colors-fg)" }}>二段階認証</span>
                      <Switch />
                    </label>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <Accordion.Trigger>接続済みのアプリ</Accordion.Trigger>
                  <Accordion.Panel>現在、連携している外部アプリはありません。</Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            </Card.Body>
          </Card.Root>

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
    </Tooltip.Provider>
  )
}
