# AI Career Tracker

A production-oriented full-stack job application tracker with AI-powered resume analysis, cover-letter generation, interview preparation, and application management.

> **Project status:** Foundation only. The repository currently contains the application shell, placeholder routes, database design, test configuration, Docker tooling, and implementation plan. Authentication, persistence, uploads, and AI workflows are intentionally not implemented yet.

## Product goals

- Keep job applications organized in table and Kanban views.
- Track progress from saved opportunity through offer or rejection.
- Manage multiple resume versions and associate a version with an application.
- Compare supplied resume content with a supplied job description.
- Draft summaries, cover letters, and interview questions from user-provided facts.
- Give users clear control over sensitive career data and AI-generated drafts.

AI output must never invent skills, experience, education, or achievements. Generated content will be treated as a reviewable draft and linked to a snapshot of its source material.

## Technology

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- PostgreSQL 17 and Prisma 7
- Vitest, Testing Library, and Playwright
- Docker and Docker Compose
- ESLint and Prettier

Planned milestone dependencies include NextAuth, Zod, React Hook Form, and the OpenAI SDK. They are intentionally not installed until the milestone that uses them, which keeps the foundation's production dependency and audit surface small.

## Current routes

| Route                           | Purpose                                       | Current state        |
| ------------------------------- | --------------------------------------------- | -------------------- |
| `/`                             | Public landing page                           | Placeholder complete |
| `/sign-up`                      | Account registration                          | Placeholder only     |
| `/sign-in`                      | Account login                                 | Placeholder only     |
| `/dashboard`                    | Metrics, activity, deadlines                  | Placeholder only     |
| `/applications`                 | Application table and Kanban views            | Placeholder only     |
| `/applications/new`             | Create an application                         | Placeholder only     |
| `/applications/[applicationId]` | View and edit an application                  | Placeholder only     |
| `/resumes`                      | Resume and version management                 | Placeholder only     |
| `/ai-tools`                     | Resume, cover-letter, and interview tools     | Placeholder only     |
| `/settings`                     | Profile, theme, privacy, and account controls | Placeholder only     |

Protected routing is planned for the authentication milestone; dashboard routes are intentionally accessible in this preview.

## Repository structure

```text
.
├── prisma/
│   └── schema.prisma          # Reviewed data model; no migration yet
├── src/
│   ├── app/                   # App Router pages, layouts, and route groups
│   ├── components/            # Shared layout and UI components
│   ├── features/              # Feature-owned UI, actions, schemas, and tests
│   ├── generated/             # Generated Prisma client; ignored from formatting
│   ├── lib/                   # Framework-independent constants and utilities
│   ├── schemas/               # Shared Zod contracts
│   └── server/                # Server-only auth, database, AI, and storage code
├── tests/e2e/                 # Playwright end-to-end tests
├── Dockerfile
├── docker-compose.yml         # Local PostgreSQL service
├── PLAN.md                    # Architecture, schema, routes, risks, and milestones
├── playwright.config.ts
├── prisma.config.ts
└── vitest.config.ts
```

Feature folders are intentionally empty boundaries at this stage. Code should be colocated by feature as each milestone begins; shared code should move to `components`, `lib`, or `schemas` only when it has more than one consumer.

## Prerequisites

- Node.js 22 or newer
- npm 11 or newer
- Docker Desktop (recommended for local PostgreSQL)
- A PostgreSQL database if Docker is not used
- An OpenAI API key only when beginning the AI milestone

## Local setup

1. Clone and enter the repository:

   ```bash
   git clone https://github.com/XonkelX/ai-career-tracker.git
   cd ai-career-tracker
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

   On PowerShell, use `Copy-Item .env.example .env`.

4. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

5. Generate the Prisma client:

   ```bash
   npm run db:generate
   ```

   Client generation does not require a running database. Prisma migration and Studio commands do require `DATABASE_URL`.

   The schema is defined, but the initial migration is deliberately deferred until the data model is reviewed. When approved, create it with `npm run db:migrate -- --name init`.

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable              | Required           | Purpose                                   |
| --------------------- | ------------------ | ----------------------------------------- |
| `DATABASE_URL`        | For database work  | PostgreSQL connection string; server only |
| `NEXTAUTH_URL`        | For authentication | Canonical authentication callback URL     |
| `NEXTAUTH_SECRET`     | For authentication | Strong random session-signing secret      |
| `OPENAI_API_KEY`      | For AI features    | Server-only OpenAI credential             |
| `NEXT_PUBLIC_APP_URL` | Yes                | Public canonical application URL          |
| `RESUME_STORAGE_DIR`  | For local uploads  | Development-only resume storage directory |

Never commit `.env`, API keys, database credentials, resume content, or generated career documents. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and must not contain secrets.

## Development commands

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the Next.js development server    |
| `npm run build`        | Create a production build               |
| `npm run lint`         | Run ESLint with zero warnings allowed   |
| `npm run typecheck`    | Run strict TypeScript checking          |
| `npm run format`       | Format supported files                  |
| `npm run format:check` | Check formatting without changing files |
| `npm test`             | Run unit and component tests once       |
| `npm run test:watch`   | Run Vitest in watch mode                |
| `npm run test:e2e`     | Run Playwright tests                    |
| `npm run db:generate`  | Generate the Prisma client              |
| `npm run db:migrate`   | Create/apply a development migration    |
| `npm run db:studio`    | Open Prisma Studio                      |
| `npm run check`        | Run lint, typecheck, and unit tests     |

Install the Playwright browser once before the first end-to-end run:

```bash
npx playwright install chromium
```

## Docker

Start only PostgreSQL for normal local development:

```bash
docker compose up -d postgres
```

Build the production application image:

```bash
docker build -t ai-career-tracker .
```

The image uses Next.js standalone output and runs as a non-root user. Production secrets must be injected at runtime, never baked into the image.

## Data model summary

The initial Prisma schema defines:

- Auth-compatible `User`, `Account`, `Session`, and `VerificationToken` models.
- `JobApplication` with ownership, status, compensation range, dates, notes, job description, and an optional linked resume version. Compensation uses `BigInt` ISO 4217 minor units plus an explicit hourly, monthly, or annual period; values are gross unless the source says otherwise.
- `Resume` and immutable `ResumeVersion` records with storage metadata and content hashes.
- `AiArtifact` records containing the artifact type, model, source snapshot, structured output, and execution status.
- `Activity` records for dashboard history and audit-friendly user events.

See [PLAN.md](./PLAN.md) for the full design rationale and milestone sequence.

## Quality gates

Every feature should include:

- Server-side authorization and Zod validation.
- Explicit loading, empty, success, and error states.
- Accessible labels, keyboard operation, and visible focus treatment.
- Unit tests for meaningful business rules.
- End-to-end coverage for critical user journeys.
- A privacy review when handling resume content, job descriptions, or AI output.

The first required end-to-end journeys after implementation are registration/sign-in and job-application creation.

## Contributing

1. Read `PLAN.md` and choose one milestone-sized change.
2. Create a focused branch.
3. Keep route handlers thin and business rules in feature/server modules.
4. Run `npm run check` and relevant Playwright tests.
5. Document new environment variables and data-retention behavior.

## License

No license has been selected yet. All rights are reserved until a license is added.
