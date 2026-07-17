# CareerFlow Technical Plan

## 1. Product scope and principles

CareerFlow Version 1.0 is a privacy-conscious, single-user career management workspace for organizing applications, deadlines, statuses, resume versions, and job-search progress.

Architecture principles:

- Server Components by default; Client Components only for browser interaction.
- Validate untrusted input on the server with shared Zod schemas.
- Scope every user-data query and mutation with the authenticated user ID.
- Keep ownership values out of client-controlled input.
- Feature modules own their UI, actions, validation, persistence, and tests.
- Preserve accessible loading, empty, success, and safe error states.
- Keep secrets server-only and collect only the data required by the workflow.

Version 1.0 does not include resume uploads, document parsing, generated career content, external provider calls, notifications, or email automation.

## 2. Architecture

```text
src/
├── app/
│   ├── (auth)/                 # Sign-up and sign-in
│   ├── (dashboard)/            # Authenticated product routes
│   └── api/auth/               # Auth.js handler
├── components/
│   ├── layout/                 # Application shell and navigation
│   ├── marketing/              # Public landing page
│   └── ui/                     # Reusable accessible primitives
├── features/
│   ├── applications/
│   ├── auth/
│   ├── dashboard/
│   └── resumes/
├── schemas/                    # Shared Zod contracts
└── server/
    ├── applications/
    ├── auth/
    ├── dashboard/
    ├── db/
    └── resumes/
```

## 3. Data model decisions

### Identity

- Auth.js Credentials uses encrypted JWT sessions with a seven-day lifetime.
- Argon2id protects stored passwords.
- User ID and the `USER` role are retained in the encrypted token and typed session.

### Applications

- `JobApplication` belongs to one user.
- Statuses: `SAVED`, `APPLIED`, `INTERVIEW`, `OFFER`, and `REJECTED`.
- Search covers company and job title; status, salary availability, and deadline filters combine with `AND`.
- Salary values use `BigInt` ISO 4217 minor units. Precision comes from the Node.js runtime's `Intl`/CLDR metadata.
- `SAVED` records keep `dateApplied` null. Submitted or later statuses receive the current date when no explicit value exists.

### Resumes

- `Resume.name` is the shared user-owned resume-family name.
- `ResumeVersion.versionLabel` independently identifies a version in that family.
- Renaming `Resume.name` intentionally renames the family for every version.
- `JobApplication.resumeVersionId` records the version used for an opportunity.
- Deleting a version clears its application association rather than deleting the application.
- Version 1.0 stores metadata only; upload-specific columns remain nullable for future storage work.

### Dormant extensibility

The schema retains the existing `AiArtifact` model, related enums, and immutable migration history. This is unused internal extensibility, not Version 1.0 product scope. There is no route, navigation item, provider client, environment credential, or visible workflow for it. Removing stable historical tables offers little benefit and would create unnecessary migration risk.

## 4. Application routes

| Route                                | Responsibility                                  |
| ------------------------------------ | ----------------------------------------------- |
| `/`                                  | Public CareerFlow landing page                  |
| `/sign-up`                           | Secure account registration                     |
| `/sign-in`                           | Credentials sign-in and safe callback handling  |
| `/dashboard`                         | User-scoped metrics, deadlines, recent updates  |
| `/applications`                      | List, search, filters, edit/delete entry points |
| `/applications/new`                  | Create an application                           |
| `/applications/[applicationId]/edit` | Edit an application and resume association      |
| `/resumes`                           | Resume-family and version list                  |
| `/resumes/new`                       | Create resume-version metadata                  |
| `/resumes/[resumeId]/edit`           | Edit an owned resume version                    |
| `/api/health`                        | Generic PostgreSQL readiness check              |

## 5. Delivery status and release boundary

Completed:

- Foundation, design system, landing page, and application shell.
- PostgreSQL and Prisma foundation.
- Registration, credentials login, protected routes, and JWT sessions.
- Sign-out and production-safe shell controls.
- Application create, list, edit, delete, search, and filters.
- Dashboard overview, deadlines, conversion metric, and recent updates.
- Resume-family/version CRUD and application association.

Version 1.0 deliberately excludes settings, data export, account deletion, pagination, Kanban, notifications, and global search. Those capabilities must not appear as placeholder controls. Production deployment still requires the external operational controls listed in `PRODUCTION_CHECKLIST.md`, including backups, trusted proxy configuration, and shared or edge authentication rate limiting.

## 6. Security and privacy risks

| Risk                         | Control                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Cross-user data access       | Include `userId` in every predicate and verify with two-user tests      |
| Credential attacks           | Argon2id, generic errors, rate-limit boundaries, no credential logging  |
| Session theft                | Encrypted secure HTTP-only same-site cookie with finite expiration      |
| Open redirects               | Accept internal absolute callback paths only                            |
| Resume metadata leakage      | Server-session ownership checks; no public identifiers as authorization |
| Sensitive logs               | Do not log passwords, hashes, notes, or resume metadata                 |
| Excessive retention          | Define export, deletion, backup, and retention policy before release    |
| CSRF and XSS                 | Same-site cookies, trusted origins, render user content as text         |
| Supply-chain vulnerabilities | Lockfile, audit review, minimal dependencies, scheduled patching        |

## 7. Testing strategy

- Unit tests for validation, normalization, salary/date rules, filters, and metrics.
- Component tests for forms, errors, keyboard interaction, responsive presentations, and dialogs.
- PostgreSQL integration tests for ownership, ordering, associations, and relationship behavior.
- Playwright tests for registration, sign-in, application creation, resume management, and responsive navigation.
- CI gates: formatting, lint, typecheck, tests, production build, migration deployment, and focused browser coverage.

## 8. Post-Version 1.0 decisions

- Managed PostgreSQL and deployment platform.
- Data export format and account-deletion retention window.
- Pagination thresholds and whether Kanban belongs in a later release.
- Private object storage and scanning controls if uploads are added later.
- License for the public repository.
