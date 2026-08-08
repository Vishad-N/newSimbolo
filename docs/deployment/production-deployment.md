# Production Deployment Guide

This guide deploys `@simbolo/backend` on any standard Linux host or managed Node/container platform. Runtime behavior must depend on environment variables only; platform-specific setup belongs in the platform dashboard or deployment config, not application code.

## Deployment Flow

Use the same sequence everywhere:

1. Install dependencies: `npm ci`
2. Generate Prisma Client: `npm run prisma:generate --workspace backend`
3. Compile: `npm run build --workspace backend`
4. Deploy migrations: `npm run prisma:deploy --workspace backend`
5. Start: `npm run start:prod --workspace backend`
6. Check health: `GET /api/v1/health/live` and `GET /api/v1/health/ready`

Do not run `prisma generate`, `prisma db push`, or `prisma migrate deploy` inside the long-running app startup command. Run migrations as a deploy step before starting the process.

## Local Development

```bash
npm ci
cp backend/.env.example backend/.env
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run dev --workspace backend
```

Local defaults can use development services and disabled optional integrations. Production must pass validation.

## Production Environment Variables

Required core variables:

- `NODE_ENV=production`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `FRONTEND_URLS`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

Database requirement: PostgreSQL must have the `vector` extension available because `backend/prisma/schema.prisma` declares `extensions = [vector]` and migrations create vector columns. The provided Docker Compose files use `pgvector/pgvector:pg16`.

Required when enabled:

- Google OAuth: `GOOGLE_OAUTH_ENABLED=true`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Gemini: `GEMINI_ENABLED=true`, `GEMINI_API_KEY`
- Razorpay: `RAZORPAY_ENABLED=true`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, optional `RAZORPAY_WEBHOOK_SECRET`
- Email: `EMAIL_ENABLED=true`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, optional `SMTP_FROM`, `SMTP_SECURE`
- Cloudinary: `CLOUDINARY_ENABLED=true`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Cloudflare R2 client assets: `STORAGE_PROVIDER=r2`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, optional `R2_ENDPOINT`

Optional integrations can be disabled with their `*_ENABLED=false` flag. Sentry remains optional through `SENTRY_DSN`.

Validate the production contract before deployment:

```bash
npm run env:validate --workspace backend
```

## Prisma

Canonical files:

- Schema: `backend/prisma/schema.prisma`
- Prisma config: `backend/prisma.config.ts`
- Migrations: `backend/prisma/migrations`
- Seed script: `backend/prisma/seed.ts`

Production migration command:

```bash
npm run prisma:deploy --workspace backend
```

Use `prisma migrate dev` only for local migration authoring. Do not use `prisma db push` in production.

## Docker

Build from the repository root so npm workspaces and the root lockfile are available:

```bash
docker build -f backend/Dockerfile -t simbolo-backend .
```

Run migrations once, then start the app:

```bash
docker run --rm --env-file .env.production simbolo-backend npm run deploy:migrate
docker run -d --name simbolo-backend --env-file .env.production -p 3001:3001 simbolo-backend
```

For the provided production Compose stack:

```bash
docker compose -f infrastructure/docker/docker-compose.production.yml up --build -d
```

The Compose stack runs migrations in a one-shot `migrate` service before starting `backend`.

## VPS Deployment

On a Linux server:

```bash
git pull
npm ci
npm run prisma:generate --workspace backend
npm run build --workspace backend
npm run prisma:deploy --workspace backend
NODE_ENV=production npm run start:prod --workspace backend
```

Use a process manager such as systemd or PM2 to keep the process alive. Terminate TLS in Nginx or a managed load balancer and proxy to `PORT`.

## Railway and Render

Use the same commands:

- Build: `npm ci && npm run build --workspace backend`
- Pre-deploy migration: `npm run prisma:deploy --workspace backend`
- Start: `npm run start:prod --workspace backend`
- Health check path: `/api/v1/health/ready`

Set variables in the platform dashboard. Do not branch application code by platform.

## Health Checks

- Liveness: `/api/v1/health/live`
- Readiness: `/api/v1/health/ready`
- Diagnostics: `/api/v1/health`

Optional disabled services should not fail liveness. Readiness reports dependency status and should be used by load balancers and orchestrators.

## Troubleshooting

- Prisma cannot find schema: run commands from the workspace using the package scripts; they pass `--schema ./prisma/schema.prisma`.
- Production env validation fails: set the missing variable or disable the integration intentionally with its `*_ENABLED=false` flag.
- Database connection fails at startup: verify `DATABASE_URL`, network access, SSL requirements, and URL encoding for special characters.
- Docker build fails on workspace files: build from the repository root with `-f backend/Dockerfile`.
- Health readiness is `not_ready`: check database connectivity first, then Redis and queue status.
