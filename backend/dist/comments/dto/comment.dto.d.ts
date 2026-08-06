export declare enum CommentEntityType {
    TASK = "TASK"
}
export declare class CreateCommentDto {
    entityType: CommentEntityType;
    entityId: string;
    message: string;
}
export declare class UpdateCommentDto {
    message: string;
}
