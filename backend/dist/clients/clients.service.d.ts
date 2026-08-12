import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientProfile } from '@prisma/client';
export declare class ClientsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly clientInclude;
    findAll(search?: string, status?: string, companyId?: string, accountManagerId?: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                avatarUrl: string | null;
                status: import(".prisma/client").$Enums.UserStatusEnum;
            };
            company: {
                id: string;
                name: string;
                slug: string;
                industry: string | null;
                logoUrl: string | null;
            } | null;
            _count: {
                orders: number;
                projects: number;
                supportTickets: number;
            };
            accountManager: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
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
            companyId: string | null;
            accountManagerId: string | null;
            gstNumber: string | null;
            billingAddress: string | null;
            timezone: string;
            notes: string | null;
            legalName: string | null;
            stateCode: string | null;
            pincode: string | null;
            country: string | null;
            gstRegistered: boolean;
            gstinVerified: boolean;
            gstinVerifiedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<ClientProfile>;
    findByUserId(userId: string): Promise<ClientProfile>;
    create(dto: CreateClientDto, createdBy?: string): Promise<ClientProfile>;
    update(id: string, dto: UpdateClientDto, updatedBy?: string): Promise<ClientProfile>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
    getClientTimeline(clientId: string, page?: number, limit?: number): Promise<{
        data: {
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
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getClientDashboard(clientId: string): Promise<{
        activeProjects: number;
        pendingDeliverables: number;
        upcomingMeetings: number;
        openTickets: number;
        recentOrders: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatusEnum;
            currency: string;
            orderNumber: string;
            totalAmount: number;
        }[];
    }>;
}
