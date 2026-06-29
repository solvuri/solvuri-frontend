# Solvuri Frontend

This repository contains the frontend implementation for Solvuri, a modular, white-label business software platform. Solvuri is designed for brands that want to sell commerce, travel, reservation, and operational services under their own name without rebuilding everything from scratch.

Rather than shipping one monolithic product, Solvuri is organized as a set of independent modules that can be adopted one at a time or combined under a single Super License. The frontend in this repository powers the public-facing experience, the customer storefront experience, and the administrative portal experience that support those products.

## What Solvuri is

Solvuri exists to help businesses operate digital products under their own brand through a modular infrastructure layer. In practice, this means:

- brands can launch white-label products without building the full stack themselves
- different business units can start with a single module and expand later
- the platform is structured around reusable modules rather than a single rigid application
- the experience is designed to feel polished, productized, and ready to sell under a partner or reseller brand

The current product story presented by the UI centers around four core modules:

- ClearRack for commerce experiences
- Safyri for travel booking experiences
- Reservr for reservation-based flows
- Master as part of the broader operating platform

## Repository purpose

This monorepo is the frontend layer for the Solvuri ecosystem. Its purpose is to deliver the user interfaces and shared UI primitives that make the platform usable, consistent, and scalable.

The codebase is organized as a Turborepo monorepo with three primary applications and a shared package layer.

## Project structure

The repository is organized as a Turborepo monorepo with a clear separation between product experiences and shared infrastructure.

```text
solvuri-frontend/
├── apps/
│   ├── web/                # Public marketing website and product storytelling
│   ├── store-front/        # Customer-facing storefront experience
│   └── admin-portal/       # Internal/admin experience for operators
├── packages/
│   ├── ui/                 # Shared UI component library
│   ├── types/              # Shared TypeScript types
│   ├── eslint-config/     # Shared linting configuration
│   └── typescript-config/  # Shared TypeScript configuration
├── package.json            # Root scripts and workspace configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
└── turbo.json              # Turborepo pipeline configuration
```

### What lives in each area

- apps/web: the public-facing Solvuri website, including the homepage, product messaging, and module showcase
- apps/store-front: the storefront experience for customers interacting with Solvuri-powered products
- apps/admin-portal: the admin and operational surface for managing the platform experience
- packages/ui: reusable design-system components used across the applications
- packages/types: shared contracts for data structures and domain models
- packages/\*-config: shared tooling so the apps remain consistent and maintainable

## Tech stack

The frontend is built with modern tooling and a component-driven architecture:

- Next.js for application rendering and routing
- React and TypeScript for UI development
- Tailwind CSS for styling
- Turborepo for monorepo orchestration
- pnpm for package management
- Framer Motion for interface motion and transitions

## Getting started

### Prerequisites

- Node.js 18 or newer
- pnpm 9 or newer

### Install dependencies

```bash
pnpm install
```

### Run the full monorepo

```bash
pnpm dev
```

### Run an individual app

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/store-front dev
pnpm --filter @repo/admin-portal dev
```

### Available app ports

- Web marketing site: http://localhost:3000
- Store front: http://localhost:3001
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
   Shared UI and shared types are used to keep the experience consistent across the web, storefront, and admin layers.

4. Product-first experience
   The presentation is focused on explaining what Solvuri offers and how the modules fit together.

## Notes for contributors

When working in this repository:

- Keep changes aligned with the Solvuri product story and brand direction.
- Prefer shared components and shared types when adding new UI.
- Make sure updates are consistent across the web, storefront, and admin experiences where applicable.
- Treat this as the frontend foundation of a broader platform rather than a standalone marketing site.

## Summary

Solvuri Frontend is the user interface layer for a modular white-label operating system for digital commerce and booking products. The repository brings together the marketing experience, customer-facing storefronts, and administrative tools in one coordinated monorepo so the whole product experience can evolve together.
