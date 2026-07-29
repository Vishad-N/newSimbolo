import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
/**
 * WebSocket JWT guard.
 * Validates JWT from socket handshake auth or query param.
 * Used by the ChatGateway to authenticate incoming WebSocket connections.
 */
export declare class WsJwtGuard implements CanActivate {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    canActivate(context: ExecutionContext): boolean;
}
