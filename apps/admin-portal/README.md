# Solvuri Admin Portal

An internal operator console: a login screen and a dashboard (Global Stats, Clearrack Stores, Safyri Bookings, Platform Settings) backed by `@repo/data`'s mock tenant/order/reservation hooks — real page logic, no real backend yet.

## Running locally

```bash
pnpm --filter @repo/admin-portal dev
```

Runs on [http://localhost:3002](http://localhost:3002).

## Environment variables

See `.env.example` for the full list with placeholder values. Copy it to `.env.local` (gitignored, not committed) and fill in real values.

| Variable              | Purpose                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (`adminApi` in `lib/api.ts`) — the real `backend-api-test.solvuri.com` environment for now |

## Notes

- Uses `@repo/eslint-config/next-js` with `--max-warnings 0`, same as `apps/web`.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css`, imported by this app's `globals.css` (same SOLVURI brand palette as `apps/web`).
- Auth is real: login goes through the backend's JWT flow (Admin/SuperAdmin accounts require an OTP step), and `proxy.ts` gates `/dashboard` on the resulting token's `AppRole` claim. See `AGENTS.md` for the exact flow and what's still mock-data-only.
