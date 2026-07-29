import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';
export declare class MilestonesController {
    private readonly milestonesService;
    constructor(milestonesService: MilestonesService);
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
    findOne(id: string): Promise<{
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
    }>;
    create(dto: CreateMilestoneDto): Promise<{
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
    }>;
    update(id: string, dto: UpdateMilestoneDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
