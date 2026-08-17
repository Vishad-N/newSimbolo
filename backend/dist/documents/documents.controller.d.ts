import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { DocumentCategoryEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findAll(clientId?: string, projectId?: string, category?: DocumentCategoryEnum, page?: number, limit?: number): Promise<{
        data: ({
            company: {
                id: string;
                name: string;
            } | null;
            project: {
                id: string;
                name: string;
            } | null;
            client: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                status: string;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                state: string | null;
                companyId: string | null;
                accountManagerId: string | null;
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                notes: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
            }) | null;
            uploadedBy: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            version: number;
            description: string | null;
            title: string;
            isPublic: boolean;
            companyId: string | null;
            mimeType: string | null;
            uploadedById: string | null;
            category: import(".prisma/client").$Enums.DocumentCategoryEnum;
            clientId: string | null;
            projectId: string | null;
            fileUrl: string;
            fileSize: number | null;
            downloadCount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        version: number;
        description: string | null;
        title: string;
        isPublic: boolean;
        companyId: string | null;
        mimeType: string | null;
        uploadedById: string | null;
        category: import(".prisma/client").$Enums.DocumentCategoryEnum;
        clientId: string | null;
        projectId: string | null;
        fileUrl: string;
        fileSize: number | null;
        downloadCount: number;
    }>;
    trackDownload(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        version: number;
        description: string | null;
        title: string;
        isPublic: boolean;
        companyId: string | null;
        mimeType: string | null;
        uploadedById: string | null;
        category: import(".prisma/client").$Enums.DocumentCategoryEnum;
        clientId: string | null;
        projectId: string | null;
        fileUrl: string;
        fileSize: number | null;
        downloadCount: number;
    }>;
    create(dto: CreateDocumentDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        version: number;
        description: string | null;
        title: string;
        isPublic: boolean;
        companyId: string | null;
        mimeType: string | null;
        uploadedById: string | null;
        category: import(".prisma/client").$Enums.DocumentCategoryEnum;
        clientId: string | null;
        projectId: string | null;
        fileUrl: string;
        fileSize: number | null;
        downloadCount: number;
    }>;
    update(id: string, dto: UpdateDocumentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        version: number;
        description: string | null;
        title: string;
        isPublic: boolean;
        companyId: string | null;
        mimeType: string | null;
        uploadedById: string | null;
        category: import(".prisma/client").$Enums.DocumentCategoryEnum;
        clientId: string | null;
        projectId: string | null;
        fileUrl: string;
        fileSize: number | null;
        downloadCount: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
