<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ClearRacks — project notes

- This app owns its own cart state (`lib/store.ts`, Zustand + `localStorage` persistence under `clearracks-storage`). Don't move it back into a shared package unless a second app genuinely needs the same cart shape.
- Storefront routes live under `app/storefront/[subdomain]/...` and are reached via `proxy.ts`'s subdomain rewrite (renamed from `middleware.ts` — Next.js 16's non-deprecated convention). It treats any `localhost:<port>` as the root domain, so subdomain routing works whether this app runs on its own dev port (3001) or alongside the others.
- Both the storefront listing page (`app/storefront/[subdomain]/page.tsx`, via `useProducts()`) and the product detail page (`product/[productId]/page.tsx`, via `useProduct(id)`) fetch through `@repo/data`, currently backed by the same mock data (`packages/data/src/mock/products.ts`) — swap `fetchProducts`/`fetchProduct` in `packages/data/src/products.ts` for real API calls when one exists; no consumer changes needed.
- Client Component pages under `app/` receive `params` as a `Promise` in this Next.js version, not a plain object — unwrap it with React's `use(params)`, not `params.foo` directly (the sync-access shim from Next 15 is gone). Got this wrong once already wiring up the product detail page above; double-check any new dynamic route page.
- `Product` types come from `@repo/types` — extend that shared interface rather than hand-rolling a new product shape per component.
- Shared design tokens (background/surface/foreground/border/ring/radius/fonts) come from `packages/ui/src/styles/solvuri-theme.css`'s vocabulary; this app supplies its own ClearRacks brand values in `app/globals.css`, distinct from the SOLVURI palette used by `web`/`admin-portal`.
