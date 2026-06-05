import type { GlobalProvider } from "@ladle/react"

// Gen Interface JP — Inter × Noto Sans JP の調和書体。
// 山戸飯塚氏作、SIL Open Font License 1.1。
// otibo の「機能的可読性 + 冷たくない温度 + 装飾的・手書き風を避ける」(理念.md §3) の
// 制約に最も整合する選択。Plus Jakarta Sans からの差し替えは、preview の trendy 方向を
// 抜いて Honest / Calm but Clear 寄りに戻すための判断。
import "gen-interface-jp/400.css"
import "gen-interface-jp/500.css"
import "gen-interface-jp/600.css"

// Cascade-layer declaration so Panda's @layer rules resolve in our desired order.
import "../src/index.css"

// Panda's generated stylesheet — contains the global resets, token variables,
// and recipe classes.
import "../styled-system/styles.css"

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  )
}
