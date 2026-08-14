# 🌐 @simbolo/backend — Core Infrastructure Foundation

This workspace contains the enterprise-grade NestJS backend API serving **The Simbolo** (AI-Powered Digital Marketing Platform). It powers all data interactions across the **Landing Website**, **Client Dashboard**, and **Admin CMS**.

---

## 🏛️ Architecture Overview

The backend is structured using a **Feature-First Clean Architecture** with strict Separation of Concerns:
- **`src/config/`**: Strongly typed configuration factories (`AppConfig`, `DatabaseConfig`, `AuthConfig`, `StorageConfig`, `EmailConfig`) loaded globally via NestJS `ConfigModule`.
- **`src/prisma/`**: Singleton `PrismaService` managing PostgreSQL database connection pools, explicit query logging, and graceful shutdown hooks (`enableShutdownHooks`).
- **`src/common/`**: Universal cross-cutting infrastructure:
  - **Filters**: `GlobalExceptionFilter` catching and standardizing every HTTP and database exception into uniform JSON payloads.
  - **Interceptors**: `TransformInterceptor` (standardizing success envelopes), `LoggingInterceptor` (request performance telemetry), and `TimeoutInterceptor` (enforcing a 10s SLA).
  - **Pipes**: `CustomValidationPipe` enforcing DTO whitelisting, non-whitelisted property stripping, and implicit type transformations.
  - **Guards & Decorators**: `JwtAuthGuard` (global default protection), `RolesGuard` (RBAC authorization), `@Public()`, `@Roles()`, `@CurrentUser()`, and `@ApiPaginatedResponse()`.
  - **Utilities**: Static helper classes (`PaginationUtil`, `ApiResponseUtil`, `DateUtil`, `StringUtil`, `HashUtil`).
- **`src/shared/`**: Universal abstractions (`BaseService`, `BaseRepository`) and structured logging service (`CustomLoggerService` powered by Winston).
- **`src/auth/` & `src/users/`**: Scaffolding foundation for identity and JWT bearer token authentication.
- **`src/health/`**: Real-time diagnostic endpoint (`GET /api/v1/health`) pinging database connectivity.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v20+ or v22+
- **PostgreSQL** v16+ (or use Docker Compose)
- **Redis** v7+ (optional, for caching foundation)

### 2. Environment Setup
Copy the sample environment file and configure your local credentials:
```bash
cp .env.example .env
```

### 3. Install Dependencies & Generate Prisma Client
```bash
npm install
npm run prisma:generate
```

### 4. Database Migrations
Run existing DDL migrations against your PostgreSQL instance:
```bash
npm run prisma:migrate
```

### 5. Seed the Initial Administrator
For a normal seed, `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` may both be omitted. The seed will skip the Super Admin and continue with all other data.

To create or rotate the seeded Super Admin, set both variables before running the seed. The password must contain at least 12 characters with uppercase, lowercase, number, and special character. Supplying only one variable is treated as a configuration error.

```bash
npm run prisma:seed
```

These variables are used only by the seed command. Do not commit their real values.

### 6. Running the Application
```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```
Once running, inspect real-time diagnostics and OpenAPI documentation:
- **Health Check**: `http://localhost:3001/api/v1/health`
- **Swagger Docs**: `http://localhost:3001/docs`

---

## 🐳 Docker & Containerization

Start local development dependencies (PostgreSQL + Redis + API) using Docker Compose:
```bash
docker-compose up -d
```
To build and run the multi-stage production Docker image independently:
```bash
docker build -t simbolo-backend .
docker run -p 3001:3001 --env-file .env simbolo-backend
```

---

## 🧪 Testing & Code Quality

```bash
# Run unit tests
npm test

# Run End-to-End (E2E) tests
npm run test:e2e

# Run ESLint check and fix
npm run lint

# Format codebase with Prettier
npm run format
```

---

## 📖 Complete Documentation
For exhaustive coding standards, DTO guidelines, and API conventions, please consult the official handbook:
👉 [`docs/backend-setup-and-conventions.md`](../docs/backend-setup-and-conventions.md)
