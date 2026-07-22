#!/usr/bin/env bash
set -euo pipefail

npx markdownlint-cli2 \
  "_docs/**/*.md" \
  "_evals/**/*.md" \
  README.md \
  AGENTS.md \
  TODO.md \
  QUICKSTART.md \
  "#_docs/archives/**" \
  "#_docs/standards/templates/**"
npx biome check scripts/*.mjs
deno run --allow-read --allow-env --allow-run=git scripts/validate-frontmatter.mjs
deno run --allow-read scripts/validate-todo.mjs
deno run --allow-read --allow-env --allow-run=git scripts/validate-doc-links.mjs
deno run --allow-read --allow-env --allow-run=git scripts/validate-intent.mjs
deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.mjs
deno run --allow-read --allow-write --allow-env --allow-run scripts/test-validators.mjs
deno run --allow-read --allow-run=git scripts/test-agent-workflow-hook.mjs
deno run --allow-read scripts/test-agent-workflow-smoke.mjs
