---
title: Editorial media typography verification
status: active
draft_status: n/a
qa_status: verified
risk: Medium
created_at: 2026-07-11
updated_at: 2026-07-13
references:
  - "_docs/plan/DesignSystem/editorial-media-typography/plan.md"
  - "_docs/intent/DesignSystem/editorial-media-typography/decision.md"
  - "_docs/qa/DesignSystem/editorial-media-typography/test-plan.md"
related_issues: []
related_prs: []
---

# Editorial media typography verification

## Summary

Media / Typography+Prose / TableScroll を実装し、package 検証と Ladle + Cursor browser MCP での視覚確認を行った。2026-07-13のpublish前レビューでdrop-in typography経路、MediaFrame variant伝播、Prose listを補正し、Intentの七invariantsを満たす。

## Verification Verdict

Verdict: PASS

## Commands Run

| Command / Test | Result | Notes |
| --- | --- | --- |
| `date '+%Y-%m-%d'` | PASS | Returned `2026-07-11`. |
| `npm run panda:codegen` / `npm run panda` | PASS | Recipes and `styled-system/styles.css` regenerated. |
| `npm run typecheck` | PASS | Exit 0. |
| `npm run lint` | PASS | Exit 0. |
| `npm run build` | PASS | Exit 0; package CSS includes new recipes. |
| `npm run test:package` | PASS | Exit 0; recipe inventory includes mediaFrame / logoFrame / prose / tableScroll. |
| `deno run --allow-read scripts/validate-todo.mjs` | PASS | Exit 0. |
| `deno run --allow-read scripts/validate-frontmatter.mjs` | PASS | Exit 0. |
| `deno run --allow-read scripts/validate-doc-links.mjs` | PASS | Exit 0. |
| `deno run --allow-read scripts/validate-qa.mjs` | PASS | Exit 0 after schema-aligned verification. |
| Export invariant grep | PASS | No `EmptyMedia` / typography `Text` export in `src/index.ts`. |

## Automated Test Results

- `test:package` confirmed new recipes appear in `panda.config.ts` staticCss and compiled CSS classNames.
- Typecheck and Biome passed for Prose / MediaFrame / LogoFrame / TableScroll and textStyles.
- Public flat exports include `MediaFrame*`, `LogoFrame*`, `Prose`, `TableScroll`.

## Manual QA Results

Ladle (`http://localhost:61000/?mode=preview&story=...`) via Cursor browser MCP:

- `core-ui--typography--roles` — display / heading.lg|md|sm / body / eyebrow / caption ladder readable.
- `core-ui--prose--side-by-side` — ui vs article body size / leading difference visible.
- `core-ui--mediaframe--empty` — muted aspect frame +「画像がありません」(not Skeleton pulse).
- `core-ui--mediaframe--with-image` — 16:9 media with sample image.
- `core-ui--logoframe--fallback` — rounded rect, muted fill, `OT` (not Avatar accent circle).
- `core-ui--table--narrow-scroll` — ≈352px wrapper scrolls horizontally; no row-card layout.

## Acceptance Criteria Coverage

- AC-001: PASS. textStyles defined in `src/theme/text-styles.ts`; Roles story renders the ladder.
- AC-002: PASS. Prose `reading="ui"|"article"` and SideBySide story show measure / size difference.
- AC-003: PASS. MediaFrame empty is a slot (`MediaFrameEmpty`); no `EmptyMedia` export.
- AC-004: PASS. LogoFrame uses Avatar-like slots with contain, rounded rect, muted fallback.
- AC-005: PASS. `TableScroll` enables narrow horizontal scroll without row cards.
- AC-006: PASS. flat export, staticCss, typecheck, lint, build, and test:package passed.

## Invariant Coverage

- INV-001: PASS. No dedicated `<Text>` typography component is exported.
- INV-002: PASS. Empty is MediaFrame slot only; no independent EmptyMedia export.
- INV-003: PASS. LogoFrame defaults are contain + non-circle radius + `surface.muted`.
- INV-004: PASS. Mobile table path is TableScroll only; no card-stack markup.
- INV-005: PASS. MediaFrame empty is static absence UI; Skeleton remains loading placeholder.
- INV-006: PASS. packed consumerのSSRでRootの`aspect="auto"` / `fit="contain"`がImage classへ伝播し、Imageの明示fitがRoot fitを上書きする。
- INV-007: PASS. packed ESM / CJS / typesからpublic `textStyle(role)`を利用でき、Panda subpathや`<Text>` exportを追加していない。

## Publish readiness re-verification (2026-07-13)

publish blocker修正後にcanonical release gateと実際のnpm lifecycleを含むdry-runを完走した。

| Command / Check | Result | Notes |
| --- | --- | --- |
| `date '+%F %T %Z'` | PASS | `2026-07-13 08:24:39 JST`。 |
| `npm run typecheck` | PASS | public helper、Context伝播、storiesを含めexit 0。 |
| `npm run lint` | PASS | Biome 145 files、error 0。 |
| `npm run build` | PASS | ESM / CJS / declarations / compiled CSS生成。 |
| `npm run test:package` | PASS | `@otibo/ui@0.4.0` packed consumerでReact 18/19、ESM/CJS/types、Vite/Next、typography helper、MediaFrame SSR、Prose list CSSを確認。 |
| `npm run release:check` | PASS | check / audit / docs / publint / ATTWが全てexit 0。 |
| `npm publish --dry-run --access public` | PASS | prepublishOnlyからrelease gateを再実行し、397 files / 10.5 MBの0.4.0 tarballを生成。実publishはしていない。 |
| `git diff --check` | PASS | whitespace errorなし。 |

### Additional acceptance coverage

- AC-001: PASS. public `textStyle(role)`はconsumer-side Panda無しでroot exportから利用でき、全named role classがcompiled CSSに存在する。
- AC-007: PASS. Root variant伝播とImage fit overrideをpacked SSR regression checkで確認した。
- AC-008: PASS. compiled CSSにul disc、ol decimal、直下li typography selectorが存在し、storyにul/olを追加した。

## Deferred / Not Covered

- Playwright CLI fallback was not needed (browser MCP succeeded).
- Live GitHub Actions run was not executed in this session.
- Note: Ladle story CSS needs `npm run panda` (or watch) after recipe changes; package `build` regenerates CSS for publish.

## Post-review refinements (2026-07-12)

Cursor browser MCP でのレビューで見つけた見た目の弱点を 2 点修正した。

- **LogoFrame `shape` variant を追加**（`square` 既定 / `auto`）。従来は正方形 + `contain` 固定で、横長ワードマークが `sm`/`md` でほぼ判読不能に潰れていた。`shape="auto"` は高さを `size` で固定し幅をロゴ比率に追従させる。image 寸法は root の shape から `& img` で駆動（子は shape を受け取らないため slot 分岐にしない）。INV-003（既定は contain + 非円 + muted）は既定 `square` のまま維持。
- **TableScroll の端フェードを scroll 位置追従に変更**（Lea Verou の local/scroll 背景技法）。従来は左右 inset shadow 常時表示で、開始位置でも左に「続きがある」と誤誘導していた。cover 色は `--otibo-table-scroll-bg`（既定 `bg`）で受け、Card（`surface`）上では上書きする。project-brief デモは Card 内テーブルで `surface` に上書き済み。

### Re-verification

| Command / Check | Result | Notes |
| --- | --- | --- |
| `date '+%Y-%m-%d'` | PASS | `2026-07-12`. |
| `npm run typecheck` | PASS | Exit 0. |
| `npm run lint` | PASS | Exit 0. |
| `npm run build` | PASS | Exit 0; package CSS 再生成。 |
| `npm run test:package` | PASS | Exit 0; recipe inventory 不変（名称追加なし）。 |
| `npm run ladle:build` | PASS | 71 stories, meta.json 生成。 |
| Browser MCP: `logoframe--wordmark` | PASS | sm/md/lg いずれもワードマーク判読可、幅がロゴ比率に追従。 |
| Browser MCP: `logoframe--mark` / `--fallback` | PASS | square はアイコン / `OT` を中央に、auto fallback は内容幅にフィット。 |
| Browser MCP: `table--narrow-scroll` | PASS | 開始位置で左フェード無し、右端送りで右フェード消失・左フェード出現。 |
| Browser MCP: `explore--project-brief` | PASS | ヘッダーの otibo ワードマーク明瞭、Card 内テーブルは surface 一致で帯無し。 |

## Residual Risks

None

## Design constraints (not risks)

- `TableScroll` の cover 色は背後の面へ一致させる前提。`--otibo-table-scroll-bg`（既定 `bg`）の上書きで対応し、reference / refinements に明記済み。

## Follow-up TODOs

- `display` textStyle と body が同一書体（Gen Interface JP）。単一書体系の意図だが、将来 editorial 感を強めるなら display 用ウェイト / トラッキングの再校正余地あり（今ラウンド対象外）。
