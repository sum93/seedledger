# SeedLedger – v0 Architecture & Stack

## 1. Purpose

This document describes **how** SeedLedger v0 is structured and implemented: tech stack, service boundaries, and high-level module layout.  
Functional requirements (what the system does) are documented separately in `docs/seedledger-v0-functional-requirements.md`.

## 2. High-Level Architecture

- **Monorepo layout:**
  - `apps/web` – Next.js web application (App Router) for the UI.
  - `services/transactions` – Backend service for transaction management.
  - `packages/shared` – Shared code (types, Zod schemas, tRPC router types/utilities).
- **Service boundaries:**
  - `services/transactions` exposes a tRPC API for transaction operations.
  - `apps/web` consumes this tRPC API via a type-safe tRPC client and uses server-side rendering (SSR) features to act as a middleware layer between end users and the transaction service.

## 3. Backend Service: `services/transactions`

- **Runtime:** Node.js (>= 20) + TypeScript.
- **Server:** Fastify, responsible for:
  - Hosting the tRPC router.
  - Handling HTTP transport, logging, and middleware.
- **API layer:** tRPC only.
  - One `appRouter` composed of feature routers (v0: `transactionsRouter`).
- **Validation & types:** Zod.
  - Zod schemas defined in `packages/shared` for inputs/outputs.
  - Types inferred via `z.infer` and re-used in both backend and frontend.
  - Public schemas expose monetary fields (e.g. `amount`, `incomeTotal`, `expenseTotal`, `balance`) as decimal strings, mapped from integer minor-unit storage in the database.
  - In v0, `userId` and `currency` are not accepted as client inputs; the transaction service always sets `userId = "default"` and `currency = "HUF"` internally.
- **Persistence:**
  - SQLite database, accessed via Drizzle ORM.
  - `better-sqlite3` as the SQLite driver.
  - DB file path configured via env var
- **Responsibilities:**
  - Implement transaction creation, hard deletion, listing, and summary logic.
  - Enforce domain rules (e.g. positive amounts, valid transaction types, single user `userId = "default"`, single currency `HUF`, normalized categories).

## 4. Web App: `apps/web`

- **Framework:** Next.js (TypeScript, App Router).
- **API consumption:** tRPC client generated from the shared `AppRouter` type.
- **Responsibilities:**
  - Provide UI for logging income and expenses.
  - Display transaction lists and basic summaries.
  - Rely on shared Zod schemas and types for end-to-end type safety.

## 5. Shared Package: `packages/shared`

- **Purpose:** Provide a single source of truth for cross-cutting types and schemas.
- **Contents (v0):**
  - Zod schemas for domain entities and DTOs, e.g.:
    - `TransactionSchema`.
    - `CreateTransactionInputSchema`.
    - `ListTransactionsInputSchema`.
    - `SummaryInputSchema` / `SummaryResultSchema`.
    - `DeleteTransactionInputSchema`.
  - Types inferred from these schemas via `z.infer`.
  - tRPC router types (e.g. `AppRouter`) exported for use in `apps/web`.
- **Consumers:**
  - `services/transactions` for validation and domain typing.
  - `apps/web` for typed tRPC hooks and shared domain models.

## 6. tRPC API Surface (Conceptual)

All procedures are validated with Zod and derived types are shared through `packages/shared`.

- **Namespace:** `transactions` (v0)
  - `transactions.create`
    - Input: `type`, `amount`, optional `date`, `description`, `category`.
    - Output: created `Transaction`.
  - `transactions.delete`
    - Input: `id` of the transaction to delete.
    - Behavior: performs a hard delete. If the transaction is not found (either never existed or already deleted), returns a not-found (404-style) error; delete operations are not idempotent in v0.
    - Output: e.g. `{ success: true }` on successful deletion.
  - `transactions.list`
    - Input: filters: `from`, `to`, `type`, `category`. Both `from` and `to` are optional and, when present, are interpreted with day-level granularity in the `Europe/Budapest` timezone; omission of one side means that bound is unbounded. If both `from` and `to` are provided, they must satisfy `from <= to` (with equality representing a single day); invalid ranges must fail validation with a 400-level error. Category filter inputs are normalized (trim + lowercase) by the backend before comparison; empty or whitespace-only category filters are rejected.
    - Output: `{ items: Transaction[]; totalCount: number }` (always includes `totalCount`).
  - `transactions.summary`
    - Input: `from`, `to` (both optional, same semantics and validation rules as for `transactions.list`). Summaries must be computed over exactly the same set of transactions that would be returned by `transactions.list` with the same `from`/`to` filters.
    - Output: `{ incomeTotal: string; expenseTotal: string; balance: string; byCategory?: Array<{ category: string; incomeTotal: string; expenseTotal: string; balance: string }> }`, where all monetary fields are transmitted as decimal strings corresponding to the underlying integer minor-unit representation.

## 7. Non-Functional & Operational

- **Migrations:** Use Drizzle migrations; they must be idempotent and runnable on startup or as a separate step.
- **Configuration via env vars:** at minimum `PORT`, `NODE_ENV`, and `DATABASE_FILE` for the backend.
- **Logging:** Use Fastify’s logger (pretty logging in development). Application logs must not include financial data such as transaction amounts or descriptions; logs should contain only minimal metadata (e.g. operation type, success/failure, error codes, and non-sensitive identifiers).
- **Performance:** Efficient querying for basic filtering and summaries; no premature optimization beyond reasonable indexes. Summaries and counts should be computed using database-level aggregations rather than loading all transactions into memory.
- **Validation & errors:** All external inputs to tRPC procedures must be validated with Zod schemas. Validation failures must result in 400-level client errors rather than 500-level server errors.
- **Testing:**
  - Unit tests around domain and service logic (e.g. summary calculations, amount handling with integer storage and string transmission, date range filtering, category normalization).
  - Integration tests for tRPC procedures against a test DB, covering both successful flows and validation/error scenarios.
  - Testing is considered critical for v0 to ensure financial calculations, date handling, and validations behave as specified and remain stable as the system evolves.

## 8. Evolution & Mentoring

- Keep a clear separation between:
  - tRPC procedures (API surface).
  - Domain/services (business logic).
  - DB layer (Drizzle + SQLite).
  - Shared schemas/types (in `packages/shared`).
- Provide and maintain:
  - Clear procedure contracts (inputs/outputs) that frontend can rely on.
  - Simple contribution notes for a medior colleague.
- Natural extension points:
  - Additional services (e.g. `services/stocks`).
  - Enhanced reporting, budgets, recurring transactions.
  - Multi-user + authentication and authorization.
  - UI refinements and additional flows in Next.js.
