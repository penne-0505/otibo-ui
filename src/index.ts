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

// Icon
export { Icon } from "./core-ui/icon"
export type { IconName, IconProps } from "./core-ui/icon"

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

// Checkbox
export { Checkbox } from "./core-ui/checkbox"
export type { CheckboxProps } from "./core-ui/checkbox"

// Switch
export { Switch } from "./core-ui/switch"
export type { SwitchProps } from "./core-ui/switch"

// Radio
export { Radio, RadioGroup } from "./core-ui/radio"
export type { RadioProps, RadioGroupProps } from "./core-ui/radio"

// Badge
export { Badge } from "./core-ui/badge"
export type { BadgeProps } from "./core-ui/badge"

// Tabs
export { Tabs, TabsRoot, TabsList, TabsTab, TabsPanel } from "./core-ui/tabs"

// Tooltip
export { Tooltip } from "./core-ui/tooltip"

// Popover
export { Popover } from "./core-ui/popover"

// Dialog
export { Dialog } from "./core-ui/dialog"

// SegmentedControl
export { SegmentedControl } from "./core-ui/segmented-control"

// Menu
export { Menu } from "./core-ui/menu"

// Accordion
export { Accordion } from "./core-ui/accordion"

// Avatar
export { Avatar } from "./core-ui/avatar"

// Progress
export { Progress } from "./core-ui/progress"

// Table
export { Table } from "./core-ui/table"

// Spinner
export { Spinner } from "./core-ui/spinner"
export type { SpinnerProps } from "./core-ui/spinner"

// Skeleton
export { Skeleton } from "./core-ui/skeleton"
export type { SkeletonProps } from "./core-ui/skeleton"

// Link
export { Link } from "./core-ui/link"
export type { LinkProps } from "./core-ui/link"

// Breadcrumb
export { Breadcrumb } from "./core-ui/breadcrumb"

// Pagination
export { Pagination } from "./core-ui/pagination"

// Select
export { Select } from "./core-ui/select"

// Combobox
export { Combobox } from "./core-ui/combobox"

// NumberField
export { NumberField } from "./core-ui/number-field"

// Toggle
export { Toggle, ToggleGroup } from "./core-ui/toggle"

// Chip
export { Chip, ChipGroup } from "./core-ui/chip"

// NavigationMenu
export { NavigationMenu } from "./core-ui/navigation-menu"

// Separator
export { Separator } from "./core-ui/separator"
export type { SeparatorProps } from "./core-ui/separator"

// PreviewCard
export { PreviewCard } from "./core-ui/preview-card"

// ScrollArea
export { ScrollArea } from "./core-ui/scroll-area"

// Meter
export { Meter } from "./core-ui/meter"

// Slider
export { Slider } from "./core-ui/slider"
export type { SliderProps } from "./core-ui/slider"

// Toast
export { Toast } from "./core-ui/toast"
