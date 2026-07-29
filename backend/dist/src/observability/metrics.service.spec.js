"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_service_1 = require("./metrics.service");
describe('MetricsService', () => {
    it('renders Prometheus metrics after recording a request and WebSocket count', async () => {
        const service = new metrics_service_1.MetricsService();
        service.recordHttpRequest('GET', '/health', 200, 0.02);
        service.setWebsocketConnections(3);
        const metrics = await service.renderPrometheusMetrics();
        expect(metrics).toContain('simbolo_http_requests_total');
        expect(metrics).toContain('simbolo_websocket_connections 3');
    });
});
//# sourceMappingURL=metrics.service.spec.js.map