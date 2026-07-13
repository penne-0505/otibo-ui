import type { Story } from "@ladle/react"

import { Prose } from "./prose"

export default {
  title: "core-ui / Prose",
}

const paragraphs = (
  <>
    <h2>読み面としての Prose</h2>
    <p>
      otibo
      は誰かのひと手間に基づきます。架空のペルソナや、調査の数字を出発点にしません。万能を目指さず、特定の状況にぴったりはまるように作ります。
    </p>
    <h3>余白で区切る</h3>
    <p>
      構造の区切りは線より先に余白です。色の段差と間隔だけで領域を語り、content
      が前に出る面を保ちます。
    </p>
    <blockquote>
      「やればできる」を「気づけば終わっている」に変える。本文の流れを止めずに、補助として置く。
    </blockquote>
    <ul>
      <li>役割を先に選ぶ</li>
      <li>HTML semantics は文書構造から選ぶ</li>
    </ul>
    <ol>
      <li>読み面を決める</li>
      <li>段落と見出しを配置する</li>
    </ol>
    <figcaption>原則からの引用メモ</figcaption>
  </>
)

export const UiReading: Story = () => <Prose reading="ui">{paragraphs}</Prose>

export const ArticleReading: Story = () => (
  <Prose reading="article" as="article">
    {paragraphs}
  </Prose>
)

export const SideBySide: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
      gap: "2rem",
      alignItems: "start",
    }}
  >
    <div>
      <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, marginBottom: "1rem" }}>
        reading=ui
      </p>
      <Prose reading="ui">{paragraphs}</Prose>
    </div>
    <div>
      <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, marginBottom: "1rem" }}>
        reading=article
      </p>
      <Prose reading="article">{paragraphs}</Prose>
    </div>
  </div>
)
