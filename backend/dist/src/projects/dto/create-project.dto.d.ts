import { ProjectStatusEnum, ProjectPriorityEnum } from '@prisma/client';
export declare class CreateProjectDto {
    name: string;
    description?: string;
    orderId: string;
    clientId: string;
    managerId?: string;
    status?: ProjectStatusEnum;
    priority?: ProjectPriorityEnum;
    budget?: number;
    startDate?: string;
    targetEndDate?: string;
}
