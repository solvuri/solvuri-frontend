# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
## POS — project notes

- This app owns its own register state (`lib/store.ts`, Zustand + `localStorage` persistence under `pos-register-storage`) — a single running sale, not a multi-day cart like `apps/clearracks`. `completeSale()` snapshots the current items/totals into `lastReceipt` and clears `items`; the receipt page reads `lastReceipt`, not a fetched record.
- Register routes live under `app/register/[subdomain]/...` and are reached via `proxy.ts`'s subdomain rewrite, same mechanism as `apps/clearracks`'s `proxy.ts` but keyed off its own `POS_ROOT_DOMAIN` env var (default `solvuripos.xyz`) — deliberately a separate env var from clearracks' `ROOT_DOMAIN` so the two apps' subdomain schemes don't collide.
- The register screen (`useProducts()`), sales history list (`useSales()`), and sale detail page (`sales/[id]/page.tsx`, via `useSale(id)`) all fetch through `@repo/data`, currently backed by mock data — swap the corresponding `fetch*` function in `packages/data/src/products.ts`/`sales.ts` for a real API call when one exists; no consumer changes needed.
- `Sale`/`SaleItem` (in `@repo/types`) are a dedicated type, not a reuse of `Order` — `Order.shipping`/`address` are delivery-specific and don't fit an in-person transaction. Extend `Sale` rather than bending `Order` to fit.
- No cashier login/auth gate exists yet — the register is scoped by subdomain alone, same trust boundary `apps/clearracks`' storefront has today. If real auth is added, it belongs in `proxy.ts`, following `apps/admin-portal`'s cookie-gate pattern.
- Client Component pages under `app/` receive `params` as a `Promise` in this Next.js version — unwrap with React's `use(params)`, not `params.foo` directly. `sales/[id]/page.test.tsx` is a regression test for this; when testing a page that calls `use(params)`, wrap the initial `render()` in an awaited `act()` or the test hangs on the Suspense fallback.
- `pnpm test` here runs `lib/store.test.ts` (register logic) plus `sales/[id]/page.test.tsx` via Vitest + Testing Library + jsdom.
- Tax is a hardcoded 16% VAT computed ad hoc per page, matching `apps/clearracks`' existing convention — not stored centrally.
- Shared design tokens come from `packages/ui/src/styles/solvuri-theme.css`'s vocabulary, imported by `app/globals.css` (same SOLVURI palette as `apps/web`/`apps/admin-portal` — POS is an internal operator tool, not a customer-facing storefront with its own brand identity like ClearRack, so it uses the shared palette rather than an independent one).
- The root route (`/`) is intentionally just a minimal landing page, not a full marketing sub-site like `apps/clearracks`' `(marketing)` route group — `apps/web` is the central marketing hub for all modules including this one.
