import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { StorageService } from '../storage/storage.service';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
import { Document, DocumentCategoryEnum } from '@prisma/client';
export declare class DocumentsService extends BaseService {
    private readonly prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
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
    findOne(id: string): Promise<Document>;
    /** Self-service listing: a client only ever sees their own documents, regardless of query params. */
    findMyDocuments(userId: string, category?: DocumentCategoryEnum, page?: number, limit?: number): Promise<{
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
    /**
     * Same as findOne, but scoped to the requester: a client can only fetch a
     * document tied to their own ClientProfile (or one with no client at all is
     * treated as staff-only). Staff roles can fetch any document. Returns 404 (not
     * 403) for a non-owned document so a client can't use this to confirm another
     * client's document ID exists.
     */
    findOneForRequester(id: string, requester: {
        sub?: string;
        role?: string;
    }): Promise<Document>;
    /**
     * Uploads a real file to storage and registers it as a Document in one step.
     * A client caller always uploads to their OWN ClientProfile — any clientId in
     * the DTO is ignored for non-staff requesters, same ownership rule as reads.
     */
    uploadDocument(file: Express.Multer.File | undefined, dto: UploadDocumentDto, requester: {
        sub?: string;
        role?: string;
    }): Promise<Document>;
    create(dto: CreateDocumentDto, uploadedById?: string): Promise<Document>;
    update(id: string, dto: UpdateDocumentDto): Promise<Document>;
    trackDownload(id: string): Promise<Document>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
}
