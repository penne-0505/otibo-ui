import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const executableSuffix = process.platform === "win32" ? ".cmd" : ""
const environment = { ...process.env, npm_config_dry_run: "false" }

function run(binary, args) {
  const result = spawnSync(
    path.join(root, "node_modules", ".bin", `${binary}${executableSuffix}`),
    args,
    {
      cwd: root,
      env: environment,
      stdio: "inherit",
    },
  )

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run("publint", [])
run("attw", ["--pack", "--entrypoints", ".", "."])
