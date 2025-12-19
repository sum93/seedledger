# AGENTS guidelines for this repo

1. Prefer Node + TypeScript; if `package.json` exists, use `npm run build`, `npm run lint`, and `npm test` as the default build/lint/test commands.
2. To run a single Jest test file, use `npm test -- --runTestsByPath path/to/file.test.(ts|tsx|js)`; for Vitest, prefer `npx vitest path/to/file.test.ts`.
3. Before introducing new commands, inspect existing scripts in `package.json` and reuse them instead of adding redundant ones.
4. Do not add new build systems or CLIs unless the user explicitly asks; extend the existing tooling in a minimal way.
5. Use ES module-style imports; keep third-party imports above internal imports, and within each group sort imports alphabetically by module path.
6. Prefer absolute or path-alias imports for cross-module usage and relative imports (`./`, `../`) only within the same feature folder.
7. Follow a Prettier-style format: 2-space indentation, single quotes in JS/TS, trailing commas where valid, and semicolons enabled.
8. Treat TypeScript as strict: avoid `any`, `unknown` without narrowing, and prefer explicit return types for exported functions and public methods.
9. Use `camelCase` for variables/functions, `PascalCase` for types/classes/components, and `UPPER_SNAKE_CASE` for constants and environment variable names.
10. Name files using `kebab-case` or `camelCase` for utilities and `PascalCase` for React components if present; keep one major export per file.
11. Centralize domain logic in services/use-cases instead of scattering it across controllers, routes, or UI components.
12. For error handling, never silently swallow errors; either rethrow typed errors, return structured error objects, or map to appropriate HTTP status codes (4xx for client issues, 5xx for server issues).
13. Use `try/catch` at the edges (request handlers, job runners, CLI commands) and keep core domain functions mostly exception-free and deterministic.
14. Propagate errors with context (message + minimal metadata) but avoid logging or storing secrets, tokens, or personal data in error messages.
15. When adding tests, mirror the existing test framework (Jest, Vitest, etc.); place unit tests next to the implementation or under a matching `__tests__`/`tests` directory.
16. Prefer fast, focused tests; when debugging, run a single test or test file via the framework’s built-in filtering flags (e.g., `-t` for Jest).
17. Before large refactors, preserve public APIs and typings where possible; if a breaking change is unavoidable, clearly explain it in your final message.
18. Do not introduce new dependencies if the same functionality exists in the repo; if a new dependency is necessary, pick well-maintained, mainstream packages.
19. Respect any future Cursor or Copilot instruction files (e.g., `.cursor/rules/*`, `.github/copilot-instructions.md`) and incorporate their rules into your behavior.
20. Keep changes minimal, focused on the user’s request, and aligned with the existing project structure and conventions you observe in this repository.