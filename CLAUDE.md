# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Sample code accompanying the article/video "How to Build an Agent in JavaScript". It implements a minimal CLI agent that talks to Claude via the Anthropic SDK on Google Vertex AI and exposes three filesystem tools (read, list, edit) to the model.

## Commands

- `pnpm i` — install dependencies (pnpm is the required package manager; see `packageManager` in `package.json`).
- `pnpm agent` — build and run the agent CLI (`tsc` then `node dist/index.js`). There is no watch/dev script; every run recompiles.
- `pnpm build` — TypeScript compile only, emits to `dist/`.
- `pnpm format` — Prettier over the repo.

There is no test suite and no linter configured.

## Runtime prerequisites

The agent authenticates to Vertex AI using Google **Application Default Credentials**, not an API key:

```
gcloud auth application-default login
gcloud auth application-default set-quota-project <GCP project ID>
```

The GCP project ID and region are **hardcoded** at the top of `src/index.ts` (`projectId`, `region`). Edit those constants to point at a project the authenticated user can call Vertex AI from. The model string (`claude-3-7-sonnet@20250219`) is hardcoded in `src/agent.ts` and must be a model available in the chosen Vertex region.

Node 20 is expected (declared in `devbox.json`).

## Architecture

Two layers, deliberately small:

**`src/index.ts`** — composition root. Instantiates `AnthropicVertex`, wires three I/O callbacks (`getUserMessage`, `getToolConsent`, `showAgentMessage`) built on `readline/promises`, imports the tool list, and calls `agent.run()`. Ctrl-C triggers an `AbortError` that is caught here for a clean exit.

**`src/agent.ts`** — the `Agent` class and the conversation loop. The loop is the whole pattern worth understanding:

1. Append a user turn to `conversation`.
2. Call `client.messages.create` with the full `conversation` and the tool schemas.
3. Append the assistant message back onto `conversation`.
4. For every `tool_use` block in the response, prompt the user for consent, execute the tool, and collect `tool_result` blocks.
5. If any tools ran, append the `tool_result` blocks as a `user` message and loop **without** reading new user input (`readUserInput = false`). Otherwise, read new user input next iteration.

This "tool results are a user message, then re-prompt the model" shape is the core of the agent — don't restructure it without reading the article it's teaching.

**`src/agent/tools/`** — each tool is a `ToolDefinition` (`src/agent/types.ts`): `name`, `description`, Anthropic `input_schema`, and an async `func`. `index.ts` exports the array passed to `Agent`. Adding a tool = create a new file in `tools/`, append it to that array.

Consent gate: every tool call is intercepted by `getToolConsent` before `tool.func` runs; declining returns an `is_error: true` tool result so the model sees the refusal.

## Module conventions

- `"type": "module"` + `tsconfig` `module: "NodeNext"` → **imports must use the compiled `.js` extension** even when importing a `.ts` source (e.g. `import { Agent } from "./agent.js"`). Keep this when adding new files.
- `rootDir: ./src`, `outDir: ./dist`. The entry point after build is `dist/index.js`.
