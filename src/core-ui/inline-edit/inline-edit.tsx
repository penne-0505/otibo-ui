import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from "react"

import { cx } from "../../../styled-system/css"
import { inlineEdit } from "../../../styled-system/recipes"

/**
 * InlineEdit — 読み専用がデフォルト、ユーザーの能動的なアクションで編集モードに
 * 切り替わるテキスト編集 primitive。
 *
 * 設計上の前提:
 *   - read mode は周囲 text と完全同化する(recipe が font 系を継承するため、
 *     配置文脈の typography に従う)
 *   - single click で edit、blur / Enter で commit、Esc で cancel
 *   - 多くの settings 文脈で「最後の状態を保持」したいので uncontrolled でも
 *     value prop で外部 state を反映可能(controlled-light pattern)
 *
 * スコープ外(後続で別 component / 別 prop として検討):
 *   - multiline / textarea 派生
 *   - validation 表示(Field と組み合わせる前提)
 *   - 編集中の loading state(server-side commit の async UI)
 */
export interface InlineEditProps {
  /** 表示する値(controlled-light: 外部 state と同期される) */
  value: string
  /** commit 時に呼ばれる。trim 後の文字列を受け取る */
  onCommit?: (next: string) => void
  /** 空値時に read mode で表示する文言。edit mode の placeholder としても使う */
  placeholder?: string
  /** screen reader 用ラベル(例: "表示名を編集") */
  "aria-label"?: string
  className?: string
  /** 編集モードで開始する(主に story / 開発用) */
  defaultEditing?: boolean
  /** 空文字での commit を許容する。false なら空 commit は cancel と同等 */
  allowEmpty?: boolean
}

export const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(
  function InlineEdit(
    {
      value,
      onCommit,
      placeholder = "未設定",
      className,
      defaultEditing = false,
      allowEmpty = true,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const slot = inlineEdit()
    const [editing, setEditing] = useState(defaultEditing)
    const [draft, setDraft] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)
    // commit/cancel が短時間に多重起動するのを防ぐ(blur と Enter が連続する等)
    const settledRef = useRef(false)
    const inputId = useId()

    // value が外部から変化したら draft を追従(edit 中でない時のみ)
    useEffect(() => {
      if (!editing) setDraft(value)
    }, [editing, value])

    // edit モードに入ったら入力 focus + 全選択
    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
        settledRef.current = false
      }
    }, [editing])

    const commit = useCallback(() => {
      if (settledRef.current) return
      settledRef.current = true
      const next = draft.trim()
      if (!allowEmpty && next === "") {
        setDraft(value)
        setEditing(false)
        return
      }
      if (next !== value) onCommit?.(next)
      setEditing(false)
    }, [allowEmpty, draft, onCommit, value])

    const cancel = useCallback(() => {
      if (settledRef.current) return
      settledRef.current = true
      setDraft(value)
      setEditing(false)
    }, [value])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit()
        } else if (event.key === "Escape") {
          event.preventDefault()
          cancel()
        }
      },
      [cancel, commit],
    )

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setDraft(event.target.value)
    }, [])

    const isEmpty = !value
    const displayed = value || placeholder

    return (
      <div ref={ref} className={cx(slot.root, className)}>
        {editing ? (
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            className={slot.edit}
            value={draft}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
          />
        ) : (
          <button
            type="button"
            className={slot.read}
            onClick={() => setEditing(true)}
            data-empty={isEmpty ? "true" : undefined}
            aria-label={ariaLabel}
          >
            {displayed}
          </button>
        )}
      </div>
    )
  },
)
