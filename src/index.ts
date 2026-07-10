/**
 * otibo-ui public API.
 *
 * consumer は `import { Button, CardRoot, FieldRoot } from "@otibo/ui"` でアクセスする。
 * compound component も namespace object を持たず、全て flat named export とする。
 */

// Accordion
export { AccordionItem, AccordionPanel, AccordionRoot, AccordionTrigger } from "./core-ui/accordion"
// Avatar
export { AvatarFallback, AvatarImage, AvatarRoot } from "./core-ui/avatar"
export type { BadgeProps } from "./core-ui/badge"
// Badge
export { Badge } from "./core-ui/badge"
// Breadcrumb
export {
  BreadcrumbCurrent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "./core-ui/breadcrumb"
export type { ButtonProps } from "./core-ui/button"
// Button
export { Button } from "./core-ui/button"
export type { CardRootProps } from "./core-ui/card"
// Card
export {
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
export {
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxRoot,
  ComboboxValue,
} from "./core-ui/combobox"
// Dialog
export {
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./core-ui/dialog"
export type { FieldInputProps } from "./core-ui/field"
// Field
export {
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
export {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "./core-ui/menu"
// Meter
export { MeterLabel, MeterRoot, MeterTrack, MeterValue } from "./core-ui/meter"
// NavigationMenu
export {
  NavigationMenuContent,
  NavigationMenuGrid,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./core-ui/navigation-menu"
// NumberField
export { NumberFieldField, NumberFieldRoot } from "./core-ui/number-field"
// Pagination
export {
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from "./core-ui/pagination"
// Popover
export {
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "./core-ui/popover"
// PreviewCard
export {
  PreviewCardBody,
  PreviewCardDescription,
  PreviewCardFooter,
  PreviewCardMedia,
  PreviewCardPopup,
  PreviewCardRoot,
  PreviewCardTitle,
  PreviewCardTrigger,
} from "./core-ui/preview-card"
// Progress
export { ProgressLabel, ProgressRoot, ProgressTrack, ProgressValue } from "./core-ui/progress"
export type { RadioGroupProps, RadioProps } from "./core-ui/radio"
// Radio
export { Radio, RadioGroup } from "./core-ui/radio"
// ScrollArea
export { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaViewport } from "./core-ui/scroll-area"
// SegmentedControl
export { SegmentedControlItem, SegmentedControlRoot } from "./core-ui/segmented-control"
// Select
export {
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemText,
  SelectPopup,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./core-ui/select"
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
export { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "./core-ui/table"
// Tabs
export { TabsList, TabsPanel, TabsRoot, TabsTab } from "./core-ui/tabs"
// Toast
export { createToastManager, ToastProvider, ToastToaster, useToastManager } from "./core-ui/toast"
// Toggle
export { Toggle, ToggleGroup } from "./core-ui/toggle"
// Tooltip
export { TooltipPopup, TooltipProvider, TooltipRoot, TooltipTrigger } from "./core-ui/tooltip"
