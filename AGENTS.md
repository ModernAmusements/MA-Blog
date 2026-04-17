<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Rules

- Work independently without asking user for clarification
- Continue through tasks in priority order until blocked
- If blocked, note the issue and move to next available task
- ALWAYS test changes by running build and verifying in browser when needed

## Workflow Rules

### Always Build and Check for Errors

After EVERY code or content change, you MUST:
1. Run `npm run build` to verify compilation
2. Check for any errors in the output
3. Test the page loads in browser if needed

This applies to:
- MDX blog posts and projects
- TypeScript/React code changes
- Mermaid diagram changes
- Any content that could fail at runtime

### Mermaid Diagram Rules

When writing Mermaid diagrams in MDX files:
- ALWAYS use brackets for node labels: `A[Label]` not `A Label`
- NEVER use curly braces `{}` in node labels - use plain text like "KP suchen" not "{KP suchen}"
- NEVER use quotes `"` or special characters in labels - use plain text
- For decision nodes, use simple text: `B{Decision}` not `B{"Decision"}`
- Avoid: `"`, `'`, `:`, `->`, `{`, `}` in node content
- If you need to reference file names with underscores, use readable alternatives: `pokewiki SET json` instead of `pokewiki_{set}.json`
