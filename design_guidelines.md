# Portfolio Website Design Guidelines

## Design Approach
**Reference-Based Approach** drawing inspiration from modern portfolio platforms like Dribbble, Awwwards, and Behance. Focus on showcasing work as hero content with minimal chrome, letting projects speak for themselves while maintaining sophisticated presentation.

## Typography System

**Font Stack:**
- Primary: Inter or DM Sans (Google Fonts) - clean, modern sans-serif for UI and body text
- Display: Space Grotesk or Syne - bold, distinctive for name/headlines

**Type Scale:**
- Hero Name: 4xl to 6xl (responsive)
- Section Headers: 2xl to 3xl
- Card Titles: lg to xl
- Body/Descriptions: base (16px)
- Meta Info: sm (14px)
- Social Icons: Match header height (24-28px clickable area)

## Layout System

**Spacing Primitives:**
Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8
- Header padding: px-6 py-4

**Grid Structure:**
- Container: max-w-7xl with px-6
- Portfolio Grid: 
  - Mobile: Single column (grid-cols-1)
  - Tablet: 2 columns (md:grid-cols-2)
  - Desktop: 3 columns (lg:grid-cols-3)
- Masonry-style staggered heights for visual interest

## Core Components

### Header (Sticky)
Minimal, functional header that remains accessible:
- Left: Your name as wordmark (not logo) - clickable home link
- Right: Social icon cluster (Instagram, LinkedIn, GitHub) + theme toggle
- Height: h-16, backdrop-blur effect for elegance
- Social icons in horizontal row with gap-4, each with subtle hover lift

### Portfolio Cards
Hero of the experience - rich, interactive showcases:
- Card Structure: Elevated with subtle shadow, rounded corners (rounded-xl)
- Preview Image: Aspect ratio 16:10 or 4:3, takes 60% of card height
- Use actual website screenshot thumbnails via screenshot service API or placeholder service
- Content Zone: Project title (bold, lg), description (2-line truncate), subtle arrow/external link icon
- Hover State: Gentle scale (scale-105), enhanced shadow, smooth transitions
- Click: Entire card clickable opening link in new tab

### Theme Toggle
- Position: Header right-side, after social icons
- Style: Icon-only toggle (sun/moon) with smooth rotation transition
- Persistent state via localStorage
- Affects: Background, text, card backgrounds, borders - comprehensive theming

### Hero/Introduction Section
Brief, impactful introduction before portfolio grid:
- Centered layout: max-w-2xl
- Structure: Name (if not in header), tagline/role, 2-3 sentence bio
- Spacing: py-16 to py-20 above portfolio grid
- No background image needed - let typography and whitespace create impact

## Interactions & Animations

**Card Interactions:**
- Hover: transform scale-105, enhanced shadow, 200ms ease-out
- Preview image subtle zoom on hover (scale-110 within container)
- Arrow/link icon slide or fade-in on hover

**Theme Transition:**
- All color properties transition smoothly (transition-colors duration-200)
- Icon rotation for theme toggle (rotate-180)

**Page Load:**
- Cards stagger-fade-in (50ms delay between each)
- No distracting hero animations

## Images

**Portfolio Preview Thumbnails:**
- Required for each project card
- Implement using screenshot service (screenshotapi.net, urlbox.io, or similar)
- Fallback: Placeholder images with project initials/icon
- Format: WebP for performance, with JPG fallback
- Aspect Ratio: Consistent 16:10 across all cards
- Quality: High enough to show interface details but optimized

**No Hero Image:**
This portfolio focuses on showcasing work, not decorative imagery. Let the portfolio previews be the visual anchors.

## Responsive Behavior

**Breakpoints:**
- Mobile (<768px): Single column, full-width cards, stacked social icons
- Tablet (768px-1024px): 2-column grid, header remains horizontal
- Desktop (>1024px): 3-column grid, maximum layout width

**Header Adaptations:**
- Mobile: Name abbreviation if needed, icons stay visible, theme toggle always accessible
- Maintain sticky behavior across all viewpoints

## Content Strategy

**Portfolio Card Information:**
Parse markdown to extract:
- Site URL (primary click target)
- Project title (if available, else derive from URL)
- Description text
- Generate preview thumbnail from URL

**Grid Density:**
Show 6-12 projects initially (2-4 rows), lazy load more if available. Emphasize quality over quantity - curated selection displays professionalism.