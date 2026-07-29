import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(clientId?: string, status?: ProjectStatusEnum, managerId?: string, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                orderNumber: string;
            };
            teamMembers: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    avatar: never;
                };
            } & {
                role: string;
                id: string;
                userId: string;
                projectId: string;
                responsibilities: string | null;
                assignedAt: Date;
            })[];
            _count: {
                deliverables: number;
                milestones: number;
                tasks: number;
            };
            client: {
                user: {
                    email: string;
                    id: string;
                    firstName: string;
                    lastName: string;
                };
                company: {
                    id: string;
                    name: string;
                } | null;
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
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
            };
            manager: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            priority: import(".prisma/client").$Enums.ProjectPriorityEnum;
            description: string | null;
            slug: string;
            progress: number;
            startDate: Date | null;
            clientId: string;
            budget: number | null;
            orderId: string;
            managerId: string | null;
            targetEndDate: Date | null;
            actualEndDate: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ProjectStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.ProjectPriorityEnum;
        description: string | null;
        slug: string;
        progress: number;
        startDate: Date | null;
        clientId: string;
        budget: number | null;
        orderId: string;
        managerId: string | null;
        targetEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    recalculateProgress(id: string): Promise<{
        progress: number;
        message: string;
    }>;
    create(dto: CreateProjectDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ProjectStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.ProjectPriorityEnum;
        description: string | null;
        slug: string;
        progress: number;
        startDate: Date | null;
        clientId: string;
        budget: number | null;
        orderId: string;
        managerId: string | null;
        targetEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    update(id: string, dto: UpdateProjectDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.ProjectStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.ProjectPriorityEnum;
        description: string | null;
        slug: string;
        progress: number;
        startDate: Date | null;
        clientId: string;
        budget: number | null;
        orderId: string;
        managerId: string | null;
        targetEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
