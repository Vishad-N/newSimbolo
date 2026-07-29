import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateCommentDto, UpdateCommentDto, CommentEntityType } from './dto/comment.dto';
export declare class CommentsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCommentDto, senderId: string): Promise<{
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string;
        senderId: string;
    }>;
    findByEntity(entityType: CommentEntityType, entityId: string, page?: number, limit?: number): Promise<{
        data: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            senderId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, dto: UpdateCommentDto, requesterId: string): Promise<{
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string;
        senderId: string;
    }>;
    remove(id: string, requesterId: string): Promise<{
        message: string;
    }>;
}
