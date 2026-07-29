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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let TransactionsService = class TransactionsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('TransactionsService');
        this.prisma = prisma;
    }
    async findAll(filters) {
        const { paymentId, status, type, startDate, endDate, page = 1, limit = 20 } = filters;
        const where = {};
        if (paymentId)
            where.paymentId = paymentId;
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                include: {
                    payment: {
                        select: {
                            paymentNumber: true,
                            amount: true,
                            currency: true,
                            gatewayProvider: true,
                            order: {
                                select: {
                                    orderNumber: true,
                                    client: {
                                        select: { user: { select: { firstName: true, lastName: true, email: true } } },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                payment: {
                    include: {
                        order: { include: { client: { include: { user: true } } } },
                    },
                },
            },
        });
        if (!transaction)
            throw new common_1.NotFoundException(`Transaction ${id} not found`);
        return transaction;
    }
    async findByPayment(paymentId) {
        return this.prisma.transaction.findMany({
            where: { paymentId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getRevenueAnalytics(startDate, endDate) {
        const where = { status: 'SUCCESS' };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const successfulTransactions = await this.prisma.transaction.findMany({
            where,
            include: { payment: { select: { currency: true } } },
        });
        const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalCount = successfulTransactions.length;
        const byType = successfulTransactions.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + t.amount;
            return acc;
        }, {});
        return {
            totalRevenue,
            totalCount,
            byType,
            currency: 'INR',
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map