# Changelog

All notable changes to `@otibo/ui` are documented here.

## 0.4.0 - 2026-07-13

### Added

- Typography roles backed by Panda named `textStyles`, exposed to drop-in consumers through the typed `textStyle()` helper (`display`, `heading.sm|md|lg`, `body`, `eyebrow`, `caption`).
- `Prose` reading surface with `reading="ui" | "article"`.
- `MediaFrame` (image / empty slots) and `LogoFrame` (brand mark frame with `shape="square" | "auto"` for icon marks vs. wide wordmarks).
- `TableScroll` for narrow-viewport horizontal table overflow, with scroll-position-aware edge fades (`--otibo-table-scroll-bg` to match the surface behind).

### Fixed

- Propagated `MediaFrameRoot` aspect and fit variants to its image slot while preserving an image-level fit override.
- Restored unordered and ordered list markers and direct list-item typography inside `Prose`.

## 0.3.0 - 2026-07-10

### Changed

- Replaced the Panda preset and consumer-side code generation contract with the drop-in `@otibo/ui/styles.css` entrypoint.
- Standardized compound components on flat named exports such as `FieldRoot` and `DialogPopup`; the 0.2.x namespace objects were removed.
- Bundled Gen Interface JP weights 400, 500, and 600 with their SIL Open Font License.
- Added explicit ESM, CommonJS, and CSS type conditions for TypeScript consumers.

### Migration from 0.2.x

1. Remove `@otibo/ui/preset` and `panda.buildinfo.json` from the consumer Panda configuration.
2. Remove Panda dependencies that were installed only for `@otibo/ui`.
3. Import `@otibo/ui/styles.css` once from the application root.
4. Replace namespace usage such as `Field.Root` with flat exports such as `FieldRoot`.

The stylesheet intentionally applies the otibo global reset, design tokens, typography, and component variants to the full document.

## 0.2.0 - 2026-07-10

- Updated the dependency baseline, React peer contract, Panda generation, and package CI matrix.

## 0.1.0 - 2026-06-21

- Published the initial public package with React components and a Panda consumer preset.
