# Monitoring Guide

## Metrics

Prometheus scrapes `/metrics`.

Core metrics:

- `simbolo_http_requests_total`
- `simbolo_http_request_duration_seconds`
- `simbolo_websocket_connections`
- default process, memory, CPU, and event loop metrics from `prom-client`

## Dashboards

Start with `infrastructure/monitoring/grafana-dashboard.json`.

Recommended alerts:

- API 5xx rate above 1 percent for 5 minutes.
- p95 latency above 1 second for 10 minutes.
- Readiness endpoint failing.
- Redis unavailable.
- Queue failed job count increasing.
- Memory usage above 85 percent.
