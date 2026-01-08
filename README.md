# SeedLedger

SeedLedger is a personal finance application composed of a web app,
a shared contracts package, and a transactions service.

## Workspaces

- `apps/web` – Next.js web frontend
- `packages/contracts` – shared Drizzle/Zod/TRPC schemas and validation
- `services/transactions` – Fastify-based transactions API using SQLite + Drizzle ORM

## Development

From the repo root, start all dev services with:

```bash
npm run dev
```

This runs three processes in parallel via `concurrently`:

- `apps/web`: Next.js dev server
- `services/transactions`: Fastify dev server
- `packages/contracts`: TypeScript watcher (`tsc -w`) that rebuilds the `dist`
  output whenever the contracts source (`src`) changes

Because the `contracts` package is watch-built, changes to shared schemas and
validation logic are automatically reflected in the running services without
needing a manual build.

## Development Environment

- Recommended editor: VS Code
- Install extensions:
  - ESLint (by Microsoft)
  - Prettier  Code formatter (by Prettier)
- Optional project settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Prettier formats code on save, ESLint surfaces issues in the editor and runs on
staged files via pre-commit hooks (Husky + lint-staged)

This repo targets Node 24 (see `.nvmrc`).
