"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let OrdersService = class OrdersService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('OrdersService');
        this.prisma = prisma;
    }
    generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }
    orderInclude = {
        client: {
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                company: { select: { id: true, name: true } },
            },
        },
        package: { select: { id: true, name: true, type: true } },
        service: { select: { id: true, name: true, slug: true } },
        items: true,
        project: { select: { id: true, name: true, status: true, progress: true } },
    };
    /**
     * A plain client (no `orders.manage`) may only ever see their own orders —
     * whatever `clientId` they passed in the query string is ignored and
     * replaced with their own ClientProfile id, so there is no way to view
     * another client's orders by tampering with the query param. Staff with
     * `orders.manage` can filter by any clientId, or omit it to see everyone's.
     */
    async resolveScopedClientId(user, requestedClientId) {
        const isStaff = user.permissions?.includes('orders.manage') || user.role === 'SUPER_ADMIN';
        if (isStaff)
            return requestedClientId;
        const ownProfile = await this.prisma.clientProfile.findUnique({
            where: { userId: user.sub },
            select: { id: true },
        });
        if (!ownProfile) {
            throw new custom_exceptions_1.CustomForbiddenException('No client profile found for this account.');
        }
        return ownProfile.id;
    }
    async findAllForRequester(user, clientId, status, page = 1, limit = 20) {
        const scopedClientId = await this.resolveScopedClientId(user, clientId);
        return this.findAll(scopedClientId, status, page, limit);
    }
    async findOneForRequester(id, user) {
        const order = await this.findOne(id);
        const isStaff = user.permissions?.includes('orders.manage') || user.role === 'SUPER_ADMIN';
        if (isStaff)
            return order;
        const ownProfile = await this.prisma.clientProfile.findUnique({
            where: { userId: user.sub },
            select: { id: true },
        });
        // 404 (not 403) so a client can't use this to confirm another client's
        // order ID exists, matching the pattern used for invoices/projects.
        if (!ownProfile || order.clientId !== ownProfile.id) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        return order;
    }
    async findAll(clientId, status, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (clientId)
            where.clientId = clientId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: this.orderInclude,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const order = await this.prisma.order.findFirst({
            where: { id, deletedAt: null },
            include: {
                ...this.orderInclude,
                payments: { orderBy: { createdAt: 'desc' } },
                invoices: { orderBy: { createdAt: 'desc' } },
                timelines: { orderBy: { date: 'desc' } },
            },
        });
        return this.checkEntityExists(order, 'Order', id);
    }
    async checkout(dto, userId) {
        // 1. Get or create ClientProfile for the user
        let client = await this.prisma.clientProfile.findUnique({
            where: { userId },
        });
        if (!client) {
            client = await this.prisma.clientProfile.create({
                data: { userId },
            });
        }
        // 2. Fetch package to get amount
        const pkg = await this.prisma.package.findUnique({
            where: { id: dto.packageId, deletedAt: null },
        });
        if (!pkg) {
            throw new common_1.NotFoundException(`Package with ID ${dto.packageId} not found`);
        }
        // 3. Create Order
        return this.prisma.order.create({
            data: {
                orderNumber: this.generateOrderNumber(),
                clientId: client.id,
                packageId: pkg.id,
                serviceId: pkg.serviceId,
                status: client_1.OrderStatusEnum.PENDING_PAYMENT,
                totalAmount: pkg.basePrice,
                netAmount: pkg.basePrice,
                currency: 'INR',
            },
        });
    }
    async create(dto, createdBy) {
        const client = await this.prisma.clientProfile.findFirst({ where: { id: dto.clientId, deletedAt: null } });
        if (!client)
            throw new common_1.NotFoundException(`Client with ID ${dto.clientId} not found`);
        const orderNumber = this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                clientId: dto.clientId,
                packageId: dto.packageId ?? null,
                serviceId: dto.serviceId ?? null,
                totalAmount: dto.totalAmount,
                taxAmount: dto.taxAmount ?? 0.0,
                discountAmount: dto.discountAmount ?? 0.0,
                netAmount: dto.netAmount,
                currency: dto.currency ?? 'INR',
                notes: dto.notes ?? null,
                status: dto.status ?? client_1.OrderStatusEnum.PENDING_PAYMENT,
                createdBy: createdBy ?? null,
            },
            include: this.orderInclude,
        });
        // Log activity timeline
        await this.prisma.timeline.create({
            data: {
                title: `Order ${orderNumber} created`,
                description: `New order placed for ₹${dto.netAmount} ${dto.currency ?? 'INR'}`,
                eventType: 'ORDER_CREATED',
                clientId: dto.clientId,
                orderId: order.id,
            },
        });
        return order;
    }
    async update(id, dto, updatedBy) {
        const existing = await this.findOne(id);
        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
                ...(dto.totalAmount !== undefined && { totalAmount: dto.totalAmount }),
                ...(dto.taxAmount !== undefined && { taxAmount: dto.taxAmount }),
                ...(dto.discountAmount !== undefined && { discountAmount: dto.discountAmount }),
                ...(dto.netAmount !== undefined && { netAmount: dto.netAmount }),
                updatedBy: updatedBy ?? null,
            },
            include: this.orderInclude,
        });
        // Log status change activity
        if (dto.status && dto.status !== existing.status) {
            await this.prisma.timeline.create({
                data: {
                    title: `Order status changed to ${dto.status}`,
                    description: `Order ${existing.orderNumber} transitioned from ${existing.status} to ${dto.status}`,
                    eventType: 'ORDER_STATUS_CHANGED',
                    clientId: existing.clientId,
                    orderId: id,
                    userId: updatedBy ?? null,
                },
            });
            // Auto-create project when order is confirmed
            if (dto.status === client_1.OrderStatusEnum.CONFIRMED) {
                await this.autoCreateProject(updated, updatedBy);
            }
        }
        return updated;
    }
    async autoCreateProject(order, createdBy) {
        const existingProject = await this.prisma.project.findUnique({ where: { orderId: order.id } });
        if (existingProject)
            return;
        const slug = `project-${order.orderNumber.toLowerCase()}-${Date.now()}`;
        const project = await this.prisma.project.create({
            data: {
                name: `Project for ${order.orderNumber}`,
                slug,
                status: 'PLANNING',
                priority: 'MEDIUM',
                orderId: order.id,
                clientId: order.clientId,
                createdBy: createdBy ?? null,
            },
        });
        await this.prisma.timeline.create({
            data: {
                title: `Project created from confirmed order`,
                description: `Project "${project.name}" was automatically created when order ${order.orderNumber} was confirmed`,
                eventType: 'PROJECT_CREATED_FROM_ORDER',
                clientId: order.clientId,
                orderId: order.id,
            },
        });
    }
    async softDelete(id, deletedBy) {
        await this.findOne(id);
        await this.prisma.order.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: deletedBy ?? null } });
        return { message: `Order ${id} has been cancelled` };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map