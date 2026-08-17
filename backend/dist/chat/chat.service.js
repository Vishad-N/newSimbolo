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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let ChatService = class ChatService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('ChatService');
        this.prisma = prisma;
    }
    conversationInclude = {
        participants: {
            include: {
                user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            },
        },
        project: { select: { id: true, name: true, status: true } },
        supportTicket: { select: { id: true, ticketNumber: true, subject: true } },
    };
    async findUserConversations(userId, page = 1, limit = 20) {
        const where = {
            participants: { some: { userId } },
        };
        const [data, total] = await Promise.all([
            this.prisma.conversation.findMany({
                where,
                include: {
                    ...this.conversationInclude,
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: { sender: { select: { firstName: true, lastName: true } } },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.conversation.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id, requesterId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: this.conversationInclude,
        });
        if (!conversation)
            throw new common_1.NotFoundException(`Conversation ${id} not found`);
        // Access control: only participants can view
        const isParticipant = conversation.participants.some((p) => p.userId === requesterId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not a participant in this conversation');
        return conversation;
    }
    async createConversation(dto, creatorId) {
        // Ensure creator is in participant list
        const allParticipants = [...new Set([...dto.participantIds, creatorId])];
        const conversation = await this.prisma.conversation.create({
            data: {
                title: dto.title ?? null,
                type: dto.projectId ? 'PROJECT_ROOM' : dto.supportTicketId ? 'SUPPORT_ROOM' : 'DIRECT',
                projectId: dto.projectId ?? null,
                supportTicketId: dto.supportTicketId ?? null,
                participants: {
                    create: allParticipants.map((userId) => ({ userId })),
                },
            },
            include: this.conversationInclude,
        });
        return conversation;
    }
    async getMessages(conversationId, requesterId, page = 1, limit = 50) {
        // Verify participant access
        await this.findOne(conversationId, requesterId);
        const where = { conversationId, deletedAt: null };
        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where,
                include: {
                    sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                    attachments: {
                        include: { mediaAsset: { select: { id: true, cdnUrl: true, mimeType: true, originalName: true } } },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.message.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async sendMessage(dto, senderId) {
        // Verify sender is participant
        await this.findOne(dto.conversationId, senderId);
        const message = await this.prisma.message.create({
            data: {
                content: dto.content,
                senderId,
                conversationId: dto.conversationId,
                attachments: dto.attachmentIds?.length
                    ? {
                        create: dto.attachmentIds.map((mediaAssetId) => ({ mediaAssetId })),
                    }
                    : undefined,
            },
            include: {
                sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                attachments: { include: { mediaAsset: { select: { id: true, cdnUrl: true, originalName: true } } } },
            },
        });
        // Update conversation's updatedAt for ordering
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async markAsRead(conversationId, userId) {
        await this.findOne(conversationId, userId);
        await this.prisma.participant.updateMany({
            where: { conversationId, userId },
            data: { lastReadAt: new Date() },
        });
        return { marked: true };
    }
    async softDeleteMessage(messageId, requesterId) {
        const message = await this.prisma.message.findUnique({ where: { id: messageId } });
        if (!message)
            throw new common_1.NotFoundException(`Message ${messageId} not found`);
        if (message.senderId !== requesterId) {
            throw new common_1.ForbiddenException('You can only delete your own messages');
        }
        return this.prisma.message.update({
            where: { id: messageId },
            data: { deletedAt: new Date(), content: '[Message deleted]' },
        });
    }
    async addParticipant(conversationId, userId, requesterId) {
        await this.findOne(conversationId, requesterId);
        return this.prisma.participant.upsert({
            where: { conversationId_userId: { conversationId, userId } },
            create: { conversationId, userId },
            update: {},
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map