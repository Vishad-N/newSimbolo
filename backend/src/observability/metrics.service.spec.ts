import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  it('renders Prometheus metrics after recording a request and WebSocket count', async () => {
    const service = new MetricsService();

    service.recordHttpRequest('GET', '/health', 200, 0.02);
    service.setWebsocketConnections(3);
    const metrics = await service.renderPrometheusMetrics();

    expect(metrics).toContain('simbolo_http_requests_total');
    expect(metrics).toContain('simbolo_websocket_connections 3');
  });
});
