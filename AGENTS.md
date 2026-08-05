<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Web del Club Deportivo Granaderos de Koslay

Marketing site for an Argentine soccer club (Juana Koslay, San Luis). App Router site with a public marketing side (SSR) and an authenticated admin panel backed by Prisma + SQLite.

## Stack & versions
- Next.js **16.2.12** (App Router, React 19, Turbopack) + Tailwind **v4** (no `tailwind.config.*`; CSS-first via `@tailwindcss/postcss`).
- TypeScript strict, path alias `@/*` → repo root and `./src/` (see `tsconfig.json`). `@/domain`, `@/application`, `@/infrastructure`, `@/generated` resolve into `src/`/`generated/`.
- Prisma **7** (SQLite, driver adapter better-sqlite3), Zod **4** for input validation, `jose` for JWT, `bcryptjs` for hashes.
- Next.js docs live in `node_modules/next/dist/docs/` — check there before writing code (see warning above). In Next.js 16, `middleware` is renamed to **`proxy.ts`**.

## Commands
- `npm run dev` — dev server
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`); no `--fix`
- `npm run build` — the only typecheck gate (`next build` runs `tsc`); run it to verify TS changes
- `npm run reset-password` — `tsx scripts/reset-admin-password.ts` (admin password reset)
- No test runner or standalone typecheck script exists.

## Architecture
- **Public marketing site:** pages in `app/` compose `Header`/`Footer` (`components/layout/`) plus section components (`components/sections/`); generic UI in `components/ui/` (`Button`, `Badge`, `SectionHeading`, `PageHeader`).
- **Admin panel** under `app/admin/*` (login at `/admin`, dashboard/CRUDs for noticias/calendario/equipos). Auth is enforced by `proxy.ts` (root `proxy.ts`, matcher `/admin/:path*`) + `requiereSesion()` defense-in-depth in every admin server action.
- **Server actions** live centralized in `app/actions/` (`app/actions/admin/*` are the admin, auth-gated ones). No actions defined inline in pages.
- **DDD layers under `src/`:** `domain` (entities + repository ports, no framework imports), `application` (use cases + Zod DTOs), `infrastructure` (Prisma adapters). Public read paths go through use cases; admin actions may use repositories directly. Prisma client singleton: `src/infrastructure/db/prisma.ts` (generated to `generated/prisma`, imported as `@/generated/prisma/client`).
- **Content split:** static site content lives in `lib/site.ts` + `lib/data/*.ts` (`nav`, `sponsors`, `el-club`, `footer`). Dynamic content (noticias, calendario, equipos) lives in the DB via Prisma — there are no `lib/data/{calendario,noticias}.ts`.
- Some components are client components (`"use client"`): `Header`, `ThemeToggle`, admin forms, `BotonEliminar`, `CampoImagen`, `BotonEnviar`, `Sidebar`, `LoginForm`.
- `elclub.md` is the source copy for the El Club page — keep it in sync when editing that page.
- `lib/utils/date.ts` owns all date formatting (Spanish, `es-AR` locale) and `aValorInputDatetimeLocal` for form inputs. Use it; don't hand-roll dates in components.
- Shared form helpers: `lib/utils/form.ts` (`vacioANull`) and `src/application/dtos/form.helpers.ts` (checkbox/date Zod helpers).

## Design system ("Pitch Imperial") — match it, don't invent
- Dark-first with an optional light theme: default `color-scheme: dark` in `app/globals.css`; light overrides live under `html[data-theme="light"]`. Toggling is handled by the inline `themeScript` in `app/layout.tsx` + `components/ui/ThemeToggle.tsx` (shared `localStorage("grana-theme")` key — keep them in sync).
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
