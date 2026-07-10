import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = process.cwd()
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const stylesPath = path.join(root, "dist/styles.css")
const styles = readFileSync(stylesPath, "utf8")
const nextVersion = "16.2.10"

// Covers AC-001..005 and INV-001..006 from
// `_docs/qa/Pkg/drop-in-styles/test-plan.md` against the packed public artifact.
const expectedRecipes = [
  "accordion",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "card",
  "checkbox",
  "chip",
  "combobox",
  "dialog",
  "field",
  "inlineEdit",
  "input",
  "link",
  "menu",
  "meter",
  "navigationMenu",
  "numberField",
  "pagination",
  "popover",
  "previewCard",
  "progress",
  "radio",
  "scrollArea",
  "segmentedControl",
  "select",
  "separator",
  "skeleton",
  "slider",
  "spinner",
  "switchRecipe",
  "table",
  "tabs",
  "toast",
  "toggle",
  "tooltip",
]

const removedNamespaceExports = [
  "Accordion",
  "Avatar",
  "Breadcrumb",
  "Card",
  "Combobox",
  "Dialog",
  "Field",
  "Menu",
  "Meter",
  "NavigationMenu",
  "NumberField",
  "Pagination",
  "Popover",
  "PreviewCard",
  "Progress",
  "ScrollArea",
  "SegmentedControl",
  "Select",
  "Table",
  "Tabs",
  "Toast",
  "Tooltip",
]

const expectedFlatExports = [
  "AccordionRoot",
  "AccordionItem",
  "AccordionTrigger",
  "AccordionPanel",
  "AvatarRoot",
  "AvatarImage",
  "AvatarFallback",
  "BreadcrumbRoot",
  "BreadcrumbItem",
  "BreadcrumbLink",
  "BreadcrumbCurrent",
  "CardRoot",
  "CardHeader",
  "CardTitle",
  "CardDescription",
  "CardBody",
  "CardFooter",
  "ComboboxRoot",
  "ComboboxInput",
  "ComboboxPopup",
  "ComboboxList",
  "ComboboxItem",
  "ComboboxEmpty",
  "ComboboxValue",
  "DialogRoot",
  "DialogTrigger",
  "DialogPopup",
  "DialogTitle",
  "DialogDescription",
  "DialogClose",
  "FieldRoot",
  "FieldLabel",
  "FieldInput",
  "FieldDescription",
  "FieldError",
  "MenuRoot",
  "MenuTrigger",
  "MenuPopup",
  "MenuItem",
  "MenuSeparator",
  "MenuGroup",
  "MenuGroupLabel",
  "MeterRoot",
  "MeterLabel",
  "MeterValue",
  "MeterTrack",
  "NavigationMenuRoot",
  "NavigationMenuList",
  "NavigationMenuItem",
  "NavigationMenuTrigger",
  "NavigationMenuLink",
  "NavigationMenuContent",
  "NavigationMenuGrid",
  "NavigationMenuViewport",
  "NumberFieldRoot",
  "NumberFieldField",
  "PaginationRoot",
  "PaginationItem",
  "PaginationPrev",
  "PaginationNext",
  "PaginationEllipsis",
  "PopoverRoot",
  "PopoverTrigger",
  "PopoverPopup",
  "PopoverTitle",
  "PopoverDescription",
  "PopoverClose",
  "PreviewCardRoot",
  "PreviewCardTrigger",
  "PreviewCardPopup",
  "PreviewCardMedia",
  "PreviewCardBody",
  "PreviewCardTitle",
  "PreviewCardDescription",
  "PreviewCardFooter",
  "ProgressRoot",
  "ProgressLabel",
  "ProgressValue",
  "ProgressTrack",
  "ScrollAreaRoot",
  "ScrollAreaViewport",
  "ScrollAreaScrollbar",
  "SegmentedControlRoot",
  "SegmentedControlItem",
  "SelectRoot",
  "SelectTrigger",
  "SelectValue",
  "SelectPopup",
  "SelectItem",
  "SelectItemText",
  "SelectGroup",
  "SelectGroupLabel",
  "SelectSeparator",
  "TableRoot",
  "TableHeader",
  "TableBody",
  "TableRow",
  "TableHead",
  "TableCell",
  "TabsRoot",
  "TabsList",
  "TabsTab",
  "TabsPanel",
  "ToastProvider",
  "ToastToaster",
  "useToastManager",
  "createToastManager",
  "TooltipProvider",
  "TooltipRoot",
  "TooltipTrigger",
  "TooltipPopup",
]

const preservedStandaloneExports = [
  "Button",
  "ChipGroup",
  "InlineEdit",
  "RadioGroup",
  "Slider",
  "ToggleGroup",
]

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    ...options,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    )
  }
  return result
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(entryPath) : [entryPath]
  })
}

function installConsumer(prefix, tarball, dependencies) {
  const consumerDirectory = mkdtempSync(path.join(tmpdir(), prefix))
  writeFileSync(
    path.join(consumerDirectory, "package.json"),
    JSON.stringify(
      {
        private: true,
        type: "module",
        dependencies: {
          "@otibo/ui": `file:${tarball}`,
          ...dependencies,
        },
      },
      null,
      2,
    ),
  )
  run(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["install", "--ignore-scripts", "--no-audit", "--no-fund"],
    {
      cwd: consumerDirectory,
      env: { ...process.env, npm_config_dry_run: "false" },
    },
  )
  return consumerDirectory
}

assert.equal(manifest.version, "0.3.0")
assert.deepEqual(Object.keys(manifest.exports).sort(), [".", "./styles.css"])
assert.deepEqual(manifest.exports["."], {
  import: { types: "./dist/index.d.ts", default: "./dist/index.js" },
  require: { types: "./dist/index.d.cts", default: "./dist/index.cjs" },
})
assert.deepEqual(manifest.exports["./styles.css"], {
  types: "./dist/styles.d.ts",
  default: "./dist/styles.css",
})
assert.deepEqual(Object.keys(manifest.peerDependencies).sort(), ["react", "react-dom"])
assert.equal(manifest.dependencies["@base-ui/react"], "^1.6.0")
assert.equal(manifest.devDependencies["@base-ui/react"], undefined)
assert.equal(manifest.devDependencies["@pandacss/dev"], "^1.11.4")
assert.equal(manifest.devDependencies["gen-interface-jp"], "^0.6.2")
assert.ok(manifest.sideEffects.includes("**/*.css"))

const pandaConfig = readFileSync(path.join(root, "panda.config.ts"), "utf8")
for (const recipe of expectedRecipes) {
  assert.match(
    pandaConfig,
    new RegExp(`\\b${recipe}: \\["\\*"\\]`),
    `${recipe} must emit all variants`,
  )
}

const recipeSources = walk(path.join(root, "src/core-ui")).filter((file) =>
  file.endsWith(".recipe.ts"),
)
assert.equal(recipeSources.length, expectedRecipes.length)
for (const recipeSource of recipeSources) {
  const source = readFileSync(recipeSource, "utf8")
  const marker = source.match(/className:\s*"([^"]+)"/)?.[1]
  assert.ok(marker, `${recipeSource} must declare a className`)
  assert.ok(styles.includes(marker), `${marker} must be present in compiled CSS`)
}

assert.ok(styles.includes("@layer otibo-reset"), "compiled CSS must include the otibo reset layer")
assert.ok(styles.includes("--colors-warm-50"), "compiled CSS must include design tokens")
assert.ok(styles.includes('font-family:"Gen Interface JP"'), "compiled CSS must include font faces")

const fontWeights = new Set(
  [...styles.matchAll(/@font-face\{[^}]*font-weight:(\d+)/g)].map((match) => match[1]),
)
assert.deepEqual([...fontWeights].sort(), ["400", "500", "600"])

const fontUrls = [...styles.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((match) => match[1])
assert.equal(fontUrls.length, 384)
assert.ok(fontUrls.every((url) => url.startsWith("./fonts/w/normal/")))
for (const fontUrl of fontUrls) {
  assert.ok(
    existsSync(path.resolve(path.dirname(stylesPath), fontUrl)),
    `missing font asset: ${fontUrl}`,
  )
}
assert.ok(existsSync(path.join(root, "dist/fonts/OFL.txt")))

const packDirectory = mkdtempSync(path.join(tmpdir(), "otibo-ui-pack-"))
const packResult = run(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["pack", "--json", "--ignore-scripts", "--pack-destination", packDirectory],
  {
    capture: true,
    // `npm publish --dry-run` exports npm_config_dry_run=true to lifecycle scripts.
    // The nested pack must still materialize a tarball for consumer installation.
    env: { ...process.env, npm_config_dry_run: "false" },
  },
)
const pack = JSON.parse(packResult.stdout)[0]
const tarball = path.join(packDirectory, pack.filename)
const packedPaths = new Set(pack.files.map((file) => file.path))

assert.ok(packedPaths.has("dist/styles.css"))
assert.ok(packedPaths.has("dist/styles.d.ts"))
assert.ok(packedPaths.has("dist/fonts/OFL.txt"))
assert.ok(packedPaths.has("CHANGELOG.md"))
assert.equal([...packedPaths].filter((file) => file.endsWith(".woff2")).length, 384)
assert.ok(
  ![...packedPaths].some((file) => file.includes("preset") || file.includes("panda.buildinfo")),
)

const consumer = installConsumer("otibo-ui-react19-", tarball, {
  next: nextVersion,
  react: "19.2.7",
  "react-dom": "19.2.7",
})

run(
  process.execPath,
  [
    "--input-type=module",
    "--eval",
    `import("@otibo/ui").then((ui) => {
      const removed = ${JSON.stringify(removedNamespaceExports)}
      const expected = ${JSON.stringify([...expectedFlatExports, ...preservedStandaloneExports])}
      if (removed.some((name) => name in ui)) process.exit(1)
      if (expected.some((name) => !(name in ui))) process.exit(1)
    })`,
  ],
  { cwd: consumer },
)
run(
  process.execPath,
  [
    "--eval",
    `const ui = require("@otibo/ui")
    const removed = ${JSON.stringify(removedNamespaceExports)}
    const expected = ${JSON.stringify([...expectedFlatExports, ...preservedStandaloneExports])}
    if (removed.some((name) => name in ui)) process.exit(1)
    if (expected.some((name) => !(name in ui))) process.exit(1)`,
  ],
  { cwd: consumer },
)

writeFileSync(
  path.join(consumer, "typecheck.ts"),
  'import "@otibo/ui/styles.css"\nimport type * as OtiboUI from "@otibo/ui"\ntype PublicExports = typeof OtiboUI.Button | typeof OtiboUI.FieldRoot | typeof OtiboUI.DialogPopup\nconst valid: PublicExports | undefined = undefined\nvoid valid\n',
)
run(
  process.execPath,
  [
    path.join(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--skipLibCheck",
    "--target",
    "ES2020",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--noUncheckedSideEffectImports",
    "typecheck.ts",
  ],
  { cwd: consumer },
)

writeFileSync(
  path.join(consumer, "typecheck.cts"),
  'import { Button, DialogPopup, FieldRoot } from "@otibo/ui"\nvoid Button\nvoid DialogPopup\nvoid FieldRoot\n',
)
run(
  process.execPath,
  [
    path.join(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--skipLibCheck",
    "--target",
    "ES2020",
    "--module",
    "Node16",
    "--moduleResolution",
    "Node16",
    "typecheck.cts",
  ],
  { cwd: consumer },
)

const installedPackage = path.join(consumer, "node_modules/@otibo/ui")
assert.ok(existsSync(path.join(installedPackage, "dist/styles.css")))
assert.ok(existsSync(path.join(installedPackage, "dist/styles.d.ts")))
assert.ok(existsSync(path.join(consumer, "node_modules/@base-ui/react")))

const appSource = path.join(consumer, "src")
mkdirSync(appSource)
writeFileSync(
  path.join(consumer, "index.html"),
  '<main id="root"></main><script type="module" src="/src/main.jsx"></script>',
)
writeFileSync(
  path.join(appSource, "main.jsx"),
  'import React from "react"\nimport { createRoot } from "react-dom/client"\nimport { Button, FieldDescription, FieldInput, FieldLabel, FieldRoot } from "@otibo/ui"\nimport "@otibo/ui/styles.css"\ncreateRoot(document.getElementById("root")).render(<FieldRoot><FieldLabel>名前</FieldLabel><FieldInput /><FieldDescription>入力してください</FieldDescription><Button>保存</Button></FieldRoot>)\n',
)
run(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "build"], {
  cwd: consumer,
})

const viteAssets = walk(path.join(consumer, "dist/assets"))
assert.ok(viteAssets.some((file) => file.endsWith(".css")))
assert.ok(viteAssets.some((file) => file.endsWith(".woff2")))
assert.ok(viteAssets.some((file) => statSync(file).size > 0))

const stylesUrl = new URL("dist/styles.css", `file://${installedPackage}/`)
assert.ok(existsSync(fileURLToPath(stylesUrl)))

const nextApp = path.join(consumer, "app")
mkdirSync(nextApp)
writeFileSync(
  path.join(nextApp, "layout.jsx"),
  'import "@otibo/ui/styles.css"\nexport default function Layout({ children }) { return <html lang="ja"><body>{children}</body></html> }\n',
)
writeFileSync(
  path.join(nextApp, "otibo-form.jsx"),
  '"use client"\nimport { Button, FieldDescription, FieldInput, FieldLabel, FieldRoot } from "@otibo/ui"\nexport function OtiboForm() { return <FieldRoot><FieldLabel>名前</FieldLabel><FieldInput /><FieldDescription>入力してください</FieldDescription><Button>保存</Button></FieldRoot> }\n',
)
writeFileSync(
  path.join(nextApp, "page.jsx"),
  'import { OtiboForm } from "./otibo-form"\nexport default function Page() { return <main><OtiboForm /></main> }\n',
)
writeFileSync(path.join(consumer, "next.config.mjs"), "export default {}\n")
run(process.execPath, [path.join(consumer, "node_modules/next/dist/bin/next"), "build"], {
  cwd: consumer,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
})
assert.ok(existsSync(path.join(consumer, ".next/BUILD_ID")))

const react18Consumer = installConsumer("otibo-ui-react18-", tarball, {
  react: "18.3.1",
  "react-dom": "18.3.1",
})
writeFileSync(
  path.join(react18Consumer, "typecheck.ts"),
  'import "@otibo/ui/styles.css"\nimport { Button, FieldRoot } from "@otibo/ui"\nvoid Button\nvoid FieldRoot\n',
)
run(
  process.execPath,
  [
    path.join(root, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--skipLibCheck",
    "--target",
    "ES2020",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--noUncheckedSideEffectImports",
    "typecheck.ts",
  ],
  { cwd: react18Consumer },
)
const react18Source = path.join(react18Consumer, "src")
mkdirSync(react18Source)
writeFileSync(
  path.join(react18Consumer, "index.html"),
  '<main id="root"></main><script type="module" src="/src/main.jsx"></script>',
)
writeFileSync(
  path.join(react18Source, "main.jsx"),
  'import React from "react"\nimport { createRoot } from "react-dom/client"\nimport { Button, FieldInput, FieldLabel, FieldRoot } from "@otibo/ui"\nimport "@otibo/ui/styles.css"\ncreateRoot(document.getElementById("root")).render(<FieldRoot><FieldLabel>名前</FieldLabel><FieldInput /><Button>保存</Button></FieldRoot>)\n',
)
run(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "build"], {
  cwd: react18Consumer,
})
assert.ok(walk(path.join(react18Consumer, "dist/assets")).some((file) => file.endsWith(".css")))

console.log(
  `Verified ${manifest.name}@${manifest.version}: ${pack.files.length} files, ${(pack.size / 1_000_000).toFixed(2)} MB tarball, ${fontUrls.length} font subsets, React 18/19 ESM/CJS/types/Vite/Next consumers`,
)
