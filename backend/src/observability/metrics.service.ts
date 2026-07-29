import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  private readonly httpRequests: Counter<string>;
  private readonly httpDuration: Histogram<string>;
  private readonly websocketConnections: Gauge<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry, prefix: 'simbolo_' });
    this.httpRequests = new Counter({
      name: 'simbolo_http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
    this.httpDuration = new Histogram({
      name: 'simbolo_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
    this.websocketConnections = new Gauge({
      name: 'simbolo_websocket_connections',
      help: 'Active Socket.IO connections',
      registers: [this.registry],
    });
  }

  recordHttpRequest(method: string, route: string, statusCode: number, durationSeconds: number) {
    const labels = { method, route, status_code: String(statusCode) };
    this.httpRequests.inc(labels);
    this.httpDuration.observe(labels, durationSeconds);
  }

  setWebsocketConnections(count: number) {
    this.websocketConnections.set(count);
  }

  async renderPrometheusMetrics() {
    return this.registry.metrics();
  }

  contentType() {
    return this.registry.contentType;
  }
}
