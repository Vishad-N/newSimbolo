import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
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
            gstNumber: string | null;
            billingAddress: string | null;
            timezone: string;
            companyId: string | null;
            accountManagerId: string | null;
            notes: string | null;
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
    }>;
    findByUserId(userId: string): Promise<{
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
    }>;
    getTimeline(id: string, page?: number, limit?: number): Promise<{
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
    getDashboard(id: string): Promise<{
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
    create(dto: CreateClientDto, user: JwtPayload): Promise<{
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
    }>;
    update(id: string, dto: UpdateClientDto, user: JwtPayload): Promise<{
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
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
