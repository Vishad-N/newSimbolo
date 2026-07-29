# API Standards

- Base path: `/api/v1`.
- Swagger: `/docs`.
- Use JWT bearer auth unless endpoint is explicitly marked public.
- Use the shared response interceptor for consistent success envelopes.
- Pagination response shape:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

- New endpoints must include DTO validation and Swagger decorators.
- Breaking changes require a new API version or compatibility adapter.
- Deprecate endpoints with documentation before removal.
