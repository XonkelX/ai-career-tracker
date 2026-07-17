FROM node:22-alpine AS build-base
RUN npm install --global npm@11.10.1

FROM build-base AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM build-base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Prisma configuration validates the URL while generating the client, but no
# database connection is made during generation or the Next.js build. Runtime
# credentials are injected only when the final image starts.
RUN export DATABASE_URL="postgresql://build:build@127.0.0.1:5432/careerflow_build" \
    && npm run db:generate \
    && mkdir -p public \
    && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
