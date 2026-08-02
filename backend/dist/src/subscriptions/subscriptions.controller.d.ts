import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { SubscriptionStatusEnum } from '@prisma/client';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(dto: CreateSubscriptionDto, req: any): Promise<{
        package: {
            id: string;
            name: string;
            type: import(".prisma/client").$Enums.PackageTypeEnum;
        };
        client: {
            user: {
                email: string;
                id: string;
                createdAt: Date;
                passwordHash: string | null;
                firstName: string;
                lastName: string;
                phone: string | null;
                avatarUrl: string | null;
                status: import(".prisma/client").$Enums.UserStatusEnum;
                roleId: string;
                organizationId: string | null;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
    findAll(page: number, limit: number, status?: SubscriptionStatusEnum, clientId?: string): Promise<{
        data: ({
            package: {
                service: {
                    name: string;
                };
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
            };
            invoices: {
                id: string;
                status: import(".prisma/client").$Enums.InvoiceStatusEnum;
                totalAmount: number;
            }[];
            client: {
                user: {
                    email: string;
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
            subscriptionNumber: string;
            interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            stripeSubscriptionId: string | null;
            razorpaySubscriptionId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMySubscriptions(req: any, page: number, limit: number): Promise<{
        data: ({
            package: {
                service: {
                    name: string;
                };
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
            };
            invoices: {
                id: string;
                status: import(".prisma/client").$Enums.InvoiceStatusEnum;
                totalAmount: number;
            }[];
            client: {
                user: {
                    email: string;
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
            subscriptionNumber: string;
            interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            stripeSubscriptionId: string | null;
            razorpaySubscriptionId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    sendRenewalReminders(): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<{
        package: {
            service: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                type: import(".prisma/client").$Enums.ServiceTypeEnum;
                slug: string;
                shortDescription: string;
                fullDescription: string | null;
                iconUrl: string | null;
                basePrice: number;
                categoryId: string | null;
                seoPageId: string | null;
            };
            features: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                isIncluded: boolean;
                packageId: string;
                limitValue: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.PackageTypeEnum;
            description: string | null;
            slug: string;
            serviceId: string;
            basePrice: number;
            seoPageId: string | null;
            billingInterval: string;
            isPopular: boolean;
            isCustom: boolean;
        };
        invoices: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
        }[];
        client: {
            user: {
                email: string;
                id: string;
                createdAt: Date;
                passwordHash: string | null;
                firstName: string;
                lastName: string;
                phone: string | null;
                avatarUrl: string | null;
                status: import(".prisma/client").$Enums.UserStatusEnum;
                roleId: string;
                organizationId: string | null;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
    update(id: string, dto: UpdateSubscriptionDto, req: any): Promise<{
        package: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.PackageTypeEnum;
            description: string | null;
            slug: string;
            serviceId: string;
            basePrice: number;
            seoPageId: string | null;
            billingInterval: string;
            isPopular: boolean;
            isCustom: boolean;
        };
        client: {
            user: {
                email: string;
                id: string;
                createdAt: Date;
                passwordHash: string | null;
                firstName: string;
                lastName: string;
                phone: string | null;
                avatarUrl: string | null;
                status: import(".prisma/client").$Enums.UserStatusEnum;
                roleId: string;
                organizationId: string | null;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
    cancel(id: string, immediate: string, req: any): Promise<{
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
    pause(id: string, req: any): Promise<{
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
    resume(id: string, req: any): Promise<{
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
        subscriptionNumber: string;
        interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
        razorpaySubscriptionId: string | null;
    }>;
}
