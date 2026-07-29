# Incident Response Runbook

1. Identify affected service, start time, and user impact.
2. Check `/api/v1/health/ready`.
3. Review Grafana for request rate, latency, memory, and WebSocket connections.
4. Review centralized logs by `x-request-id`.
5. Check Sentry for new exceptions.
6. Check queue failed job counts.
7. Roll back if the incident correlates with a deployment.
8. Document root cause and corrective action.
