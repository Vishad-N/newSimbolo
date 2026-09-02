import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class OrdersService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateOrderNumber;
    private readonly orderInclude;
    /**
     * A plain client (no `orders.manage`) may only ever see their own orders —
     * whatever `clientId` they passed in the query string is ignored and
     * replaced with their own ClientProfile id, so there is no way to view
     * another client's orders by tampering with the query param. Staff with
     * `orders.manage` can filter by any clientId, or omit it to see everyone's.
     */
    private resolveScopedClientId;
    findAllForRequester(user: JwtPayload, clientId?: string, status?: OrderStatusEnum, page?: number, limit?: number): Promise<{
        data: ({
            service: {
                id: string;
                name: string;
                slug: string;
            } | null;
            package: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
            } | null;
            project: {
                id: string;
                name: string;
                status: import(".prisma/client").$Enums.ProjectStatusEnum;
                progress: number;
            } | null;
            items: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                description: string | null;
                serviceId: string | null;
                packageId: string | null;
                orderId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
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
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            notes: string | null;
            serviceId: string | null;
            packageId: string | null;
            currency: string;
            clientId: string;
            orderNumber: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneForRequester(id: string, user: JwtPayload): Promise<Order>;
    findAll(clientId?: string, status?: OrderStatusEnum, page?: number, limit?: number): Promise<{
        data: ({
            service: {
                id: string;
                name: string;
                slug: string;
            } | null;
            package: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
            } | null;
            project: {
                id: string;
                name: string;
                status: import(".prisma/client").$Enums.ProjectStatusEnum;
                progress: number;
            } | null;
            items: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                description: string | null;
                serviceId: string | null;
                packageId: string | null;
                orderId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
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
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            notes: string | null;
            serviceId: string | null;
            packageId: string | null;
            currency: string;
            clientId: string;
            orderNumber: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Order>;
    checkout(dto: import('./dto/client-checkout.dto').ClientCheckoutDto, userId: string): Promise<Order>;
    create(dto: CreateOrderDto, createdBy?: string): Promise<Order>;
    update(id: string, dto: UpdateOrderDto, updatedBy?: string): Promise<Order>;
    private autoCreateProject;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}
