# Development Conversation Log

## Initial Requirements (March 31, 2026)
- Personal developer portfolio website
- Blog section for technical articles
- Project showcase section
- Updates about ongoing projects
- Free hosting on Vercel
- Tech stack: Next.js, MDX, SCSS
- All features: dark mode, blog tags, project links, contact form, newsletter, SEO, sitemap, RSS
- Minimal black & white design

## Decisions Made
- Next.js 14 with App Router
- MDX for content (next-mdx-remote + gray-matter)
- SCSS Modules for styling (no Tailwind)
- next-themes for dark/light mode
- Formspree for contact form (free tier)
- Vercel for hosting
- JetBrains Mono font for developer vibe
- Orange accent color (#f97316)
- UI toggle (no emojis)
- i18n with English (default) and German

## Project Structure
```
/src
  /app
    /[lang]
      /blog
        /[slug]
      /projects
        /[slug]
      /about
      /contact
      page.tsx
      layout.tsx
      /rss.xml
  /components
  /lib
  /styles
  /i18n
    en.json
    de.json
    index.ts
  /middleware.ts
/content
  /blog
  /projects
/public
  /robots.txt
  /sitemap.xml
  /favicon.svg
  /manifest.json
  /og-image.svg
```

## All Completed Features
- Project initialization with Next.js 16.2.1
- MDX configuration for blog/projects
- Global styles with CSS variables for theming
- Dark/light mode toggle (system preference + manual)
- Header & Footer components with i18n
- Home page with featured content
- Blog listing with tag filtering
- Individual blog posts (MDX)
- Projects showcase listing
- Individual project pages (MDX)
- About page with translations
- Contact page with Formspree integration
- SEO metadata with local keywords (Bielefeld, NRW, Germany)
- Open Graph & Twitter Cards
- hreflang for i18n
- RSS feed at /rss.xml
- Sitemap with hreflang
- PWA manifest
- Custom favicon (orange M on dark)
- Vercel Analytics

## Styling Iterations
1. Increased max-width from 900px to 1400px
- Added responsive padding (2rem default, 3rem on >1400px)
2. Centered hero (headline, bio, CTAs)
3. Added padding to nav alignment
4. Renamed logo to "ModernAmusement Development"
5. Centered and text-aligned hero section

## i18n Implementation
- Sub-path routing (/en, /de)
- Middleware for language detection
- Translation files for all UI text
- Dynamic metadata per language
- Sitemap with hreflang

## SEO Features Added
- Full metadata (title, description, keywords)
- Open Graph tags
- Twitter Cards
- Geo tags (Bielefeld, NRW, DE-NW)
- Local keywords: Bielefeld, NRW, Deutschland, Ostwestfalen
- Tech keywords: Swift, Python, React, Next.js, iOS, Backend
- hreflang alternates
- PWA manifest
- Custom favicon

## Changes Made Post-Launch
1. Changed font to JetBrains Mono (developer vibe)
2. Replaced emoji toggle with UI toggle switch
3. Removed all emojis from codebase
4. Changed accent color to orange (#f97316)
5. Added Formspree contact form (form ID: xzdkgrar)
6. Increased max-width to 1400px with responsive padding
7. Centered hero section
8. Renamed logo to "ModernAmusement Development"
9. Added full i18n (English + German)
10. Added comprehensive SEO with local keywords
11. Added Vercel Analytics
12. Added custom favicon

## What I Learned
- Next.js 16 uses Turbopack by default in dev
- App Router uses async params (params: Promise<{ slug: string }>)
- SCSS Modules: pure selectors required (can't use bare `button`, `a`, etc.)
- Date objects in React children must be converted to strings
- Dynamic routes with catch-all patterns like [slug] need unique names
- CSS custom properties work across light/dark themes via data-theme attribute
- next-themes with `suppressHydrationWarning` prevents hydration mismatches
- Formspree React library provides easier form handling than manual fetch
- Root layout should be in [lang] folder for i18n routing
- Duplicate layouts cause hydration errors (html inside html)
- SVG favicons work with rel="icon" and type="image/svg+xml"

## Deployment
- Vercel: https://modern-amusements.vercel.app
- GitHub: https://github.com/ModernAmusements/MA-Blog

## Pending/Todo
- Customize About page with actual bio
- Add more blog posts and projects
- Set up newsletter (ConvertKit/Beehiiv)
- Add Google Search Console verification
- Replace placeholder domain with real domain

## New Project Added: 2026-Conflict (April 1, 2026)

### Project Details
- **Name**: 2026-Conflict: Israel-Hamas Conflict Timeline
- **URL**: https://israel-hamas-conflict.vercel.app
- **GitHub**: https://github.com/ModernAmusements/Conflict-Visulizer
- **Tech Stack**: Vanilla JavaScript, Leaflet.js, Vite, SCSS
- **Description**: Interactive timeline visualization of the Israel-Hamas conflict (1900-2025)

### Implementation
1. Added Mermaid support for diagrams in MDX
2. Created Mermaid React component with client-side rendering
3. Added Image component support for project screenshots
4. Created public/images/projects/ folder for project images
5. Added 4 screenshots to project page
6. Updated project frontmatter with live/repo URLs

### Mermaid Integration
- Installed `mermaid` npm package
- Created client-side Mermaid component that renders diagrams
- Components support both `<Mermaid chart="..."/>` and code blocks in MDX
- Fixed TypeScript errors with proper type annotations
- Added Image component for MDX img tags with Next.js optimization

### Images Added
- conflict-full-page-01.png
- conflict-det-01.png
- conflict-det-02.png
- conflict-det-03.png

## What I Learned Today
- Mermaid.js requires client-side rendering in React/Next.js
- Use `typeof children === 'string'` to detect mermaid in code blocks
- next-mdx-remote/rsc supports custom components
- MDX images work with custom img component using Next.js Image
- Images should be in public/ folder for proper serving
- TypeScript interfaces for component props need proper React.ReactNode types
- mermaid.initialize() with securityLevel: 'loose' allows diagram rendering

## Deployment
- Vercel: https://modern-amusements.vercel.app
- GitHub: https://github.com/ModernAmusements/MA-Blog

## Pending/Todo
- Customize About page with actual bio
- Add more blog posts and projects
- Set up newsletter (ConvertKit/Beehiiv)
- Add Google Search Console verification
- Replace placeholder domain with real domain