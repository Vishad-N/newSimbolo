import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/chat.dto';
import { MetricsService } from '../observability/metrics.service';
interface AuthenticatedSocket extends Socket {
    user?: {
        sub?: string;
    };
}
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly notificationsService;
    private readonly metricsService;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService, notificationsService: NotificationsService, metricsService: MetricsService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<void>;
    handleLeaveConversation(client: Socket, data: {
        conversationId: string;
    }): Promise<void>;
    handleSendMessage(client: AuthenticatedSocket, dto: SendMessageDto): Promise<({
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
        attachments: ({
            mediaAsset: {
                id: string;
                originalName: string;
                cdnUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            messageId: string | null;
            ticketId: string | null;
            taskId: string | null;
            mediaAssetId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        senderId: string;
        readAt: Date | null;
        conversationId: string;
    }) | undefined>;
    handleTyping(client: AuthenticatedSocket, data: {
        conversationId: string;
        isTyping: boolean;
    }): void;
    handleMessageRead(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<void>;
    emitNotificationToUser(userId: string, notification: Record<string, unknown>): void;
}
export {};
