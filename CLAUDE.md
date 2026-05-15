# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16** with **React 19** — APIs and conventions differ significantly from training data. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
pnpm dev        # start dev server at localhost:3000
pnpm build      # production build
pnpm lint       # Biome check (linter + formatter check)
pnpm format     # Biome format --write
```

No test suite. Linter/formatter is **Biome** (not ESLint/Prettier) — do not add ESLint or Prettier config.

## Architecture

Single-page documentation site for the `@ttsalpha/qrcode` npm package. Everything lives in one route (`src/app/page.tsx`) with four components under `src/components/`.

**Rendering model:**
- `layout.tsx` — async Server Component; reads the `theme` cookie to set `data-theme` on `<html>` before first paint
- `page.tsx` — Server Component; composes the full page (hero, features, playground, install, API reference, examples)
- `CodeBlock.tsx` — async Server Component; uses `shiki` server-side to produce pre-highlighted HTML via `dangerouslySetInnerHTML`
- `Playground.tsx` — Client Component (`"use client"`); interactive QR code editor with live syntax highlighting via a shared singleton `Highlighter` from shiki
- `CopyButton.tsx`, `ThemeToggle.tsx` — Client Components

**Theme system:** Cookie `theme=light|dark` → read in `layout.tsx` → `data-theme` attribute on `<html>` → CSS `[data-theme="dark"]` selectors in `globals.css`. `ThemeToggle` sets the cookie and updates `data-theme` on `document.documentElement` directly (no re-render needed).

**Styling:** CSS Modules throughout. Design tokens (colors, radii) defined as CSS custom properties in `globals.css`. Dark mode via both `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]` selectors — both must be kept in sync when adding new color rules.

**Shiki:** Version 4 (`shiki@4`). The Playground lazily creates one shared `Highlighter` instance (module-level singleton `highlighterPromise`) to avoid re-initializing on every render. CodeBlock uses `codeToHtml` (server-side, no singleton needed).
