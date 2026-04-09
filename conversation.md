# Development Conversation Log

> **Last Updated**: April 9, 2026
> **Project**: ModernAmusements Portfolio (Next.js)
> **URL**: https://modern-amusements.vercel.app

---

## Current Site Status

- **Framework**: Next.js 16.2.1 with Turbopack
- **Languages**: English (en) and German (de)
- **Features**:
  - Dark/light theme (next-themes)
  - i18n support (EN/DE)
  - TUI-style terminal hero with keyboard navigation
  - MDX blog and projects
  - Contact form (Formspree)
  - SEO optimized (OpenGraph, Twitter Cards, sitemap)

---

## Recent Work (April 9, 2026)

### Pokemon TCG Card Extractor
- New blog post: `pokemon-tcg-card-extractor` (EN + DE) with mermaid diagrams
- New project: `pokemon-tcg-card-extractor` (EN + DE) with 7 screenshots
- Fixed Mermaid diagram parsing errors (curly braces, quotes, pipe characters)
- Blog folder now opens by default in TUI menu

### Mermaid Diagram Fixes
- Removed curly braces `{}` from node labels
- Removed quotes `"` from edge labels
- Replaced pipe characters `|` in decision nodes with simple text
- Changed `pokewiki_{set}.json` to `pokewiki SET json`
- All nodes now use brackets: `A[Label]` not `A Label`

### Agent Rules
- Added Mermaid diagram rules to AGENTS.md
- Added build and check workflow to AGENTS.md

### Blog & Fixes
- `ai_energy_os` (EN + DE) - AI as operating system of global energy with mermaid diagrams
- Fixed TOC duplicate numbering (removed manual numbers from headings)
- Fixed projects showing in both EN/DE in TUI menu

### Layout Consistency
- Added `max-width: 1400px` and `margin: 0 auto` to header/main/footer
- Added side padding at `<1445px` for all pages
- Removed `border-radius` from all elements
- Used shared JetBrains Mono font throughout

### SEO Improvements
- Dynamic sitemap generation (`/sitemap.xml`)
- OpenGraph metadata for all pages
- Twitter Card metadata
- Proper hreflang for bilingual content

### Bilingual Support
- German versions for all blog posts and projects
- Content filtering by language on overview pages
- Translated hero text and navigation

### UI/UX
- Enabled contact page links across all elements
- Contact page: TUI-style hero + form layout
- Removed back links from detail pages
- Updated CTA buttons to use shared styles

### Blog Posts
- `axios_npm_supply_chain_compromise` (EN + DE)
- `cli-tool` (EN + DE)
- `linkedin-browser-surveillance` (EN + DE)
- `ai_energy_os` (EN + DE)
- `pokemon-tcg-card-extractor` (EN + DE)

### Projects
- `Israel-Hamas-Conflict` (EN + DE)
- `pokemon-tcg-card-extractor` (EN + DE)

---

## Tech Stack

- **Frontend**: Next.js 16.2.1, React, TypeScript
- **Styling**: SCSS modules, CSS variables
- **Fonts**: JetBrains Mono
- **Content**: MDX with frontmatter
- **Deployment**: Vercel

---

## Key Files

```
src/
├── app/[lang]/
│   ├── page.tsx              # Homepage with TUIHero
│   ├── blog/                 # Blog overview & posts
│   ├── projects/             # Projects overview & detail
│   ├── about/                # About page
│   └── contact/              # Contact form
├── components/
│   ├── Header.tsx           # Navigation
│   ├── TUIHero.tsx          # Terminal-style hero
│   └── ...
├── styles/
│   ├── globals.scss         # Global styles
│   ├── cta.module.scss      # Button styles
│   └── ...
└── lib/
    └── mdx.ts               # MDX content loading
```

---

## Pending Tasks

- [ ] Customize About page with actual bio
- [ ] Add Google Search Console verification
- [ ] Set up newsletter (ConvertKit/Beehiiv)
- [ ] Replace placeholder domain with real domain
