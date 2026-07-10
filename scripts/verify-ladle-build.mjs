import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs"

// Covers AC-001 / INV-003: Ladle 5 can report an internal Vite failure but exit 0.
// Require a newly written metadata file with real stories instead of trusting status alone.
const metaPath = "build/meta.json"
const indexPath = "build/index.html"
const previousMetaMtime = existsSync(metaPath)
  ? statSync(metaPath, { bigint: true }).mtimeNs
  : undefined
mkdirSync("build", { recursive: true })

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const result = spawnSync(npmCommand, ["run", "ladle:build:raw"], { stdio: "inherit" })

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

const metaStat = statSync(metaPath, { bigint: true })

if (previousMetaMtime !== undefined && metaStat.mtimeNs <= previousMetaMtime) {
  throw new Error("Ladle metadata was not refreshed by the current build")
}

const meta = JSON.parse(readFileSync(metaPath, "utf8"))
const storyCount = Object.keys(meta.stories ?? {}).length

if (storyCount === 0) {
  throw new Error("Ladle build completed without any stories")
}

statSync(indexPath)
console.log(`Verified Ladle build artifact with ${storyCount} stories`)
