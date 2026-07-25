# 🛠️ Backend Setup & API Conventions Handbook

This document serves as the authoritative developer reference for **The Simbolo** backend infrastructure established in **Phase 4**. It defines our architectural patterns, environment configuration rules, coding standards, and standardized REST API JSON responses.

---

## 📂 1. Folder Structure & Feature-First Architecture

Our backend repository (`@simbolo/backend`) adheres strictly to modular, feature-first design principles. Every domain capability resides in an self-contained module directory:

```text
backend/
├── src/
│   ├── app.module.ts              # Root application bootstrap module
│   ├── main.ts                    # Server initialization, CORS, Helmet, Swagger, versioning
│   ├── common/                    # Universal cross-cutting infrastructure
│   │   ├── constants/             # Global defaults, error codes, RBAC role enums
│   │   ├── decorators/            # @CurrentUser(), @Public(), @Roles(), @ApiPaginatedResponse()
│   │   ├── dto/                   # Generic API response & pagination query envelopes
│   │   ├── exceptions/            # Domain exception hierarchy extending HttpException
│   │   ├── filters/               # Centralized GlobalExceptionFilter (@Catch)
│   │   ├── guards/                # JwtAuthGuard (global default) & RolesGuard (RBAC)
│   │   ├── interceptors/          # TransformInterceptor, LoggingInterceptor, TimeoutInterceptor
│   │   ├── middleware/            # Express-level HTTP RequestLoggerMiddleware
│   │   ├── pipes/                 # CustomValidationPipe with strict DTO whitelisting
│   │   └── utils/                 # Static helper classes (PaginationUtil, ApiResponseUtil, etc.)
│   ├── config/                    # Strongly typed config factories loaded via ConfigModule
│   ├── prisma/                    # Singleton PrismaService connection pool with lifecycle hooks
│   ├── auth/                      # Authentication foundation (JWT & Refresh token strategies)
│   ├── users/                     # User profile identity management scaffold
│   ├── health/                    # Real-time diagnostics endpoint (GET /api/v1/health)
│   └── shared/                    # Universal abstractions (BaseService, BaseRepository, Logger)
├── test/                          # End-to-End (E2E) testing suite and Jest configurations
├── prisma/                        # Database schema (schema.prisma), migrations/, and seed.ts
├── Dockerfile                     # Multi-stage production container definition
├── docker-compose.yml             # Local development PostgreSQL 16 & Redis 7 orchestration
└── package.json                   # Monorepo workspace package definition
```

---

## 🌍 2. Environment Variables Specification

All sensitive credentials and application settings are injected via `.env` files and loaded asynchronously using NestJS `ConfigModule.forRootAsync()`. **Never hardcode secrets or URLs in source code.**

| Variable Name | Example / Default | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Execution environment (`development`, `staging`, `production`) |
| `API_PORT` | `3001` | TCP port on which the NestJS HTTP server binds |
| `API_PREFIX` | `api` | Global route prefix prepended to all controller endpoints |
| `API_VERSION` | `v1` | URI version prefix (`/api/v1/...`) |
| `FRONTEND_URLS` | `http://localhost:3000,...` | Comma-separated list of allowed CORS client origins |
| `DATABASE_URL` | `postgresql://...` | Connection URI for PostgreSQL database (via Prisma) |
| `DATABASE_POOL_SIZE` | `20` | Maximum number of concurrent database connections in pool |
| `JWT_SECRET` | `super-secret-key` | Cryptographic secret for signing access JWT tokens |
| `JWT_EXPIRES_IN` | `15m` | Expiration time window for short-lived access tokens |
| `JWT_REFRESH_SECRET` | `super-secret-refresh` | Secret for signing long-lived refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Expiration interval for refresh tokens |
| `BCRYPT_ROUNDS` | `12` | Cost factor for bcrypt password hashing |
| `STORAGE_BUCKET` | `simbolo-assets` | AWS S3 / Cloudflare R2 bucket name for media storage |
| `STORAGE_CDN_URL` | `https://cdn.simbolo.ai` | Public CDN base URL for asset delivery |
| `SMTP_HOST` | `smtp.mailtrap.io` | SMTP email server hostname |
| `REDIS_URL` | `redis://localhost:6379/0` | Connection URL for Redis cache and queueing service |

---

## 📏 3. Coding Standards & Best Practices

1. **Strict TypeScript & Zero `any`**:
   - Always use concrete interfaces, DTOs, or generic types (`<T>`). Never use `any`.
   - Enable `strictNullChecks` and `noImplicitAny` across all files.
2. **DRY & SOLID Principles**:
   - Keep classes focused on a single responsibility.
   - Extract identical logic into static utility classes (`@common/utils`) or shared services (`@shared`).
3. **Small Focused Files**:
   - If a controller, service, or repository exceeds ~300 lines of code, break it down into smaller specialized helpers or domain services.
4. **Declarative Validation**:
   - All input data arriving via `@Body()`, `@Query()`, or `@Param()` MUST be bound to a TypeScript DTO class decorated with `class-validator` rules (`@IsString()`, `@IsInt()`, `@IsUUID()`, `@IsOptional()`, etc.).
   - Never perform manual `if (!req.body.email)` validation inside controller methods.
5. **Secure by Default Authorization**:
   - `JwtAuthGuard` is registered globally in `AppModule`. Every endpoint is protected by default.
   - To expose a public route (such as health checks or login webhooks), explicitly decorate the handler with `@Public()`.
   - To restrict access by RBAC role, decorate with `@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)`.

---

## 📡 4. Standardized REST API JSON Conventions

Every HTTP response emitted by our backend is automatically normalized by our global interceptors and exception filters to guarantee consistent contract structures for frontend client consumption.

### 4.1. Standard Success Response (`200 OK`, `201 Created`)
All successful controller return values are automatically wrapped by `TransformInterceptor` into the generic envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "c1f7b8e2-4d3a-4a1b-9f8e-1a2b3c4d5e6f",
    "email": "vishad@simbolo.ai",
    "role": "SUPER_ADMIN"
  }
}
```

### 4.2. Standard Paginated Response
When returning list data, endpoints must return items alongside pagination metadata (`PaginatedResponseDto<T>`):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      { "id": "1", "email": "client1@example.com" },
      { "id": "2", "email": "client2@example.com" }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 4.3. Standard Error Response (`4xx`, `5xx`)
Any thrown `HttpException`, domain exception (`BusinessException`), Prisma database failure, or unhandled runtime error is caught by `GlobalExceptionFilter` and formatted into:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User with identifier \"999\" was not found",
  "errorCode": "ERR_NOT_FOUND",
  "timestamp": "2026-07-25T12:05:30.123Z",
  "path": "/api/v1/users/999"
}
```

---

## 🛡️ 5. Security & Reliability Foundation

- **Helmet**: Enforces secure HTTP headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP) on server startup.
- **Rate Limiting**: Integrated `ThrottlerModule` enforcing a foundation limit of 100 requests per minute per client IP address.
- **SLA Request Timeout**: Global `TimeoutInterceptor` monitors every request using RxJS operators, automatically aborting and returning HTTP `408 Request Timeout` if execution exceeds 10,000ms.
- **CORS Protection**: Restricted origin whitelisting loaded dynamically from `app.config.ts`.
