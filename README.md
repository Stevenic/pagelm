# PageLM

An AI-powered web page builder that creates and modifies web pages using natural language prompts. Describe what you want, and PageLM builds it.

PageLM supports two editing modes: **HTML mode** for direct DOM transformations and **CoreLM mode** using a typed UI intermediate representation with 28 primitives and semantic design tokens.

## Quick Start

```bash
npm install
npm run build
```

Set your API key and start Studio:

```bash
export PAGELM_API_KEY=sk-...
node studio/bin/pagelm-studio.js start
```

Studio opens at `http://localhost:3000`.

## Studio CLI

```
pagelm-studio start [options]
```

| Option | Description | Default |
|---|---|---|
| `-p, --port <port>` | Port to listen on | `3000` |
| `--provider <name>` | AI provider (`anthropic`, `openai`, `azure`, `oss`) | `anthropic` |
| `--api-key <key>` | API key | |
| `--model <model>` | Model name (e.g. `claude-opus-4-6`, `gpt-4o`) | `claude-opus-4-6` |
| `--debug` | Enable debug logging | |
| `--debug-page-updates` | Log full HTML on each transform | |

Environment variables `PAGELM_PROVIDER`, `PAGELM_API_KEY`, and `PAGELM_MODEL` can be used instead of CLI flags.

## Architecture

PageLM is an npm workspaces monorepo with TypeScript composite project references.

```
pagelm/
  packages/
    corelm/              @pagelm/corelm — Schema, types, validation for 28 UI primitives
    corelm-compiler/     @pagelm/corelm-compiler — Compiles CoreLM documents to HTML
    pagelm/              @pagelm/core — Page transformation engine (parses & applies changes)
    pagelm-anthropic/    @pagelm/anthropic — Anthropic Claude builder
    pagelm-openai/       @pagelm/openai — OpenAI builder (stub)
    pagelm-azure/        @pagelm/azure — Azure OpenAI builder (stub)
    pagelm-oss/          @pagelm/oss — Open-source model builder (stub)
  frameworks/
    fluentlm/            Fluent UI CSS framework with light/dark theme support
  studio/                @pagelm/studio — Web IDE with chat-based page editing
```

### Key Concepts

- **Builder interface** — Pluggable AI model implementations (`Builder.run()`) that take current page state + user message and return transforms, CoreLM operations, a text reply, or an error.
- **Dual-mode editing** — HTML mode uses `ChangeOp[]` for DOM mutations (insert, update, replace, delete, style, search-replace). CoreLM mode uses `CoreOp[]` for structured document operations.
- **Framework injection** — Studio injects framework CSS/JS into page previews, strips them before sending to the LLM, then re-injects after transformation.
- **Workspace storage** — `.pagelm/` directory holds `settings.json` and `pages/` with per-page version history and turn metadata.

### Studio API

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/settings` | Provider and model configuration |
| `GET/POST/DELETE` | `/api/pages[/:name]` | Page CRUD |
| `GET` | `/api/pages/:name/versions[/:ver]` | Version history |
| `POST` | `/api/pages/:name/transform` | Apply AI transformation |

## Development

```bash
npm run build          # Build all packages
npm run clean          # Clean build artifacts
npm run dev            # Run studio in dev mode
```

## License

MIT
