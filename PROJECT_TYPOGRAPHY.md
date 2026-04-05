# Project Page Typography Rules

## Headings

### h2
- Font-size: 1.75rem
- Font-weight: 700 (bold)
- Padding-bottom: 0.75rem
- Border-bottom: 2px solid accent color (#f97316)
- Color: foreground

### h3
- Font-size: 1.35rem
- Font-weight: 600 (semibold)
- Color: foreground
- Prefix: "## " in accent color

### h4
- Font-size: 1.1rem
- Font-weight: 600 (semibold)
- Font-style: italic
- Color: muted
- Prefix: "### " in accent color

## Paragraphs

- Font-size: 1rem
- Line-height: 1.75
- Color: text
- Margin-bottom: 1.5rem

## Text Styles

### strong
- Font-weight: 700
- Color: foreground

### em
- Font-style: italic
- Color: muted

## Lists

### ul (unordered)
- List-style: none
- Bullet: "-" (dash) in accent color
- Indent with margin-left

### ol (ordered)
- List-style: none
- Numbered: "1.", "2.", etc. in accent color
- Counter reset for proper numbering

### li
- Margin-bottom: 0.75rem
- Line-height: 1.6

## Code

### inline code
- Padding: 0.2em 0.4em
- Border-radius: 4px
- Font-size: 0.9em

### code blocks (pre)
- Font-size: 0.85rem
- Line-height: 1.5
- Overflow-x: auto
- Margin-bottom: 1.5rem
- Syntax highlighting: highlight.js (github-dark theme)

## Tables

- Width: 100%
- Font-size: 0.9rem
- Border-collapse: collapse
- Margin-bottom: 1.5rem

### th (table header)
- Background: code-bg
- Font-weight: 600
- Color: foreground

### td (table data)
- Border: 1px solid border color
- Padding: 0.75rem
- Text-align: left

### tr:hover
- Background: code-bg

## Links

- Color: accent
- Text-decoration: underline
- Hover: opacity 0.8

## Blockquotes

- Border-left: 3px solid accent
- Padding-left: 1rem
- Margin: 1.5rem 0
- Color: muted
- Font-style: italic

## TOC (Table of Contents)

- tocLevel3 margin-left: 2rem
- tocLevel4 margin-left: 3rem

## Notes

- No bullet points - use "-" instead
- Bold important facts and key terms
- Remove backgrounds and padding from code blocks
