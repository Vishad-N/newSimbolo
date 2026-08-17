import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateDeliverableDto, UpdateDeliverableDto } from './dto/deliverable.dto';
import { Deliverable, DeliverableStatusEnum } from '@prisma/client';
export declare class DeliverablesService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly deliverableInclude;
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
    findOne(id: string): Promise<Deliverable>;
    create(dto: CreateDeliverableDto, createdBy?: string): Promise<Deliverable>;
    update(id: string, dto: UpdateDeliverableDto, updatedBy?: string): Promise<Deliverable>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}
