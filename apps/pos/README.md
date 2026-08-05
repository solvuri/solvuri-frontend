# Solvuri POS

An in-person register app for the POS module: log in as a cashier, browse a real product catalog, build a running sale against a real server-side cart (discounts included), take a split cash/card/M-Pesa payment, and view a real receipt — plus a real sales history, optional register/till session tracking (open/close, cash-in/out, reconciliation), owner-only reports (sales/profit/tax/top-products/top-customers/cashiers/payment-methods/returns), and inventory management (stock levels, adjustments, supplier returns, stock-batch receiving with QR codes, movement history) for the merchant. Multi-tenant via subdomain routing (`<subdomain>.solvuripos.xyz` in production, `<subdomain>.localhost:3003` in dev), same mechanism as `apps/clearack`'s storefront — but unlike clearack, every route here requires a real cashier login, since every POS endpoint on the backend requires an authenticated `Merchant`/`MerchantAgent` caller.

## Running locally

```bash
pnpm --filter @repo/pos dev
```

Runs on [http://localhost:3003](http://localhost:3003). Visit `http://demo.localhost:3003` to reach the demo tenant's register.

## Environment variables

See `.env.example` for the full list with placeholder values. Copy it to `.env.local` (gitignored, not committed) and fill in real values.

| Variable          | Purpose                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL passed to `@repo/api-client`'s `createApiClient` (used by `lib/api.ts`'s `posApi`) |
| `POS_ROOT_DOMAIN`     | Root domain `proxy.ts` uses to detect and strip subdomains. Defaults to `solvuripos.xyz` (placeholder) if unset. |

## Auth

`proxy.ts` gates every register/sales route on a `solvuri_auth_token` cookie holding a real JWT with `AppRole` `Merchant` or `MerchantAgent` — anyone else (or nobody) is redirected to `/login`. `merchantId` for every API call comes from the logged-in cashier's own JWT claim (`lib/auth.ts`'s `getMerchantId()`), not from the subdomain — see `AGENTS.md` for why.

## Notes

- Uses `@repo/eslint-config/next-js`, same as the other apps.
- Shared design tokens live in `packages/ui/src/styles/solvuri-theme.css` (same SOLVURI palette as `apps/web`/`apps/admin-portal`).
- See `AGENTS.md` for the register-store shape, the JWT-derived-merchantId simplification, and the `use(params)`-as-Promise gotcha.
