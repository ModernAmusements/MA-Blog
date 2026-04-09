# Project Knowledge Base

## Site Info
- **URL**: https://modern-amusements.vercel.app
- **GitHub**: https://github.com/ModernAmusements/MA-Blog
- **Stack**: Next.js 16.2.1, MDX, SCSS Modules, next-themes
- **Design**: Minimal black & white, orange accent (#f97316), JetBrains Mono font

## Key Features
- Dark/light mode toggle (UI switch, no emojis)
- i18n: English + German (/en, /de)
- Blog with tag filtering (MDX)
- Projects showcase
- Contact form (Formspree)
- RSS feed, Sitemap, SEO, hreflang, PWA manifest
- TUI-style hero with file browser
- TOC and anchor links for blog/project pages
- Image thumbnails from MDX content

## Tech Notes
- Next.js 16 uses Turbopack by default in dev
- App Router uses async params: `params: Promise<{ slug: string }>`
- SCSS Modules require pure selectors (no bare `button`, `a`)
- Root layout in [lang] folder for i18n routing
- next-themes needs `suppressHydrationWarning`

## Recent Changes (Apr 2026)
- New blog post: ai_energy_os (EN + DE) with mermaid diagrams
- Fixed projects showing in both languages in TUI menu
- Standardized padding across all pages
- Added hero section with "Explore My Work" pane
- Added preview images for projects (thumbnail from MDX)
- Added TOC and anchor links to blog/project pages
- Added collapsible TOC with Wikipedia-style numbering (4, 4.1, 4.1.1)
- TOC has chevron for expand/collapse functionality
- Styled blog/project content with TUI aesthetics
- Added footer info to burger menu
- Fixed various styling issues (border-radius removal, flex layouts)
- Fixed hydration warnings
