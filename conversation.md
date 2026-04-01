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

## Project Structure
```
/src
  /app
    /blog
      /[slug]
    /projects
      /[slug]
    /about
    /contact
    /rss.xml
  /components
  /lib
  /styles
/content
  /blog
  /projects
/public
  /robots.txt
  /sitemap.xml
```

## All Completed Features
- Project initialization with Next.js 16.2.1
- MDX configuration for blog/projects
- Global styles with CSS variables for theming
- Dark/light mode toggle (system preference + manual)
- Header & Footer components
- Home page with featured content
- Blog listing with tag filtering
- Individual blog posts (MDX)
- Projects showcase listing
- Individual project pages (MDX)
- About page (template)
- Contact page with Formspree integration
- SEO metadata
- RSS feed at /rss.xml
- Sitemap at /sitemap.xml
- Robots.txt

## Changes Made Post-Launch
1. Changed font to JetBrains Mono (developer vibe)
2. Replaced emoji toggle with UI toggle switch
3. Removed all emojis from codebase
4. Changed accent color to orange (#f97316)
5. Added Formspree contact form (form ID: xzdkgrar)

## What I Learned
- Next.js 16 uses Turbopack by default in dev
- App Router uses async params (params: Promise<{ slug: string }>)
- SCSS Modules: pure selectors required (can't use bare `button`, `a`, etc.)
- Date objects in React children must be converted to strings
- Dynamic routes with catch-all patterns like [slug] need unique names
- CSS custom properties work across light/dark themes via data-theme attribute
- next-themes with `suppressHydrationWarning` prevents hydration mismatches
- Formspree React library provides easier form handling than manual fetch

## Deployment
- Vercel: https://ma-website-theta.vercel.app
- GitHub: https://github.com/ModernAmusements/MA-Blog

## Pending/Todo
- Customize About page with actual bio
- Add more blog posts and projects
- Set up newsletter (ConvertKit/Beehiiv)
- Update sitemap with actual domain when ready