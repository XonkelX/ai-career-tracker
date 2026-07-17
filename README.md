# CareerFlow

**A privacy-conscious career-management platform for organizing applications, deadlines, progress, and resume versions.**

[Live demo](https://careerflow-snowy.vercel.app) · [Source code](https://github.com/XonkelX/ai-career-tracker) · [v1.0.0 release](https://github.com/XonkelX/ai-career-tracker/releases/tag/v1.0.0)

![CareerFlow dashboard showing application metrics, status progress, upcoming deadlines, and recent activity](docs/assets/screenshots/careerflow-dashboard-desktop.png)

## Product overview

Job searches create a growing mix of opportunities, deadlines, status changes, and tailored resumes. CareerFlow brings that work into one focused, account-scoped workspace. Users can follow every application from saved opportunity to final decision, see what needs attention, and record which resume version supports each application.

The production portfolio deployment runs on Vercel and Neon. It is designed for clear workflows, responsive use, and server-enforced ownership boundaries—not fabricated trends or decorative metrics.

## Core features

### Application management

- Create, review, edit, and delete job applications.
- Track company, role, location, compensation, status, deadline, notes, and application date.
- Move opportunities through Saved, Applied, Interview, Offer, and Rejected states.

### Search and organization

- Search company names and job titles on the server.
- Combine status, salary-availability, and deadline filters.
- Keep filter state in the URL for refreshable, shareable views.
- Order upcoming deadlines first while keeping undated records useful.

### Dashboard insights

- Review total and per-status application counts.
- Measure interview conversion using a documented, stable definition.
- See up to five upcoming deadlines and five recently updated applications.
- Start from a useful empty state without fabricated activity.

### Resume management

- Organize resume families and independently labeled versions.
- Store source-filename metadata, descriptions, and notes without uploading private files.
- Associate an owned resume version with an owned application and safely detach it later.

### Authentication and privacy

- Register with an Argon2id-hashed password and sign in through Auth.js credentials.
- Use encrypted, secure, HTTP-only JWT session cookies with a finite lifetime.
- Protect product routes at request and server-layout boundaries.
- Scope reads and mutations to the authenticated user ID; ownership never comes from the browser.

### User experience and accessibility

- Use responsive desktop, tablet, and mobile layouts.
- Switch between dark and light themes with synchronized browser metadata.
- Navigate labeled forms, dialogs, tabs, and mobile navigation by keyboard.
- Receive focused validation summaries, visible focus indicators, safe errors, and clear empty states.

## Visual product tour

### Applications stay searchable and actionable

![CareerFlow applications list with search, combined filters, multiple statuses, salaries, and deadlines](docs/assets/screenshots/careerflow-applications-desktop.png)

Server-side search and filters preserve the same ownership predicate and deadline-aware ordering as the complete list.

### Structured application details

![CareerFlow new-application form filled with fictional portfolio data](docs/assets/screenshots/careerflow-application-form.png)

The reusable form validates on the server, normalizes URLs, preserves date rules, and stores monetary amounts in currency minor units.

### Resume families and versions

![CareerFlow resume library showing a shared resume family with independently labeled versions](docs/assets/screenshots/careerflow-resumes-desktop.png)

Resume family names are shared intentionally, while each version retains its own label and application associations.

### Mobile workspace

| Responsive dashboard                                                                                                                       | Accessible navigation drawer                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="docs/assets/screenshots/careerflow-dashboard-mobile.png" alt="CareerFlow dashboard at a 375 by 812 mobile viewport" width="375"> | <img src="docs/assets/screenshots/careerflow-navigation-mobile.png" alt="CareerFlow mobile navigation drawer with labeled destinations and sign-out control" width="375"> |

### 105-second product demo

[![CareerFlow v1.0 product demo title frame](docs/assets/video/careerflow-video-poster.png)](https://github.com/XonkelX/ai-career-tracker/releases/tag/v1.0.0)

The silent, recruiter-focused walkthrough is rendered locally from the isolated [Remotion workspace](video/README.md). Select the poster to open the release and its downloadable H.264 video.

## Technology stack

| Area                          | Technology                                                         |
| ----------------------------- | ------------------------------------------------------------------ |
| Frontend                      | Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4 |
| Backend                       | Server Components, Server Actions, route handlers, Zod validation  |
| Database                      | PostgreSQL 17, Prisma 7, `pg`, Prisma PostgreSQL adapter           |
| Authentication                | Auth.js 5 credentials provider, encrypted JWT sessions, Argon2id   |
| Validation and testing        | Vitest, Testing Library, Playwright, ESLint, Prettier              |
| Deployment and infrastructure | Vercel Hobby, Neon Free, Docker Compose for local PostgreSQL       |

## Architecture

```mermaid
flowchart LR
    Browser[Browser]

    subgraph Vercel[Next.js application on Vercel]
        Pages[Server Components and layouts]
        Actions[Server Actions]
        AuthRoute[Auth route handler]
        Health[Health route handler]
        Auth[Auth.js credentials and JWT sessions]
        Validation[Zod validation]
    end

    Prisma[Prisma Client]
    Neon[(PostgreSQL on Neon)]

    Browser -->|HTTPS navigation| Pages
    Browser -->|Forms and mutations| Actions
    Browser -->|Auth requests| AuthRoute
    Browser -->|Readiness requests| Health
    Pages --> Auth
    Actions --> Auth
    AuthRoute --> Auth
    Actions --> Validation
    Pages --> Prisma
    Actions --> Prisma
    Auth --> Prisma
    Health --> Prisma
    Prisma -->|TLS connection| Neon
```

Server Components load user-scoped views. Server Actions own validated mutations. Route handlers expose only Auth.js and a generic database-readiness response; there is no separate public application API.

## Data model

```mermaid
erDiagram
    USER ||--o{ JOB_APPLICATION : owns
    USER ||--o{ RESUME : owns
    RESUME ||--|{ RESUME_VERSION : contains
    RESUME_VERSION o|--o{ JOB_APPLICATION : "is associated with"

    USER {
        string id PK
        string email UK
        string passwordHash
        enum role
    }

    JOB_APPLICATION {
        string id PK
        string userId FK
        string companyName
        string jobTitle
        enum status
        bigint salaryMinMinor
        bigint salaryMaxMinor
        datetime deadline
        string resumeVersionId FK
    }

    RESUME {
        string id PK
        string userId FK
        string name
    }

    RESUME_VERSION {
        string id PK
        string resumeId FK
        int version
        string versionLabel
        string sourceFileName
    }
```

This recruiter-facing diagram focuses on the entities used by the v1.0 product rather than every internal table in the immutable migration history. Field names and relationship behavior match `prisma/schema.prisma`.

## Security and ownership model

- Authentication state is derived on the server; user IDs are never accepted from client form data or URL parameters.
- Application and resume operations include both the record ID and authenticated user ID in their ownership checks.
- Missing and unowned records produce equivalent safe outcomes.
- Passwords are validated server-side, hashed with Argon2id, and never returned from user queries.
- Login and registration return generic account-sensitive errors and include process-local rate-limit boundaries.
- Callback URLs accept internal paths only, preventing external redirects.
- Secrets remain server-only and are represented by placeholders in `.env.example`.

The portfolio release has been tested for ownership isolation, but it is not presented as a security certification or a commercial service with an SLA.

## Accessibility and responsive design

CareerFlow uses semantic landmarks, headings, tables, lists, labels, status text, and native form controls. Interactive components include visible focus states, connected field errors, accessible names, keyboard navigation, Escape handling, focus trapping, and focus restoration where appropriate. The application shell becomes a managed mobile drawer without page-level horizontal scrolling. Motion is restrained and responds to reduced-motion preferences.

## Testing and quality assurance

The v1.0 release-readiness validation recorded **179 passing tests** across unit, component, integration, and database-backed coverage. Key areas include validation and normalization, authentication, callback safety, ownership isolation, application CRUD, search and filters, dashboard metrics, resume-family behavior, associations, accessible dialogs, themes, and responsive navigation.

Run the local quality gates with:

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

Playwright coverage is available through `npm run test:e2e`. Database-backed tests require a disposable PostgreSQL database and `RUN_DATABASE_TESTS=1`.

## Local development

### Requirements

- Node.js `22.x`
- npm `11.x` or newer
- Docker Desktop, Docker Engine with Compose, or another PostgreSQL 17-compatible database

### Setup

```bash
git clone https://github.com/XonkelX/ai-career-tracker.git
cd ai-career-tracker
npm ci
cp .env.example .env
docker compose up -d postgres
npm run db:generate
npm run db:migrate:deploy
npm run dev
```

On PowerShell, replace the copy command with `Copy-Item .env.example .env`. Open `http://localhost:3000` after the development server starts.

Use `npm run db:migrate` only while authoring a new development migration. Apply committed migrations with `npm run db:migrate:deploy` in validation and production workflows.

## Environment variables

| Variable       | Required | Example purpose                                           |
| -------------- | -------- | --------------------------------------------------------- |
| `DATABASE_URL` | Yes      | Server-only PostgreSQL connection string                  |
| `AUTH_SECRET`  | Yes      | Random secret of at least 32 bytes for encrypted sessions |
| `AUTH_URL`     | Yes      | Canonical application origin                              |

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_URL="http://localhost:3000"
```

Never commit real values. Production variables belong in the deployment platform's encrypted environment settings.

## Database setup and migrations

The local Docker Compose service provides PostgreSQL for development. Prisma Client is generated into `src/generated/prisma`, and committed migrations remain immutable.

```bash
docker compose up -d postgres
npm run db:generate
npm run db:migrate:deploy
```

Production releases must run `npm run db:migrate:deploy` against the target database before directing traffic to the new application version. Do not run `prisma migrate dev` in production.

## Production deployment

The public portfolio instance uses [Vercel Hobby](https://vercel.com) for the Next.js application and [Neon Free](https://neon.tech) for PostgreSQL. The supported build/runtime baseline is Node.js 22 with the committed npm lockfile.

```bash
npm ci
npm run db:generate
npm run build
npm run db:migrate:deploy
npm run start
```

`GET /api/health` performs a minimal database-readiness query and returns only a generic success or unavailable response. Complete [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before directing public traffic to another deployment.

## Project structure

```text
.
├── docs/
│   ├── assets/                 # Portfolio screenshots and video assets
│   └── releases/               # Public release notes
├── prisma/
│   ├── migrations/             # Immutable PostgreSQL migration history
│   └── schema.prisma           # Prisma data model
├── src/
│   ├── app/                    # App Router pages, layouts, actions, handlers
│   ├── components/             # Shared layout, marketing, and UI components
│   ├── features/               # Application, auth, dashboard, resume features
│   ├── schemas/                # Shared Zod contracts
│   └── server/                 # Server-only auth and persistence logic
├── tests/e2e/                  # Playwright journeys
├── video/                      # Isolated Remotion portfolio demo
├── DESIGN_SYSTEM.md
├── PLAN.md
└── PRODUCTION_CHECKLIST.md
```

## Engineering decisions

- **JWT sessions:** Credentials-based Auth.js uses encrypted JWT sessions with a seven-day lifetime while Prisma remains the source of user and product data.
- **Ownership isolation:** Every user-data operation derives `userId` from the authenticated session and applies it server-side.
- **UTC dates:** Version 1.0 uses a documented UTC convention for deadlines and application dates.
- **Minor currency units:** Monetary values are stored as `BigInt` ISO 4217 minor units using the deployed Node.js runtime's `Intl`/CLDR currency metadata.
- **Resume families:** `Resume.name` is shared by a family; each `ResumeVersion.versionLabel` remains independently editable.
- **Stable migrations:** Released migration history is retained instead of being rewritten for presentation changes.
- **Free-tier infrastructure:** Vercel Hobby and Neon Free keep the portfolio deployment cost-free within provider quotas.

## Known operational limitations

- Vercel Hobby and Neon Free quotas apply; Neon may scale to zero during inactivity, delaying the first request.
- Registration and login rate limiting is process-local and should be replaced with shared or edge enforcement before higher-volume use.
- Resume records store metadata only; CareerFlow v1.0 does not upload or parse resume files.
- The deployment is a portfolio release, not a commercial service with uptime or support guarantees.
- Backup, restore, retention, privacy-notice, and account-deletion operations require deployment-owner procedures beyond the application repository.

## Roadmap and future considerations

Potential future work includes shared authentication rate limiting, user-controlled export and deletion, pagination thresholds, and carefully scoped private file storage. These are not commitments and are intentionally outside the v1.0 release.

## License and usage

No license has been selected. All rights are reserved until the repository owner publishes an explicit license.

## Author

Built and maintained by [XonkelX](https://github.com/XonkelX). Only intentionally public repository information is listed here.
