# SeedLedger – v0 Action Items

High-level, per-package checklist of actionable items required to complete SeedLedger v0.

## Root Monorepo (`seedledger`)

- Define and document a simple "v0 dev workflow" script usage – One-liner notes on how to run `dev`, where backend/web are exposed, and basic troubleshooting for a medior.
- Align workspace tooling configs with current package needs – Ensure root scripts (`lint`, `prettier`, etc.) correctly target active workspaces and don’t reference dead/placeholder scripts.

## Contracts Package (`packages/contracts`)

- Expand transaction DB schema to full v0 domain model – Bring `transactionSchema` fields in line with functional requirements (type, amount, currency, dates, category, user, timestamps, etc.).
- Add explicit Zod contracts for tRPC inputs/outputs – Introduce dedicated DTO schemas for create, list, summary, and delete that match the v0 functional spec and architecture doc.
- Encode domain validation rules in contracts where appropriate – Capture basic format/shape rules (e.g., amount string format, transaction type enum, date string expectations) in the shared contracts.
- Provide a clear public contracts surface from `index.ts` – Export a small, coherent set of types/schemas (DB vs DTO vs helpers) that backend and frontend can depend on without leaking internals.

## Transactions Service (`services/transactions`) – Infrastructure & DB

- Wire the db plugin to use Drizzle with the contracts schema – Ensure `fastify.db` exposes a Drizzle client configured with the shared `transactionSchema` from the contracts package.
- Implement minimal SQLite schema and migration setup for v0 – Provide a "good enough" initial migration/reset story that creates the required tables and resets the local DB safely.
- Configure environment handling for DB file and basic settings – Use the existing env plugin to read `DATABASE_FILE` and any other required variables for local development.

## Transactions Service – Domain & tRPC API

- Replace placeholder tRPC procedures with the v0 API surface – Implement `transactions.create`, `transactions.list`, `transactions.summary`, and `transactions.delete` using the contracts DTOs.
- Enforce v0 domain rules in service logic – Apply constraints like positive amounts, fixed `userId`/`currency`, category normalization, and non-idempotent delete semantics.
- Implement date-range and category filtering semantics – Make `list` and `summary` respect `from`/`to` rules, `Europe/Budapest` day-level ranges, and normalized category matching.
- Implement summary computations consistent with list filters – Ensure `summary` calculations operate over exactly the same transaction set that `list` would return for the same filters.
- Standardize error mapping and validation failures – Map Zod and domain validation errors to appropriate tRPC/HTTP error shapes that the web app can surface generically.
- Add basic seed/reset utilities aligned with v0 domain – Adjust `db/seed.ts` and `db/reset.ts` (or equivalents) so seeded data reflects the real schema and typical v0 use cases.

## Transactions Service – HTTP/Server Integration

- Ensure Fastify+tRPC integration matches the intended path structure – Confirm that the tRPC plugin is exposed under the expected `/trpc` prefix and works end-to-end with the web proxy.
- Align server startup and logging with non-functional requirements – Configure logging to avoid leaking sensitive financial data while still providing useful operational context.

## Web App (`apps/web`) – tRPC Client & Infrastructure

- Finalize tRPC client typing and transport configuration – Update `src/utils/trpc.ts` to match the final `TransactionsRouter` shape and any path/URL decisions from the backend.
- Verify Next.js route proxy for tRPC is aligned with backend – Confirm `/transactions/[trpcFunc]/route.ts` correctly forwards all required methods and paths to the Fastify/tRPC server.

## Web App – UI for Core Flows

- Implement a basic UI to create income/expense transactions – Provide a single, simple form that creates transactions with the required fields and uses contracts-typed client calls.
- Implement a transaction list view with filters – Show transactions ordered by date with optional type, date range, and category filters wired to the `list` procedure.
- Implement a simple summary view for a date range – Display income total, expense total, and balance, with optional by-category breakdown if available.
- Add a basic delete interaction for transactions – Provide a way to hard-delete a transaction and reflect the result in the list and summary views.
- Surface generic validation and error feedback in the UI – Show lightweight, user-friendly messages for failed validations and backend errors without deep customization per error type.

## Cross-Cutting

- Ensure contracts, service, and web stay in sync on types – Establish a simple convention for when to rebuild/restart or bump versions so that all packages share consistent types/contracts.
