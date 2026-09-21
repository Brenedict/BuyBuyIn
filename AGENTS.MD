# AGENTS.md

npm-workspaces monorepo: `client/` (React 19 + Vite 8 + Tailwind 4 + MUI), `server/` (Express 5 + Prisma 7 + Jest), `shared/` (generated Prisma Client + Zod schemas). Run all npm scripts from the root.

## Setup (fresh checkout — order matters)

1. `npm install` at the root (single install covers all workspaces).
2. Copy `client/.env.example` → `client/.env` and `server/.env.example` → `server/.env`; fill real Postgres credentials. Special characters in the DB password must be percent-encoded in the connection string.
3. **Must run `npm run gen:prisma` before building/typechecking/running the server.** `shared/prisma` and `shared/zod` are generated output that is gitignored (`server/src/config/prisma.config.ts` imports `@buybuyin/shared/prisma/client`).
4. Create the database and run `npm run mig:prisma`. Start Postgres via `docker compose up -d postgres` if not installed locally (docker-compose reads `server/.env`; keep `POSTGRES_USER/PASSWORD/DB` in sync).

## Commands (root)

- `npm run dev` — client + server together; `dev:client` / `dev:server` individually (backend :3000, frontend :5173).
- Prisma: `mig:prisma` (migrate dev), `gen:prisma` (generate client + zod), `res:prisma` (reset), `seed:prisma`, `studio:prisma`, `gensql:prisma` (typed SQL), `create:prisma`, `pull:prisma`.
- Client: `npm run build -w client/` (runs `tsc -b && vite build`, i.e. the typecheck), `npm run lint -w client/`. Server has eslint config but no lint script (run `npx eslint` in `server/`).

## Testing

- `npm run test:server` runs `jest --watch --runInBand` — **watch mode, never exits on its own** (bad in CI/non-interactive shells). Run once from `server/` with `npx jest --runInBand`.
- Jest has two projects (`server/jest.config.js`): `unit` (`tests/unit/**/*.test.ts`, Prisma mocked via `server/jest.unit.ts`) and `integration` (`tests/integration/**/*.test.ts`, real Prisma + Passport, 30s timeout, needs test DB migrated first).
- `server/src/config/prisma.config.ts` uses `TEST_DATABASE_URL` when `NODE_ENV=test`. For integration tests, migrate the test DB: `NODE_ENV=test npm run mig:prisma` — **but note** `server/prisma7.config.ts` (auto-loaded by Prisma) pins its datasource to `DATABASE_URL`, so the test-DB migrate may actually target the dev DB.
- There are currently no test files (`server/tests/*` only contain `.gitkeep`); add tests under `tests/unit/` or `tests/integration/`.
- Client has no `test` script; component tests run through Storybook's vitest + Playwright browser addon (`client/vite.config.ts`).

## Prisma / generated code

- `server/prisma/schema.prisma` is the single source of truth. Generators emit to `../../shared/prisma` and `../../shared/zod` (gitignored).
- Zod schemas are customized with `/// @zod...` doc comments on model fields (`prisma-zod-generator`). Schema also uses `previewFeatures = ["typedSql"]`.
- When you change the schema, run `npm run gen:prisma` (and `npm run mig:prisma` for migrations).

## Conventions

- **Branch format:** `<type>/#<issue-number>-<short-description>`, e.g. `feat/#42-user-authentication`. Never push to `main`; PR base is `development`. Commit style: `type(scope): description`.
- Work is tracked on the GitHub project board (Backlog → Todo → In Progress → In Review → Done); pick only Todo items and assign yourself. See `CONTRIBUTING.md`.
- Formatting is enforced via root `.prettierrc`: **4-space indent, printWidth 120, semicolons, double quotes** (differs from Prettier defaults — rely on the Prettier editor extension).
- Client pages live under `client/src/pages/<role>/` (`branch-manager`, `cashier`, `hq-admin`, `super-admin`, `shared`) with `<Role>.<Page>.tsx` names; routes are wired in `client/src/routes/ProtectedRoutes.tsx`. Shared design-system classes/types are centralized in `client/src/types/common.ts`.
