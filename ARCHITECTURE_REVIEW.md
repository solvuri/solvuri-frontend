# Solvuri Frontend — Outstanding Architecture Items

Reviewed: solvuri-frontend (Turborepo + pnpm workspaces), July 2026.

This document lists what's still open in the codebase today. It intentionally does not narrate what's already been fixed — the structural drift from earlier passes (color tokens, HTTP-client duplication, `@repo/store`, the `Product` type, `LocalSidebar`, ESLint alignment, docs, CI, `ROOT_DOMAIN`, `@types/node`, dynamic-route `params` bugs), the pass after that (order-detail wiring, `apps/web` docs, `aria-label`s, Navbar/Footer consolidation, a testing baseline), and the orders list/detail mismatch fixed just now (the list only links "Details" for order types the `Order` shape actually supports; other types render as non-interactive text instead of linking to a page that says "not found") have all been addressed and verified directly against the code. What follows is everything confirmed still outstanding, prioritized.

## 1. Do next — small, contained, no dependency on a real backend

**Verify the new CI test step actually runs green on GitHub.** `test` was added to `turbo.json` and `.github/workflows/ci.yml`'s build step, and passes locally — but it hasn't been pushed/exercised on an actual GitHub Actions runner yet. Worth specific attention given precedent: the last time a CI change went from "works locally" to a real runner, it immediately caught a Node-version mismatch invisible in this local environment.

**Broaden test coverage past its current two packages.** The baseline is real (11 tests in `apps/clearack` [formerly `apps/clearracks`], 5 in `packages/data`), but `packages/ui` — including the two components (`Navbar`, `Footer`) added this same pass — has zero tests, and neither do `apps/web`, `apps/admin-portal`, `packages/types`, or `packages/api-client`. Establishing the pattern was the point of this round; extending it to the shared design-system package is the natural next target, since `@repo/ui` is now consumed by all three real apps' chrome.

**Add `CODEOWNERS`.** No ownership boundaries are declared anywhere. Blocked on knowing actual GitHub usernames/team handles, which isn't something derivable from the code — needs input from whoever owns the repo.

**Confirm the deployment model, not just document the guess.** The root README now has a `## Deployment` section — but it explicitly labels itself an inferred assumption ("each app deploys independently to Vercel"), not a decision anyone has actually confirmed. Documenting the guess was the fix available without more information; someone with the actual deployment context still needs to either confirm it or correct it.

## 2. Do before the next app or the next team joins — larger, still not started

**Decide and build the real auth backend.** `apps/admin-portal/proxy.ts` gates `/dashboard/:path*` behind a `solvuri_admin_session` cookie that the login form sets unconditionally on submit — real route protection, zero credential verification. NextAuth, Supabase, and Clerk are all name-checked in the login form's own comment as options; none is chosen yet. The scaffold is deliberately built so wiring in a real one only means replacing what happens before the cookie gets set — no redesign — but that work hasn't started.

**Decide and build the real product/order API.** `@repo/data`'s `useProducts()`/`useProduct(id)`/`useOrder(id)` are real, working hooks with the correct shape (`data`/`isLoading`/`error`), all backed by `fetchProducts`/`fetchProduct`/`fetchOrder` stand-ins that resolve static mock arrays instead of calling a real endpoint. Swapping in a real API is designed to be a one-function change per each hook's own contract — but there is no real API yet, and cart/checkout still operate purely on client-side mock data with no order-placement backend behind them either.
