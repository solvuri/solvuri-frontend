# Solvuri Frontend

This repository contains the frontend implementation for Solvuri, a modular, white-label business software platform designed for brands that want to offer commerce, travel, reservation, and operational experiences under their own name without rebuilding everything from scratch.

Rather than shipping one monolithic product, Solvuri is organized as a set of independent modules that can be adopted one at a time or combined under a broader product experience. The frontend in this repository powers the public-facing website, the customer-facing storefront experience, and the administrative portal experience that support those products.

## What Solvuri is

Solvuri exists to help businesses launch digital products under their own brand through a modular infrastructure layer. In practice, this means:

- brands can introduce white-label experiences without building the full stack themselves
- different business units can start with a single module and expand later
- the platform is structured around reusable product modules rather than a single rigid application
- the experience is designed to feel polished, productized, and ready to sell under a partner or reseller brand

The product story presented in the UI currently centers on a combination of commerce and operations-focused experiences, including:

- ClearRacks for commerce-oriented experiences
- a public marketing and product storytelling experience in the web app
- an admin surface for operating and managing the platform experience

## Repository purpose

This monorepo is the frontend layer for the Solvuri ecosystem. Its purpose is to deliver the user interfaces, shared UI primitives, and cross-app state and utility logic that make the platform usable, consistent, and scalable.

The codebase is organized as a Turborepo monorepo with three primary applications and a shared package layer.

## Project structure

The repository is organized around a clear separation between product experiences and shared infrastructure.

```text
solvuri-frontend/
├── apps/
│   ├── web/                # Public marketing website and product storytelling
│   ├── clearracks/        # ClearRacks-focused experience with storefront and marketing routes
│   └── admin-portal/      # Internal/admin experience for operators
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
- apps/clearracks: the ClearRacks experience, including marketing pages and storefront-oriented routes
- apps/admin-portal: the admin and operational surface for managing the platform experience
- packages/ui: reusable design-system components (buttons, cards, inputs, sidebar); adoption is still growing across the three apps
- packages/types: shared contracts for data structures and domain models
- packages/utils: shared helpers for common application concerns (class-name merging, shared constants)
- packages/api-client: a factory for creating per-app HTTP clients against `NEXT_PUBLIC_API_URL`
- packages/data: a shared React Query client plus domain hooks (e.g. `useProducts`, currently backed by mock data — see `packages/data/src/products.ts`) that consumers call the same way a real API-backed hook would be called
- packages/\*-config: shared tooling so the apps remain consistent and maintainable

Cart/UI state currently lives in `apps/clearracks` directly (Zustand), since it's ClearRacks-specific business logic rather than a cross-app concern — it'll move back into a shared package if a second app needs the same kind of state.

## Tech stack

The frontend is built with modern tooling and a component-driven architecture:

- Next.js for application rendering and routing
- React and TypeScript for UI development
- Tailwind CSS for styling
- pnpm for package management and workspaces
- Turborepo for monorepo orchestration
- Zustand for local state management (currently used in the ClearRacks storefront's cart)
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
pnpm --filter @repo/clearracks dev
pnpm --filter @repo/admin-portal dev
```

### Available app ports

The current development ports are:

- Web marketing site: http://localhost:3000
- ClearRacks experience: http://localhost:3001
- Admin portal: http://localhost:3002

## Development workflow

From the repository root, you can run:

```bash
pnpm build
pnpm lint
pnpm check-types
pnpm format
```

These commands are wired through Turborepo so the shared packages and apps can be built or validated consistently.

## Design philosophy

The frontend is intentionally built around a few core ideas:

1. Modular product architecture
   The user experience should reflect a platform made of independent products rather than one fixed application.

2. White-label readiness
   The UI is designed so brands can present the product as their own, with a polished experience and room for customization.

3. Reusability
   Shared UI, state, types, and utilities are used to keep the experience consistent across the web, storefront, and admin layers.

4. Product-first experience
   The presentation is focused on explaining what Solvuri offers and how the modules fit together.

## Notes for contributors

When working in this repository:

- keep changes aligned with the Solvuri product story and brand direction
- prefer shared components and shared packages when adding new UI or logic that may be reused
- make sure updates are consistent across the web, storefront, and admin experiences where applicable
- treat this as the frontend foundation of a broader platform rather than a standalone marketing site

## Summary

Solvuri Frontend is the user interface layer for a modular white-label operating system for digital commerce and booking products. The repository brings together the marketing experience, customer-facing storefronts, and administrative tools in one coordinated monorepo so the whole product experience can evolve together.
