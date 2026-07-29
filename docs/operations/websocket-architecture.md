# WebSocket Architecture

Socket.IO uses `RedisIoAdapter` when `REDIS_URL` is configured.

Production behavior:

- Redis pub/sub supports multiple backend instances.
- Chat namespace uses heartbeat settings with `pingInterval` and `pingTimeout`.
- CORS uses `FRONTEND_URLS`, not wildcard origins.
- Active connections are published as Prometheus gauge `simbolo_websocket_connections`.

Operational checks:

- Confirm users can join the same conversation across two backend replicas.
- Confirm reconnect after backend restart.
- Confirm stale rooms clear after disconnect.
