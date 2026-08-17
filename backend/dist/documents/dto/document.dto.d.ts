import { DocumentCategoryEnum } from '@prisma/client';
export declare class CreateDocumentDto {
    title: string;
    description?: string;
    category?: DocumentCategoryEnum;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
    clientId?: string;
    projectId?: string;
    companyId?: string;
    isPublic?: boolean;
}
export declare class UpdateDocumentDto {
    title?: string;
    description?: string;
    category?: DocumentCategoryEnum;
    isPublic?: boolean;
}
