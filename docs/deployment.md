# Production Deployment Guide

This guide covers the necessary configuration to securely deploy The Simbolo backend into production behind a reverse proxy (such as Cloudflare or Nginx).

## Reverse Proxy & Trust Proxy

When deploying the backend behind a reverse proxy, the client IP address is obscured. The proxy connects to the NestJS application, and the request appears to originate from the proxy's IP.

To solve this, we configure NestJS with `app.set('trust proxy', 1)`.
This allows Express (and thus NestJS) to extract the real client IP from the `X-Forwarded-For` header. 

### Why is this required?
- **Rate Limiting (`@nestjs/throttler`)**: Throttling relies on identifying the client IP. Without `trust proxy`, all requests would share the same proxy IP and would be heavily rate-limited together.
- **Logging & Security**: Audit logs and error tracing need the real client IP for incident response and debugging.

### Nginx Configuration
If you use Nginx, ensure it correctly forwards headers:
```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Production CORS Configuration

Cross-Origin Resource Sharing (CORS) enforces which web origins are allowed to interact with the API.

In development, we allow `http://localhost:3000` and similar local origins. 
In production, the backend is strictly configured to **reject any unknown origins**, and never uses `origin: "*"`.

To configure allowed origins, define them as a comma-separated list in your environment variables:
```env
FRONTEND_URLS=https://thesimbolo.com,https://app.thesimbolo.com,https://admin.thesimbolo.com
```

Any unauthorized request will be rejected and logged as `Blocked CORS request from unauthorized origin: ...`.

---

## Google OAuth Configuration

The Google OAuth Passport strategy strictly relies on environment variables and has no hardcoded defaults. If these are missing, the server will refuse to start in production.

### Google Cloud Console Setup
1. Go to **APIs & Services > Credentials** in GCP.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. **Authorized JavaScript origins**: 
   - `https://app.thesimbolo.com`
   - `https://thesimbolo.com`
4. **Authorized redirect URIs**: 
   - `https://api.thesimbolo.com/api/v1/auth/google/callback`

### Environment Configuration
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.thesimbolo.com/api/v1/auth/google/callback
```

---

## Environment Validation

The backend uses `class-validator` and `class-transformer` during startup to validate the `.env` file before booting.

If required variables (like `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`) are missing or incorrectly formatted, **the server will gracefully crash and log the validation error**. This prevents silent failures in production.

### Example Environments

**Development (`.env`)**
```env
NODE_ENV=development
API_PORT=3001
FRONTEND_URLS=http://localhost:3000,http://localhost:3002
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback
```

**Production (`.env`)**
```env
NODE_ENV=production
API_PORT=3001
FRONTEND_URLS=https://thesimbolo.com,https://app.thesimbolo.com,https://admin.thesimbolo.com
GOOGLE_CALLBACK_URL=https://api.thesimbolo.com/api/v1/auth/google/callback
```
