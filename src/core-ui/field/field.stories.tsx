import type { Story } from "@ladle/react"

import { Card } from "../card/card"
import { Field } from "./field"

export default {
  title: "core-ui / Field",
}

// 1. Default — Label + Input。Base UI が aria-labelledby を自動配線。
export const Default: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Field.Root>
      <Field.Label>メールアドレス</Field.Label>
      <Field.Input type="email" placeholder="claude@otibo.dev" />
    </Field.Root>
  </div>
)

// 2. WithDescription — 補助テキスト付き。aria-describedby が自動配線される。
export const WithDescription: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Field.Root>
      <Field.Label>表示名</Field.Label>
      <Field.Input placeholder="例:penne" />
      <Field.Description>
        他のユーザーに表示される名前です。あとから変更できます。
      </Field.Description>
    </Field.Root>
  </div>
)

// 3. WithError — Field.Error と aria-invalid を表現。
export const WithError: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <Field.Root>
      <Field.Label>メールアドレス</Field.Label>
      <Field.Input
        type="email"
        defaultValue="claude@otibo"
        aria-invalid="true"
      />
      <Field.Error>有効なメールアドレスを入力してください。</Field.Error>
    </Field.Root>
  </div>
)

// 4. AccountForm — Card 内に複数 Field を並べる settings-form 例。
export const AccountForm: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <Card.Root surface="flat" padding="md">
      <Card.Header>
        <Card.Title>アカウント</Card.Title>
        <Card.Description>主体性を奪わない設計範囲で。</Card.Description>
      </Card.Header>
      <Card.Body>
        <Field.Root>
          <Field.Label>表示名</Field.Label>
          <Field.Input defaultValue="penne" />
        </Field.Root>
        <Field.Root>
          <Field.Label>メールアドレス</Field.Label>
          <Field.Input type="email" defaultValue="claude@otibo.dev" />
          <Field.Description>確認メールを再送できます。</Field.Description>
        </Field.Root>
      </Card.Body>
    </Card.Root>
  </div>
)
