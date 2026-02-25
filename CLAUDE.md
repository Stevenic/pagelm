# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PageLM is an AI-powered web page builder that creates and modifies web pages using natural language prompts. It supports two modes: direct HTML transformations and a typed UI intermediate representation called CoreLM.

## Build & Run Commands

```bash
npm run build          # Build all packages (TypeScript composite build)
npm run clean          # Clean all build artifacts
npm run dev            # Run studio in dev mode
npm start --workspace=studio  # Start studio server
```

To build and start in one step: `npm run build && node studio/bin/pagelm-studio.js start`

Studio CLI options: `--port`, `--provider`, `--api-key`, `--model`, `--debug`, `--debug-page-updates`

Environment variables: `PAGELM_PROVIDER`, `PAGELM_API_KEY`, `PAGELM_MODEL`

## Monorepo Structure

npm workspaces with TypeScript composite project references. Each package has `src/` source and `dist/` output. Base config in `tsconfig.base.json` (ES2022, Node16, strict).

- **packages/corelm** (`@pagelm/corelm`) — CoreLM schema, types, validation, and operations for 28 UI primitives
- **packages/corelm-compiler** (`@pagelm/corelm-compiler`) — Compiles CoreLM documents to HTML via pluggable framework adapters
- **packages/pagelm** (`@pagelm/core`) — Core page transformation engine: parses builder responses, applies change operations to HTML
- **packages/pagelm-anthropic** (`@pagelm/anthropic`) — Anthropic Claude builder with intelligent request classification (Sonnet for simple, Opus for complex)
- **packages/pagelm-openai**, **pagelm-azure**, **pagelm-oss** — Stubs for other AI providers
- **frameworks/fluentlm** — Fluent UI CSS framework with theme support (light/dark)
- **studio/** (`@pagelm/studio`) — Express.js web IDE: REST API, CLI, chat-based page editor frontend

## Key Architecture

**Builder interface** (`Builder.run()`) — Pluggable AI model implementations that take current page state + user message and return either `transforms` (HTML ChangeOps), `coreOps` (CoreLM operations), `reply` (text only), or `error`.

**Dual-mode editing** — HTML mode uses ChangeOp[] for DOM mutations (insert, update, replace, delete, style, search-replace). CoreLM mode uses CoreOp[] for structured document operations.

**Framework injection** — Studio injects framework CSS/resources into pages for preview, strips them before sending to LLM, then re-injects after transformation.

**Workspace storage** — `.pagelm/` directory holds `settings.json` (provider config) and `pages/` (per-page state with version history and turn metadata).

**CoreLM design tokens** — Semantic token system for spacing, colors, typography, radius, shadow. All CoreLM nodes use these tokens rather than raw CSS values.

## Working on Studio

Always read `STUDIO_DESIGN.md` before making changes to the `studio/` project.

## API Endpoints (Studio)

- `GET/POST /api/settings` — Provider/model configuration
- `GET/POST/DELETE /api/pages[/:name]` — Page CRUD
- `GET /api/pages/:name/versions[/:ver]` — Version history
- `POST /api/pages/:name/transform` — Apply AI transformation
