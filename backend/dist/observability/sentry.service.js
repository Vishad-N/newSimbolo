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
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Sentry = require("@sentry/node");
let SentryService = class SentryService {
    configService;
    initialized = false;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const dsn = this.configService.get('observability.sentryDsn');
        if (!dsn)
            return;
        Sentry.init({
            dsn,
            environment: this.configService.get('observability.sentryEnvironment'),
            release: this.configService.get('observability.release'),
            tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
        });
        this.initialized = true;
    }
    captureException(error) {
        if (this.initialized)
            Sentry.captureException(error);
    }
    status() {
        return this.initialized ? 'configured' : 'disabled';
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SentryService);
//# sourceMappingURL=sentry.service.js.map