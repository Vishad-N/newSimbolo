import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { Document, DocumentCategoryEnum } from '@prisma/client';
export declare class DocumentsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
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
    findOne(id: string): Promise<Document>;
    create(dto: CreateDocumentDto, uploadedById?: string): Promise<Document>;
    update(id: string, dto: UpdateDocumentDto): Promise<Document>;
    trackDownload(id: string): Promise<Document>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
}
