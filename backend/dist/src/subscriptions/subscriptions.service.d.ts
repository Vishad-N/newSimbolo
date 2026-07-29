import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { SubscriptionStatusEnum } from '@prisma/client';
export declare class SubscriptionsService extends BaseService {
    private readonly prisma;
    private readonly emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    private generateSubscriptionNumber;
    private computePeriodEnd;
    create(dto: CreateSubscriptionDto, createdBy?: string): Promise<{
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
    findAll(clientId?: string, status?: SubscriptionStatusEnum, page?: number, limit?: number): Promise<{
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
            basePrice: number;
            serviceId: string;
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
    findMySubscriptions(userId: string, page?: number, limit?: number): Promise<{
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
    update(id: string, dto: UpdateSubscriptionDto, updatedBy?: string): Promise<{
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
            basePrice: number;
            serviceId: string;
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
    cancel(id: string, immediate?: boolean, cancelledBy?: string): Promise<{
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
    pause(id: string, pausedBy?: string): Promise<{
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
    resume(id: string, resumedBy?: string): Promise<{
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
    /**
     * Finds subscriptions expiring within 7 days and sends renewal reminders.
     * Designed to be called by a scheduled job or cron.
     */
    sendRenewalReminders(): Promise<number>;
}
