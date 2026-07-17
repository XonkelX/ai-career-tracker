# CareerFlow Version 1.0 Production Checklist

Complete every required item before directing public traffic to CareerFlow.

## Platform and secrets

- [ ] Run Node.js 22+ and npm 11+ from the committed `package-lock.json`.
- [ ] Store `DATABASE_URL`, `AUTH_URL`, and `AUTH_SECRET` in the platform secret manager.
- [ ] Generate `AUTH_SECRET` from at least 32 random bytes and never reuse the example value.
- [ ] Set `AUTH_URL` to the final HTTPS origin with no untrusted alternate host.
- [ ] Terminate TLS at the application platform or a trusted reverse proxy.
- [ ] Strip client-supplied forwarding headers and set trusted client-IP headers at the proxy.
- [ ] Configure shared or edge rate limiting for registration and credentials login.

## PostgreSQL

- [ ] Use a dedicated, least-privilege application role and require provider-supported TLS.
- [ ] Create automated backups and test a restore before launch.
- [ ] Apply migrations once with `npm run db:migrate:deploy` before starting the release.
- [ ] Confirm `GET /api/health` returns `200` after migration and `503` when PostgreSQL is unavailable.

## Build and release

- [ ] Run `npm ci`, `npm run db:generate`, and `npm run build` on the release commit.
- [ ] Inject required environment variables at runtime; do not copy `.env` into an image.
- [ ] Run the application with `npm run start` or the standalone Docker server as a non-root user.
- [ ] Verify registration, sign-in, sign-out, protected routes, ownership isolation, and destructive confirmations.
- [ ] Verify desktop and mobile layouts, keyboard navigation, theme switching, and browser console output.

## Operations

- [ ] Review `npm audit` and document any accepted production risk.
- [ ] Ensure production logs exclude passwords, hashes, application notes, resume metadata, query text, and connection details.
- [ ] Establish an incident contact, backup owner, and rollback procedure.
- [ ] Recheck the privacy notice, data-retention policy, and account-deletion process before collecting public user data.
