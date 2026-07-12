# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run check    # Type check (tsc --noEmit)
npm run lint     # next lint
npm run build    # Static export → out/ (runs prebuild: copy-portfolio-images.js)
npm run start    # Serve the built out/ locally

npm test         # Playwright e2e tests
npm run test:ui  # Playwright in UI mode
npx playwright test tests/seo.spec.ts                       # single test file
npx playwright test tests/seo.spec.ts -g "sitemap"          # single test by name

npx tsx scripts/warm-cache.ts   # regenerate .cache/*.json seeds (see Data Layer)
```

Next.js 16 (App Router) + React 19 + TypeScript, static export (`output: 'export'`). ESM throughout (`"type": "module"`).

## Big Picture

Despite being a **static export**, this is not a plain static site. It is a personal portfolio/profile page (`advenoh.pe.kr`) that aggregates *live external data* at build time and re-hydrates it in the browser. Understanding the data flow is the key to working here.

### Data Layer (build-time fetch + cache fallback)

`lib/home-data.ts::loadHomeData(locale)` is the single orchestrator called by both pages. It runs these loaders in parallel:

| Loader | Source | Notes |
|--------|--------|-------|
| `lib/portfolio.ts` | local markdown in `contents/website/**` | pure local, no network |
| `lib/status.ts` | **Supabase** (`@supabase/supabase-js`) | service uptime snapshot |
| `lib/github.ts` | GitHub GraphQL (`GITHUB_TOKEN`) | contribution calendar |
| `lib/writing.ts` | RSS feeds (blog + investment, `fast-xml-parser`) | latest posts, totals |
| `lib/profile-readme.ts` | local markdown (`contents/profile`) | profile facts |

Every network loader is wrapped by `lib/cache.ts::withCache(file, fetcher, fallback)` with a **hybrid policy**: try live fetch → on success overwrite `.cache/<file>.json` and return fresh → on failure return the last cached value (stale, logs WARN) → if no cache exists return `fallback`. Because Netlify builds may hit rate limits or outages, seed caches are generated locally with `scripts/warm-cache.ts` and **`.cache/*.json` is committed to git** (not gitignored). Regenerate and commit these when feeds change.

### Client live re-fetch

After the static HTML loads, `hooks/useLiveStatus.ts` and `hooks/useLiveWriting.ts` re-query the same sources from the browser to replace build-time data with fresh values (silently keeping initial data on failure). **`useLiveStatus` duplicates the Supabase query logic in `lib/status.ts`** — if the Supabase table schema changes, both must be updated together.

### i18n / routing

Two locales, English is the default:
- `app/page.tsx` → English at `/` (calls `loadHomeData('en')`)
- `app/ko/page.tsx` → Korean at `/ko/`
- `components/profile/AutoLangRedirect.tsx` redirects visitors by preference; `LangToggle.tsx` switches manually.
- Translation strings live in `lib/i18n/{en,ko}.ts` (typed by `lib/i18n/types.ts`) and are threaded through components as a `t` prop.
- `trailingSlash: true` in `next.config.mjs` so routes emit `/ko/index.html`.

### UI structure

The live UI is entirely under **`components/profile/`** — a terminal/IDE-themed single-page shell (`ProfileShell` → `Sidebar`, `RightRail`, `Hero`, `ProjectGrid`/`ProjectModal`, `CommitGraph`, `StatusBar`, `CommandPalette`, mobile drawers). `components/ui/` holds shadcn/ui (Radix) primitives. There is a **single dark theme** — `next-themes` is not used despite what older docs suggest.

## Content System

Portfolio items are markdown files under `contents/website/<slug>/` parsed at build time with `gray-matter` + `marked`, validated by `portfolioItemSchema` in `lib/portfolio.ts`. Frontmatter supports **per-locale fields** (`description_en`/`description_ko`, `dek_*`, `overview_*`, `status_*`, `year_*`, `role_*`) plus `site` (required URL), `stack`, `cover`, `featured`, and `order` (controls display order). The loader resolves the correct locale variant based on the `Locale` argument.

## Environment Variables

Required for live data (loaders degrade to cache/fallback when absent, so `npm run dev` works without them):

- `GITHUB_TOKEN` — GitHub GraphQL for the contribution calendar
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — status snapshot (used both server- and client-side)

## Conventions

- **Path aliases** (`tsconfig.json`): use `@/*` for repo root (e.g. `@/lib/site-config`, `@/components/...`) and `@shared/*` for `shared/`. Never use relative `../` paths across directories.
- `lib/site-config.ts` is the source of truth for author info, external data-source URLs, sidebar service links, and `githubLogin`. Add new external services/links here.
- SEO/structured data: `app/sitemap.ts`, `app/robots.ts`, and `lib/structured-data.ts` (JSON-LD injected in the page components).
- `docs/done/` holds completed PRD/implementation notes and regression screenshots — useful history, not active spec.

## Deployment

Netlify (`netlify.toml`): build `npm run build`, publish `out/`, with security headers and a 404 redirect. `next.config.mjs` sets `output: 'export'` and `images.unoptimized: true` (required for static hosting).
