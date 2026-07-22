# Solvuri Admin Portal

An internal operator console: a login screen and a dashboard shell (Global Stats, Clearrack Stores, Safyri Bookings, Platform Settings) with static placeholder numbers. No real backend integration yet.

## Running locally

```bash
pnpm --filter @repo/admin-portal dev
```

Runs on [http://localhost:3002](http://localhost:3002).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (not yet used by any page in this app) |

Set these in `.env.local` (gitignored, not committed).

## Notes

- Uses `@repo/eslint-config/next-js` with `--max-warnings 0`, same as `apps/web`.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css`, imported by this app's `globals.css` (same SOLVURI brand palette as `apps/web`).
- Auth is scaffolded but not real: `proxy.ts` gates `/dashboard` behind a placeholder session cookie that the login form sets on submit without verifying credentials. See `AGENTS.md` for what to change when a real auth provider is wired in.
