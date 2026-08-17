import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(dto: CreateConversationDto, req: any): Promise<{
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
    findMyConversations(req: any, page: number, limit: number): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    getMessages(id: string, req: any, page: number, limit: number): Promise<{
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
    sendMessage(conversationId: string, dto: SendMessageDto, req: any): Promise<{
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
    markAsRead(id: string, req: any): Promise<{
        marked: boolean;
    }>;
    deleteMessage(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        senderId: string;
        readAt: Date | null;
        conversationId: string;
    }>;
}
