# ClearRacks

The ClearRacks product: a marketing shell plus a multi-tenant storefront under `storefront/[subdomain]/...`, resolved via a subdomain-rewriting `proxy.ts`. This is the only app in the monorepo with real product/cart/checkout UI.

## Running locally

```bash
pnpm --filter @repo/clearracks dev
```

Runs on [http://localhost:3001](http://localhost:3001).

Storefront routes are resolved by subdomain (e.g. `<store>.clearrack.xyz` in production). Locally, `proxy.ts` treats any `localhost:<port>` as the root domain, so subdomain routing (e.g. `demo.localhost:3001`) works whether this app runs on its own dev port or alongside the others.

## Environment variables

See `.env.example` for the full list with placeholder values. Copy it to `.env.local` (gitignored, not committed) and fill in real values.

| Variable              | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (used by `lib/api.ts`'s `clearracksApi`) |
| `ROOT_DOMAIN`         | Production root domain for subdomain routing in `proxy.ts`; falls back to `clearrack.xyz` if unset |

## State

Cart state is a Zustand store local to this app (`lib/store.ts`), persisted to `localStorage` under the key `clearracks-storage`. It lives here rather than in a shared package because it's ClearRacks-specific business state, not a cross-app concern.

## Data

The storefront is wired to the real Clearack API (`lib/clearackApi.ts`) — real product/category browsing and checkout, anonymous end-to-end (no buyer login exists in the real system). `lib/merchants.ts` maps a subdomain to a real `merchantId` via a hardcoded stand-in table until a real anonymous domain-lookup endpoint exists. Order history has no real anonymous equivalent, so `orders/page.tsx`/`orders/[id]/page.tsx` are honest stubs, not fabricated data. See `AGENTS.md` for the full list of real-vs-simplified pieces (checkout only uses the no-payment `/request` fallback, not real STK-push).

## Notes

- Uses `@repo/eslint-config/next-js` with `--max-warnings 0`, same as `apps/web`.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css`; this app's `globals.css` defines its own distinct ClearRacks brand palette on top of the same shared structural token names (`--color-background`, `--color-primary`, etc.) rather than the SOLVURI palette used by `web`/`admin-portal`.
