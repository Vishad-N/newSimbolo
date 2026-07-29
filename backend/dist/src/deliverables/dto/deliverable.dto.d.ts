import { DeliverableStatusEnum } from '@prisma/client';
export declare class CreateDeliverableDto {
    projectId: string;
    title: string;
    description?: string;
    mediaAssetId?: string;
}
export declare class UpdateDeliverableDto {
    title?: string;
    description?: string;
    status?: DeliverableStatusEnum;
    revisionNotes?: string;
    clientFeedback?: string;
    mediaAssetId?: string;
}
