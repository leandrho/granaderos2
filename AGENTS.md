<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Web del Club Deportivo Granaderos de Koslay

Marketing site for an Argentine soccer club (Juana Koslay, San Luis). Static App Router site — no backend, no database, no tests.

## Stack & versions
- Next.js **16.2.12** (App Router, React 19, Turbopack) + Tailwind **v4** (no `tailwind.config.*`; CSS-first via `@tailwindcss/postcss`).
- TypeScript strict, path alias `@/*` → repo root (see `tsconfig.json`).
- Next.js docs live in `node_modules/next/dist/docs/` — check there before writing code (see warning above).

## Commands
- `npm run dev` — dev server
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`); no `--fix`
- `npm run build` — the only typecheck gate (`next build` runs `tsc`); run it to verify TS changes
- No test runner or standalone typecheck script exists.

## Architecture
- Pages in `app/` compose `Header`/`Footer` (`components/layout/`) plus section components (`components/sections/`); generic UI in `components/ui/` (`Button`, `Badge`, `SectionHeading`, `PageHeader`).
- All components are server components — no `"use client"` anywhere yet.
- **Content is static and lives in data files, not components:** `lib/site.ts` (site-wide constants) and `lib/data/*.ts` (`nav`, `calendario`, `noticias`, `sponsors`, `el-club`, `footer`). Add/edit site content there.
- `elclub.md` is the source copy for the El Club page — keep it in sync when editing that page.
- `lib/utils/date.ts` owns all date formatting (Spanish, `es-AR` locale). Use it; don't hand-roll dates in components.

## Design system ("Pitch Imperial") — match it, don't invent
- Dark theme only (`color-scheme: dark` in `app/globals.css`).
- Tokens defined in `@theme inline` in `app/globals.css`: `primary` navy `#0a1d37`, `secondary` gold `#c5a059`, `tertiary` red `#d31124`, `surface`/`on-surface`. **Add any new color/font tokens there** — there is no Tailwind config file.
- Fonts loaded once in `app/layout.tsx` via `next/font/google`: Anton (`font-headline`), Hanken Grotesk (`font-body`/`font-sans`), Space Grotesk (`font-label`).
- Signature style: square corners (no `rounded-*`), 45° diagonal clip-path cuts on primary CTAs (see `Button.tsx` `CLIP_PRIMARIO`), uppercase `font-headline` headings with `tracking-[0.1em]` labels.
- **All UI copy is in Spanish** — write new copy/aria/alt text in Spanish, matching existing tone.

## Content & images
- `next.config.ts` enables `dangerouslyAllowSVG` (needed for SVG logo/sponsor images).
- Sponsor logos: `public/sponsors/`; social icons: `public/icons/` (Instagram, whatsapp, youtube).
- Ignore `public/icons/Create Next App_files/` and `public/icons/Create Next App.html` — leftover junk, don't build on it.

## Workflow: spec-driven
- `specs/*.md` are the specs (written in Spanish, status "Aprobado"). Branch names follow `spec-NN-slug` (e.g. current: `spec-02-noticias-sponsors-cta-footer`).
- The `spec` and `spec-impl` skills (`skills-lock.json`) drive design → implementation; `specs/.spec-config.yml` auto-creates branches (`AutoCreateBranch: true`).
- `opencode.json` configures the Google Stitch MCP (remote) for screen generation/design-system work. Don't remove or expose the API key.

## Gotchas
- `next-env.d.ts` is gitignored and auto-generated — never hand-edit it.
- Landing sections use anchor nav (`/#calendario`); keep `id` attributes and `scroll-mt-*` offsets when renaming sections.
- This is a Next.js 16 repo — several APIs differ from earlier Next versions; verify against `node_modules/next/dist/docs/` rather than assuming.
