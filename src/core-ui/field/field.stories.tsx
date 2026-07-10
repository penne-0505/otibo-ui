import type { Story } from "@ladle/react"

import { CardRoot, CardHeader, CardTitle, CardDescription, CardBody } from "../card/card"
import { FieldRoot, FieldLabel, FieldInput, FieldDescription, FieldError } from "./field"

export default {
  title: "core-ui / Field",
}

// 1. Default — Label + Input。Base UI が aria-labelledby を自動配線。
export const Default: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldRoot>
      <FieldLabel>メールアドレス</FieldLabel>
      <FieldInput type="email" placeholder="claude@otibo.dev" />
    </FieldRoot>
  </div>
)

// 2. WithDescription — 補助テキスト付き。aria-describedby が自動配線される。
export const WithDescription: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldRoot>
      <FieldLabel>表示名</FieldLabel>
      <FieldInput placeholder="例:penne" />
      <FieldDescription>
        他のユーザーに表示される名前です。あとから変更できます。
      </FieldDescription>
    </FieldRoot>
  </div>
)

// 3. WithError — FieldError と aria-invalid を表現。
// 役割分担:
//   - Description は「何に使われるか」のような常時提示すべき情報。Field 内に
//     入れるとは限らず、画面側で別配置にすることもある。ここでは省略。
//   - Error は「入力 / 未入力というアクションに対して、なぜ通っていないか」を
//     担う。「未入力です」では why の説明が薄いので、必要性まで踏み込んだ
//     文面にする。
// 実装メモ:Base UI の FieldError は ValidityState 連動でデフォルト非表示。
// Story では `match={true}` で常時表示に固定する(API 仕様)。
// 実 form では `match="valueMissing"` などで validation key に応じる。
export const WithError: Story = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldRoot>
      <FieldLabel>メールアドレス</FieldLabel>
      <FieldInput type="email" defaultValue="" aria-invalid="true" />
      <FieldError match>メールアドレスは登録に必須です。</FieldError>
    </FieldRoot>
  </div>
)

// 4. AccountForm — Card 内に複数 Field を並べる settings-form 例。
export const AccountForm: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <CardRoot surface="flat" padding="md">
      <CardHeader>
        <CardTitle>アカウント</CardTitle>
        <CardDescription>主体性を奪わない設計範囲で。</CardDescription>
      </CardHeader>
      <CardBody>
        <FieldRoot>
          <FieldLabel>表示名</FieldLabel>
          <FieldInput defaultValue="penne" />
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>メールアドレス</FieldLabel>
          <FieldInput type="email" defaultValue="claude@otibo.dev" />
          <FieldDescription>確認メールを再送できます。</FieldDescription>
        </FieldRoot>
      </CardBody>
    </CardRoot>
  </div>
)
