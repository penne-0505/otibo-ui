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

// Accordion
export { Accordion } from "./core-ui/accordion"
// Avatar
export { Avatar } from "./core-ui/avatar"
export type { BadgeProps } from "./core-ui/badge"
// Badge
export { Badge } from "./core-ui/badge"
// Breadcrumb
export { Breadcrumb } from "./core-ui/breadcrumb"
export type { ButtonProps } from "./core-ui/button"
// Button
export { Button } from "./core-ui/button"
export type { CardRootProps } from "./core-ui/card"
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
export type { CheckboxProps } from "./core-ui/checkbox"
// Checkbox
export { Checkbox } from "./core-ui/checkbox"
// Chip
export { Chip, ChipGroup } from "./core-ui/chip"
// Combobox
export { Combobox } from "./core-ui/combobox"
// Dialog
export { Dialog } from "./core-ui/dialog"
export type { FieldInputProps } from "./core-ui/field"
// Field
export {
  Field,
  FieldDescription,
  FieldError,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "./core-ui/field"
export type { IconName, IconProps } from "./core-ui/icon"
// Icon
export { Icon } from "./core-ui/icon"
export type { InlineEditProps } from "./core-ui/inline-edit"
// InlineEdit
export { InlineEdit } from "./core-ui/inline-edit"
export type { InputProps } from "./core-ui/input"
// Input
export { Input } from "./core-ui/input"
export type { LinkProps } from "./core-ui/link"
// Link
export { Link } from "./core-ui/link"
// Menu
export { Menu } from "./core-ui/menu"
// Meter
export { Meter } from "./core-ui/meter"
// NavigationMenu
export { NavigationMenu } from "./core-ui/navigation-menu"
// NumberField
export { NumberField } from "./core-ui/number-field"
// Pagination
export { Pagination } from "./core-ui/pagination"
// Popover
export { Popover } from "./core-ui/popover"
// PreviewCard
export { PreviewCard } from "./core-ui/preview-card"
// Progress
export { Progress } from "./core-ui/progress"
export type { RadioGroupProps, RadioProps } from "./core-ui/radio"
// Radio
export { Radio, RadioGroup } from "./core-ui/radio"
// ScrollArea
export { ScrollArea } from "./core-ui/scroll-area"
// SegmentedControl
export { SegmentedControl } from "./core-ui/segmented-control"
// Select
export { Select } from "./core-ui/select"
export type { SeparatorProps } from "./core-ui/separator"
// Separator
export { Separator } from "./core-ui/separator"
export type { SkeletonProps } from "./core-ui/skeleton"
// Skeleton
export { Skeleton } from "./core-ui/skeleton"
export type { SliderProps } from "./core-ui/slider"
// Slider
export { Slider } from "./core-ui/slider"
export type { SpinnerProps } from "./core-ui/spinner"
// Spinner
export { Spinner } from "./core-ui/spinner"
export type { SwitchProps } from "./core-ui/switch"
// Switch
export { Switch } from "./core-ui/switch"
// Table
export { Table } from "./core-ui/table"
// Tabs
export { Tabs, TabsList, TabsPanel, TabsRoot, TabsTab } from "./core-ui/tabs"
// Toast
export { Toast } from "./core-ui/toast"
// Toggle
export { Toggle, ToggleGroup } from "./core-ui/toggle"
// Tooltip
export { Tooltip } from "./core-ui/tooltip"
