import { ProjectStatusEnum, ProjectPriorityEnum } from '@prisma/client';
export declare class UpdateProjectDto {
    name?: string;
    description?: string;
    managerId?: string;
    status?: ProjectStatusEnum;
    priority?: ProjectPriorityEnum;
    budget?: number;
    progress?: number;
    startDate?: string;
    targetEndDate?: string;
    actualEndDate?: string;
}
