# Solvuri POS

An in-person register app for the POS module: browse a product catalog, build a running sale, take a cash/card/M-Pesa payment, and view a receipt — plus a sales history for the tenant. Multi-tenant via subdomain routing (`<subdomain>.solvuripos.xyz` in production, `<subdomain>.localhost:3003` in dev), same mechanism as `apps/clearracks`'s storefront. No real payment processing or backend yet — the register and payment flow are working UI backed by local state and mock data.

## Running locally

```bash
pnpm --filter @repo/pos dev
```

Runs on [http://localhost:3003](http://localhost:3003). Visit `http://demo.localhost:3003` to reach the demo tenant's register.

## Environment variables

See `.env.example` for the full list with placeholder values. Copy it to `.env.local` (gitignored, not committed) and fill in real values.

| Variable          | Purpose                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (not yet used by any page in this app) |
| `POS_ROOT_DOMAIN`     | Root domain `proxy.ts` uses to detect and strip subdomains. Defaults to `solvuripos.xyz` (placeholder) if unset. |

## Notes

- Uses `@repo/eslint-config/next-js`, same as the other apps.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css` (same SOLVURI palette as `apps/web`/`apps/admin-portal`).
- See `AGENTS.md` for the register-store shape, the `Sale` type's rationale, and the `use(params)`-as-Promise gotcha.
