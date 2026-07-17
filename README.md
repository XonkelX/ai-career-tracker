# CareerFlow

CareerFlow is a privacy-conscious career management application that helps users organize job applications, track deadlines and statuses, manage resume versions, and understand job-search progress.

## Version 1.0 scope

- Secure account registration and credentials sign-in.
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
| `/settings`                          | Future account and preference controls        |
| `/api/auth/[...nextauth]`            | Auth.js route handler                         |

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

| Variable              | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `DATABASE_URL`        | Server-only PostgreSQL connection string      |
| `AUTH_URL`            | Canonical Auth.js application URL             |
| `AUTH_SECRET`         | Long random secret for encrypted JWT sessions |
| `NEXT_PUBLIC_APP_URL` | Public canonical application URL              |
| `RESUME_STORAGE_DIR`  | Reserved local path for a future upload flow  |

Never commit real credentials. `.env.example` contains placeholders only.

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
git diff --check
```

Database-backed tests use a disposable PostgreSQL database with `RUN_DATABASE_TESTS=1`.

## License

No license has been selected. All rights are reserved until a license is added.
