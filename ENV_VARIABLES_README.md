# Simbolo Environment Variables Setup Guide

This document lists all the environment variables required for deploying the different parts of the Simbolo monorepo (Backend + 3 Frontends). 
When deploying to your hosting provider (e.g. Railway, Vercel), ensure you set these corresponding variables in their dashboard.

## 1. Backend (`backend/`)

The backend requires the most configuration. Below are the variables you must set in your production environment (e.g., Railway).

| Variable Name | Description | Example / Default |
| --- | --- | --- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | The port the backend runs on | `3001` (usually managed by Railway) |
| `API_PORT` | Alias for backend port | `3001` |
| `API_PREFIX` | Prefix for all routes | `api` |
| `API_VERSION` | Version of the API | `v1` |
| `FRONTEND_URLS` | Comma-separated list of allowed CORS origins and redirect targets. **Must include production frontend URLs.** | `https://simbolo.ai,https://dashboard.simbolo.ai,https://admin.simbolo.ai` |
| `DATABASE_URL` | Prisma DB connection string (Pooler URL if using Supabase) | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | Direct DB connection string for Prisma migrations | `postgresql://user:pass@host:5432/db` |
| `DATABASE_POOL_SIZE` | DB Connection pool size | `20` |
| `JWT_SECRET` | Secret key for access tokens | `your-secure-random-string` |
| `JWT_EXPIRES_IN` | Access token lifespan | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `another-secure-random-string` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifespan | `7d` |
| `BCRYPT_ROUNDS` | Salt rounds for password hashing | `12` |
| `GOOGLE_OAUTH_ENABLED` | Enable Google Login | `true` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud | `your-google-client-secret` |
| `GOOGLE_CALLBACK_URL` | **CRITICAL:** The live callback URL Google redirects to | `https://your-backend.up.railway.app/api/v1/auth/google/callback` |
| `STORAGE_PROVIDER` | Object storage provider (`local` or `r2`) | `r2` |
| `R2_ACCOUNT_ID` | Cloudflare R2 Account ID | `your-r2-account-id` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 Access Key | `your-r2-access-key` |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 Secret Key | `your-r2-secret-key` |
| `R2_BUCKET_NAME` | Cloudflare R2 Bucket Name | `your-r2-bucket-name` |
| `R2_ENDPOINT` | Cloudflare R2 S3 API Endpoint | `https://<id>.r2.cloudflarestorage.com` |
| `EMAIL_ENABLED` | Enable email sending | `true` |
| `SMTP_HOST` | SMTP Server Host | `smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP Server Port | `2525` |
| `SMTP_USER` | SMTP Username | `user` |
| `SMTP_PASSWORD` | SMTP Password | `pass` |
| `SMTP_FROM` | "From" address for system emails | `noreply@simbolo.ai` |
| `SMTP_SECURE` | Use secure SMTP connection | `false` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `CLOUDINARY_ENABLED` | Enable Cloudinary for assets | `true` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your-api-secret` |
| `RAZORPAY_ENABLED` | Enable Razorpay Payments | `true` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `your-razorpay-key-id` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `your-razorpay-key-secret` |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay Webhook Signature Secret| `your-razorpay-webhook-secret` |
| `GEMINI_ENABLED` | Enable Google Gemini AI | `true` |
| `GEMINI_API_KEY` | Google Gemini API Key | `your-gemini-api-key` |
| `GEMINI_GENERATION_MODEL`| Gemini generation model | `gemini-3.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Gemini embedding model | `gemini-embedding-2` |

---

## 2. Landing Website Frontend (`apps/landing/`)

The main marketing website.

| Variable Name | Description | Example / Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | The base URL to the deployed backend API | `https://simbolobackend-production.up.railway.app/api/v1` |
| `NEXT_PUBLIC_DASHBOARD_URL` | **(NEW)** The URL to your deployed Client Dashboard. Used to redirect users after logging in via Google. | `https://dashboard.simbolo.ai` |

---

## 3. Client Dashboard Frontend (`apps/client/`)

The portal where clients manage projects and pay.

| Variable Name | Description | Example / Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | The base URL to the deployed backend API | `https://simbolobackend-production.up.railway.app/api/v1` |

---

## 4. Admin Frontend (`apps/admin/`)

The CMS for your team to manage everything.

| Variable Name | Description | Example / Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | The base URL to the deployed backend API | `https://simbolobackend-production.up.railway.app/api/v1` |
