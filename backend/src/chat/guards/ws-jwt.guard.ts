import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * WebSocket JWT guard.
 * Validates JWT from socket handshake auth or query param.
 * Used by the ChatGateway to authenticate incoming WebSocket connections.
 */
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token =
      client.handshake.auth?.token ??
      client.handshake.headers?.authorization?.replace('Bearer ', '') ??
      (client.handshake.query?.token as string);

    if (!token) {
      throw new WsException('Missing authentication token');
    }

    try {
      const secret = this.configService.get<string>('auth.jwtSecret', 'super-secret-jwt-key');
      const payload = this.jwtService.verify(token, { secret });
      (client as any).user = payload;
      return true;
    } catch {
      throw new WsException('Invalid or expired authentication token');
    }
  }
}
