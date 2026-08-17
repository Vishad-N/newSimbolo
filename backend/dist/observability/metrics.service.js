"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
let MetricsService = class MetricsService {
    registry = new prom_client_1.Registry();
    httpRequests;
    httpDuration;
    websocketConnections;
    constructor() {
        (0, prom_client_1.collectDefaultMetrics)({ register: this.registry, prefix: 'simbolo_' });
        this.httpRequests = new prom_client_1.Counter({
            name: 'simbolo_http_requests_total',
            help: 'Total HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.registry],
        });
        this.httpDuration = new prom_client_1.Histogram({
            name: 'simbolo_http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
        this.websocketConnections = new prom_client_1.Gauge({
            name: 'simbolo_websocket_connections',
            help: 'Active Socket.IO connections',
            registers: [this.registry],
        });
    }
    recordHttpRequest(method, route, statusCode, durationSeconds) {
        const labels = { method, route, status_code: String(statusCode) };
        this.httpRequests.inc(labels);
        this.httpDuration.observe(labels, durationSeconds);
    }
    setWebsocketConnections(count) {
        this.websocketConnections.set(count);
    }
    async renderPrometheusMetrics() {
        return this.registry.metrics();
    }
    contentType() {
        return this.registry.contentType;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map