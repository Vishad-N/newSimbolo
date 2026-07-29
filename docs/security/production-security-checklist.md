# Production Security Checklist

- Use strong `JWT_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`, and `CSRF_SECRET`.
- Keep `FRONTEND_URLS` explicit per environment.
- Keep `/metrics` private to monitoring networks.
- Set `CSRF_ENABLED=true` if browser cookie authentication is used.
- Validate all file uploads by MIME type and size.
- Enable object versioning for R2/S3.
- Use signed URLs for private downloads.
- Rotate Razorpay webhook secret on suspected exposure.
- Verify all admin endpoints require RBAC permissions.
- Run `npm audit` and triage high/critical findings before release.
- Use HTTPS only in production.
- Store secrets in platform secret storage, not Git.
