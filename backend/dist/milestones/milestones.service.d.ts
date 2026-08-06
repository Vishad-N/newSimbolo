import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';
import { ProjectMilestone } from '@prisma/client';
export declare class MilestonesService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(projectId: string): Promise<({
        tasks: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatusEnum;
            title: string;
        }[];
        dependsOn: {
            id: string;
            status: import(".prisma/client").$Enums.MilestoneStatusEnum;
            title: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatusEnum;
        updatedAt: Date;
        description: string | null;
        title: string;
        sortOrder: number;
        projectId: string;
        dueDate: Date | null;
        dependsOnId: string | null;
        completedDate: Date | null;
    })[]>;
    findOne(id: string): Promise<ProjectMilestone>;
    create(dto: CreateMilestoneDto): Promise<ProjectMilestone>;
    update(id: string, dto: UpdateMilestoneDto): Promise<ProjectMilestone>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
