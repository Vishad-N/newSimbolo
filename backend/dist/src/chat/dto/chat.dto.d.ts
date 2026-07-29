export declare class SendMessageDto {
    conversationId: string;
    content: string;
    attachmentIds?: string[];
}
export declare class CreateConversationDto {
    title?: string;
    projectId?: string;
    supportTicketId?: string;
    participantIds: string[];
}
