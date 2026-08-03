<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Admin Portal — project notes

- Auth is real: `app/page.tsx` calls `@repo/api-client`'s `login()` against the real test backend (`https://backend-api-test.solvuri.com`, see `.env.local`/`.env.example`). Admin/SuperAdmin accounts always get `requiresOtp: true` back — there's no token until the OTP step (`verifyOtp()`) succeeds; Merchant/Agent logins would get a token immediately but are rejected here since this app is admin-only. `proxy.ts` gates `/dashboard/:path*` on a `solvuri_auth_token` cookie holding the real JWT, decoding it inline (Edge-safe, no `@repo/api-client`/axios import) and checking `AppRole` is `Admin`/`SuperAdmin` — a Merchant/Agent token does not grant access. Log out via the dashboard header's "Log out" button, which calls `clearAuthToken()`.
- `@repo/api-client`'s `createApiClient()` already attaches the JWT (`Authorization: Bearer`) to every request via an interceptor and unwraps the backend's `{success, message, data}` envelope down to just `data` — don't re-implement either of these per-call. Errors surface as a plain `Error(message)` using the backend's real message.
- Only `Clearack` and `POS` are real backend modules — Safyri/Reservr/Master, which the rest of this dashboard's mock data models, don't exist server-side. That mismatch isn't resolved yet; treat the Global Stats/Clearrack/Safyri/POS pages as still mock-data-only until they're individually wired to the real API.
- Shared design tokens (background/surface/foreground/border/ring/radius/fonts) come from `packages/ui/src/styles/solvuri-theme.css`, imported by this app's `globals.css` (same SOLVURI palette as `apps/web`).
- Sidebar navigation uses `@repo/ui`'s `Sidebar` component — don't reintroduce an app-local sidebar; extend the shared one instead. It renders real `next/link`s with active-route highlighting via `usePathname()`, so it's a client component.
- Dashboard data (tenants/stores, orders, reservations/bookings) comes from `@repo/data`'s `useTenants`/`useOrders`/`useReservations` hooks, backed by mock arrays in `packages/data/src/mock/` — same swap-out-later convention as `apps/clearracks`. `Tenant` (in `@repo/types`) is this app's operational model for stores/subscriptions; don't confuse it with `apps/web`'s marketing-oriented `ModuleInfo`.
- `/dashboard/settings` (Platform Settings) intentionally lives under `/dashboard` rather than as a standalone `/settings` route, so it inherits the sidebar shell and `proxy.ts`'s existing `/dashboard/:path*` auth matcher for free. Its form fields are local component state only — not persisted anywhere yet.
