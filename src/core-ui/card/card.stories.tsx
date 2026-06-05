import type { Story } from "@ladle/react"

import { Card } from "./card"

/**
 * Card stories follow the Context Matrix from
 * `_docs/reference/DesignSystem/components/card.md` (otibo_ds spec).
 *
 * Each story names a context, not a "Card variant". Stories that share a
 * surface variant but apply it to a different role combination help test
 * whether the recipe is honest about boundary intent.
 */

export default {
  title: "core-ui / Card",
}

// 1a. BrandStatement — タグラインが主役の Card。description は lead として
// title を補強し、body には書かない(本文に「説明文」を入れないことで主役を
// 際立たせる)。second opinion に応えた書き直し:カードの主役を一つに絞る。
export const BrandStatement: Story = () => (
  <div style={{ maxWidth: 520 }}>
    <Card.Root>
      <Card.Header>
        <Card.Title>ひと手間に、ぴったりの道具を。</Card.Title>
        <Card.Description>
          特定の状況に、特定の姿勢に、特定の認知のかたちに、ぴったり合うように。
        </Card.Description>
      </Card.Header>
    </Card.Root>
  </div>
)

// 1b. ComponentNotes — developer 向けの doc surface 例。title が「主役」、
// description が「副題 / 役割の一行説明」、body が「使い方の本文」。
// BrandStatement と同じ recipe で、声色が用途に合わせて変わることを示す。
// body の line-height は token の relaxed (= 1.55)。
export const ComponentNotes: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <Card.Root>
      <Card.Header>
        <Card.Title>Card.Root</Card.Title>
        <Card.Description>
          polymorphic な container。slot recipe の root として描画される。
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <p>
          Base UI の <code>useRender</code> を経由するため、{`<article>`}・{`<section>`}・
          {`<button>`} など任意の semantic tag に着地できます。意味は host
          が決め、recipe は構造を提供する分担です。
        </p>
      </Card.Body>
    </Card.Root>
  </div>
)



// 2. Dashboard metric — Object role + Surface inside a Flow composition.
export const DashboardMetric: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "1.25rem",
      maxWidth: 900,
    }}
  >
    {[
      { label: "今週の所要時間", value: "4h 12m", trend: "前週比 -38m" },
      { label: "未着手のひと手間", value: "3 件", trend: "うち 2 件は新規" },
      { label: "気づけば終わった作業", value: "11 件", trend: "今月累計" },
    ].map((metric) => (
      <Card.Root key={metric.label} surface="paper" padding="md">
        <Card.Header>
          <Card.Description>{metric.label}</Card.Description>
          <Card.Title>{metric.value}</Card.Title>
        </Card.Header>
        <Card.Body>
          <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>{metric.trend}</span>
        </Card.Body>
      </Card.Root>
    ))}
  </div>
)

// 3. Settings section — Region + Internal inside parent Object composition.
// Uses `flat` so the section reads as internal organization, not placed object.
// 主役は「設定項目の一覧」であり、body は実用的な settings 内容を書く。
export const SettingsSection: Story = () => (
  <div
    style={{
      maxWidth: 560,
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    }}
  >
    <Card.Root surface="flat" padding="md">
      <Card.Header>
        <Card.Title>通知</Card.Title>
        <Card.Description>静かな受け取りを基本に、必要なものだけ。</Card.Description>
      </Card.Header>
      <Card.Body>
        <SettingRow
          label="作業完了の通知"
          value="オン"
          hint="ひと手間が終わった時だけ、軽い音で知らせます。"
        />
        <SettingRow
          label="新機能のお知らせ"
          value="オフ"
          hint="重要な変更は別途メールで届きます。"
        />
        <SettingRow
          label="通知音"
          value="紙の音"
          hint="3 種類から選べます。"
        />
      </Card.Body>
    </Card.Root>
    <Card.Root surface="flat" padding="md">
      <Card.Header>
        <Card.Title>アカウント</Card.Title>
        <Card.Description>主体性を奪わない設計範囲で。</Card.Description>
      </Card.Header>
      <Card.Body>
        <SettingRow label="メールアドレス" value="claude@otibo.dev" />
        <SettingRow
          label="表示言語"
          value="日本語"
          hint="再起動後に反映されます。"
        />
      </Card.Body>
    </Card.Root>
  </div>
)

// Settings row 補助 component:label + hint(縦組)と value を横に並べ、
// value が label + hint の縦中央に来るように center align。
function SettingRow({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        paddingBlock: "0.5rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span style={{ fontSize: "1rem", color: "var(--colors-fg)" }}>
          {label}
        </span>
        {hint && (
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--colors-fg-muted)",
              lineHeight: 1.5,
            }}
          >
            {hint}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: "1rem",
          color: "var(--colors-fg-secondary)",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}

// 4. Selectable plan — Object role + Control. Interactive turns on focus/hover.
export const SelectablePlan: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "1.25rem",
      maxWidth: 760,
    }}
  >
    {[
      { name: "Personal", price: "¥0", note: "ひとりで使う" },
      { name: "Pro", price: "¥980 / 月", note: "ひと手間を共有する" },
    ].map((plan) => (
      <Card.Root
        key={plan.name}
        surface="paper"
        padding="lg"
        interactive
        render={(props) => <button type="button" {...props} />}
      >
        <Card.Header>
          <Card.Description>{plan.note}</Card.Description>
          <Card.Title>{plan.name}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p style={{ fontSize: "1.5rem", letterSpacing: "-0.01em" }}>{plan.price}</p>
        </Card.Body>
        <Card.Footer>
          <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>選択する →</span>
        </Card.Footer>
      </Card.Root>
    ))}
  </div>
)

// 5. Prose supplemental callout — Region + Support inside prose Flow.
// `muted` recesses the surface so the note reads as supplement, not placed object.
export const ProseCallout: Story = () => (
  <div
    style={{
      maxWidth: 640,
      fontSize: "1rem",
      lineHeight: 1.7,
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    }}
  >
    <p>
      otibo は誰かのひと手間に基づきます。架空のペルソナや、調査の数字を出発点にしません。万能を目指さず、特定の状況、特定の姿勢、特定の認知のかたちに、ぴったりはまるように作ります。
    </p>
    <Card.Root surface="muted" padding="md">
      <Card.Body>
        <p style={{ margin: 0 }}>
          「やればできる」を「気づけば終わっている」に変える。これは原則三です。本文の流れを止めずに、補助情報として控えめに置かれています。
        </p>
      </Card.Body>
    </Card.Root>
    <p>
      ユーザーの主体性を奪わない設計を続けます。認知負荷を下げる目的で選択肢を絞ることはあっても、その絞りは可逆であることを保ちます。
    </p>
  </div>
)
