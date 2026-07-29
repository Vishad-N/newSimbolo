# Production Deployment Guide

## Required Environment

- Node.js 22
- PostgreSQL 16
- Redis 7
- Docker and Docker Compose for containerized deployment
- HTTPS termination through Nginx or a managed load balancer

## Required Variables

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URLS`
- `COOKIE_SECRET`
- `CSRF_SECRET`
- `SENTRY_DSN` optional
- `STORAGE_PROVIDER` as `local`, `s3`, or `r2`
- `STORAGE_BUCKET`
- `STORAGE_REGION`
- `STORAGE_ENDPOINT`
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`
- `STORAGE_CDN_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

## Deploy

1. Build and test in CI.
2. Apply Prisma migrations against staging.
3. Run smoke tests against staging.
4. Deploy the Docker image to production.
5. Run readiness checks at `/api/v1/health/ready`.
6. Watch Grafana, application logs, and Sentry for the first release window.

## Rollback

1. Stop routing traffic to the new release.
2. Deploy the last known good image.
3. Restore database only if a migration caused irreversible data issues.
4. Record the incident in the operational log.
