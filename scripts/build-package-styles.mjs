import { spawnSync } from "node:child_process"
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

const weights = ["400", "500", "600"]
const fontPackage = "node_modules/gen-interface-jp"
const outputDirectory = "dist"
const fontOutputDirectory = `${outputDirectory}/fonts`
const cssOutput = `${outputDirectory}/styles.css`
const cssTypesOutput = `${outputDirectory}/styles.d.ts`

mkdirSync(fontOutputDirectory, { recursive: true })

const panda = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["panda", "cssgen", "--outfile", cssOutput],
  { stdio: "inherit" },
)

if (panda.error) throw panda.error
if (panda.status !== 0) process.exit(panda.status ?? 1)

const pandaCss = readFileSync(cssOutput, "utf8")
const fontCss = weights
  .map((weight) => readFileSync(`${fontPackage}/${weight}.css`, "utf8"))
  .join("\n")
  .replaceAll('url("./w/', 'url("./fonts/w/')

for (const weight of weights) {
  cpSync(`${fontPackage}/w/normal/${weight}`, `${fontOutputDirectory}/w/normal/${weight}`, {
    recursive: true,
  })
}

cpSync(`${fontPackage}/OFL.txt`, `${fontOutputDirectory}/OFL.txt`)

writeFileSync(
  cssOutput,
  `/* Gen Interface JP 400/500/600 — SIL Open Font License 1.1. */\n${fontCss}\n${pandaCss}`,
)
writeFileSync(cssTypesOutput, "declare const styles: string\nexport default styles\n")

console.log(
  `Built ${cssOutput} and ${cssTypesOutput} with self-hosted Gen Interface JP ${weights.join("/")}`,
)
