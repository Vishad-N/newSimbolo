export declare enum AiCapability {
    BLOG_DRAFT = "BLOG_DRAFT",
    IMPROVE_CONTENT = "IMPROVE_CONTENT",
    SEO_RECOMMENDATIONS = "SEO_RECOMMENDATIONS",
    META_TITLE = "META_TITLE",
    META_DESCRIPTION = "META_DESCRIPTION",
    FAQ_GENERATION = "FAQ_GENERATION",
    SERVICE_DESCRIPTION = "SERVICE_DESCRIPTION",
    MARKETING_COPY = "MARKETING_COPY",
    LANDING_PAGE_COPY = "LANDING_PAGE_COPY",
    EMAIL_DRAFT = "EMAIL_DRAFT"
}
export declare class AiGenerationDto {
    capability: AiCapability;
    prompt: string;
    content?: string;
    tone?: string;
}
export interface AiGenerationResult {
    provider: string;
    capability: AiCapability;
    output: string;
    suggestions: string[];
    generatedAt: string;
}
