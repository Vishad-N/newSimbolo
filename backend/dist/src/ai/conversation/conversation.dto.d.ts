export declare class ChatRequestDto {
    sessionId: string;
    message: string;
    context?: Record<string, any>;
}
export declare class ChatResponseDto {
    intent: string;
    content: string;
    recommendations?: string[];
    data?: Record<string, any>;
}
