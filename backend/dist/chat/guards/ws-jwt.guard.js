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
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const websockets_1 = require("@nestjs/websockets");
/**
 * WebSocket JWT guard.
 * Validates JWT from socket handshake auth or query param.
 * Used by the ChatGateway to authenticate incoming WebSocket connections.
 */
let WsJwtGuard = class WsJwtGuard {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = client.handshake.auth?.token ??
            client.handshake.headers?.authorization?.replace('Bearer ', '') ??
            client.handshake.query?.token;
        if (!token) {
            throw new websockets_1.WsException('Missing authentication token');
        }
        try {
            const secret = this.configService.get('auth.jwtSecret', 'super-secret-jwt-key');
            const payload = this.jwtService.verify(token, { secret });
            client.user = payload;
            return true;
        }
        catch {
            throw new websockets_1.WsException('Invalid or expired authentication token');
        }
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], WsJwtGuard);
//# sourceMappingURL=ws-jwt.guard.js.map