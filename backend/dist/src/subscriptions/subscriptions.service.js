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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const email_service_1 = require("../shared/email/email.service");
const client_1 = require("@prisma/client");
let SubscriptionsService = class SubscriptionsService extends base_service_1.BaseService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        super('SubscriptionsService');
        this.prisma = prisma;
        this.emailService = emailService;
    }
    generateSubscriptionNumber() {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `SUB-${ts}-${rand}`;
    }
    computePeriodEnd(start, interval) {
        const end = new Date(start);
        if (interval === client_1.SubscriptionIntervalEnum.MONTHLY)
            end.setMonth(end.getMonth() + 1);
        else if (interval === client_1.SubscriptionIntervalEnum.QUARTERLY)
            end.setMonth(end.getMonth() + 3);
        else
            end.setFullYear(end.getFullYear() + 1);
        return end;
    }
    async create(dto, createdBy) {
        const client = await this.prisma.clientProfile.findFirst({
            where: { id: dto.clientId, deletedAt: null },
        });
        if (!client)
            throw new common_1.NotFoundException(`Client ${dto.clientId} not found`);
        const packageRecord = await this.prisma.package.findFirst({
            where: { id: dto.packageId, deletedAt: null },
        });
        if (!packageRecord)
            throw new common_1.NotFoundException(`Package ${dto.packageId} not found`);
        const interval = dto.interval ?? client_1.SubscriptionIntervalEnum.MONTHLY;
        const periodStart = dto.currentPeriodStart ? new Date(dto.currentPeriodStart) : new Date();
        const periodEnd = this.computePeriodEnd(periodStart, interval);
        const subscription = await this.prisma.subscription.create({
            data: {
                subscriptionNumber: this.generateSubscriptionNumber(),
                status: client_1.SubscriptionStatusEnum.TRIALING,
                interval,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                clientId: dto.clientId,
                packageId: dto.packageId,
                price: dto.price,
                currency: dto.currency ?? 'INR',
                razorpaySubscriptionId: dto.razorpaySubscriptionId ?? null,
                createdBy: createdBy ?? null,
            },
            include: {
                client: { include: { user: true } },
                package: { select: { id: true, name: true, type: true } },
            },
        });
        this.logger.log(`✅ Subscription created: ${subscription.subscriptionNumber}`);
        return subscription;
    }
    async findAll(clientId, status, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (clientId)
            where.clientId = clientId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                include: {
                    client: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
                    package: { select: { id: true, name: true, type: true, service: { select: { name: true } } } },
                    invoices: { select: { id: true, status: true, totalAmount: true }, orderBy: { createdAt: 'desc' }, take: 3 },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id, deletedAt: null },
            include: {
                client: { include: { user: true } },
                package: { include: { service: true, features: true } },
                invoices: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!subscription)
            throw new common_1.NotFoundException(`Subscription ${id} not found`);
        return subscription;
    }
    async findMySubscriptions(userId, page = 1, limit = 20) {
        const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
        if (!client)
            throw new common_1.NotFoundException('Client profile not found');
        return this.findAll(client.id, undefined, page, limit);
    }
    async update(id, dto, updatedBy) {
        await this.findOne(id);
        return this.prisma.subscription.update({
            where: { id },
            data: {
                ...(dto.status && { status: dto.status }),
                ...(dto.packageId && { packageId: dto.packageId }),
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.cancelAtPeriodEnd !== undefined && { cancelAtPeriodEnd: dto.cancelAtPeriodEnd }),
                updatedBy: updatedBy ?? null,
            },
            include: { client: { include: { user: true } }, package: true },
        });
    }
    async cancel(id, immediate = false, cancelledBy) {
        const subscription = await this.findOne(id);
        const client = subscription.client;
        if (immediate) {
            return this.prisma.subscription.update({
                where: { id },
                data: { status: client_1.SubscriptionStatusEnum.CANCELED, updatedBy: cancelledBy ?? null },
            });
        }
        // Cancel at period end
        const updated = await this.prisma.subscription.update({
            where: { id },
            data: { cancelAtPeriodEnd: true, updatedBy: cancelledBy ?? null },
        });
        await this.emailService.sendSubscriptionRenewalReminder(client.user.email, `${client.user.firstName} ${client.user.lastName}`, subscription.package?.name ?? 'Subscription', subscription.currentPeriodEnd, subscription.price);
        return updated;
    }
    async pause(id, pausedBy) {
        const sub = await this.findOne(id);
        if (sub.status !== client_1.SubscriptionStatusEnum.ACTIVE) {
            throw new common_1.BadRequestException('Only ACTIVE subscriptions can be paused');
        }
        return this.prisma.subscription.update({
            where: { id },
            data: { status: client_1.SubscriptionStatusEnum.PAUSED, updatedBy: pausedBy ?? null },
        });
    }
    async resume(id, resumedBy) {
        const sub = await this.findOne(id);
        if (sub.status !== client_1.SubscriptionStatusEnum.PAUSED) {
            throw new common_1.BadRequestException('Only PAUSED subscriptions can be resumed');
        }
        return this.prisma.subscription.update({
            where: { id },
            data: { status: client_1.SubscriptionStatusEnum.ACTIVE, updatedBy: resumedBy ?? null },
        });
    }
    /**
     * Finds subscriptions expiring within 7 days and sends renewal reminders.
     * Designed to be called by a scheduled job or cron.
     */
    async sendRenewalReminders() {
        const now = new Date();
        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
        const expiringSoon = await this.prisma.subscription.findMany({
            where: {
                status: client_1.SubscriptionStatusEnum.ACTIVE,
                cancelAtPeriodEnd: false,
                currentPeriodEnd: { gte: now, lte: sevenDaysLater },
                deletedAt: null,
            },
            include: {
                client: { include: { user: true } },
                package: { select: { name: true } },
            },
        });
        let sent = 0;
        for (const sub of expiringSoon) {
            const client = sub.client;
            await this.emailService.sendSubscriptionRenewalReminder(client.user.email, `${client.user.firstName} ${client.user.lastName}`, sub.package?.name ?? 'Subscription', sub.currentPeriodEnd, sub.price);
            sent++;
        }
        this.logger.log(`📧 Sent ${sent} subscription renewal reminders`);
        return sent;
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map