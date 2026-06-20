import type { Story } from "@ladle/react"

import { Card } from "../card/card"
import { Button } from "./button"

export default {
  title: "core-ui / Button",
}

// 1. Intent × Size matrix — base affordance を裸で並べて読みやすさを判定。
// grid だと auto 列幅が「列の最大幅」で固定されて sm が stretch される副作用が
// あるため、row 単位の flex で independent に並べる。
export const Matrix: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "fit-content" }}>
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button intent="primary" size="sm">
        保存する
      </Button>
      <Button intent="secondary" size="sm">
        キャンセル
      </Button>
      <Button intent="ghost" size="sm">
        もっと見る
      </Button>
    </div>
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button intent="primary" size="md">
        送信する
      </Button>
      <Button intent="secondary" size="md">
        下書きに戻す
      </Button>
      <Button intent="ghost" size="md">
        履歴を見る
      </Button>
    </div>
  </div>
)

// 2. Single primary — 「気づけば終わる」を 1 行で
export const Primary: Story = () => <Button intent="primary">送信する</Button>

// 3. Disabled — 操作不能を「opacity + cursor」で示す(grammar: disabled affordance)。
// 全 button が disabled の例として、視覚的に「使えないものは詰めて目立たせない」
// 方針で gap を 0.5rem に。本来「disabled の両隣だけ詰める」を CSS selector で
// 実現可能だが grouping wrapper が必要で実装コスト > 効果のため簡易対応。
export const Disabled: Story = () => (
  <div style={{ display: "flex", gap: "0.5rem" }}>
    <Button intent="primary" disabled>
      送信する
    </Button>
    <Button intent="secondary" disabled>
      キャンセル
    </Button>
    <Button intent="ghost" disabled>
      もっと見る
    </Button>
  </div>
)

// 4. Card + Button — Card 内 footer に CTA を置く。settings-like context。
export const InCard: Story = () => (
  <div style={{ maxWidth: 560 }}>
    <Card.Root surface="paper" padding="md">
      <Card.Header>
        <Card.Title>通知</Card.Title>
        <Card.Description>静かな受け取りを基本に、必要なものだけ。</Card.Description>
      </Card.Header>
      <Card.Body>
        <p>設定変更は次のセッションから反映されます。すでに開いている画面には影響しません。</p>
      </Card.Body>
      <Card.Footer>
        <Button intent="ghost">変更を取り消す</Button>
        <Button intent="primary">変更を保存</Button>
      </Card.Footer>
    </Card.Root>
  </div>
)
