# SeedLedger – v0 Functional Requirements

## 1. Overview

SeedLedger is a personal finance tracker focused on daily use.  
Version 0 (v0) delivers a minimal but solid foundation for tracking income and expenses, with a separate backend service and web UI.

This document describes **what** v0 must do (features and domain), without prescribing **how** it is implemented.

## 2. Functional Scope

- **Primary goal:** Track where money comes from and where it goes.
- **In scope for v0:**
  - Log income entries.
  - Log expense entries.
  - List stored transactions with basic filters (date range, type, category).
  - Compute a simple summary (totals and balance for a given period).
  - Hard-delete an existing transaction.
- **Out of scope for v0 (future work):**
  - Authentication / multi-user support.
  - Updating existing transactions (editing type, amount, date, description, category).
  - Stocks, advanced reports, budgets, recurring transactions.
  - Pagination for transaction listings (`limit` / `offset`).
  - Multi-currency support and cross-currency aggregation.
  - Configurable decimal places and additional amount formatting options.
  - Notifications or reminders.

## 3. Domain Model (Single User)

### 3.1 Transaction

A **Transaction** represents one income or expense event for a single user.

Fields:

- `id`: primary key (integer or UUID).
- `userId`: string; in v0 this must always be the hardcoded value `"default"`.
- `type`: `"income"` or `"expense"`.
- `amount`: stored internally as a positive integer representing minor currency units (for `HUF`, the smallest unit). Over the wire (API and UI), amounts are transmitted as decimal strings (e.g. `"1234.00"`) with up to two decimal digits; incoming amount strings are trimmed for leading/trailing whitespace before validation and must match a simple decimal format (e.g. `^[0-9]+(\.[0-9]{1,2})?$`, no sign or thousands separators).
- `currency`: string; in v0 this must always be the hardcoded value `"HUF"`.
- `date`: ISO 8601 datetime with explicit offset (e.g. `2025-01-01T10:00:00+02:00`) when the transaction occurred.
- `description`: optional string.
- `category`: optional free-form string (e.g. `"rent"`, `"groceries"`) that is normalized on input by trimming whitespace and converting to lowercase before storage and use in filters/aggregations.
- `createdAt`: timestamp when the transaction record was first created.
- `updatedAt`: timestamp when the transaction record was last updated (initially equal to `createdAt`).

Future versions may support configurable decimal places for amounts beyond the current integer minor-unit representation.

## 4. Required Capabilities

### 4.1 Create Transactions

- The system must allow creating new transactions with:
  - Required: `type`, `amount`.
  - Optional: `date`, `description`, `category` (which may be omitted or empty; an omitted or empty `category` is treated as "no category" and will not be matchable via the `category` filter).
- If `date` is omitted, the system should default it to the current time.
- The system must reject transactions with:
  - Non-positive `amount`.
  - Invalid `type` (anything other than `"income"` or `"expense"`).

### 4.2 List Transactions

- The system must allow listing transactions with optional filters:
  - `from` / `to` (date range, both optional). If `from` is omitted, the lower bound is unbounded; if `to` is omitted, the upper bound is unbounded. Both `from` and `to` are interpreted with day-level granularity in the `Europe/Budapest` timezone.
  - `type` (`"income"` or `"expense"`).
  - `category` (normalized exact match as stored: trimmed, lowercase). Empty or whitespace-only category filter inputs must be rejected as invalid.
- Validation rules for date ranges:
  - If both `from` and `to` are provided, they must satisfy `from <= to`. If `from` equals `to`, the filter represents a single day.
- The result must:
  - Include all transactions matching the filters, ordered by date (newest-first by default).
  - Always include a `totalCount` representing the total number of matching transactions.

Pagination of transaction listings (using `limit` / `offset`) is not part of v0 but is expected in future versions.

### 4.3 Summarize Transactions

- The system must compute, for a given optional date range (using the same `from`/`to` semantics and validations as in **4.2 List Transactions**):
  - `incomeTotal`: sum of all income amounts.
  - `expenseTotal`: sum of all expense amounts.
  - `balance`: `incomeTotal - expenseTotal`.
- All monetary summary fields (`incomeTotal`, `expenseTotal`, `balance`, and any by-category monetary fields) are exposed via the API as decimal strings that correspond to the underlying integer minor-unit representation.
- It may also provide a **by-category** breakdown:
  - For each category, separate `incomeTotal`, `expenseTotal`, and `balance`, following the same string representation.

### 4.4 Delete Transactions

- The system must allow hard-deleting an existing transaction by its `id`.
- If a transaction with the given `id` exists, it must be permanently removed so that it no longer appears in listings or summaries.
- If a transaction with the given `id` does not exist (either because it was never created or was already deleted), the system must return a not-found error (404-style); delete operations are not idempotent in v0.

## 5. Constraints & Assumptions

- Single-user system in v0; all data is explicitly associated with a single hardcoded user identified by `userId = "default"`. In v0, `userId` is not provided by clients; it is always set by the transaction service.
- Single-currency system in v0; all transactions must use the hardcoded currency `HUF`. Summaries and balances are defined only within this single currency. Multi-currency support and cross-currency aggregation will be added in a future version. In v0, `currency` is not provided by clients; it is always set by the transaction service.
- Timezone handling: date/time values are stored and transmitted as ISO 8601 datetimes with explicit offsets. For filtering with `from`/`to`, the system interprets ranges with day-level granularity in the `Europe/Budapest` timezone. In v0 this timezone is hardcoded and not configurable.
