# German Police Shootings Project (April 14, 2026)

## Summary
Created new blog post and project for visualizing police firearm incidents in Germany from 1976-2025 using Leaflet.js, SVG charts, and vanilla JavaScript.

## New Blog Posts
- `german-police-shootings.mdx` (English)
- `german-police-shootings.de.mdx` (German translation)

## New Projects
- `german-police-shootings.mdx` (English)
- `german-police-shootings.de.mdx` (German translation)

## Features
- Interactive Leaflet.js map with OpenStreetMap tiles
- Marker clustering for dense areas
- SVG pie charts (categories, weapons, locations, armed status)
- Dynamic filtering (year, category)
- Search functionality
- Chronological timeline
- Fallback data mechanism (CSV + embedded JSON)

## Images Used
- `public/images/projects/german-police-shootings/`:
  - police_shootings_overview.png
  - police_shootings_map.png
  - police_shootings_map_popup.png
  - Charts.png

## Links Added
- Live Demo: https://police-shootings-germany.vercel.app/
- Repository: https://github.com/ModernAmusements/Police-Shootings-Germany
- Dataset: https://www.kaggle.com/datasets/nathanamusement/german-police-shootings-1976-2026
- Write-up: https://www.kaggle.com/writeups/nathanamusement/documentation-of-police-firearms-deployments-in-ge

## Previous Work (April 13, 2026)

### LiDARSight Blog Post
Created new blog post "LiDARSight" about building 6DoF head tracking for X-Plane 12 using iPhone TrueDepth camera.

## Assets Used (LiDARSight)
- `public/images/projects/LiDARSight/`:
  - LiDARSight_Alpha.mov
  - LiDARSight_Architecture.png
  - protocols.png
  - LiDAR_Settings.jpg
  - Connection_State.jpg

## Fixes Made
1. Video tag: changed from `<source>` to `src` attribute
2. Fixed `playsinline` → `playsInline` (React camelCase)
3. Removed parentheses from mermaid node labels (caused parse errors)
4. Simplified mermaid syntax (no `<br/>`, no special chars)

## Typography Rules Used
- Video: `<video controls width="100%" src="...">`
- Mermaid node labels: plain text only, no `<br/>`, no `()`, no `{}`

## Committed
- Pushed to origin/main on April 13, 2026