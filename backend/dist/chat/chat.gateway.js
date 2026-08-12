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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const notifications_service_1 = require("../notifications/notifications.service");
const chat_dto_1 = require("./dto/chat.dto");
const metrics_service_1 = require("../observability/metrics.service");
let ChatGateway = class ChatGateway {
    chatService;
    notificationsService;
    metricsService;
    server;
    logger = new common_1.Logger('ChatGateway');
    constructor(chatService, notificationsService, metricsService) {
        this.chatService = chatService;
        this.notificationsService = notificationsService;
        this.metricsService = metricsService;
    }
    afterInit() {
        this.logger.log('Chat WebSocket gateway initialized');
    }
    handleConnection(client) {
        this.logger.log(`WebSocket client connected: ${client.id}`);
        this.metricsService.setWebsocketConnections(this.server.engine.clientsCount);
    }
    handleDisconnect(client) {
        this.logger.log(`WebSocket client disconnected: ${client.id}`);
        this.metricsService.setWebsocketConnections(this.server.engine.clientsCount);
    }
    async handleJoinConversation(client, data) {
        const userId = client.user?.sub;
        if (!userId)
            throw new websockets_1.WsException('Unauthenticated');
        try {
            await this.chatService.findOne(data.conversationId, userId);
            await client.join(data.conversationId);
            client.emit('joined', { conversationId: data.conversationId });
            this.logger.log(`User ${userId} joined room ${data.conversationId}`);
        }
        catch (err) {
            client.emit('error', { message: err.message });
        }
    }
    async handleLeaveConversation(client, data) {
        await client.leave(data.conversationId);
        client.emit('left', { conversationId: data.conversationId });
    }
    async handleSendMessage(client, dto) {
        const userId = client.user?.sub;
        if (!userId)
            throw new websockets_1.WsException('Unauthenticated');
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
        }
        catch (err) {
            client.emit('error', { message: err.message });
        }
    }
    handleTyping(client, data) {
        const userId = client.user?.sub;
        client.to(data.conversationId).emit('user-typing', { userId, isTyping: data.isTyping });
    }
    async handleMessageRead(client, data) {
        const userId = client.user?.sub;
        if (!userId)
            throw new websockets_1.WsException('Unauthenticated');
        await this.chatService.markAsRead(data.conversationId, userId);
        client.to(data.conversationId).emit('read-receipt', { userId, conversationId: data.conversationId });
    }
    emitNotificationToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification', notification);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message-read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URLS?.split(',') ?? ['http://localhost:3000'],
            credentials: true,
        },
        pingInterval: 25000,
        pingTimeout: 20000,
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        notifications_service_1.NotificationsService,
        metrics_service_1.MetricsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map