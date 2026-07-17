# CareerFlow

CareerFlow is a privacy-conscious career management application that helps users organize job applications, track deadlines and statuses, manage resume versions, and understand job-search progress.

## Version 1.0 scope

- Secure account registration, credentials sign-in, and sign-out.
- A user-scoped dashboard with application metrics, status counts, interview conversion, deadlines, and recent updates.
- Job application creation, listing, editing, deletion, search, and filters.
- Resume-family and resume-version metadata management.
- Association of an owned resume version with an owned application.
- Responsive, accessible light and dark interfaces.

CareerFlow does not upload resume files or provide generated career content in Version 1.0. Every application and resume query is scoped to the authenticated user on the server; ownership is never accepted from the browser.

## Technology

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- PostgreSQL 17 and Prisma 7
- Auth.js 5 with encrypted JWT sessions
- Zod validation
- Vitest, Testing Library, and Playwright
- Docker Compose for local PostgreSQL
- ESLint and Prettier

## Current routes

| Route                                | Purpose                                       |
| ------------------------------------ | --------------------------------------------- |
| `/`                                  | Public CareerFlow landing page                |
| `/sign-up`                           | Account registration                          |
| `/sign-in`                           | Credentials login and safe redirects          |
| `/dashboard`                         | Metrics, recent updates, and deadlines        |
| `/applications`                      | User-scoped application list, search, filters |
| `/applications/new`                  | Create an application                         |
| `/applications/[applicationId]/edit` | Edit an owned application and resume link     |
| `/resumes`                           | Resume-family and version management          |
| `/resumes/new`                       | Create resume-version metadata                |
| `/resumes/[resumeId]/edit`           | Edit an owned resume version                  |
| `/api/auth/[...nextauth]`            | Auth.js route handler                         |
| `/api/health`                        | Generic database-readiness response           |

Authenticated product routes are protected at both the request proxy and server layout boundaries.

## Repository structure

```text
.
├── prisma/
│   ├── migrations/            # Immutable PostgreSQL migration history
│   └── schema.prisma          # Prisma data model
├── src/
│   ├── app/                   # App Router pages, layouts, and actions
│   ├── components/            # Shared layout, marketing, and UI components
│   ├── features/              # Feature-owned components and state
│   ├── generated/             # Generated Prisma client
│   ├── lib/                   # Shared constants and utilities
│   ├── schemas/               # Shared Zod contracts
│   └── server/                # Server-only auth and persistence logic
├── tests/e2e/                 # Playwright tests
├── docker-compose.yml
├── PLAN.md
└── DESIGN_SYSTEM.md
```

## Local setup

Requirements: Node.js 22+, npm 11+, and Docker Desktop or another PostgreSQL 17-compatible database.

1. Clone and enter the repository:

   ```bash
   git clone https://github.com/XonkelX/ai-career-tracker.git
   cd ai-career-tracker
   ```

2. Install dependencies and create local environment configuration:

   ```bash
   npm ci
   cp .env.example .env
   ```

   On PowerShell, use `Copy-Item .env.example .env`.

   Replace `AUTH_SECRET` with a random value. One option is:

   ```bash
   npx auth secret
   ```

3. Start PostgreSQL and apply migrations:

   ```bash
   docker compose up -d postgres
   npm run db:generate
   npm run db:migrate:deploy
   ```

4. Start CareerFlow:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

## Environment variables

| Variable       | Required | Purpose                                         |
| -------------- | -------- | ----------------------------------------------- |
| `DATABASE_URL` | Yes      | Server-only PostgreSQL connection string        |
| `AUTH_URL`     | Yes      | Canonical Auth.js application URL               |
| `AUTH_SECRET`  | Yes      | At least 32 random bytes for encrypted sessions |

Never commit real credentials. `.env.example` contains local-only placeholders. Production must use a secret manager, an HTTPS `AUTH_URL`, and a PostgreSQL URL configured for TLS according to the database provider.

## Production deployment

CareerFlow supports Node.js 22 or newer and npm 11 or newer. Deploy from the committed lockfile and migration history:

```bash
npm ci
npm run db:generate
npm run build
npm run db:migrate:deploy
npm run start
```

Apply `npm run db:migrate:deploy` once as a release step before directing traffic to the new application version. Do not run `prisma migrate dev` in production. The deployment platform must inject `DATABASE_URL`, `AUTH_URL`, and `AUTH_SECRET` at runtime.

For container deployment, build the standalone image with `docker build -t careerflow .`, inject the three required environment variables when starting the container, and run migrations from the checked-out release or a dedicated migration job before starting it. The image runs as a non-root user and does not contain local `.env` files.

`GET /api/health` performs a minimal `SELECT 1`. It returns only `{"status":"ok"}` or a generic `503` response, never connection details, and disables caching. Use it as a readiness check rather than a public diagnostics page.

Before launch, complete [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md). In particular, configure database backups, TLS, a least-privilege database role, trusted proxy headers, and shared or edge rate limiting for registration and login. The included in-memory limiter is only a process-local defense and is not sufficient by itself for horizontally scaled or serverless production.

## Data and privacy model

- Users own all applications, resumes, and resume versions.
- Reads and mutations include the authenticated `userId` in their predicates.
- `Resume.name` is the shared family name; `ResumeVersion.versionLabel` identifies an individual version.
- Applications may reference one resume version. Removing the association does not delete either record.
- Deleting a resume version clears application associations through `onDelete: SetNull`.
- Salary values use ISO 4217 minor units derived from the deployed Node.js `Intl`/CLDR metadata.
- Credentials are hashed with Argon2id. Auth.js stores encrypted JWT sessions in secure, HTTP-only cookies.

The schema still contains `AiArtifact` and related enum definitions from the original architecture. They are intentionally dormant extensibility: Version 1.0 has no corresponding navigation, route, provider integration, environment credential, or user-facing workflow. Migration history is not rewritten solely to remove unused tables.

## Quality gates

Run before submitting changes:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:generate
git diff --check
npm audit
```

Database-backed tests use a disposable PostgreSQL database with `RUN_DATABASE_TESTS=1`.

## License

No license has been selected. All rights are reserved until a license is added.
