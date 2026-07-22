# Solvuri Web

The public-facing Solvuri marketing site: homepage, module showcase, pricing-adjacent pages, and contact. No authentication, no data layer — content is static.

## Running locally

```bash
pnpm --filter @repo/web dev
```

Runs on [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example` for the full list with placeholder values. Copy it to `.env.local` (gitignored, not committed) and fill in real values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (not yet used by any page in this app) |

## Notes

- Uses `@repo/eslint-config/next-js` with `--max-warnings 0` — this app is held to the strictest lint bar in the monorepo.
- `check-types` also runs `next typegen` before `tsc --noEmit`.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css`, imported by this app's `globals.css`.
