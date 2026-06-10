/**
 * otibo-ui public API.
 *
 * consumer は `import { Card, Button, Field } from "otibo-ui"` でアクセスする。
 * Panda preset は `import { otiboPreset } from "otibo-ui/preset"` で取得する。
 *
 * 個別 component の slot や型を細かく扱いたい場合は、各 component の
 * import 経路(例:`otibo-ui/core-ui/card`)も path として残しておくが、
 * 安定 API として保証するのはこの index の re-export のみ。
 */

// Card
export {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "./core-ui/card"
export type { CardRootProps } from "./core-ui/card"

// Button
export { Button } from "./core-ui/button"
export type { ButtonProps } from "./core-ui/button"

// Input
export { Input } from "./core-ui/input"
export type { InputProps } from "./core-ui/input"

// Field
export {
  Field,
  FieldDescription,
  FieldError,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "./core-ui/field"
export type { FieldInputProps } from "./core-ui/field"

// InlineEdit
export { InlineEdit } from "./core-ui/inline-edit"
export type { InlineEditProps } from "./core-ui/inline-edit"
