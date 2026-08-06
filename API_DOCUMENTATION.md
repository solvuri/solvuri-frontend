# Solvuri API Documentation

Solvuri is a multi-tenant SaaS backend. **Solvuri** is the platform itself (run by Solvuri admins). A **Merchant** (internally still called `Tenant` in the database) is a business that signs up to use Solvuri's modules — **Clearack** (e-commerce storefront) and **POS** (physical point-of-sale). Each Merchant can register **MerchantAgents** (cashiers/staff) to operate the storefront/till on their behalf.

This document covers every API currently in the codebase, grouped by who uses them:

1. [Conventions](#conventions) — envelope, auth, roles
2. [Solvuri Platform Admin APIs](#1-solvuri-platform-admin-apis) — bootstrap, admin login, merchant onboarding, catalog, platform billing
3. [Merchant & Agent APIs](#2-merchant--agent-apis) — login, staff management, self-service subscription payment, Mpesa setup
4. [Clearack APIs](#3-clearack-apis-e-commerce-storefront) — products, categories, cart, orders, delivery towns, anonymous checkout
5. [POS APIs](#4-pos-apis-point-of-sale) — cart/sale/payments/receipts, inventory & stock, register/customers/reports/pricing

> This file was pasted into chat by the user on 2026-08-06 and saved here since it had never actually existed in the repo before, despite being referenced by name throughout every app's `AGENTS.md`. Treat it as the authoritative source for "does endpoint X exist" — don't rely on AGENTS.md prose claims about what is/isn't documented without checking this file directly, since those claims have gone stale/wrong before (see `apps/pos/AGENTS.md`'s void/refund/exchange note).

---

## Conventions

### Response envelope

**Every** endpoint in this API returns the same shape, regardless of success or failure:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": { }
}
```

- `success: false` responses still return this shape, with `data: null` and an explanit `message`.
- HTTP status codes are used normally alongside the envelope (`200`/`201` success, `400` validation/business error, `403` forbidden, `404` not found).
- **Important:** a `200 OK` / `success: true` response only means "the request was processed" — for STK-push status-check endpoints specifically, always inspect the actual field inside `data` (e.g. `data.status`, `data.paymentStatus`) to know whether the *payment itself* succeeded, not just the envelope's `success` flag.

### Authentication

All non-anonymous endpoints require a JWT bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token is obtained from `POST /api/Auth/login` (see [§2.1](#21-login-all-roles)) and carries these claims:

| Claim | Meaning |
|---|---|
| `nameidentifier` (`ClaimTypes.NameIdentifier`) | the user's numeric `Id` |
| `MerchantId` | the tenant/merchant this user belongs to (`"0"` for platform-level Admin/SuperAdmin accounts) |
| `name` (`ClaimTypes.Name`) | `Username` |
| `role` (`ClaimTypes.Role`) | free-text role name (admin-renameable, cosmetic) |
| `AppRole` | the numeric role enum name — **this is what every authorization check in the API actually reads** |

### Roles (`AppRole` enum)

| Role | Who | Can do |
|---|---|---|
| `Merchant` | The business owner who signed up for Solvuri | Full control of their own tenant: inventory, POS, agents, payment settings, reports/pricing |
| `MerchantAgent` | Staff/cashier registered by a `Merchant` | Runs POS/checkout day-to-day; **never** sees cost price, profit, or management reports |
| `Admin` | Solvuri platform staff | Onboards merchants, manages catalog, collects subscription billing |
| `SuperAdmin` | Solvuri platform super-user | Same as `Admin`, plus can grant `SuperAdmin` to other accounts |

Shared authorization helpers used throughout (`Controllers/BaseController.cs`):
- `IsSolvuriAdmin()` → `Admin` or `SuperAdmin`
- `IsCashier()` → `Merchant` or `MerchantAgent` (day-to-day POS/storefront operations)
- `IsAuthorizedForMerchant(merchantId)` → true if caller is a Solvuri admin, **or** the caller's own `MerchantId` matches

---

## 1. Solvuri Platform Admin APIs

This section covers everything a **Solvuri Admin/SuperAdmin** uses to run the platform: bootstrapping the very first admin account, onboarding merchants, managing the shared feature/category catalog, and collecting subscription revenue.

### 1.1 Bootstrapping & Admin Auth (`AuthController`, base route `api/Auth`)

#### How admin registration/login works

- **Bootstrap**: `POST /api/Auth/register` is open to anyone **only until the very first Admin/SuperAdmin account exists** in the system — that first account is force-promoted to `SuperAdmin` no matter what `isSuperAdmin` was sent. After that, the endpoint locks down: caller must already be a Solvuri admin, and only an existing `SuperAdmin` can grant `SuperAdmin` to someone else.
- **2FA on every admin login**: `Admin`/`SuperAdmin` logins always require a second factor. `POST /api/Auth/login` never returns a token for an admin account directly — it sends an OTP (email + SMS if a phone is on file) and returns `requiresOtp: true`. The token is only issued from `POST /api/Auth/login/verify-otp`.
- Merchant/MerchantAgent logins skip the OTP step entirely (see [§2.1](#21-login-all-roles)).

#### POST `/api/Auth/register`

**Caller:** Anyone (only while zero Admin/SuperAdmin exist) → then Solvuri Admin/SuperAdmin only.
**Why:** Register a Solvuri platform operator account (not tied to any merchant).

Request:
```json
{
  "username": "jane.admin",
  "password": "StrongPassw0rd!",
  "email": "jane.admin@solvuri.com",
  "phoneNumber": "254712345678",
  "isSuperAdmin": false
}
```

Response:
```json
{ "success": true, "message": "Admin account registered successfully", "data": null }
```

Errors: `"Username already exists"`, `"Email already in use"` (400); `"Forbidden"` (403, non-admin caller once bootstrap is closed); `"Only a SuperAdmin can grant SuperAdmin."` (403).

---

#### POST `/api/Auth/login`

**Caller:** Anyone with an account — this is the **single login endpoint for all four roles** (login is always by **email**, never username).
**Why:** Authenticate and (for non-admin roles) receive a JWT immediately.

Request:
```json
{ "email": "merchant.owner@example.com", "password": "SuperSecret123!" }
```

Response — Merchant/MerchantAgent (token issued immediately):
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
}
```

Response — Admin/SuperAdmin (2FA required, no token yet):
```json
{
  "success": true,
  "message": "OTP sent to your email and phone. Verify to complete login.",
  "data": { "requiresOtp": true }
}
```

Error: `{ "success": false, "message": "Invalid email or password", "data": null }` (401).

---

#### POST `/api/Auth/login/verify-otp`

**Caller:** A Solvuri Admin/SuperAdmin completing the 2FA step above.
**Why:** Exchanges the OTP for the actual JWT.

Request:
```json
{ "email": "admin@solvuri.com", "otp": "482913" }
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
}
```

Error: `{ "success": false, "message": "Invalid or expired OTP", "data": null }` (400). OTP expires after 5 minutes.

---

#### POST `/api/Auth/forgot-password` / `POST /api/Auth/reset-password`

**Caller:** Any user of any role, anonymously.
**Why:** OTP-based password reset (works for Merchant/MerchantAgent/Admin/SuperAdmin alike).

```json
// POST /api/Auth/forgot-password
{ "email": "merchant.owner@example.com" }
```
```json
{ "success": true, "message": "OTP sent to your email and phone (if available)", "data": null }
```

```json
// POST /api/Auth/reset-password
{ "email": "merchant.owner@example.com", "otp": "738204", "newPassword": "NewStrongPass1!" }
```
```json
{ "success": true, "message": "Password reset successful", "data": null }
```

---

#### GET `/api/Auth/users`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** List every platform user across every tenant (support/ops visibility).

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "id": 1, "username": "jane.admin", "email": "jane.admin@solvuri.com", "tenantId": null, "isActive": true },
    { "id": 42, "username": "acme.owner", "email": "owner@acme.co.ke", "tenantId": 7, "isActive": true }
  ]
}
```
`tenantId: null` = a platform-level Admin/SuperAdmin account; non-null = belongs to that Merchant tenant.

---

### 1.2 Tenant/License Requests (`TenantRequestsController`, base route `api/tenant-requests`)

Public "apply to become a Solvuri merchant" lead-capture form, reviewed by an admin before an actual account is created via [§1.3](#13-merchant-onboarding--subscription-setup-tenantscontroller-base-route-apitenants).

`request-license` is `[AllowAnonymous]`; `GET /` and the status-update endpoint require `[Authorize]` + `IsSolvuriAdmin()`.

#### POST `/api/tenant-requests/request-license`

**Caller:** Anonymous prospective merchant.
**Why:** Submit interest in becoming a Solvuri merchant.

Request:
```json
{
  "firstName": "John",
  "middleName": "Otieno",
  "lastName": "Kamau",
  "brandName": "Acme Retail Ltd",
  "email": "john.kamau@acmeretail.co.ke",
  "phoneNumber": "254712345678",
  "businessDescription": "Retail electronics and accessories shop with 3 branches.",
  "requestedSystems": "POS, Inventory Management"
}
```

Response:
```json
{
  "success": true,
  "message": "License request submitted successfully",
  "data": {
    "id": 101, "createdAt": "2026-07-29T09:15:00Z", "updatedAt": null, "isActive": true,
    "firstName": "John", "middleName": "Otieno", "lastName": "Kamau",
    "brandName": "Acme Retail Ltd", "email": "john.kamau@acmeretail.co.ke",
    "phoneNumber": "254712345678",
    "businessDescription": "Retail electronics and accessories shop with 3 branches.",
    "requestedSystems": "POS, Inventory Management",
    "status": "Pending"
  }
}
```

#### GET `/api/tenant-requests`

**Caller:** Solvuri Admin/SuperAdmin only. Returns the queue of active requests, newest first.

#### PUT `/api/tenant-requests/{id}/status`

**Caller:** Solvuri Admin/SuperAdmin only. Approves/rejects a request (free-text `status`, not validated against an enum).

Request: `{ "status": "Approved" }` → Response echoes the updated request row.

> Approving here does **not** auto-create the merchant account — that's a separate, deliberate step: [§1.3](#13-merchant-onboarding--subscription-setup-tenantscontroller-base-route-apitenants) `POST /api/tenants/register-tenant`.

---

### 1.3 Merchant Onboarding & Subscription Setup (`TenantsController`, base route `api/tenants`)

The full onboarding sequence a Solvuri Admin follows for a new merchant:

```
1. POST /api/tenants/register-tenant           → creates the Merchant account (Inactive), sends welcome SMS
2. PUT  /api/tenants/{id}/subscription/categories → pick which SystemCategories (Clearack, POS, ...) they're opted into
3. PUT  /api/tenants/{id}/subscription/features    → pick which Features under those categories, and set a PRICE for each (per-merchant pricing)
4. (later, ongoing) POST /api/solvuri/payments/stk-push or /manual → collect payment → features flip to "paid" and become usable (see §1.5)
```

#### POST `/api/tenants/register-tenant`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Creates the Merchant account + an Inactive `TenantSubscription` shell + the owner's login (`AppRole.Merchant`). Sends a welcome SMS if a phone number is given. Categories/features/pricing are **not** set here — that's steps 2–3 above.

Request:
```json
{
  "firstName": "John",
  "middleName": "Otieno",
  "lastName": "Kamau",
  "brandName": "Acme Retail Ltd",
  "businessDescription": "Retail electronics and accessories shop.",
  "email": "owner@acmeretail.co.ke",
  "phoneNumber": "254712345678",
  "password": "TempPassw0rd!",
  "domainName": "acmeretail",
  "customMonthlyFee": null
}
```

Response:
```json
{
  "success": true,
  "message": "Merchant registered successfully",
  "data": {
    "message": "Tenant registered successfully (Inactive until subscription activation)",
    "tenantId": 7,
    "subscriptionId": 12,
    "userUsername": "owner",
    "status": "Inactive"
  }
}
```

**Special behavior:** the owner's login `Username` is auto-derived as the local part of their email (`owner@acmeretail.co.ke` → `owner`); login is by **email**, so the username is just a display label. Rejects with `"Email already in use."` (400) if the email is already registered.

---

#### PUT `/api/tenants/{id}`

**Caller:** currently no explicit role gate beyond `[Authorize]` in code (any authenticated user) — used by Solvuri admin in practice to edit brand/contact/domain info.

Request: `{ "brandName": "Acme Retail Ltd", "businessDescription": "...", "email": "...", "phoneNumber": "...", "domainName": "...", "customMonthlyFee": 5000 }` (all fields optional/partial-update).

---

#### GET `/api/tenants`

**Caller:** any authenticated user (no explicit role gate in code). Lists every tenant with its subscription included — used by Solvuri admin as the merchant directory.

---

#### PUT `/api/tenants/subscription/{subscriptionId}`

**Caller:** any authenticated user (no explicit gate) — an admin-level override for subscription fields directly (status, dates, `isPaid`, `totalPaid`, etc.), separate from the payment-driven flow in §1.5.

Request:
```json
{
  "startDate": "2026-07-29T00:00:00Z",
  "endDate": "2026-08-29T00:00:00Z",
  "status": "Active",
  "isPaid": true,
  "paymentMethod": "Cash",
  "customMonthlyFee": 5000,
  "totalPaid": 5000
}
```

---

#### PUT `/api/tenants/{id}/subscription/categories`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Step 1 of subscription setup — which `SystemCategory` groupings (e.g. "Clearack", "Point of Sale") this merchant is opted into. **Replaces** the full selection — removing a category also removes any feature subscriptions the merchant had under it.

Request:
```json
{ "systemCategoryIds": [1, 3] }
```

Response (returns the full updated summary, same shape as §1.3 `GET .../subscription` below):
```json
{
  "success": true,
  "message": "Merchant categories updated successfully",
  "data": {
    "categories": [{ "systemCategoryId": 1, "name": "Clearack" }, { "systemCategoryId": 3, "name": "Point of Sale" }],
    "features": [],
    "totalMonthlyCost": 0
  }
}
```

---

#### PUT `/api/tenants/{id}/subscription/features`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Step 2 — which `Feature`s the merchant subscribes to, **each at its own merchant-specific price** (the same feature can be priced differently per merchant). Every `featureId` must belong to a category already selected in step 1. **Replaces** the full selection; if an existing feature's price is changed, it's reset to unpaid (must be paid again at the new price — see §1.5).

Request:
```json
{
  "features": [
    { "featureId": 5, "monthlyPrice": 1500 },
    { "featureId": 8, "monthlyPrice": 500 }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Merchant features updated successfully",
  "data": {
    "categories": [{ "systemCategoryId": 1, "name": "Clearack" }],
    "features": [
      { "featureId": 5, "featureName": "Ecommerce (no online checkout)", "systemCategoryId": 1, "systemCategoryName": "Clearack", "monthlyPrice": 1500, "isPaid": false, "paidAt": null },
      { "featureId": 8, "featureName": "Online Checkout", "systemCategoryId": 1, "systemCategoryName": "Clearack", "monthlyPrice": 500, "isPaid": false, "paidAt": null }
    ],
    "totalMonthlyCost": 2000
  }
}
```

---

#### GET `/api/tenants/{id}/subscription`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Current categories + priced features (with paid/unpaid status) + total monthly cost for one merchant — same shape as the responses above.

---

### 1.4 Feature & System Category Catalog

These define the **shared catalog** every merchant picks from in §1.3. `SystemCategory` groups related `Feature`s (e.g. "Clearack", "Point of Sale"); each `Feature` is a billable unit (e.g. "Online Checkout") whose price is set *per merchant* in `SetMerchantFeaturesDto` above — the catalog entry itself carries no fixed price.

Both controllers require `[Authorize]` + `IsSolvuriAdmin()` on every action (including the `GET` list endpoints) — billable catalog items are Solvuri admin/super-admin only.

#### `SystemCategoriesController` (base route `api/system-categories`)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/system-categories` | Create a category |
| `PUT` | `/api/system-categories/{id}` | Update name/description |
| `DELETE` | `/api/system-categories/{id}` | Remove a category |
| `GET` | `/api/system-categories` | List all (powers the category dropdown in §1.3 step 1) |

```json
// POST /api/system-categories
{ "name": "Point of Sale", "description": "POS terminal, cart, payments and receipts." }
```
```json
{
  "success": true,
  "message": "System category created successfully",
  "data": { "id": 3, "createdAt": "2026-07-29T09:10:00Z", "updatedAt": null, "isActive": true, "name": "Point of Sale", "description": "POS terminal, cart, payments and receipts." }
}
```

#### `FeaturesController` (base route `api/features`)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/features` | Create a feature under a category |
| `PUT` | `/api/features/{id}` | Update name/description/category |
| `DELETE` | `/api/features/{id}` | Remove a feature |
| `GET` | `/api/features` | List all (powers the feature picker in §1.3 step 2) |

```json
// POST /api/features
{ "name": "Advanced Reporting", "description": "Unlocks sales trend reports and CSV export.", "monthlyPrice": 1500, "systemCategoryId": 3 }
```
```json
{
  "success": true,
  "message": "Feature created successfully",
  "data": { "id": 12, "createdAt": "2026-07-29T09:20:00Z", "updatedAt": null, "isActive": true, "name": "Advanced Reporting", "description": "Unlocks sales trend reports and CSV export.", "monthlyPrice": 1500, "systemCategoryId": 3 }
}
```
> `monthlyPrice` here is a catalog default/reference value — the price actually billed to a specific merchant is the one set via `SetMerchantFeaturesDto` in §1.3, which can differ from this.

---

### 1.5 Solvuri Platform Billing (`SolvuriPaymentsController`, base route `api/solvuri/payments`)

This is **Solvuri's own revenue** — collecting subscription fees from merchants, as distinct from Clearack checkout money (which belongs to the merchant, §3). Payments here go through **Solvuri's single static Daraja till**, not any merchant's own till.

**Per-feature billing model:** a merchant selecting a feature (§1.3) does not make it usable — only a payment that specifically **targets** that feature (via `featureIds`) flips its `isPaid` flag to `true`. This means a merchant can pay for one feature and leave another unpaid/inactive — payment is never all-or-nothing across the whole subscription.

**Proration:** every payment extends `TenantSubscription.EndDate` proportionally to the targeted features' combined monthly price: `extension_days = round(30 × amount / cyclePriceOfTargetedFeatures)`. Overpayment extends further than 30 days; underpayment extends *less* than 30 days (both directions are allowed, not rejected) — unless an admin passes an explicit `extendDays` override, which always wins.

#### POST `/api/solvuri/payments/stk-push`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Push an STK prompt to a merchant's phone via Solvuri's static till, to collect their subscription fee.

Request:
```json
{
  "subscriptionId": 12,
  "phoneNumber": "254712345678",
  "amount": 1500,
  "featureIds": [5]
}
```
`featureIds: null`/omitted = "whatever is currently unpaid, once this succeeds."

Response:
```json
{
  "success": true,
  "message": "STK push initiated successfully",
  "data": { "success": true, "message": "STK push sent", "checkoutRequestId": "ws_CO_290720261234567890" }
}
```

#### GET `/api/solvuri/payments/stk-push/status/{checkoutRequestId}`

**Caller:** Solvuri Admin/SuperAdmin only (any merchant's transaction).
**Why:** Actively check the outcome of the push above — see [§5 STK-push flow](#5-stk-push-flow-how-all-three-mpesa-integrations-resolve-status) for the full mechanics.

Response (success):
```json
{
  "success": true,
  "message": "Success",
  "data": { "checkoutRequestId": "ws_CO_290720261234567890", "status": "Success", "activatedFeatureIds": [5] }
}
```

#### POST `/api/solvuri/payments/manual`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Log a subscription payment received outside STK (cash, card, bank deposit, paybill, till), optionally overriding the extension length directly.

Request:
```json
{
  "subscriptionId": 12,
  "amount": 1500,
  "paymentMode": "Cash",
  "referenceNumber": "RCPT-0042",
  "paymentDate": "2026-07-29T10:00:00Z",
  "notes": "Paid at the office in person",
  "extendDays": 30,
  "featureIds": [5]
}
```
Valid `paymentMode` values: `Cash`, `Card`, `BankDeposit`, `Paybill`, `Till`.

Response:
```json
{
  "success": true,
  "message": "Payment logged successfully",
  "data": {
    "id": 88, "tenantId": 7, "tenantBrandName": "Acme Retail Ltd", "subscriptionId": 12,
    "amount": 1500, "paymentMode": "Cash", "referenceNumber": "RCPT-0042",
    "loggedByUsername": "jane.admin", "paymentDate": "2026-07-29T10:00:00Z",
    "notes": "Paid at the office in person"
  }
}
```

#### POST `/api/solvuri/payments/callback`

**Caller:** Safaricom Daraja (webhook, `[AllowAnonymous]`) — hits Solvuri's static, hardcoded `CallbackUrl`.
**Why:** Asynchronously confirms/fails an STK push initiated above, independent of the polling flow.

#### GET `/api/solvuri/payments`

**Caller:** Solvuri Admin/SuperAdmin only. Full payment ledger, optionally `?tenantId=` scoped.

#### GET `/api/solvuri/payments/revenue-report`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Platform revenue dashboard.

Request: `?from=2026-07-01&to=2026-07-29&groupBy=day` (`groupBy`: day/week/month/year)

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "from": "2026-07-01T00:00:00Z", "to": "2026-07-29T00:00:00Z",
    "totalRevenue": 45500, "paymentCount": 12,
    "byPaymentMode": [{ "paymentMode": "MpesaSTK", "amount": 30000, "count": 8 }, { "paymentMode": "Cash", "amount": 15500, "count": 4 }],
    "byPeriod": [{ "period": "2026-07-29", "amount": 1500, "count": 1 }]
  }
}
```

---

## 2. Merchant & Agent APIs

Everything a **Merchant owner** uses to run their own account, plus how their **MerchantAgents** (cashiers) authenticate.

### 2.1 Login (all roles)

Merchants and Agents use the **same** `POST /api/Auth/login` endpoint documented in [§1.1](#11-bootstrapping--admin-auth-authcontroller-base-route-apiauth) — by email, no OTP/2FA step (2FA is admin-only). A `Merchant` account is created by a Solvuri admin (§1.3); a `MerchantAgent` account is created by the merchant owner (§2.2 below).

### 2.2 Staff/Agent Management (`AgentsController`, base route `api/merchants/agents`)

**Caller for every endpoint below: `Merchant` owner only** — a `MerchantAgent` cannot manage other agents, and Solvuri admins do not use this controller (no `IsSolvuriAdmin()` bypass exists here).

#### POST `/api/merchants/agents`

**Why:** Register a new cashier/staff login under the caller's own tenant.

Request:
```json
{
  "username": "jkamau",
  "email": "jkamau@example-shop.co.ke",
  "phoneNumber": "254712345678",
  "password": "S3cureP@ss",
  "agentCode": "AGT-004"
}
```

Response (`201 Created`):
```json
{
  "success": true,
  "message": "Agent registered successfully",
  "data": {
    "id": 4, "userId": 57, "username": "jkamau", "email": "jkamau@example-shop.co.ke",
    "phoneNumber": "254712345678", "agentCode": "AGT-004", "isActive": true,
    "createdAt": "2026-07-29T09:12:44Z"
  }
}
```

**Special behavior:** No welcome SMS/email is sent — the merchant owner is responsible for handing the password to their staff out-of-band. Username uniqueness is scoped per-tenant; email uniqueness is global across the whole platform. No cap on how many agents a merchant can create. Login for the new agent is by **email**, same as everyone else.

#### GET `/api/merchants/agents`

**Why:** List the caller's own agents (never another tenant's).

```json
{
  "success": true, "message": "Success",
  "data": [
    { "id": 4, "userId": 57, "username": "jkamau", "email": "jkamau@example-shop.co.ke", "phoneNumber": "254712345678", "agentCode": "AGT-004", "isActive": true, "createdAt": "2026-07-29T09:12:44Z" }
  ]
}
```

#### PUT `/api/merchants/agents/{agentId}/deactivate` / `PUT /api/merchants/agents/{agentId}/reactivate`

**Why:** Block/restore an agent's ability to log in entirely (not just their POS access). Both are scoped so a merchant can only act on their own agents (returns 404, not 403, for another tenant's agent — avoids leaking existence).

```json
{ "success": true, "message": "Agent deactivated.", "data": null }
```

### 2.3 Self-Service Subscription Top-Up (part of `SolvuriPaymentsController`)

A merchant paying for their **own** subscription/features, as opposed to §1.5 where an admin pushes it to them.

#### POST `/api/solvuri/payments/subscription/top-up`

**Caller:** `Merchant` owner only.
**Why:** Pay for one or more of their own selected-but-unpaid features. **Amount is computed server-side** from those features' prices — the merchant only picks which features and their phone number.

Request:
```json
{ "phoneNumber": "254712345678", "featureIds": [5] }
```
`featureIds: null`/omitted = "pay for every currently-unpaid feature."

Response:
```json
{
  "success": true,
  "message": "STK push initiated successfully",
  "data": { "message": "Payment request sent", "checkoutRequestId": "ws_CO_290720269876543210", "amount": 1500 }
}
```

#### GET `/api/solvuri/payments/subscription/top-up/status/{checkoutRequestId}`

**Caller:** `Merchant` owner only (their own transactions).
**Why:** Poll for the outcome — see [§5](#5-stk-push-flow-how-all-three-mpesa-integrations-resolve-status).

```json
{
  "success": true, "message": "Success",
  "data": { "checkoutRequestId": "ws_CO_290720269876543210", "status": "Success", "activatedFeatureIds": [5] }
}
```

### 2.4 Merchant Mpesa Settings for Storefront Checkout (`MerchantPaymentSettingsController`, base route `api/clearack/merchant/mpesa-settings`)

Before a merchant's storefront can accept online Mpesa payments (§3.5 Checkout), they must configure their **own** Daraja till, have it verified by Solvuri, and have it enabled. Flow:

```
1. POST /api/clearack/merchant/mpesa-settings              (merchant submits own credentials)
2. POST /api/clearack/merchant/mpesa-settings/{id}/verify   (Solvuri admin fires a real 1-KES test STK push)
3. PUT  /api/clearack/merchant/mpesa-settings/{id}/enabled  (Solvuri admin flips it live)
```

#### GET `/api/clearack/merchant/mpesa-settings`

**Caller:** `Merchant` owner (own settings only). Secrets are never returned, only a `hasSecrets` flag.

```json
{
  "success": true, "message": "Success",
  "data": {
    "id": 3, "consumerKey": "abc123...", "shortcode": "600123", "partyB": "600123",
    "callbackUrl": "https://api.solvuri.com/api/clearack/checkout/7/callback",
    "transactionType": "CustomerBuyGoodsOnline", "isEnabled": false, "isVerified": false, "hasSecrets": true
  }
}
```

#### POST `/api/clearack/merchant/mpesa-settings`

**Caller:** `Merchant` owner. Submits/updates their own credentials — this **resets** `isVerified`/`isEnabled` to false, since a changed secret needs re-verification.

Request:
```json
{
  "consumerKey": "your-daraja-consumer-key",
  "consumerSecret": "your-daraja-consumer-secret",
  "shortcode": "600123",
  "passkey": "your-daraja-passkey",
  "partyB": "600123",
  "transactionType": "CustomerBuyGoodsOnline"
}
```
`CallbackUrl` is **never** accepted from the client — it's always derived server-side as `{PublicBaseUrl}/api/clearack/checkout/{merchantId}/callback`, so it always points back into Solvuri's own API.

#### GET `/api/clearack/merchant/mpesa-settings/{merchantId}` — Solvuri admin inspecting any merchant's settings before verifying.

#### POST `/api/clearack/merchant/mpesa-settings/{merchantId}/verify`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Fires a **real 1-KES STK push** (not just a config sanity check) to confirm the merchant's credentials actually work end-to-end.

Request: `{ "testPhoneNumber": "254712345678" }` → Response: `{ "success": true, "message": "Verification push sent. Credentials marked verified.", "data": null }`

#### PUT `/api/clearack/merchant/mpesa-settings/{merchantId}/enabled`

**Caller:** Solvuri Admin/SuperAdmin only.
**Why:** Go live / take down online checkout for this merchant. Throws a 400 if trying to enable before `isVerified` is true.

Request: `{ "isEnabled": true }`

---

## 3. Clearack APIs (e-commerce storefront)

Clearack is the storefront module: products, categories, cart, orders, delivery towns, and anonymous buyer checkout. Route prefix is `api/clearack/*` for most controllers (note: `DeliveryTownsController` is the one exception, at `api/delivery-towns`).

### 3.1 Products (`ProductsController`, base route `api/clearack/products`)

| Method | Route | Caller | Purpose |
|---|---|---|---|
| `POST` | `/api/clearack/products` | `Merchant` or `MerchantAgent` | Add a product to their catalog |
| `PUT` | `/api/clearack/products/{id}` | `Merchant` or `MerchantAgent` | Update name/description/price/cost/category/visibility |
| `POST` | `/api/clearack/products/{id}/adjust-stock` | `Merchant` or `MerchantAgent` | Restock/write-off/correction — logs an inventory transaction |
| `DELETE` | `/api/clearack/products/{id}?merchantId=` | `Merchant` or `MerchantAgent` | Remove a product |
| `GET` | `/api/clearack/products/merchant/{merchantId}` | **Anonymous** | Public storefront catalog for a merchant |
| `GET` | `/api/clearack/products/inventory` | `Merchant` or `MerchantAgent` | Own inventory dashboard — includes hidden items, cost price, units sold, revenue |

```json
// POST /api/clearack/products
{
  "merchantId": 7, "productName": "Wireless Mouse", "description": "2.4GHz USB mouse",
  "price": 1200, "costPrice": 700, "stockQuantity": 50, "categoryId": 2
}
```
```json
{
  "success": true, "message": "Product created successfully",
  "data": { "id": 101, "productName": "Wireless Mouse", "description": "2.4GHz USB mouse", "price": 1200, "stockQuantity": 50, "mainImageUrl": null, "isVisible": true, "costPrice": 700, "categoryId": 2, "isFeatured": false }
}
```

```json
// GET /api/clearack/products/merchant/7  (anonymous, public catalog — no costPrice field)
{
  "success": true, "message": "Success",
  "data": [
    { "id": 101, "productName": "Wireless Mouse", "description": "2.4GHz USB mouse", "price": 1200, "stockQuantity": 50, "mainImageUrl": null, "isVisible": true }
  ]
}
```

### 3.2 Categories (`CategoriesController`, base route `api/clearack/categories`)

| Method | Route | Caller | Purpose |
|---|---|---|---|
| `POST` | `/api/clearack/categories` | `IsAuthorizedForMerchant` (owner/agent of that merchant, or Solvuri admin) | Create a storefront product category |
| `GET` | `/api/clearack/categories/merchant/{merchantId}` | Public (no attribute) | List a merchant's categories, e.g. for a storefront nav menu |

```json
// POST /api/clearack/categories
{ "merchantId": 7, "categoryName": "Electronics", "description": "Gadgets and accessories" }
```

### 3.3 Cart (`CartsController`, base route `api/clearack/carts`)

#### POST `/api/clearack/carts/add`

**Caller:** `IsAuthorizedForMerchant`. **Why:** Add an item to a buyer's persistent Clearack cart (this is the e-commerce cart, distinct from the POS cashier cart in §4.1).

Request: `{ "merchantId": 7, "userId": 55, "productId": 101, "quantity": 2 }`

### 3.4 Orders (`OrdersController`, base route `api/clearack/orders`)

| Method | Route | Caller | Purpose |
|---|---|---|---|
| `POST` | `/api/clearack/orders` | `IsAuthorizedForMerchant` | Directly create an order (bypasses checkout/STK — used for manually-recorded sales) |
| `GET` | `/api/clearack/orders` | **Solvuri admin only** | Every order across every merchant |
| `GET` | `/api/clearack/orders/merchant/{merchantId}` | `IsAuthorizedForMerchant` | A merchant's own orders (or any merchant's, for an admin) |
| `GET` | `/api/clearack/orders/{id}` | Any authenticated user (scoped internally to the caller's own `merchantId` unless Solvuri admin) | Single order detail |

```json
// POST /api/clearack/orders
{
  "merchantId": 7, "customerName": "Mary Wanjiru", "customerEmail": "mary@example.com",
  "customerPhone": "254712345678", "shippingAddress": "Nairobi CBD",
  "items": [{ "productId": 101, "quantity": 2 }]
}
```
```json
{
  "success": true, "message": "Order created successfully",
  "data": {
    "id": 501, "merchantId": 7, "customerName": "Mary Wanjiru", "totalAmount": 2400,
    "status": "Pending", "paymentStatus": "Pending",
    "items": [{ "productId": 101, "productName": "Wireless Mouse", "quantity": 2, "price": 1200 }]
  }
}
```

### 3.5 Delivery Towns (`DeliveryTownsController`, base route `api/delivery-towns` — note: *not* under `api/clearack/`)

Platform-wide Kenyan town + delivery-cost list. Shared across every merchant's storefront (not per-tenant).

| Method | Route | Caller | Purpose |
|---|---|---|---|
| `GET` | `/api/delivery-towns` | **Anonymous** | Powers every storefront's checkout page (pick town → see shipping fee) |
| `POST` / `PUT` / `DELETE` | `/api/delivery-towns[/{id}]` | Solvuri Admin/SuperAdmin only | Maintain the shared town/cost list |

```json
// POST /api/delivery-towns
{ "townName": "Nairobi CBD", "county": "Nairobi", "deliveryCost": 200 }
```

### 3.6 Checkout — Anonymous Buyer Flow (`CheckoutController`, base route `api/clearack/checkout`)

**Every action on this controller is `[AllowAnonymous]`** — buyers are anonymous storefront visitors, identified only by `{merchantId}` in the route, never by a Solvuri login.

#### POST `/api/clearack/checkout/{merchantId}/initiate`

**Caller:** Anonymous storefront buyer.
**Why:** Pay now via STK push to the **merchant's own till** (requires the merchant to have the "Online Checkout" feature paid-for, per §1.5, *and* verified+enabled Mpesa credentials, per §2.4 — otherwise rejected with a message pointing the buyer at the `request` fallback below).

Request:
```json
{
  "customerName": "Mary Wanjiru", "customerEmail": "mary@example.com",
  "customerPhone": "254712345678", "shippingAddress": "Nairobi CBD",
  "deliveryTownId": 4,
  "items": [{ "productId": 101, "quantity": 2 }],
  "couponCode": null
}
```

Response:
```json
{
  "success": true,
  "message": "Payment request sent! Complete the STK prompt on your phone.",
  "data": { "success": true, "message": "Payment request sent! Complete the STK prompt on your phone.", "orderId": 502, "checkoutRequestId": "ws_CO_290720261122334455" }
}
```

#### POST `/api/clearack/checkout/{merchantId}/request`

**Caller:** Anonymous storefront buyer.
**Why:** Fallback for merchants **without** Online Checkout — creates an unpaid, `Pending` order; the merchant later confirms it manually via POS `PUT /api/pos/orders/{orderId}/mark-sold` (§4.1).

Request: same item/customer shape as `initiate`, minus payment fields.

#### POST `/api/clearack/checkout/{merchantId}/callback`

**Caller:** Safaricom Daraja webhook (anonymous) — the exact URL the merchant's own Daraja app is configured to hit.

#### GET `/api/clearack/checkout/status/{checkoutRequestId}`

**Caller:** Anonymous storefront buyer (polling their own checkout while waiting for the STK prompt).
**Why:** Actively resolves Pending status — see [§5](#5-stk-push-flow-how-all-three-mpesa-integrations-resolve-status).

```json
{
  "success": true, "message": "Success",
  "data": { "orderId": 502, "paymentStatus": "Paid", "orderStatus": "Confirmed" }
}
```

#### End-to-end Checkout flow

```
Buyer picks a delivery town → adds items → POST .../initiate
   → order created (Pending), STK push sent to buyer's phone, checkoutRequestId returned
   → buyer enters M-Pesa PIN on their phone
   → frontend polls GET .../status/{checkoutRequestId} every ~3-5s
       - still Pending & <90s old        → keep polling
       - ResultCode "0"                  → order.paymentStatus="Paid", order.status="Confirmed", stock deducted
       - non-zero ResultCode, or >90s w/ no answer → order.paymentStatus="Failed"
   → (Safaricom's callback may resolve it first/instead - both paths converge on the same DB state)
```

---

## 4. POS APIs (Point of Sale)

The physical till system for minimarts, hardware/steel shops, chemists, etc. Split into **three controllers** that all share the `api/pos` route prefix (ASP.NET Core routes per-action, not per-class, so there's no path collision):

- **`POSController`** — cart → sale → payments → receipts (the core transaction loop)
- **`POSInventoryController`** — stock receiving, day-to-day inventory ops, formal stock-count cycles, barcode/QR
- **`POSOperationsController`** — register/till, customers+loyalty, reports, pricing overrides

**Access pattern throughout:** almost everything requires `IsCashier()` (`Merchant` owner **or** `MerchantAgent`/cashier) — day-to-day till operation is deliberately open to both. Three things are **owner-only** (a `MerchantAgent` is refused even though they can run the till): `VoidSale`, and everything under **Reports** and **Pricing** (financial/management views — a Solvuri admin can also access these on any merchant via the same `IsOwner` gate).

### Overall POS sale flow

```
(optional) POST /api/pos/register/open                       → cashier opens the till with an opening float
POST /api/pos/carts                                            → start a draft sale
POST /api/pos/carts/{cartId}/items                              → scan/add items (repeat)
POST /api/pos/carts/{cartId}/discount                           → optional: % / fixed / coupon / staff discount
POST /api/pos/carts/{cartId}/checkout  { payments: [...] }      → one or more split payments (Cash, Card, Mpesa, ...) must cover the total
   → stock deducted, InventoryTransaction "sale" logged, cart becomes a completed Order/Sale, auto-linked to the open register session if any
GET  /api/pos/sales/{saleId}/receipt                            → print-ready payload (no separate "reprint" endpoint - just call this again)
(optional, post-sale corrections) void (owner-only, full reversal) / refund (full or per-line) / exchange (return + new items, nets out the difference)
(optional) POST /api/pos/register/close                        → reconciles counted cash vs. expected cash
```

### 4.1 Transactions (`POSController`, base route `api/pos`)

#### POST `/api/pos/sale`

**Caller:** `IsCashier()`.
**Why:** Ring up an instant walk-in sale in one call (no separate cart step) — requires the merchant to have the "POS" feature.

Request:
```json
{
  "merchantId": 7, "customerName": "Walk-in Customer", "customerPhone": null,
  "items": [{ "productId": 101, "quantity": 1 }],
  "paymentMethod": "Cash"
}
```
```json
{
  "success": true, "message": "Sale recorded successfully",
  "data": { "orderId": 601, "totalAmount": 1200, "status": "Completed", "paymentStatus": "Paid" }
}
```

#### PUT `/api/pos/orders/{orderId}/mark-sold`

**Caller:** `IsCashier()`.
**Why:** Confirms a buyer's storefront "request to buy" (§3.6 fallback) as an actual sale.

Request: `{ "merchantId": 7, "paymentMethod": "Cash" }`

#### GET `/api/pos/revenue?from=&to=`

**Caller:** `IsCashier()`. **Why:** Revenue report — the `Merchant` owner sees profit + a full per-agent breakdown; a `MerchantAgent` only ever sees the revenue **they personally** collected, never cost/profit figures.

```json
{
  "success": true, "message": "Success",
  "data": {
    "from": "2026-07-01T00:00:00Z", "to": "2026-07-29T00:00:00Z",
    "orderCount": 34, "totalRevenue": 87000, "totalProfit": 31000,
    "byAgent": [{ "agentUserId": 57, "agentName": "jkamau", "orderCount": 20, "revenue": 42000 }]
  }
}
```

#### Cart sub-routes (`POSController.Cart.cs`) — all `IsCashier()`

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/carts` | Start a new draft cart |
| `GET` | `/api/pos/carts/{cartId}?merchantId=` | Fetch a cart |
| `POST` | `/api/pos/carts/{cartId}/items` | Add a line item |
| `PUT` | `/api/pos/carts/{cartId}/items/{itemId}` | Change a line's quantity |
| `DELETE` | `/api/pos/carts/{cartId}/items/{itemId}?merchantId=` | Remove a line |
| `POST` | `/api/pos/carts/{cartId}/discount` | Apply a discount (`Percentage`/`FixedAmount`/`Coupon`/`Staff`) |
| `DELETE` | `/api/pos/carts/{cartId}/discount?merchantId=` | Remove the discount |
| `POST` | `/api/pos/carts/{cartId}/cancel?merchantId=` | Cancel before payment — no Order is ever created |
| `POST` | `/api/pos/carts/{cartId}/checkout` | Finalize with one or more split payments |

```json
// POST /api/pos/carts/{cartId}/items
{ "merchantId": 7, "productId": 101, "quantity": 2 }
```
```json
// POST /api/pos/carts/{cartId}/discount
{ "merchantId": 7, "discountType": "Percentage", "discountValue": 10 }
```
```json
// POST /api/pos/carts/{cartId}/checkout - split payment example
{
  "merchantId": 7,
  "payments": [
    { "method": "Cash", "amount": 1000 },
    { "method": "Mpesa", "amount": 1160, "referenceNumber": "QGH7X8Y9Z0" }
  ]
}
```
```json
{
  "success": true, "message": "Sale completed successfully",
  "data": {
    "id": 601, "createdAt": "2026-07-29T10:30:00Z", "customerName": "Walk-in Customer",
    "subtotal": 2400, "totalAmount": 2160, "status": "Completed", "paymentStatus": "Paid",
    "items": [{ "orderItemId": 1201, "productId": 101, "productName": "Wireless Mouse", "quantity": 2, "price": 1200 }],
    "payments": [
      { "id": 9001, "orderId": 601, "method": "Cash", "amount": 1000, "referenceNumber": null, "status": "Completed", "createdAt": "2026-07-29T10:30:00Z" },
      { "id": 9002, "orderId": 601, "method": "Mpesa", "amount": 1160, "referenceNumber": "QGH7X8Y9Z0", "status": "Completed", "createdAt": "2026-07-29T10:30:00Z" }
    ]
  }
}
```
**Special behavior:** payments total must be `>=` the cart total (over-payment allowed, no automatic "change due" field); `paymentMethod` on the resulting sale is `"Split"` when more than one tender is used; discount `Percentage` is capped/rounded, others capped at the subtotal so a discount can never make the total negative.

#### Sale lifecycle sub-routes (`POSController.Sales.cs`)

| Method | Route | Caller | Purpose |
|---|---|---|---|
| `GET` | `/api/pos/sales?merchantId=&from=&to=&cashierId=&customerName=&status=` | `IsCashier()` | List/filter completed sales |
| `GET` | `/api/pos/sales/{saleId}?merchantId=` | `IsCashier()` | Sale detail (items + payments) |
| `POST` | `/api/pos/sales/{saleId}/void` | **`Merchant` owner only** | Fully reverses a sale: restocks every line, reverses all payments |
| `POST` | `/api/pos/sales/{saleId}/refund` | `IsCashier()` | Full or partial (per-line) refund |
| `POST` | `/api/pos/sales/{saleId}/exchange` | `IsCashier()` | Return some lines + add new lines in one call |

```json
// POST /api/pos/sales/{saleId}/void
{ "merchantId": 7, "reason": "Rung up by mistake" }
```
```json
// POST /api/pos/sales/{saleId}/refund - partial refund
{ "merchantId": 7, "reason": "Customer returned 1 unit", "isFullRefund": false, "items": [{ "orderItemId": 1201, "quantity": 1 }] }
```
```json
// POST /api/pos/sales/{saleId}/exchange
{
  "merchantId": 7,
  "returnItems": [{ "orderItemId": 1201, "quantity": 1 }],
  "newItems": [{ "productId": 205, "quantity": 1 }]
}
```
```json
{
  "success": true, "message": "Exchange processed successfully",
  "data": {
    "sale": { "id": 601, "totalAmount": 2600, "status": "Completed", "paymentStatus": "Paid", "items": [ /* ... */ ] },
    "netAmountDue": 200
  }
}
```
`netAmountDue > 0` = customer owes more (collect via a follow-up `AddSalePayment` call below); `< 0` = customer is owed a refund (process separately) — the exchange endpoint itself never auto-creates a payment or refund.

#### Payments sub-routes (`POSController.Payments.cs`) — all `IsCashier()`

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/sales/{saleId}/payments` | Add a late/additional tender to an existing sale |
| `POST` | `/api/pos/payments/{paymentId}/reverse` | Reverse one specific payment |
| `GET` | `/api/pos/payments/{paymentId}?merchantId=` | Look up one payment |

```json
{ "merchantId": 7, "method": "Cash", "amount": 200 }
```

#### Receipts sub-routes (`POSController.Receipts.cs`) — all `IsCashier()`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pos/sales/{saleId}/receipt?merchantId=` | Structured, print-ready receipt payload |
| `POST` | `/api/pos/sales/{saleId}/receipt/email` | Email the receipt |
| `POST` | `/api/pos/sales/{saleId}/receipt/sms` | SMS the receipt |

```json
{
  "success": true, "message": "Success",
  "data": {
    "saleId": 601, "merchantName": "Acme Retail Ltd", "soldAt": "2026-07-29T10:30:00Z", "customerName": "Walk-in Customer",
    "items": [{ "productName": "Wireless Mouse", "quantity": 2, "price": 1200 }],
    "subtotal": 2400, "totalAmount": 2160,
    "payments": [{ "id": 9001, "orderId": 601, "method": "Cash", "amount": 1000, "referenceNumber": null, "status": "Completed", "createdAt": "2026-07-29T10:30:00Z" }]
  }
}
```
No hardware/printer integration exists — this JSON payload **is** the deliverable; a local print agent or browser print flow renders it.

### 4.2 Inventory & Stock (`POSInventoryController`, base route `api/pos`)

All endpoints in this section require `IsCashier()`.

#### Stock receiving / "stock-batches" (`POSInventoryController.Stock.cs` header + `.cs`)

For receiving a delivery of same-priced units: create one batch → get a QR code back → print/display it → cashier scans it later → types in the actual quantity received.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/stock-batches` | Create a batch (returns its QR code + base64 image) |
| `GET` | `/api/pos/stock-batches/{code}?merchantId=` | "Scan" step — look up a batch by its QR code |
| `POST` | `/api/pos/stock-batches/{code}/receive` | "Enter quantity" step — adds to stock, logs the receiving transaction |
| `GET` | `/api/pos/stock-batches?merchantId=` | List all batches |

```json
// POST /api/pos/stock-batches
{ "merchantId": 7, "productId": 101, "unitPrice": 700, "label": "July delivery", "expectedQuantity": 100 }
```
```json
{
  "success": true, "message": "Stock batch created successfully",
  "data": {
    "id": 30, "productId": 101, "productName": "Wireless Mouse", "unitPrice": 700, "label": "July delivery",
    "qrCode": "3f9a2b7c1e4d4a6f8b2c9d1e5a7f3b6c", "qrImage": "iVBORw0KGgoAAAANSUhEUg...",
    "expectedQuantity": 100, "receivedQuantity": 0, "createdAt": "2026-07-29T09:00:00Z"
  }
}
```
```json
// POST /api/pos/stock-batches/{code}/receive
{ "merchantId": 7, "quantity": 100 }
```

#### Day-to-day inventory ops (`POSInventoryController.Stock.cs`)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pos/inventory?merchantId=` | Stock levels for every product |
| `GET` | `/api/pos/inventory/{productId}?merchantId=` | Stock level for one product |
| `POST` | `/api/pos/inventory/adjustment` | Manual signed adjustment (damage, loss, theft, expired, other) |
| `POST` | `/api/pos/inventory/supplier-return` | Send stock back to a supplier (always recorded as a negative movement) |
| `GET` | `/api/pos/inventory/movements?merchantId=` | Full inventory transaction history |
| `GET` | `/api/pos/inventory/low-stock?merchantId=` | Products at/below their low-stock threshold |
| `GET` | `/api/pos/inventory/out-of-stock?merchantId=` | Products at zero stock |

```json
// POST /api/pos/inventory/adjustment
{ "merchantId": 7, "productId": 101, "quantity": -3, "reason": "Damaged", "notes": "Water damage from a leak" }
```
```json
// POST /api/pos/inventory/supplier-return
{ "merchantId": 7, "productId": 101, "quantity": 5, "notes": "Defective batch returned to supplier" }
```

#### Formal Stock-Count / cycle-count (`POSInventoryController.StockCount.cs`)

A distinct concept from stock-batches above — this is periodically **auditing** what's already on the shelf against what the system thinks is there (not receiving new stock).

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/stock-count/start` | Begin a count session (only one `InProgress` per merchant at a time) |
| `POST` | `/api/pos/stock-count/{id}/scan` | Record a counted quantity for a product (snapshots system quantity on first scan) |
| `POST` | `/api/pos/stock-count/{id}/complete` | Finalize — any variance overwrites `Product.StockQuantity` and logs an adjustment |
| `GET` | `/api/pos/stock-count/history?merchantId=` | Past count sessions |
| `GET` | `/api/pos/stock-count/{id}?merchantId=` | One session's detail with variances |

```json
// POST /api/pos/stock-count/start
{ "merchantId": 7, "notes": "End-of-month cycle count" }
```
```json
// POST /api/pos/stock-count/{id}/scan
{ "merchantId": 7, "productId": 101, "countedQuantity": 47 }
```
```json
{
  "success": true, "message": "Item scanned",
  "data": {
    "id": 15, "startedAt": "2026-07-29T08:00:00Z", "completedAt": null, "status": "InProgress", "notes": "End-of-month cycle count",
    "items": [{ "productId": 101, "productName": "Wireless Mouse", "systemQuantity": 50, "countedQuantity": 47, "variance": -3 }]
  }
}
```

#### Barcode / QR (`POSInventoryController.Barcode.cs`)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pos/barcode/{barcode}?merchantId=` | Look up a product by its scanned barcode |
| `POST` | `/api/pos/barcode/generate` | Generate a Code128 barcode image for a product |
| `POST` | `/api/pos/qr/generate` | Generate a QR code image for a product |

```json
// POST /api/pos/barcode/generate
{ "merchantId": 7, "productId": 101 }
```
```json
{
  "success": true, "message": "Success",
  "data": { "productId": 101, "code": "1007007000101", "imageBase64": "iVBORw0KGgoAAAANSUhEUg..." }
}
```
Barcodes use ZXing.Net (Code128, rendered via SkiaSharp for Linux/Docker compatibility); QR codes use the QRCoder library (same library as stock-batch QR codes above).

### 4.3 Operations & Management (`POSOperationsController`, base route `api/pos`)

#### Register / Till (`.cs`) — all `IsCashier()`

Optional — sales work fine with no register session open; if one *is* open, sales auto-link to it for reconciliation.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/register/open` | Open the till with an opening cash float |
| `POST` | `/api/pos/register/close?sessionId=` | Close and reconcile against the counted cash |
| `GET` | `/api/pos/register/current?merchantId=` | The currently open session, if any |
| `POST` | `/api/pos/register/cash-in` | Record cash added to the till outside a sale |
| `POST` | `/api/pos/register/cash-out` | Record cash removed from the till |
| `GET` | `/api/pos/register/reconciliation?merchantId=&sessionId=` | Live preview of the reconciliation math (callable before closing) |

```json
// POST /api/pos/register/open
{ "merchantId": 7, "openingCashAmount": 5000, "notes": "Morning shift" }
```
```json
// POST /api/pos/register/close?sessionId=15
{ "merchantId": 7, "closingCashAmount": 18500, "notes": "End of shift" }
```
```json
{
  "success": true, "message": "Register closed",
  "data": {
    "sessionId": 15, "openingCashAmount": 5000, "cashSales": 14000, "cashRefunds": 500,
    "cashIn": 200, "cashOut": 100, "expectedCashAmount": 18600, "actualCashAmount": 18500, "variance": -100
  }
}
```
**Reconciliation formula:** `expected = opening + cashSales(Completed, Cash method) − cashRefunds(ALL refunds, any method) + cashIn − cashOut` — refunds are assumed paid out of cash regardless of the original payment method (a documented simplification).

#### Customers + Loyalty (`.Customers.cs`) — all `IsCashier()`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pos/customers?merchantId=` | List customers |
| `POST` | `/api/pos/customers` | Create a customer |
| `GET` | `/api/pos/customers/{id}?merchantId=` | Customer detail |
| `PUT` | `/api/pos/customers/{id}` | Update a customer |
| `GET` | `/api/pos/customers/{id}/sales?merchantId=` | Purchase history for this customer |
| `POST` | `/api/pos/customers/{id}/loyalty` | Award (positive) or redeem (negative) loyalty points |

```json
// POST /api/pos/customers
{ "merchantId": 7, "name": "Mary Wanjiru", "email": "mary@example.com", "phone": "254712345678" }
```
```json
// POST /api/pos/customers/{id}/loyalty
{ "merchantId": 7, "points": 50, "reason": "Purchase reward" }
```
**Special behavior:** purchase history is matched by **phone number string** against `Order.CustomerPhone` — there's no real foreign key linking a `Customer` to their `Order`s, so this only works if the same phone number was entered at time of sale.

#### Reports (`.Reports.cs`) — **`Merchant` owner only, or Solvuri admin** (never `MerchantAgent`)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pos/reports/sales?merchantId=&from=&to=` | Sales totals, broken down by day |
| `GET` | `/api/pos/reports/profit?merchantId=&from=&to=` | Revenue vs. cost vs. profit |
| `GET` | `/api/pos/reports/tax?merchantId=&from=&to=` | Taxable revenue & tax collected (per `Product.TaxRate`) |
| `GET` | `/api/pos/reports/inventory?merchantId=` | Inventory report (same data as Clearack's, §3.1) |
| `GET` | `/api/pos/reports/top-products?merchantId=&from=&to=&take=` | Best-selling products |
| `GET` | `/api/pos/reports/top-customers?merchantId=&from=&to=&take=` | Highest-spending customers |
| `GET` | `/api/pos/reports/cashiers?merchantId=&from=&to=` | Sales grouped by cashier/agent |
| `GET` | `/api/pos/reports/payment-methods?merchantId=&from=&to=` | Sales grouped by tender type |
| `GET` | `/api/pos/reports/returns?merchantId=&from=&to=` | Refund + void totals |

```json
// GET /api/pos/reports/profit?merchantId=7&from=2026-07-01&to=2026-07-29
{
  "success": true, "message": "Success",
  "data": { "from": "2026-07-01T00:00:00Z", "to": "2026-07-29T00:00:00Z", "totalRevenue": 87000, "totalCost": 56000, "totalProfit": 31000 }
}
```

#### Pricing (`.Pricing.cs`) — **`Merchant` owner only, or Solvuri admin**

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/pos/pricing/override` | One-off price override on an item already in an open cart |
| `POST` | `/api/pos/pricing/bulk-update` | Update `Product.Price` for many products at once |
| `GET` | `/api/pos/pricing/history?merchantId=` | Audit log of every price change (override or bulk) |

```json
// POST /api/pos/pricing/override
{ "merchantId": 7, "cartItemId": 3301, "overridePrice": 999, "reason": "Manager discount for loyal customer" }
```
```json
// POST /api/pos/pricing/bulk-update
{ "merchantId": 7, "updates": [{ "productId": 101, "newPrice": 1300 }, { "productId": 205, "newPrice": 850 }] }
```
```json
{ "success": true, "message": "Prices updated successfully", "data": { "updatedCount": 2 } }
```

---

## 5. STK-Push Flow (how all three Mpesa integrations resolve status)

All three STK integrations in this API — Clearack storefront checkout (§3.6), merchant subscription top-up (§2.3), and admin-triggered subscription push (§1.5) — follow the same pattern:

```
1. INITIATE   Frontend calls the relevant "initiate"/"stk-push"/"top-up" endpoint
              → an Order/Transaction row is created with Status="Pending"
              → Safaricom sends the STK prompt to the phone; checkoutRequestId is returned

2. WAIT       Buyer/merchant enters their M-Pesa PIN (Safaricom's own prompt times out after ~30-45s)

3. POLL       Frontend calls the matching "status" endpoint every ~3-5 seconds:
                - checkout:            GET /api/clearack/checkout/status/{checkoutRequestId}
                - merchant top-up:     GET /api/solvuri/payments/subscription/top-up/status/{checkoutRequestId}
                - admin push:          GET /api/solvuri/payments/stk-push/status/{checkoutRequestId}
              Each call, if the transaction is still "Pending", actively queries Daraja's
              STK Push Query endpoint (not just waiting on the webhook) using the correct
              till's credentials (the merchant's own for checkout, Solvuri's static till
              for subscription billing).

4. RESOLVE    - Daraja ResultCode "0"      → mark Success/Paid, apply the payment
                (extend subscription / mark features paid, or mark order Paid+Confirmed
                and deduct stock), stop polling.
              - any other ResultCode       → mark Failed, stop polling.
              - still no definitive answer → stay Pending... UNLESS more than 90 seconds
                have passed since the transaction was created, in which case it is force-
                marked Failed so the UI never spins forever waiting on a poll that may
                never resolve.

5. CALLBACK   Safaricom's own webhook (POST .../callback) can ALSO resolve the same
              transaction independently and asynchronously - whichever path (poll or
              callback) gets there first "wins"; the other is a no-op because the
              transaction is no longer "Pending" by then.
```

**Why STK Push Query, not Transaction Status Query:** Daraja's `stkpushquery/v1/query` endpoint is purpose-built for exactly this — checking the outcome of an STK push you just initiated — and returns a synchronous, immediate answer with no special credential setup. Daraja's separate `transactionstatus/v1/query` API is a heavier, general-purpose reconciliation tool (for B2C/C2B/reversals) that requires an RSA-encrypted `SecurityCredential` and returns its answer *asynchronously* via a webhook — unnecessary complexity for STK-push follow-up, so it is intentionally not used here.

---

## Appendix: Machine-readable schema (OpenAPI, request DTOs only)

The backend's generated OpenAPI spec omits response bodies for every endpoint (every `"200"` response is just `{ "description": "Success" }`, with no content schema) — the actual response shapes only exist in the prose examples above. This appendix is kept for exact request DTO field names/types/nullability/validation constraints, which are sometimes more precise here than in the prose (e.g. `ReceiveStockDto.quantity` has `minimum: 1`, `AdjustStockDto` calls the reason field `transactionType` not `reason`).

```json
{
  "openapi": "3.0.1",
  "info": { "title": "Solvuri", "version": "1.0" },
  "components": {
    "schemas": {
      "AddCartItemDto": { "properties": { "merchantId": "int64", "productId": "int64", "quantity": "int32" } },
      "AddSalePaymentDto": { "properties": { "merchantId": "int64", "method": "string?", "amount": "double", "referenceNumber": "string?" } },
      "AddToCartDto": { "properties": { "merchantId": "int64", "userId": "int64", "productId": "int64", "quantity": "int32" } },
      "AdjustStockDto": { "properties": { "merchantId": "int64", "quantity": "int32", "transactionType": "string?", "notes": "string?" } },
      "ApplyCartDiscountDto": { "properties": { "merchantId": "int64", "discountType": "string?", "discountValue": "double?", "couponCode": "string?" } },
      "AwardLoyaltyDto": { "properties": { "merchantId": "int64", "points": "int32", "reason": "string?" } },
      "BulkPriceUpdateDto": { "properties": { "merchantId": "int64", "updates": "BulkPriceUpdateItemDto[]?" } },
      "BulkPriceUpdateItemDto": { "properties": { "productId": "int64", "newPrice": "double" } },
      "CartPaymentDto": { "properties": { "method": "string?", "amount": "double", "referenceNumber": "string?" } },
      "CashMovementDto": { "properties": { "merchantId": "int64", "amount": "double", "reason": "string?" } },
      "CheckoutCartDto": { "properties": { "merchantId": "int64", "payments": "CartPaymentDto[]?" } },
      "CloseRegisterDto": { "properties": { "merchantId": "int64", "closingCashAmount": "double", "notes": "string?" } },
      "CreateAgentDto": { "required": ["email", "password", "username"], "properties": { "username": "string (minLength 1)", "email": "string (email, minLength 1)", "phoneNumber": "string?", "password": "string (minLength 6)", "agentCode": "string?" } },
      "CreateCategoryDto": { "properties": { "merchantId": "int64", "categoryName": "string?", "description": "string?" } },
      "CreateCustomerDto": { "properties": { "merchantId": "int64", "name": "string?", "email": "string?", "phone": "string?" } },
      "CreateFeatureDto": { "properties": { "name": "string?", "description": "string?", "monthlyPrice": "double", "systemCategoryId": "int64" } },
      "CreateOrderDto": { "properties": { "merchantId": "int64", "customerName": "string?", "customerEmail": "string?", "customerPhone": "string?", "shippingAddress": "string?", "items": "OrderItemCreateDto[]?" } },
      "CreatePosCartDto": { "properties": { "merchantId": "int64", "customerName": "string?", "customerPhone": "string?" } },
      "CreatePosSaleDto": { "required": ["items", "paymentMethod"], "properties": { "merchantId": "int64", "customerName": "string?", "customerPhone": "string?", "items": "OrderItemCreateDto[] (minItems 1)", "paymentMethod": "string (minLength 1)" } },
      "CreateProductDto": { "properties": { "merchantId": "int64", "productName": "string?", "description": "string?", "price": "double", "costPrice": "double?", "stockQuantity": "int32", "categoryId": "int64" } },
      "CreateStockBatchDto": { "properties": { "merchantId": "int64", "productId": "int64", "unitPrice": "double", "label": "string?", "expectedQuantity": "int32?" } },
      "CreateSystemCategoryDto": { "properties": { "name": "string?", "description": "string?" } },
      "CreateTenantDto": { "required": ["brandName", "domainName", "email", "firstName", "lastName", "password"], "properties": { "firstName": "string (minLength 1)", "middleName": "string?", "lastName": "string (minLength 1)", "brandName": "string (minLength 1)", "businessDescription": "string?", "email": "string (email, minLength 1)", "phoneNumber": "string?", "password": "string (minLength 1)", "domainName": "string (minLength 1)", "customMonthlyFee": "double?" } },
      "CreateTenantRequestDto": { "properties": { "firstName": "string?", "middleName": "string?", "lastName": "string?", "brandName": "string?", "email": "string?", "phoneNumber": "string?", "businessDescription": "string?", "requestedSystems": "string?" } },
      "EmailReceiptDto": { "properties": { "merchantId": "int64", "email": "string?" } },
      "ExchangeNewItemDto": { "properties": { "productId": "int64", "quantity": "int32" } },
      "ExchangeSaleDto": { "properties": { "merchantId": "int64", "returnItems": "RefundLineDto[]?", "newItems": "ExchangeNewItemDto[]?" } },
      "ForgotPasswordDto": { "properties": { "email": "string?" } },
      "GenerateBarcodeDto": { "properties": { "merchantId": "int64", "productId": "int64" } },
      "InitiateCheckoutDto": { "required": ["customerName", "customerPhone", "deliveryTownId", "items", "shippingAddress"], "properties": { "customerName": "string (minLength 1)", "customerEmail": "string?", "customerPhone": "string (minLength 1)", "shippingAddress": "string (minLength 1)", "deliveryTownId": "int64", "items": "OrderItemCreateDto[] (minItems 1)", "couponCode": "string?" } },
      "InitiateSubscriptionStkPushDto": { "required": ["phoneNumber", "subscriptionId"], "properties": { "subscriptionId": "int64", "phoneNumber": "string (minLength 1)", "amount": "double (minimum 1)", "featureIds": "int64[]?" } },
      "InventoryAdjustmentDto": { "properties": { "merchantId": "int64", "productId": "int64", "quantity": "int32", "reason": "string?", "notes": "string?" } },
      "LogManualSubscriptionPaymentDto": { "required": ["paymentMode", "subscriptionId"], "properties": { "subscriptionId": "int64", "amount": "double (minimum 0.01)", "paymentMode": "string (minLength 1)", "referenceNumber": "string?", "paymentDate": "date-time?", "notes": "string?", "extendDays": "int32?", "featureIds": "int64[]?" } },
      "LoginDto": { "properties": { "email": "string?", "password": "string?" } },
      "LoginOtpDto": { "properties": { "email": "string?", "otp": "string?" } },
      "MarkOrderSoldDto": { "required": ["paymentMethod"], "properties": { "merchantId": "int64", "paymentMethod": "string (minLength 1)" } },
      "MerchantFeaturePriceDto": { "properties": { "featureId": "int64", "monthlyPrice": "double" } },
      "OpenRegisterDto": { "properties": { "merchantId": "int64", "openingCashAmount": "double", "notes": "string?" } },
      "OrderItemCreateDto": { "properties": { "productId": "int64", "quantity": "int32" } },
      "OverridePriceDto": { "properties": { "merchantId": "int64", "cartItemId": "int64", "overridePrice": "double", "reason": "string?" } },
      "ReceiveStockDto": { "properties": { "merchantId": "int64", "quantity": "int32 (minimum 1, maximum 2147483647)" } },
      "RefundLineDto": { "properties": { "orderItemId": "int64", "quantity": "int32" } },
      "RefundSaleDto": { "properties": { "merchantId": "int64", "reason": "string?", "isFullRefund": "boolean", "items": "RefundLineDto[]?" } },
      "RegisterSolvuriAdminDto": { "required": ["email"], "properties": { "username": "string?", "password": "string?", "email": "string (email, minLength 1)", "phoneNumber": "string?", "isSuperAdmin": "boolean" } },
      "RequestOrderDto": { "required": ["customerName", "customerPhone", "items"], "properties": { "customerName": "string (minLength 1)", "customerEmail": "string?", "customerPhone": "string (minLength 1)", "shippingAddress": "string?", "deliveryTownId": "int64?", "items": "OrderItemCreateDto[] (minItems 1)" } },
      "ResetPasswordDto": { "properties": { "email": "string?", "otp": "string?", "newPassword": "string?" } },
      "ReversePaymentDto": { "properties": { "merchantId": "int64" } },
      "SaveDeliveryTownDto": { "required": ["townName"], "properties": { "townName": "string (1-150 chars)", "county": "string? (max 150)", "deliveryCost": "double (minimum 0)" } },
      "SaveMerchantMpesaCredentialDto": { "required": ["consumerKey", "consumerSecret", "partyB", "passkey", "shortcode"], "properties": { "consumerKey": "string (minLength 1)", "consumerSecret": "string (minLength 1)", "shortcode": "string (minLength 1)", "passkey": "string (minLength 1)", "partyB": "string (minLength 1)", "transactionType": "string?" } },
      "ScanStockCountDto": { "properties": { "merchantId": "int64", "productId": "int64", "countedQuantity": "int32" } },
      "SetMerchantCategoriesDto": { "properties": { "systemCategoryIds": "int64[]?" } },
      "SetMerchantFeaturesDto": { "properties": { "features": "MerchantFeaturePriceDto[]?" } },
      "SetMerchantMpesaEnabledDto": { "properties": { "isEnabled": "boolean" } },
      "SmsReceiptDto": { "properties": { "merchantId": "int64", "phone": "string?" } },
      "StartStockCountDto": { "properties": { "merchantId": "int64", "notes": "string?" } },
      "SupplierReturnDto": { "properties": { "merchantId": "int64", "productId": "int64", "quantity": "int32", "notes": "string?" } },
      "TopUpSubscriptionDto": { "required": ["phoneNumber"], "properties": { "phoneNumber": "string (minLength 1)", "featureIds": "int64[]?" } },
      "UpdateCartItemDto": { "properties": { "merchantId": "int64", "quantity": "int32" } },
      "UpdateCustomerDto": { "properties": { "merchantId": "int64", "name": "string?", "email": "string?", "phone": "string?" } },
      "UpdateProductDto": { "properties": { "merchantId": "int64", "productName": "string?", "description": "string?", "price": "double", "costPrice": "double?", "categoryId": "int64", "isVisible": "boolean", "isFeatured": "boolean" } },
      "UpdateTenantDto": { "properties": { "brandName": "string?", "businessDescription": "string?", "email": "string?", "phoneNumber": "string?", "domainName": "string?", "customMonthlyFee": "double?" } },
      "UpdateTenantRequestDto": { "required": ["status"], "properties": { "status": "string (1-50 chars)" } },
      "UpdateTenantSubscriptionDto": { "properties": { "startDate": "date-time?", "endDate": "date-time?", "status": "string? (max 50)", "isPaid": "boolean?", "paymentMethod": "string? (max 50)", "customMonthlyFee": "double?", "totalPaid": "double?" } },
      "VerifyMerchantMpesaCredentialDto": { "required": ["testPhoneNumber"], "properties": { "testPhoneNumber": "string (minLength 1)" } },
      "VoidSaleDto": { "properties": { "merchantId": "int64", "reason": "string?" } }
    }
  }
}
```
