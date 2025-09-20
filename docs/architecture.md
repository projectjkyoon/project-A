# Architecture Overview

## High-level

The platform uses a mono-repo managed with npm workspaces and TypeScript across the stack.

- **Frontend** (`apps/web`): Next.js App Router with React Query for data fetching, NextAuth for authentication (credentials provider stub), next-intl for i18n, Tailwind + shadcn-inspired primitives, and React Hook Form + Zod for type-safe validation.
- **Backend** (`apps/api`): Express service exposing a documented REST API and orchestrating Prisma, BullMQ, PDF generation, and the tax engine.
- **Tax Engine** (`packages/tax-engine`): Deterministic, pure TypeScript modules implementing residency, FEIE, FTC, income normalization, deductions, credits, and full return computation.
- **Shared UI** (`packages/ui`): Cross-application components (e.g., disclaimer banner) published as a package.
- **Database**: PostgreSQL schema defined with Prisma. `scripts/seed.ts` populates baseline data for demo users and returns.
- **Jobs**: BullMQ queue configured for PDF generation and future long-running tasks.

## Data Flow

1. The web wizard collects user input step-by-step and persists draft data via the API.
2. The API stores structured data in PostgreSQL. Presence days, income details, and foreign tax payments are normalized tables for auditability.
3. When the user requests a computation, the API assembles normalized income entries and invokes `computeReturn` from the tax engine.
4. The computed result is stored in the `Computation` table and returned to the client. PDF summary jobs can be enqueued for asynchronous rendering.
5. Currency conversion uses yearly average rates stored in `/rates/<year>.json`. More precise daily rates can be added later.

## Security & Privacy

- Helmet, CORS, and rate limiting stubs protect the API perimeter.
- NextAuth handles session management; credentials provider demonstrates email/password with TODO for production integration.
- PII is stored in PostgreSQL with encrypted columns (configure via Prisma middleware or Postgres extensions in production).
- Audit logs use the `Computation` table to store payload/result JSON for traceability.
- Environment variables manage secrets (DB, Redis, email providers, etc.). Provide `.env.example` with expected keys.

## Dev Experience

- `make dev` orchestrates web, api, db, and redis via Docker Compose.
- Vitest-based tests cover UI components, API endpoints, and tax modules.
- GitHub Actions workflow runs lint, typecheck, tests, and build (see `.github/workflows/ci.yml`).
- OpenAPI spec auto-served at `/docs` and `/docs/openapi.json` for easy client generation.

## Future Extensions

- Extend treaty datasets under `packages/tax-engine/src/data/treaties` and expose via API.
- Implement full PDF filling for 1040/1040-NR using IRS form templates and `pdf-lib` or `react-pdf`.
- Add autosave API endpoints with background validation.
- Introduce state tax modules and e-file integration.
