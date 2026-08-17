import { MilestoneStatusEnum } from '@prisma/client';
export declare class CreateMilestoneDto {
    projectId: string;
    title: string;
    description?: string;
    dueDate?: string;
    dependsOnId?: string;
    sortOrder?: number;
}
export declare class UpdateMilestoneDto {
    title?: string;
    description?: string;
    dueDate?: string;
    completedDate?: string;
    status?: MilestoneStatusEnum;
    sortOrder?: number;
    dependsOnId?: string;
}
