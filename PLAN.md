# AI Career Tracker Technical Plan

## 1. Scope and principles

Build a secure, maintainable job-search workspace in small, reviewable milestones. The first release will support individual users, application tracking, resume version metadata, and carefully grounded AI assistance.

Architecture principles:

- Server Components by default; Client Components only for browser interaction.
- Server Actions or route handlers validate all untrusted input with Zod.
- Every database query that touches user data is scoped by the authenticated user ID.
- Feature modules own their UI, actions, validation, queries, and tests.
- AI output is a draft, never silently persisted over user-authored content.
- AI prompts receive the minimum necessary data and must distinguish supplied facts from requested transformations.
- External effects—uploads, AI calls, email—sit behind typed server-only interfaces.

Non-goals for the foundation milestone:

- No authentication flow or protected-route middleware.
- No database migration or database access layer.
- No resume file upload or text extraction.
- No OpenAI requests or prompt implementation.
- No application CRUD behavior.

## 2. Proposed folder structure

```text
src/
├── app/
│   ├── (auth)/                 # Sign-in and sign-up screens
│   ├── (dashboard)/            # Future authenticated product routes
│   ├── api/                    # Webhooks and endpoints that cannot use actions
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/                 # App shell and navigation
│   └── ui/                     # Reusable accessible primitives
├── features/
│   ├── applications/           # Forms, queries, actions, Kanban/table UI
│   ├── auth/                   # Auth forms and account workflows
│   ├── dashboard/              # Metrics and recent activity
│   ├── resumes/                # Resume/version workflows
│   └── ai/                     # Grounded analysis and generation workflows
├── generated/prisma/           # Generated client, never hand-edited
├── lib/                        # Shared framework-independent utilities
├── schemas/                    # Cross-feature Zod schemas
└── server/
    ├── ai/                     # OpenAI client, prompts, policies, telemetry
    ├── auth/                   # Auth configuration and authorization helpers
    ├── db/                     # Prisma singleton and transaction helpers
    └── storage/                # Private resume object-storage abstraction
```

Within a mature feature, prefer `components/`, `actions/`, `queries/`, `schemas/`, and `*.test.ts` colocated under the feature rather than broad global folders.

## 3. Database schema

The schema is defined in `prisma/schema.prisma`; the initial migration waits for review.

### Identity

- `User`: unique normalized email, optional profile data, optional password hash for credentials, timestamps.
- `Account`, `Session`, `VerificationToken`: NextAuth-compatible provider and session records.
- Passwords, if credentials authentication is selected, use a memory-hard password hash and never appear in logs or application responses.

### Applications

- `JobApplication`: belongs to a user and stores company, title, location, URL, job description, salary range/currency, status, date applied, deadline, and notes.
- Allowed states: `SAVED`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`.
- Indexes support status boards, date sorting, and upcoming-deadline queries per user.
- Salary is represented as integer minor/whole currency units after the product decides its display convention; validation must require min ≤ max.

### Resumes

- `Resume`: user-owned logical document with a human-readable name.
- `ResumeVersion`: immutable file metadata for each upload, including storage key, MIME type, byte size, content hash, optional extracted text, and version number.
- `JobApplication.resumeVersionId` records the exact resume version used for an application.
- File bytes belong in private object storage, not PostgreSQL; the storage key must never be a public URL.

### AI and activity

- `AiArtifact`: user-owned record for resume analysis, professional summary, cover letter, or interview questions.
- `sourceSnapshot` records the exact user-provided facts and job content used. `output` remains structured JSON for validation and rendering.
- `Activity`: append-oriented events for recent activity and status history.
- AI requests should store model identifiers and stable error codes, but not provider secrets or unnecessary raw telemetry.

### Data integrity rules

- Cascade user deletion through owned records; treat account deletion as a deliberate, re-authenticated operation.
- Use transactions for application updates that also append activity.
- Enforce ownership in query predicates, not only after fetching.
- Add optimistic concurrency or updated-at checks before enabling simultaneous edits.

## 4. Main application routes

| Route                           | Rendering and responsibility                                                     |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `/`                             | Public product landing page                                                      |
| `/sign-up`                      | Registration form and verification guidance                                      |
| `/sign-in`                      | Credentials/provider sign-in and safe callback handling                          |
| `/dashboard`                    | Aggregated counts, status breakdown, conversion rate, recent activity, deadlines |
| `/applications`                 | Searchable/filterable table and Kanban board                                     |
| `/applications/new`             | Create form with optional resume association                                     |
| `/applications/[applicationId]` | Detail, edit, status history, resume link, AI actions                            |
| `/resumes`                      | Resume list and version management                                               |
| `/resumes/[resumeId]`           | Version history, metadata, associations, deletion controls                       |
| `/ai-tools`                     | Entry point for grounded AI workflows                                            |
| `/settings`                     | Profile, appearance, privacy, export, account deletion                           |
| `/api/auth/[...nextauth]`       | NextAuth route handler                                                           |
| `/api/health`                   | Minimal deployment health endpoint without sensitive details                     |

Dashboard and API routes require authentication except the health endpoint. Prefer Server Actions for first-party form mutations; use route handlers for authentication, webhooks, health checks, and future external clients.

## 5. Milestones

### Milestone 0 — Foundation (this change)

- Create the Next.js App Router project with strict TypeScript and Tailwind.
- Add formatting, linting, unit-test, E2E-test, Prisma, and Docker tooling.
- Define the proposed Prisma schema without migrating it.
- Create feature/server boundaries and placeholder routes.
- Document setup, architecture, risks, and delivery sequence.

Exit: lint, typecheck, unit tests, and production build pass; no auth or database behavior exists.

### Milestone 1 — Database and application service boundaries

- Review the schema and generate the initial migration.
- Add the server-only Prisma singleton and test database strategy.
- Add shared IDs, pagination contracts, and Zod schemas.
- Add health checks that verify process health without exposing configuration.

### Milestone 2 — Authentication and authorization

- Choose credentials, OAuth, or both; document the threat model.
- Implement NextAuth configuration, sign-up/sign-in/sign-out, session rotation, and protected layouts.
- Add rate limits for registration and login.
- Add E2E tests for successful and failed authentication plus redirect safety.

### Milestone 3 — Job application CRUD

- Implement create, read, update, delete, status changes, and activity events.
- Add accessible forms with React Hook Form and shared Zod schemas.
- Add table search/filter/sort first, then Kanban interactions.
- Add unit tests for status, salary, dates, ownership, and conversion-rate rules.
- Add the required application-creation E2E journey.

### Milestone 4 — Resume versions and private storage

- Implement storage abstraction, signed upload/download, MIME sniffing, size limits, malware-scanning hook, and content hashing.
- Add immutable resume versions and application association.
- Define retention and secure deletion behavior before production upload access.

### Milestone 5 — Dashboard analytics

- Implement user-scoped aggregates, status breakdown, recent activity, deadlines, and interview conversion.
- Document exact metric definitions and edge cases.

### Milestone 6 — Grounded AI workflows

- Add the server-only OpenAI client with timeouts, retries, budgets, and structured outputs.
- Implement resume/job comparison and missing-keyword evidence.
- Add summary, cover-letter, and interview-question drafts.
- Require source-grounded claims, flag unsupported suggestions, and present editable drafts.
- Add prompt-injection defenses for uploaded and pasted job content.

### Milestone 7 — Product polish

- Add persisted theme preference, responsive Kanban behavior, toasts, skeletons, empty states, and recoverable error boundaries.
- Complete keyboard and screen-reader review.
- Add export and account-deletion workflows.

### Milestone 8 — Production readiness

- Add CI quality gates, deployment configuration, observability, backups, restore test, migrations, and rollback plan.
- Run dependency, container, authorization, privacy, and accessibility reviews.
- Establish data retention, incident response, support, and model-change procedures.

## 6. Security and privacy risks

| Risk                             | Planned control                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Cross-user data access (IDOR)    | Include `userId` in every read/write predicate; test with two users; never trust route IDs alone                   |
| Session theft or fixation        | Secure, HTTP-only, same-site cookies; rotated sessions; re-authentication for destructive actions                  |
| Credential attacks               | Strong hashes, generic errors, rate limits, breached-password policy, optional verified OAuth                      |
| OAuth provider token exposure    | Minimize scopes and retention; encrypt stored refresh/access tokens or avoid persistence when the provider permits |
| Resume leakage                   | Private storage, short-lived signed URLs, encryption, strict ownership checks, no public buckets                   |
| Malicious uploads                | MIME sniffing, extension allowlist, size limits, quarantine/scanning, random storage keys                          |
| Prompt injection in resumes/jobs | Treat documents as untrusted data, isolate instructions, use structured outputs, validate claims against sources   |
| AI fabrication                   | Explicit grounding policy, source snapshots, unsupported-claim detection, user review before use                   |
| Secret exposure                  | Server-only clients, environment injection, secret scanning, log redaction, no `NEXT_PUBLIC_` secrets              |
| Sensitive logs/telemetry         | Structured allowlisted events; exclude resume text, job notes, generated drafts, tokens, and credentials           |
| Excessive retention              | User-visible deletion/export, documented retention periods, deletion propagation to storage and AI artifacts       |
| CSRF/open redirects              | Same-site cookies, origin checks for mutations, allowlisted callback paths                                         |
| XSS from user/AI content         | Render as text by default; sanitize any approved rich text; strict Content Security Policy                         |
| Cost abuse                       | Per-user quotas, request-size caps, model allowlist, timeouts, rate limits, usage monitoring                       |
| Supply-chain vulnerabilities     | Lockfile, automated dependency review, minimal images, non-root runtime, scheduled patching                        |

Privacy decisions required before AI implementation:

- Whether resume/job content may be retained by any AI provider and for how long.
- Whether users must opt in separately before sending personal data to AI.
- Which regions and subprocessors are acceptable for target users.
- How exports and deletion requests cover database, object storage, logs, backups, and AI artifacts.

## 7. Testing strategy

- Unit tests: pure status rules, salary/date validation, analytics definitions, prompt-grounding validators.
- Component tests: accessible forms, errors, filters, board interactions, AI draft review.
- Integration tests: Prisma queries against isolated PostgreSQL, ownership, transactions, storage adapters.
- E2E tests: authentication, application creation, status update, resume association, AI draft review.
- Security tests: two-user isolation, unsafe redirects, upload bypasses, prompt injection, rate limits.

CI should run formatting checks, lint, typecheck, unit/component tests, production build, and a focused Playwright suite. Database integration tests should use an ephemeral PostgreSQL service.

## 8. Open decisions

- Credentials, OAuth, or both for the first authentication release.
- Managed PostgreSQL and deployment platform.
- Private object-storage provider and malware-scanning service.
- Resume text extraction method and supported file types.
- AI model allowlist, data-processing terms, retention policy, quotas, and cost ceilings.
- Salary storage convention and multi-currency reporting behavior.
- License for the public repository.
