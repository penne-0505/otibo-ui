import type { Story } from "@ladle/react"
import { useState } from "react"

import { Card } from "../card/card"
import { InlineEdit } from "./inline-edit"

export default {
  title: "core-ui / InlineEdit",
}

// 1. Default — Settings 文脈での単独利用。値あり / read mode から始まる。
export const Default: Story = () => {
  const [value, setValue] = useState("penne")
  return (
    <div style={{ maxWidth: 360 }}>
      <InlineEdit
        value={value}
        onCommit={setValue}
        aria-label="表示名を編集"
      />
    </div>
  )
}

// 2. Empty — 値なし。placeholder が fg.subtle で読み専用に表示される。
export const Empty: Story = () => {
  const [value, setValue] = useState("")
  return (
    <div style={{ maxWidth: 360 }}>
      <InlineEdit
        value={value}
        onCommit={setValue}
        placeholder="表示名を設定する"
        aria-label="表示名を編集"
      />
    </div>
  )
}

// 3. InHeading — typography 継承の検証。Card.Title 内で大きい font に従う。
// InlineEdit 自身は font-size を持たないので、文脈の typography を全継承する。
export const InHeading: Story = () => {
  const [title, setTitle] = useState("無題のドキュメント")
  return (
    <div style={{ maxWidth: 560 }}>
      <Card.Root surface="flat" padding="md">
        <Card.Header>
          <Card.Title>
            <InlineEdit
              value={title}
              onCommit={setTitle}
              aria-label="ドキュメントタイトルを編集"
              allowEmpty={false}
            />
          </Card.Title>
          <Card.Description>
            タイトルをクリックすると編集できます。空のままでは確定されません。
          </Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  )
}

// 4. InSettings — Settings 風の SettingRow に並べる。
//    Field と組み合わせず、純粋な InlineEdit のみで「読み専用が default、
//    クリックで編集」の Settings 体験を構成する。Field との合流は次ストーリー。
export const InSettings: Story = () => {
  const [displayName, setDisplayName] = useState("penne")
  const [email, setEmail] = useState("claude@otibo.dev")
  const [bio, setBio] = useState("")

  return (
    <div style={{ maxWidth: 560 }}>
      <Card.Root surface="flat" padding="md">
        <Card.Header>
          <Card.Title>アカウント</Card.Title>
          <Card.Description>クリックで編集できます。</Card.Description>
        </Card.Header>
        <Card.Body>
          <SettingRow label="表示名">
            <InlineEdit
              value={displayName}
              onCommit={setDisplayName}
              aria-label="表示名を編集"
              allowEmpty={false}
            />
          </SettingRow>
          <SettingRow label="メールアドレス">
            <InlineEdit
              value={email}
              onCommit={setEmail}
              aria-label="メールアドレスを編集"
              allowEmpty={false}
            />
          </SettingRow>
          <SettingRow label="自己紹介">
            <InlineEdit
              value={bio}
              onCommit={setBio}
              placeholder="まだ書かれていません"
              aria-label="自己紹介を編集"
            />
          </SettingRow>
        </Card.Body>
      </Card.Root>
    </div>
  )
}

interface SettingRowProps {
  label: string
  children: React.ReactNode
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10rem 1fr",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div style={{ color: "var(--colors-fg-muted)", fontSize: "0.875rem" }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  )
}
