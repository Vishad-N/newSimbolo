import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto, UpdateDeliverableDto } from './dto/deliverable.dto';
import { DeliverableStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class DeliverablesController {
    private readonly deliverablesService;
    constructor(deliverablesService: DeliverablesService);
    findAll(projectId: string, status?: DeliverableStatusEnum): Promise<({
        project: {
            id: string;
            name: string;
            clientId: string;
        };
        mediaAsset: {
            id: string;
            fileName: string;
            mimeType: string;
            sizeBytes: number;
            cdnUrl: string;
        } | null;
        versionHistory: ({
            mediaAsset: {
                id: string;
                fileName: string;
                cdnUrl: string;
            };
        } & {
            id: string;
            notes: string | null;
            deliverableId: string;
            mediaAssetId: string;
            versionNumber: number;
            uploadedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliverableStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        version: number;
        description: string | null;
        title: string;
        projectId: string;
        mediaAssetId: string | null;
        revisionNotes: string | null;
        clientFeedback: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliverableStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        version: number;
        description: string | null;
        title: string;
        projectId: string;
        mediaAssetId: string | null;
        revisionNotes: string | null;
        clientFeedback: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
    }>;
    create(dto: CreateDeliverableDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliverableStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        version: number;
        description: string | null;
        title: string;
        projectId: string;
        mediaAssetId: string | null;
        revisionNotes: string | null;
        clientFeedback: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
    }>;
    update(id: string, dto: UpdateDeliverableDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DeliverableStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        version: number;
        description: string | null;
        title: string;
        projectId: string;
        mediaAssetId: string | null;
        revisionNotes: string | null;
        clientFeedback: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
