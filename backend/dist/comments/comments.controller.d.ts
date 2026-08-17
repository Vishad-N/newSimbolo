import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, CommentEntityType } from './dto/comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(dto: CreateCommentDto, req: any): Promise<{
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
    findByEntity(entityType: CommentEntityType, entityId: string, page: number, limit: number): Promise<{
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
    update(id: string, dto: UpdateCommentDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
