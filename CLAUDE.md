# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run check

# Build for production (static export)
npm run build

# Preview production build locally
npm run start

# Linting
npm run lint
```

## Project Architecture

**Next.js Static Site**: TypeScript application using Next.js 14 App Router with static site generation (SSG).

- **`app/`** - Next.js App Router
  - `layout.tsx` - Root layout with ThemeProvider, Header, Footer
  - `page.tsx` - Home page with portfolio grid
  - `not-found.tsx` - 404 error page
  - `globals.css` - Global styles and theme CSS variables

- **`components/`** - React components
  - `Header.tsx` - Navigation with theme toggle and SNS links
  - `Footer.tsx` - Footer with SNS links (Instagram, LinkedIn, GitHub)
  - `PortfolioCard.tsx` - Portfolio item card component
  - `theme-provider.tsx` - Theme provider using next-themes
  - `ui/` - shadcn/ui components (button, card, etc.)

- **`lib/`** - Utilities and configuration
  - `utils.ts` - Utility functions (cn for className merging)
  - `site-config.ts` - Site metadata and author information
  - `portfolio.ts` - Portfolio data loader (reads markdown files)

- **`contents/website/`** - Markdown-based portfolio content
  - Each `.md` file represents a portfolio item with frontmatter

- **`shared/`** - Legacy shared schemas (being phased out)

**Key Architectural Patterns**:
- **Static Site Generation**: All pages pre-rendered at build time to `out/` directory
- **Content Management**: Portfolio items stored as markdown files, parsed at build time with `gray-matter`
- **Type Safety**: Zod schemas validate markdown frontmatter data
- **Theme System**: next-themes provides dark/light mode with localStorage persistence
- **No Backend**: Fully static site, no server runtime required

## Import Path Aliases

**Critical**: This project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
import Component from "@/components/Component"  // → components/Component
import { siteConfig } from "@/lib/site-config" // → lib/site-config
```

Always use the `@/` alias instead of relative paths.

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

The `lib/portfolio.ts` loader reads these files at build time, validates with `portfolioItemSchema`, and returns sorted by filename.

## Styling and Design System

**Framework**: Tailwind CSS v3 + shadcn/ui components (Radix UI primitives)

**Theme System**:
- next-themes integration in `components/theme-provider.tsx`
- Dark/light modes with system preference detection
- Theme persistence via localStorage
- All components support both themes

**Design Constraints** (from design_guidelines.md):
- Typography: Inter (body), Space Grotesk (headings) - loaded via next/font
- Spacing rhythm: Tailwind units 2, 4, 6, 8, 12, 16, 20
- Portfolio grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- Card aspect ratio: 16:10 for preview images
- Animations: Subtle hover effects (scale-105), 200ms transitions

## SEO and Metadata

**Configured in `app/layout.tsx`**:
- Site title: "Frank Oh Portfolio"
- Description and author metadata
- Open Graph tags for social sharing
- Twitter Card metadata

**Site Configuration** (`lib/site-config.ts`):
- Site name and description
- Author information (Frank Oh)
- Social media links (Instagram, LinkedIn, GitHub)

## Build Output

**Static Export**:
- Build command: `npm run build`
- Output directory: `out/`
- Files: Static HTML, CSS, JS, and assets
- No server required for deployment

**next.config.mjs**:
```javascript
output: 'export',  // Enable static export
images: {
  unoptimized: true  // Required for static hosting
}
```

## Deployment

**Netlify Configuration** (`netlify.toml`):
- Build command: `npm run build`
- Publish directory: `out`
- Security headers configured
- 404 redirect handling

Deploy with:
```bash
# Install Netlify CLI
npm install -D netlify-cli

# Deploy to production
npx netlify deploy --prod
```

## Module System

**ESM modules throughout**:
- `package.json` has `"type": "module"`
- All config files use ES modules (`.mjs` extension where needed)
- No CommonJS require() syntax

## Migration Notes

This project was migrated from Express + Vite to Next.js static site:
- Previous backend (`server/`) removed
- Previous frontend (`client/`) migrated to Next.js App Router
- API routes replaced with build-time data loading
- Database (Drizzle ORM) removed (was unused)
- Static export replaces server-side rendering
