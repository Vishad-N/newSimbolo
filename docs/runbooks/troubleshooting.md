# Troubleshooting

## Backend Not Ready

- Verify `DATABASE_URL`.
- Verify PostgreSQL accepts connections.
- Verify `REDIS_URL` if Redis is required in the environment.
- Check `/api/v1/health/ready`.

## WebSocket Messages Not Broadcasting Across Instances

- Verify `REDIS_URL` is set.
- Verify all backend replicas use the same Redis instance.
- Check `simbolo_websocket_connections` in Prometheus.

## Queues Not Processing

- Verify Redis health.
- Confirm workers are registered for the target queue.
- Inspect dead-letter queue entries.

## File Upload Fails

- Check `MAX_UPLOAD_BYTES`.
- Confirm MIME type is allowed.
- Verify storage provider environment variables.
