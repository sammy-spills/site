# AGENTS.md

## Build & Dev

- Use `bun` for all package management and runtime commands (not npm/yarn/pnpm).
- Build produces static output in `/out`; verify with `ls out/` after build.
- Dev server: `bun run dev`
- Production build: `bun run build` (adds `--webpack` flag)
- Static export config: `output: "export"` in next.config.ts

## Testing

- Test runner: Vitest
- Run all tests: `bun run test`
- Watch mode: `bun run test:watch`
- Test files: `src/**/*.test.{ts,tsx}`
- Path alias: `@/` → `src/` (configured in vitest.config.ts)

## Lint & Typecheck

- Linter: Biome via `ultracite`
- Lint: `bun run lint`
- Auto-fix: `bun run lint:fix`
- Typecheck: `bun run typecheck`
- Execution order: `lint → typecheck → test`

## MDX & Content

- MDX enabled with remark-gfm and rehype-slug plugins
- Content files in `src/content/`
- Page extensions: `.ts`, `.tsx`, `.md`, `.mdx`
- Content processor: `src/lib/content.ts`

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Deploys to GitHub Pages from `/out`
- Requires env vars: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BASE_PATH, Firebase keys
- Auto-detects basePath from GitHub repository name

## Security Headers

- CSP, HSTS, Referrer-Policy configured in next.config.ts
- Headers apply to all routes via `/:path*` source
- CSP includes `script-src 'self' 'strict-dynamic'` for Next.js

## Framework Quirks

- Static export limitations: images unoptimized, no optimization
- Firebase integration present but requires env vars for full functionality
- shadcn/ui components present; Biome overrides disable some a11y rules for UI
- Base path auto-detection from GITHUB_REPOSITORY env var