import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/chat.dto';
import { MetricsService } from '../observability/metrics.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';

interface AuthenticatedSocket extends Socket {
  user?: {
    sub?: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URLS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 20000,
  namespace: 'chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly notificationsService: NotificationsService,
    private readonly metricsService: MetricsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('Chat WebSocket gateway initialized');
  }

  // WsJwtGuard (applied to every @SubscribeMessage handler below) is the real
  // authorization boundary. This just authenticates eagerly on connect so the
  // socket can join its personal `user:{id}` room immediately — that's what
  // emitNotificationToUser() broadcasts to — instead of waiting for the first
  // message. An unauthenticated or invalid token disconnects the socket outright.
  handleConnection(client: AuthenticatedSocket) {
    const token =
      client.handshake.auth?.token ??
      (client.handshake.headers?.authorization as string | undefined)?.replace('Bearer ', '') ??
      (client.handshake.query?.token as string | undefined);

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const secret = this.configService.get<string>('auth.jwtSecret', 'super-secret-jwt-key');
      const payload = this.jwtService.verify(token, { secret });
      client.user = payload;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect(true);
      return;
    }

    this.logger.log(`WebSocket client connected: ${client.id} (user ${client.user?.sub})`);
    this.metricsService.setWebsocketConnections(this.server.engine.clientsCount);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WebSocket client disconnected: ${client.id}`);
    this.metricsService.setWebsocketConnections(this.server.engine.clientsCount);
  }

  @SubscribeMessage('join-conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.user?.sub;
    if (!userId) throw new WsException('Unauthenticated');

    try {
      await this.chatService.findOne(data.conversationId, userId);
      await client.join(data.conversationId);
      client.emit('joined', { conversationId: data.conversationId });
      this.logger.log(`User ${userId} joined room ${data.conversationId}`);
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('leave-conversation')
  async handleLeaveConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    await client.leave(data.conversationId);
    client.emit('left', { conversationId: data.conversationId });
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() dto: SendMessageDto) {
    const userId = client.user?.sub;
    if (!userId) throw new WsException('Unauthenticated');

    try {
      const message = await this.chatService.sendMessage(dto, userId);
      this.server.to(dto.conversationId).emit('new-message', message);

      const conversation = await this.chatService.findOne(dto.conversationId, userId);
      const otherParticipants = conversation.participants
        .filter((participant) => participant.userId !== userId)
        .map((participant) => participant.userId);

      const senderName = `${message.sender.firstName} ${message.sender.lastName}`;
      for (const participantId of otherParticipants) {
        await this.notificationsService.notifyNewMessage(participantId, dto.conversationId, senderName);
      }

      return message;
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.user?.sub;
    client.to(data.conversationId).emit('user-typing', { userId, isTyping: data.isTyping });
  }

  @SubscribeMessage('message-read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.user?.sub;
    if (!userId) throw new WsException('Unauthenticated');

    await this.chatService.markAsRead(data.conversationId, userId);
    client.to(data.conversationId).emit('read-receipt', { userId, conversationId: data.conversationId });
  }

  emitNotificationToUser(userId: string, notification: Record<string, unknown>) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }
}
