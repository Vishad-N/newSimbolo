import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
export declare class ActivityService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getGlobalFeed(filters: {
        eventType?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            } | null;
            order: {
                orderNumber: string;
            } | null;
            project: {
                id: string;
                name: string;
            } | null;
            client: ({
                user: {
                    firstName: string;
                    lastName: string;
                };
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
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProjectActivity(projectId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            } | null;
            deliverable: {
                id: string;
                title: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getClientActivity(clientId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
            order: {
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                orderNumber: string;
            } | null;
            project: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    recordActivity(data: {
        title: string;
        description?: string;
        eventType: string;
        projectId?: string;
        clientId?: string;
        orderId?: string;
        ticketId?: string;
        meetingId?: string;
        deliverableId?: string;
        userId?: string;
        metadata?: Record<string, any>;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        date: Date;
        description: string | null;
        title: string;
        metadata: string | null;
        clientId: string | null;
        orderId: string | null;
        eventType: string;
        projectId: string | null;
        ticketId: string | null;
        meetingId: string | null;
        deliverableId: string | null;
    }>;
    getEventTypes(): Promise<{
        eventTypes: string[];
    }>;
}
