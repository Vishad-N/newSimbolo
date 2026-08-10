import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatusEnum } from '@prisma/client';
export declare class ProjectsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    private readonly projectInclude;
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
                    avatarUrl: string | null;
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
                state: string | null;
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
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
            progress: number;
            startDate: Date | null;
            description: string | null;
            slug: string;
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
    findOne(id: string): Promise<Project>;
    create(dto: CreateProjectDto, createdBy?: string): Promise<Project>;
    update(id: string, dto: UpdateProjectDto, updatedBy?: string): Promise<Project>;
    recalculateProgress(id: string): Promise<number>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}
