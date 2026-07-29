# Production Architecture

The Simbolo production stack consists of:

- Next.js apps: landing site, client portal, and admin CMS.
- NestJS backend API with API versioning, Swagger, JWT auth, RBAC, request IDs, metrics, and structured logs.
- PostgreSQL as the system of record.
- Redis for cache, BullMQ queues, Socket.IO horizontal scaling, rate limiting support, and temporary operational state.
- BullMQ queues for long-running workloads such as email, invoice PDFs, AI work, analytics, exports, image processing, notifications, and reminders.
- Prometheus and Grafana for metrics.
- Sentry for exception and performance trace capture when `SENTRY_DSN` is configured.
- Nginx as reverse proxy for API, WebSockets, TLS termination, upload limits, and metrics isolation.

## Runtime Principles

- External services must degrade cleanly in local development.
- Production secrets must be injected through environment variables or secret managers.
- All public traffic should flow through the reverse proxy.
- `/health/live` is for liveness. `/health/ready` is for dependency readiness.
- `/metrics` should only be exposed to trusted monitoring networks.
