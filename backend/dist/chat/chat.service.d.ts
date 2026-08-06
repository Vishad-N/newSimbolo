import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { SendMessageDto, CreateConversationDto } from './dto/chat.dto';
export declare class ChatService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly conversationInclude;
    findUserConversations(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            project: {
                id: string;
                name: string;
                status: import(".prisma/client").$Enums.ProjectStatusEnum;
            } | null;
            supportTicket: {
                id: string;
                subject: string;
                ticketNumber: string;
            } | null;
            messages: ({
                sender: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string;
                senderId: string;
                readAt: Date | null;
                conversationId: string;
            })[];
            participants: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                };
            } & {
                id: string;
                userId: string;
                joinedAt: Date;
                conversationId: string;
                lastReadAt: Date | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            title: string | null;
            projectId: string | null;
            supportTicketId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, requesterId: string): Promise<{
        project: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
        } | null;
        supportTicket: {
            id: string;
            subject: string;
            ticketNumber: string;
        } | null;
        participants: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            conversationId: string;
            lastReadAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string | null;
        projectId: string | null;
        supportTicketId: string | null;
    }>;
    createConversation(dto: CreateConversationDto, creatorId: string): Promise<{
        project: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
        } | null;
        supportTicket: {
            id: string;
            subject: string;
            ticketNumber: string;
        } | null;
        participants: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            conversationId: string;
            lastReadAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string | null;
        projectId: string | null;
        supportTicketId: string | null;
    }>;
    getMessages(conversationId: string, requesterId: string, page?: number, limit?: number): Promise<{
        data: ({
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
                    mimeType: string;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    sendMessage(dto: SendMessageDto, senderId: string): Promise<{
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
    }>;
    markAsRead(conversationId: string, userId: string): Promise<{
        marked: boolean;
    }>;
    softDeleteMessage(messageId: string, requesterId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        senderId: string;
        readAt: Date | null;
        conversationId: string;
    }>;
    addParticipant(conversationId: string, userId: string, requesterId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        conversationId: string;
        lastReadAt: Date | null;
    }>;
}
