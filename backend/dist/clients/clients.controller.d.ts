import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientWithPlanDto } from './dto/create-client-with-plan.dto';
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
                countryCode: string | null;
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
    }>;
    createManualClient(dto: CreateClientWithPlanDto, user: JwtPayload): Promise<{
        user: {
            email: string;
            role: {
                id: string;
                name: string;
                slug: string;
            };
            id: string;
            firstName: string;
            lastName: string;
            countryCode: string | null;
            phone: string | null;
            status: import(".prisma/client").$Enums.UserStatusEnum;
        };
        client: {
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
                countryCode: string | null;
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
        };
        subscription: ({
            package: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
                basePrice: number;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            packageId: string;
            currency: string;
            price: number;
            clientId: string;
            interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
            currentPeriodStart: Date;
            subscriptionNumber: string;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            stripeSubscriptionId: string | null;
            razorpaySubscriptionId: string | null;
        }) | null;
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
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
