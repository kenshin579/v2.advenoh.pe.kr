# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development (runs backend with hot reload)
npm run dev

# Type checking
npm run check

# Build for production
npm run build  # builds both frontend (Vite) and backend (esbuild)

# Production server
npm start

# Database operations
npm run db:push  # push schema changes to Neon database
```

## Project Architecture

**Monorepo Structure**: Full-stack TypeScript application with client/server separation.

- **`client/`** - React frontend (Vite build)
  - `src/components/` - Custom components (Header, PortfolioCard, ThemeProvider) + shadcn/ui
  - `src/pages/` - Page components (Home, NotFound)
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utilities (cn for className merging)

- **`server/`** - Express backend (esbuild for production)
  - `index.ts` - Main server entry, middleware setup
  - `routes.ts` - API route definitions
  - `vite.ts` - Vite dev server integration (dev mode only)

- **`shared/`** - Shared TypeScript schemas
  - `schema.ts` - Zod schemas for data validation (used by both client/server)

- **`contents/website/`** - Markdown-based portfolio content
  - Each `.md` file represents a portfolio item with frontmatter (site, title, description)

**Key Architectural Patterns**:
- **Content Management**: Portfolio items stored as markdown files, parsed server-side with `gray-matter`
- **Type Safety**: Zod schemas in `shared/` validate data at API boundaries
- **Dev vs Prod**: In development, Vite middleware serves frontend; in production, static files from `dist/public`
- **Single Port**: Backend and frontend both served on port 5000 (environment variable `PORT`)

## Import Path Aliases

**Critical**: This project uses TypeScript path aliases configured in both `tsconfig.json` and `vite.config.ts`:

```typescript
import Component from "@/components/Component"  // → client/src/components/Component
import { schema } from "@shared/schema"         // → shared/schema
```

Always use these aliases instead of relative paths when possible.

## Content System

Portfolio items are markdown files in `contents/website/` with required frontmatter:

```markdown
---
site: https://example.com  # Required - URL to project
title: Project Title        # Optional - defaults to derived from URL
description: Brief desc     # Required - shown on portfolio card
---

Body content (currently unused, reserved for future detail pages)
```

The `/api/portfolio` endpoint reads these files, validates with `portfolioItemSchema`, and returns sorted by filename.

## Styling and Design System

**Framework**: Tailwind CSS v3 + shadcn/ui components (Radix UI primitives)

**Theme System**:
- Custom theme provider with dark/light modes (`client/src/components/theme-provider.tsx`)
- Theme persistence via localStorage
- All components must support both themes

**Design Constraints** (from design_guidelines.md):
- Typography: Inter (body), Space Grotesk (headings)
- Spacing rhythm: Tailwind units 2, 4, 6, 8, 12, 16, 20
- Portfolio grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- Card aspect ratio: 16:10 for preview images
- Animations: Subtle hover effects (scale-105), 200ms transitions

## Database Setup

**Drizzle ORM** configured with Neon PostgreSQL:
- Schema defined in `server/storage.ts` (currently minimal)
- Connection configured via `drizzle.config.ts`
- Currently unused for portfolio feature (markdown-based instead)
- Available for future features requiring persistence

## Module System

**ESM modules throughout** - all files use ES6 imports/exports:
- `package.json` has `"type": "module"`
- Server uses `.ts` extensions in imports (enabled by tsx/esbuild)
- No CommonJS require() syntax

## Replit Integration

This project is configured for Replit deployment:
- `.replit` file configures run command
- Replit-specific Vite plugins in development (cartographer, dev-banner)
- Port binding to `0.0.0.0` for Replit networking
