<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ClearRacks — project notes

- This app owns its own cart state (`lib/store.ts`, Zustand + `localStorage` persistence under `clearracks-storage`). Don't move it back into a shared package unless a second app genuinely needs the same cart shape.
- Storefront routes live under `app/storefront/[subdomain]/...` and are reached via `middleware.ts`'s subdomain rewrite. That middleware hardcodes `localhost:3000` as the "root domain" case for local dev, which doesn't match this app's own dev port (3001) — see the architecture review before assuming subdomain routing works out of the box against `localhost:3001`.
- The storefront listing page (`app/storefront/[subdomain]/page.tsx`) fetches products via `@repo/data`'s `useProducts()` hook. It's currently backed by mock data (`packages/data/src/mock/products.ts`) — swap `fetchProducts()` in `packages/data/src/products.ts` for a real API call when one exists; no consumer changes needed. The product detail page (`product/[productId]/page.tsx`) still uses its own separate `MOCK_PRODUCT` constant and hasn't been wired to the hook yet.
- `Product` types come from `@repo/types` — extend that shared interface rather than hand-rolling a new product shape per component.
- Shared design tokens (background/surface/foreground/border/ring/radius/fonts) come from `packages/ui/src/styles/solvuri-theme.css`'s vocabulary; this app supplies its own ClearRacks brand values in `app/globals.css`, distinct from the SOLVURI palette used by `web`/`admin-portal`.
