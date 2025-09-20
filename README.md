# Expat Tax Filing Platform

This repository contains a production-ready MVP for a cross-border US income tax filing assistant focused on Americans and non-resident aliens living abroad, with initial localization for Korea.

## Structure

```
apps/
  web/    # Next.js front-end wizard
  api/    # Express API + OpenAPI
packages/
  tax-engine/ # Deterministic tax engine
  ui/         # Shared UI primitives
prisma/       # Database schema and migrations
rates/        # Currency conversion data
scripts/      # Seed utilities
```

## Quick Start

1. Install dependencies using your preferred package manager (npm/pnpm/yarn) with workspace support.
2. Configure environment variables in `.env` (see `.env.example`).
3. Run database migrations and seed data:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
4. Start development services:
   ```bash
   make dev
   ```
   The command runs the web app on `localhost:3000`, API on `localhost:4000`, PostgreSQL, and Redis (via Docker Compose).
5. (Optional) Generate sample PDF outputs:
   ```bash
   npm run pdf:samples
   ```
   The PDFs are written to `docs/samples/`.

## Features

- Residency determination engine covering substantial presence, dual-status, and FEIE eligibility.
- TurboTax-style interview with autosave-ready stubs, localization (English/Korean), and Tailwind-based UI.
- Tax engine with FEIE, FTC, deductions, adjustments, and bracketed tax computation using pure functions.
- Express API with Swagger docs, Prisma ORM, BullMQ queues, and PDF generation stubs.
- Seed data for sample users/returns and automated acceptance tests for three flagship scenarios.
- Vitest test suites across front-end, API, and tax-engine packages.

## Docs

- [Architecture Overview](./docs/architecture.md)
- [Tax Engine](./docs/tax-engine.md)

## License

MIT
