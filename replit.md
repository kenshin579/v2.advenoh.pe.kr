# Portfolio Website

## Overview
A modern, responsive personal portfolio website that showcases projects from markdown files. Features dark/light mode theming, smooth animations, and a beautiful card-based layout.

## Tech Stack
- **Frontend**: React, TypeScript, TanStack Query, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS, Shadcn UI components
- **Markdown Parsing**: gray-matter

## Project Structure
- `contents/website/` - Markdown files for portfolio projects
- `client/src/components/` - React components (Header, PortfolioCard, ThemeProvider)
- `client/src/pages/` - Page components (Home)
- `server/routes.ts` - API endpoints for fetching portfolio data
- `shared/schema.ts` - TypeScript schemas for data validation

## Features
- ✨ Dark/Light mode with smooth transitions
- 🎨 Beautiful card-based portfolio grid
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔗 Social media links (Instagram, LinkedIn, GitHub)
- 🖼️ Live website preview thumbnails
- ⚡ Fast loading with staggered animations
- 🎯 Click cards to open projects in new tab

## Markdown File Format
Each project is a markdown file in `contents/website/` with frontmatter:

```markdown
---
site: https://example.com
title: Project Title (optional)
description: Brief description of the project
---
```

## Design Guidelines
- Typography: Inter (body), Space Grotesk (headings)
- Color scheme: Purple primary (#8B5CF6), neutral grays
- Spacing: Consistent rhythm using 2, 4, 6, 8, 12, 16, 20 units
- Card grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Animations: Subtle hover effects, smooth transitions

## Recent Changes
- 2025-11-07: Initial implementation with full MVP features
- Created schema, frontend components, backend API, and sample data
- Implemented dark/light mode theming
- Added responsive portfolio grid with beautiful cards
