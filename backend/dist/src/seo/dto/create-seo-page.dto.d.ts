export declare class CreateSeoPageDto {
    path: string;
    metaTitle: string;
    metaDescription: string;
    keywords?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageId?: string | null;
    twitterCard?: string;
    schemaJson?: string;
    indexable?: boolean;
    followable?: boolean;
}
