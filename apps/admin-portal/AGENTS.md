<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Admin Portal — project notes

- Auth is scaffolded but not real yet: `proxy.ts` gates `/dashboard/:path*` behind a `solvuri_admin_session` cookie, and the login form (`app/page.tsx`) sets that same cookie client-side and redirects on submit — no actual credential verification happens. When real auth (NextAuth, Supabase, Clerk, etc.) is wired in, replace the cookie-set in `handleLogin` with real verification; `proxy.ts`'s cookie check shouldn't need to change.
- Shared design tokens (background/surface/foreground/border/ring/radius/fonts) come from `packages/ui/src/styles/solvuri-theme.css`, imported by this app's `globals.css` (same SOLVURI palette as `apps/web`).
- Sidebar navigation uses `@repo/ui`'s `Sidebar` component — don't reintroduce an app-local sidebar; extend the shared one instead. It renders real `next/link`s with active-route highlighting via `usePathname()`, so it's a client component.
- Dashboard data (tenants/stores, orders, reservations/bookings) comes from `@repo/data`'s `useTenants`/`useOrders`/`useReservations` hooks, backed by mock arrays in `packages/data/src/mock/` — same swap-out-later convention as `apps/clearracks`. `Tenant` (in `@repo/types`) is this app's operational model for stores/subscriptions; don't confuse it with `apps/web`'s marketing-oriented `ModuleInfo`.
- `/dashboard/settings` (Platform Settings) intentionally lives under `/dashboard` rather than as a standalone `/settings` route, so it inherits the sidebar shell and `proxy.ts`'s existing `/dashboard/:path*` auth matcher for free. Its form fields are local component state only — not persisted anywhere yet.
