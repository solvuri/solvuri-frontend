# Solvuri Frontend

This repository contains the frontend implementation for Solvuri, a modular, white-label business software platform designed for brands that want to offer commerce, travel, reservation, and operational experiences under their own name without rebuilding everything from scratch.

Rather than shipping one monolithic product, Solvuri is organized as a set of independent modules that can be adopted one at a time or combined under a broader product experience. The frontend in this repository powers the public-facing website, the customer-facing storefront experience, the in-person POS register experience, and the administrative portal experience that support those products.

## What Solvuri is

Solvuri exists to help businesses launch digital products under their own brand through a modular infrastructure layer. In practice, this means:

- brands can introduce white-label experiences without building the full stack themselves
- different business units can start with a single module and expand later
- the platform is structured around reusable product modules rather than a single rigid application
- the experience is designed to feel polished, productized, and ready to sell under a partner or reseller brand

The product story presented in the UI currently centers on a combination of commerce and operations-focused experiences, including:

- Clearack for commerce-oriented experiences
- POS for in-person, register-based sales
- a public marketing and product storytelling experience in the web app
- an admin surface for operating and managing the platform experience

## Repository purpose

This monorepo is the frontend layer for the Solvuri ecosystem. Its purpose is to deliver the user interfaces, shared UI primitives, and cross-app state and utility logic that make the platform usable, consistent, and scalable.

The codebase is organized as a Turborepo monorepo with four primary applications and a shared package layer.

## Project structure

The repository is organized around a clear separation between product experiences and shared infrastructure.

```text
solvuri-frontend/
├── apps/
│   ├── web/                # Public marketing website and product storytelling
│   ├── clearack/          # Clearack-focused experience with storefront and marketing routes
│   ├── admin-portal/      # Internal/admin experience for operators
│   └── pos/                # In-person register app for the POS module
├── packages/
│   ├── ui/                # Shared UI component library
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Shared utility helpers
│   ├── api-client/        # Shared HTTP client factory
│   ├── data/              # Shared React Query client + domain hooks (e.g. `useProducts`)
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/# Shared TypeScript configuration
├── package.json           # Root scripts and workspace configuration
├── pnpm-workspace.yaml    # pnpm workspace definition
└── turbo.json             # Turborepo pipeline configuration
```

### What lives in each area

- apps/web: the public-facing Solvuri website, including the homepage, product messaging, and module showcase
- apps/clearack: the Clearack experience, including marketing pages and storefront-oriented routes
- apps/admin-portal: the admin and operational surface for managing the platform experience
- apps/pos: the in-person register experience for the POS module — product catalog, running sale, cash/card/M-Pesa tender, receipts, and sales history
- packages/ui: reusable design-system components (buttons, cards, inputs, sidebar); adoption is still growing across the four apps
- packages/types: shared contracts for data structures and domain models
- packages/utils: shared helpers for common application concerns (class-name merging, shared constants)
- packages/api-client: a factory for creating per-app HTTP clients against `NEXT_PUBLIC_API_URL`
- packages/data: a shared React Query client plus domain hooks (`useProducts`, `useProduct`, `useOrders`, `useOrder`, currently backed by mock data — see `packages/data/src/*.ts`) that consumers call the same way a real API-backed hook would be called. The tenants/sales mock hooks that used to live here were deleted once every consumer moved to real backend data.
- packages/\*-config: shared tooling so the apps remain consistent and maintainable

Cart/UI state currently lives in `apps/clearack` directly (Zustand), since it's Clearack-specific business logic rather than a cross-app concern — it'll move back into a shared package if a second app needs the same kind of state.

## Tech stack

The frontend is built with modern tooling and a component-driven architecture:

- Next.js for application rendering and routing
- React and TypeScript for UI development
- Tailwind CSS for styling
- pnpm for package management and workspaces
- Turborepo for monorepo orchestration
- Zustand for local state management (currently used in the Clearack storefront's cart)
- Framer Motion and TanStack React Query for UI motion and data-driven interactions

## Prerequisites

Before working in this repository, make sure you have:

- Node.js 22.13 or newer (pnpm@11.12.0 requires it — an older Node will fail `pnpm install`)
- pnpm 11.12.0 (pinned via the `packageManager` field in the root `package.json`)

## Getting started

### Install dependencies

From the repository root, install the workspace dependencies:

```bash
pnpm install
```

### Run the full monorepo

Start all development apps together:

```bash
pnpm dev
```

### Run an individual app

You can also start one application at a time:

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/clearack dev
pnpm --filter @repo/admin-portal dev
pnpm --filter @repo/pos dev
```

### Available app ports

The current development ports are:

- Web marketing site: http://localhost:3000
- Clearack experience: http://localhost:3001
- Admin portal: http://localhost:3002
- POS register: http://localhost:3003

## Development workflow

From the repository root, you can run:

```bash
pnpm build
pnpm lint
pnpm check-types
pnpm test
pnpm format
```

These commands are wired through Turborepo so the shared packages and apps can be built or validated consistently. `pnpm test` currently covers `packages/data` (the products/orders hooks), `apps/clearack` (the cart store, plus regression tests for both dynamic-route pages), and `apps/pos` (the register store, plus a regression test for the sale-detail page) — see each's `vitest.config.ts`.

## Backend API

The real backend (`https://backend-api-test.solvuri.com`) is documented in full at [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — every endpoint, request/response shape, and role gate, plus an OpenAPI appendix for exact request DTO field types. Treat that file as the source of truth over any individual app's `AGENTS.md` summary of what the backend supports.

## Deployment

**This section documents the current inferred model, not a verified decision someone on the team made** — it's written down here so it's an explicit assumption to confirm or correct, rather than something the next person has to reverse-engineer from `.gitignore`.

- Each app (`web`, `clearack`, `admin-portal`, `pos`) appears to deploy independently: `.gitignore` excludes `.vercel`, each app's boilerplate README pointed at Vercel before being rewritten, and each runs on its own port locally (3000/3001/3002/3003) with no reverse proxy or edge config checked into this repo. This has been confirmed for `admin-portal` at least (deployed at `solvuri-frontend-admin-portal.vercel.app`).
- No `vercel.json` or other deployment config exists anywhere in the repo.
- The only per-app environment difference today is `NEXT_PUBLIC_API_URL` (see each app's `.env.example`); `apps/clearack` additionally reads `ROOT_DOMAIN` and `apps/pos` reads `POS_ROOT_DOMAIN`, both for their respective subdomain-routing proxies.
- If "independent per-app Vercel deploys" isn't actually the plan, the CI setup (one workflow building all four apps) and the lack of any shared routing/proxy config would both need revisiting.
- **`apps/clearracks` was renamed to `apps/clearack`** (directory, package name, and every brand mention) to fix the long-standing "Clearrack"/"Clearack" spelling drift against the real backend. If this app already has its own deployed Vercel project (following the `solvuri-frontend-admin-portal` naming pattern seen above, it would likely be `solvuri-frontend-clearracks`), that project's root directory/build settings will need updating on Vercel's side to point at `apps/clearack` — this repo change alone doesn't touch anything outside the codebase.

## Design philosophy

The frontend is intentionally built around a few core ideas:

1. Modular product architecture
   The user experience should reflect a platform made of independent products rather than one fixed application.

2. White-label readiness
   The UI is designed so brands can present the product as their own, with a polished experience and room for customization.

3. Reusability
   Shared UI, state, types, and utilities are used to keep the experience consistent across the web, storefront, POS, and admin layers.

4. Product-first experience
   The presentation is focused on explaining what Solvuri offers and how the modules fit together.

## Notes for contributors

When working in this repository:

- keep changes aligned with the Solvuri product story and brand direction
- prefer shared components and shared packages when adding new UI or logic that may be reused
- make sure updates are consistent across the web, storefront, POS, and admin experiences where applicable
- treat this as the frontend foundation of a broader platform rather than a standalone marketing site

## Summary

Solvuri Frontend is the user interface layer for a modular white-label operating system for digital commerce and booking products. The repository brings together the marketing experience, customer-facing storefronts, and administrative tools in one coordinated monorepo so the whole product experience can evolve together.
