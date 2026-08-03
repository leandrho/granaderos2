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

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and what to look up in the library's documentation, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and what to look up in the library's documentation (not single words), scoped to a single concept. If the question spans multiple distinct concepts (e.g. routing and auth and caching), make a separate `query-docs` call per concept with the same library ID, unless the question is about how the concepts interact — combined queries dilute ranking and return shallow results for each topic
4. Answer using the fetched docs
<!-- context7 -->
