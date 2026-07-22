# ClearRacks

The ClearRacks product: a marketing shell plus a multi-tenant storefront under `storefront/[subdomain]/...`, resolved via subdomain-rewriting middleware. This is the only app in the monorepo with real product/cart/checkout UI.

## Running locally

```bash
pnpm --filter @repo/clearracks dev
```

Runs on [http://localhost:3001](http://localhost:3001).

Storefront routes are resolved by subdomain (e.g. `<store>.clearrack.xyz` in production). Locally, the middleware's root-domain check doesn't currently recognize this app's own dev port — see the middleware bug flagged in the architecture review before relying on subdomain routing against `localhost:3001` directly.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (used by `lib/api.ts`'s `clearracksApi`) |

Set these in `.env.local` (gitignored, not committed).

## State

Cart state is a Zustand store local to this app (`lib/store.ts`), persisted to `localStorage` under the key `clearracks-storage`. It lives here rather than in a shared package because it's ClearRacks-specific business state, not a cross-app concern.

## Data

The storefront listing page uses `@repo/data`'s `useProducts()` hook, which is currently backed by mock data (`packages/data/src/mock/products.ts`) rather than a real API. Swapping in a real endpoint only requires changing `fetchProducts()` in `packages/data/src/products.ts` — no consumer-side changes needed.

## Notes

- Uses `@repo/eslint-config/next-js` with `--max-warnings 0`, same as `apps/web`.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css`; this app's `globals.css` defines its own distinct ClearRacks brand palette on top of the same shared structural token names (`--color-background`, `--color-primary`, etc.) rather than the SOLVURI palette used by `web`/`admin-portal`.
