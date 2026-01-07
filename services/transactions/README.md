# Transactions Service

The transactions service is a Fastify-based HTTP API that handles
transaction data for SeedLedger. It stores data in a local SQLite database
using `better-sqlite3` and Drizzle ORM, and shares its schema/validation
with the `packages/contracts` workspace.

## Running the service

In normal development, this service is started from the monorepo root via:

```bash
npm run dev
```

See the root `README.md` for details about the overall dev setup.

## Configuration

### Environment variables

| Name                   | Default             | Purpose                                        |
| ---------------------- | ------------------- | ---------------------------------------------- |
| `TRANSACTIONS_DB_FILE` | `db/transactions.db` | Path to the SQLite database file for this service. |

`TRANSACTIONS_DB_FILE` controls where the SQLite DB file is created. If it is
not set, the service falls back to `db/transactions.db` under
`services/transactions/db/` and creates the parent directory if needed.

The same path is also used by `drizzle.config.ts` so schema-aware tools connect
to the same database file.

## Database

- Uses SQLite via `better-sqlite3`.
- The database file path is taken from `TRANSACTIONS_DB_FILE` or defaults to
  `db/transactions.db` under this workspace.
- The service ensures the parent directory for the database file exists on
  startup.
- Table definitions are defined in the shared `contracts` package and
  re-exported via `src/db/schema.ts`.

## Testing

Dedicated tests for this service are not set up yet.

## Learn more

- Fastify: https://fastify.dev/docs/latest/
- Drizzle ORM: https://orm.drizzle.team/docs
