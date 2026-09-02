# BuyBuyIn Overview

This repository is an npm-workspaces monorepo split into three packages:

- `client/`: Single-page application built with React 19 + Vite + TailwindCSS.
- `server/`: REST API built with Express 5 + Prisma 7 (PostgreSQL).
- `shared/`: Auto-generated Prisma Client and Zod schemas, consumed by both `client/` and `server/`.

---

## How to Contribute?

1. You should first open the [» BuyBuyIn Kanban Board](https://github.com/users/Brenedict/projects/5).
2. To understand how to contribute, see [» CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow. Code style is enforced via the root `.prettierrc` and each package's ESLint config. Meaning you **SHOULD** have the `prettier code` extension in your text editor (e.g. Visual Studio Code).

---

## Prerequisites

Ensure you have the following installed locally on your machine before setup:

- **[Node.js](https://nodejs.org/)** (v24.x or higher)
- **[npm](https://www.npmjs.com/)** (comes bundled with Node.js)
- **[Git](https://git-scm.com/)**
- **[PostgreSQL](https://www.postgresql.org/download/)** — or **[Docker](https://www.docker.com/)** to run Postgres via the included `docker-compose.yml`

---

## Project Structure

**Frontend Developers Main Directory:**

```text
BuyBuyIn/
├── client/                             # React Frontend
│   ├── public/                         # Static files (favicon.svg, icons.svg, etc.)
│   ├── src/
│   │   ├── api/                        # API request helpers (calls backend endpoints)
│   │   ├── assets/                     # Images, fonts, etc.
│   │   ├── components/                 # Main components
│   │   ├── context/                    # React context providers
│   │   ├── hooks/                      # Custom hooks
│   │   ├── pages/                      # Pages (consists of multiple components)
│   │   ├── routes/                     # Client Routing (i.e. /page, /dashboard)
│   │   ├── stories/                    # Storybook stories
│   │   ├── TESTINGDATA/                # Mock data (for pre-backend integration)
│   │   ├── types/                      # Shared TS types
│   │   ├── utils/                      # Utility functions
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── routes.tsx
│   ├── .env.example
│   └── package.json
```

**Backend Developers Main Directory:**

```text
BuyBuyIn/
├── server/                             # Express Backend
│   ├── prisma/
│   │   ├── migrations/                 # Prisma migration history
│   │   └── schema.prisma               # Generates client into shared/prisma and zod into shared/zod
│   ├── src/
│   │   ├── config/                     # env.config.ts, prisma.config.ts
│   │   ├── controllers/                # Controllers
│   │   ├── middlewares/                # Middlewares
│   │   ├── models/
│   │   ├── routes/                     # Server Endpoints (i.e. /get-transactions)
│   │   ├── service/                    # Services
│   │   ├── utils/
│   │   └── server.ts                   # Entry point for the Express app
│   ├── tests/
│   │   ├── fixtures/                   # Mock data used in tests
│   │   └── integration/                # Multi-component / API endpoint tests
│   ├── .env.example
│   ├── jest.config.js / jest.unit.ts / jest.integration.ts
│   ├── prisma7.config.ts
│   └── package.json
```

**Shared Directories Used for Frontend and Backend**

```text
BuyBuyIn/
├── .github/                            # Issue templates and PR template (for documentation purposes)
├── shared/                             # Generated Prisma Client + Zod schemas (shared workspace)
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                  # For Docker Setup only (not required)
├── CONTRIBUTING.md                     # Branching, commit and PR conventions
├── .prettierrc
├── .gitignore
└── package.json                        # Root workspace (npm workspaces: client, server, shared)
```

---

## Installation & Initial Setup

### 1. Clone the Repository

```bash
# HTTPS
git clone https://github.com/Brenedict/BuyBuyIn.git
```

```bash
# SSH
git clone git@github.com:Brenedict/BuyBuyIn.git
```

Navigate into the root directory:

```bash
cd BuyBuyIn
```

---

### 2. Install Dependencies (Monorepo)

This project uses **npm workspaces**, so a single install at the root pulls in `client/`, `server/`, and `shared/` together:

```bash
npm install
```

---

### 3. Configure Environment Variables

#### `client/.env`

Copy `client/.env.example` into `client/.env`:

```bash
cp client/.env.example client/.env
```

`client/.env.example`:

```env
# Environment variables for the frontend application
# Always make sure to check if your .env file for client matches the .env.example file for client

# Default Salt for hashing
VITE_HASHIDS_SALT="salt"

# Backend URL
VITE_API_URL="http://localhost:3000/api/v1"
```

#### `server/.env`

Copy `server/.env.example` into `server/.env` and fill in the values:

```bash
cp server/.env.example server/.env
```

`server/.env.example`:

```env
# Node environment (development | test | production)
NODE_ENV=development

# Port the Express server listens on
PORT=3000

# URL of the client app, used for CORS
FRONTEND_URL="http://localhost:5173"

# PostgreSQL connection string used by Prisma
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# Separate PostgreSQL connection string used when NODE_ENV=test
TEST_DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb_test?schema=public"
```

> `docker-compose.yml` also reads `server/.env` for the Postgres container's credentials, so keep both in sync.

---

### 4. Start PostgreSQL (optional, via Docker)

If you don't have a local PostgreSQL instance, start one with Docker Compose:

```bash
docker compose up -d postgres
```

---

### 5. Generate the Prisma Client and Run Migrations

Prisma's client and Zod schemas are generated into the `shared/` workspace (`shared/prisma`, `shared/zod`), so run these from the root:

```bash
# Generate Prisma Client + Zod schemas
npm run gen:prisma

# Run database migrations
npm run mig:prisma
```

If you plan to run the integration tests, also migrate the test database:

```bash
NODE_ENV=test npm run mig:prisma
```

---

## Running the Application

### From the root (recommended)

```bash
# Frontend + backend together
npm run dev

# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Or per package

```bash
# server/
npm run dev

# client/
npm run dev
```

By default, the backend listens on `http://localhost:3000` (configurable via `PORT` in `server/.env`), and the frontend opens at `http://localhost:5173`.

---

## Available Scripts

### Root (`package.json`)

- `npm run dev`: Runs client and backend dev servers together.
- `npm run dev:client`: Runs only the client dev server.
- `npm run dev:server`: Runs only the backend dev server.
- `npm run test:server`: Runs the server's Jest test suite.
- `npm run gen:prisma`: Generates the Prisma Client and Zod schemas.
- `npm run mig:prisma`: Runs Prisma migrations (`prisma migrate dev`).
- `npm run res:prisma`: Resets the database (`prisma migrate reset`).
- `npm run seed:prisma`: Seeds the database.
- `npm run gensql:prisma`: Generates typed SQL (`prisma generate --sql`).
- `npm run create:prisma`: Creates a migration without applying it.
- `npm run studio:prisma`: Opens Prisma Studio.
- `npm run pull:prisma`: Pulls the schema from an existing database (`prisma db pull`).

### `server/`

- `npm run start`: Runs the server with `tsx --env-file=.env`.
- `npm run dev`: Runs the server with live reload and the Node inspector.
- `npm test`: Runs the Jest test suite (`jest --watch --runInBand`).
- Prisma scripts mirror the root-level ones above (they're what the root scripts delegate to via `-w server/`).

### `client/`

- `npm run dev`: Runs the React app in development mode (Vite) at `http://localhost:5173`.
- `npm run build`: Type-checks and bundles the app for production.
- `npm run lint`: Lints the client source with ESLint.
- `npm run preview`: Serves the production build locally.
