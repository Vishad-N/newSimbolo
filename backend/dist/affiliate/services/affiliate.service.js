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
var AffiliateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const audit_service_1 = require("../../shared/audit/audit.service");
const affiliate_settings_service_1 = require("./affiliate-settings.service");
const employee_code_util_1 = require("../utils/employee-code.util");
/** Deliberately generic — never leaks whether a code exists but is inactive vs. does not exist. */
const GENERIC_INVALID_MESSAGE = 'Invalid or inactive employee code';
let AffiliateService = class AffiliateService extends base_service_1.BaseService {
    static { AffiliateService_1 = this; }
    prisma;
    auditService;
    settingsService;
    static CODE_GENERATION_MAX_ATTEMPTS = 5;
    constructor(prisma, auditService, settingsService) {
        super('AffiliateService');
        this.prisma = prisma;
        this.auditService = auditService;
        this.settingsService = settingsService;
    }
    // ── Validation ────────────────────────────────────────────────────────────
    /**
     * Server-side source of truth for whether an employee code may be applied to a
     * checkout. This is re-run independently at payment-order creation time — the
     * frontend's earlier /checkout/affiliate/validate call is treated as UX only and
     * is never trusted.
     *
     * @param code            raw user input (trimmed/uppercased internally)
     * @param requestingUserId the user the purchase is FOR (used for self-referral checks)
     */
    async validateEmployeeCode(code, requestingUserId) {
        const normalized = (0, employee_code_util_1.normalizeEmployeeCode)(code);
        if (!employee_code_util_1.EMPLOYEE_CODE_REGEX.test(normalized)) {
            return { valid: false, message: GENERIC_INVALID_MESSAGE };
        }
        // Codes are always stored uppercase, so an exact match is inherently case-insensitive
        // from the caller's perspective once normalized above.
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { affiliateCode: normalized, deletedAt: null },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
        if (!affiliate)
            return { valid: false, message: GENERIC_INVALID_MESSAGE };
        if (affiliate.status !== client_1.AffiliateStatusEnum.ACTIVE)
            return { valid: false, message: GENERIC_INVALID_MESSAGE };
        if (!affiliate.isEligibleForCommission)
            return { valid: false, message: GENERIC_INVALID_MESSAGE };
        if (requestingUserId && affiliate.userId === requestingUserId) {
            const settings = await this.settingsService.get();
            if (!settings.selfReferralAllowed) {
                return { valid: false, message: GENERIC_INVALID_MESSAGE };
            }
        }
        return {
            valid: true,
            affiliate: affiliate,
            displayName: this.toDisplayName(affiliate.user.firstName, affiliate.user.lastName),
        };
    }
    /** "Rahul Kumar" -> "Rahul K." — enough for the customer to recognise, no data leak. */
    toDisplayName(firstName, lastName) {
        const first = (firstName ?? '').trim();
        const initial = (lastName ?? '').trim().charAt(0);
        if (!first)
            return initial ? `${initial}.` : 'Sales Employee';
        return initial ? `${first} ${initial.toUpperCase()}.` : first;
    }
    // ── Self-service lookups ──────────────────────────────────────────────────
    /** Resolves the Affiliate profile owned by the authenticated user. 404 if none. */
    async getMyAffiliateOrThrow(userId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { userId, deletedAt: null },
            include: { wallet: { select: { id: true } } },
        });
        if (!affiliate)
            throw new common_1.NotFoundException('No sales employee profile found for this account');
        return affiliate;
    }
    async getMyProfile(userId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { userId, deletedAt: null },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                wallet: true,
            },
        });
        if (!affiliate)
            throw new common_1.NotFoundException('No sales employee profile found for this account');
        const [totalSales, pendingCommission, creditedCommission] = await Promise.all([
            this.prisma.commission.count({ where: { affiliateId: affiliate.id } }),
            this.prisma.commission.aggregate({
                where: { affiliateId: affiliate.id, status: { in: ['PENDING', 'ELIGIBLE'] } },
                _sum: { commissionAmount: true },
            }),
            this.prisma.commission.aggregate({
                where: { affiliateId: affiliate.id, status: 'CREDITED' },
                _sum: { commissionAmount: true },
            }),
        ]);
        return {
            ...affiliate,
            stats: {
                totalSales,
                pendingCommission: pendingCommission._sum.commissionAmount ?? 0,
                creditedCommission: creditedCommission._sum.commissionAmount ?? 0,
            },
        };
    }
    /** Orders attributed to this affiliate (derived from Commission rows — the attribution record). */
    async getMySales(userId, page = 1, limit = 20) {
        const affiliate = await this.getMyAffiliateOrThrow(userId);
        return this.listSales({ affiliateId: affiliate.id, page, limit });
    }
    async getMyCommissions(userId, page = 1, limit = 20, status) {
        const affiliate = await this.getMyAffiliateOrThrow(userId);
        return this.listCommissions({ affiliateId: affiliate.id, page, limit, status: status });
    }
    // ── Shared list queries (used by both /me and /admin controllers) ──────────
    async listSales(params) {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const where = params.affiliateId ? { affiliateId: params.affiliateId } : {};
        const [data, total] = await Promise.all([
            this.prisma.commission.findMany({
                where,
                select: {
                    id: true,
                    employeeCodeSnapshot: true,
                    commissionAmount: true,
                    commissionRate: true,
                    status: true,
                    createdAt: true,
                    affiliate: { select: { id: true, affiliateCode: true } },
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                            status: true,
                            totalAmount: true,
                            netAmount: true,
                            taxAmount: true,
                            discountAmount: true,
                            currency: true,
                            createdAt: true,
                            client: { select: { id: true, user: { select: { firstName: true, lastName: true, email: true } } } },
                            package: { select: { id: true, name: true } },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.commission.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async listCommissions(params) {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const where = {};
        if (params.affiliateId)
            where.affiliateId = params.affiliateId;
        if (params.status)
            where.status = params.status;
        const [data, total] = await Promise.all([
            this.prisma.commission.findMany({
                where,
                include: {
                    order: { select: { id: true, orderNumber: true, status: true, netAmount: true, currency: true } },
                    affiliate: {
                        select: {
                            id: true,
                            affiliateCode: true,
                            user: { select: { firstName: true, lastName: true, email: true } },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.commission.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    // ── Admin employee CRUD ───────────────────────────────────────────────────
    async listEmployees(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = { deletedAt: null };
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { affiliateCode: { contains: query.search, mode: 'insensitive' } },
                { user: { firstName: { contains: query.search, mode: 'insensitive' } } },
                { user: { lastName: { contains: query.search, mode: 'insensitive' } } },
                { user: { email: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.affiliate.findMany({
                where,
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, email: true } },
                    wallet: true,
                    _count: { select: { commissions: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.affiliate.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getEmployee(id) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                wallet: true,
                payoutMethods: true,
            },
        });
        if (!affiliate)
            throw new common_1.NotFoundException(`Sales employee ${id} not found`);
        return affiliate;
    }
    /**
     * Creates an Affiliate profile (with its Wallet) for an existing user.
     * Affiliate and Wallet are created inside a single transaction — the invariant is
     * that every Affiliate ALWAYS has exactly one Wallet.
     */
    async createEmployee(userId, options = {}) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
        if (!user)
            throw new common_1.NotFoundException(`User ${userId} not found`);
        const existing = await this.prisma.affiliate.findUnique({ where: { userId } });
        if (existing)
            throw new common_1.ConflictException('This user already has a sales employee profile');
        const settings = await this.settingsService.get();
        const commissionRate = options.commissionRate ?? settings.defaultCommissionRate;
        let lastError;
        for (let attempt = 1; attempt <= AffiliateService_1.CODE_GENERATION_MAX_ATTEMPTS; attempt += 1) {
            const affiliateCode = (0, employee_code_util_1.generateEmployeeCode)();
            try {
                const affiliate = await this.prisma.$transaction(async (tx) => {
                    const created = await tx.affiliate.create({
                        data: {
                            affiliateCode,
                            commissionRate,
                            userId,
                            status: client_1.AffiliateStatusEnum.ACTIVE,
                            isEligibleForCommission: true,
                            createdBy: options.actorUserId ?? null,
                        },
                    });
                    await tx.wallet.create({ data: { affiliateId: created.id } });
                    return created;
                });
                await this.auditService.logEvent({
                    action: 'affiliate.created',
                    entityType: 'Affiliate',
                    entityId: affiliate.id,
                    newValue: { affiliateCode: affiliate.affiliateCode, userId, commissionRate },
                    userId: options.actorUserId,
                });
                this.logger.log(`Created sales employee ${affiliate.affiliateCode} for user ${userId}`);
                return affiliate;
            }
            catch (error) {
                // P2002 = unique constraint violation. Only the affiliateCode can realistically
                // collide here (userId uniqueness was checked above), so regenerate and retry.
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    const target = error.meta?.target;
                    const targetStr = Array.isArray(target) ? target.join(',') : String(target ?? '');
                    if (targetStr.includes('userId')) {
                        throw new common_1.ConflictException('This user already has a sales employee profile');
                    }
                    lastError = error;
                    this.logger.warn(`Employee code collision on ${affiliateCode} (attempt ${attempt}) — regenerating`);
                    continue;
                }
                throw error;
            }
        }
        this.logger.error('Exhausted employee code generation attempts', lastError);
        throw new common_1.InternalServerErrorException('Could not generate a unique employee code, please retry');
    }
    async setEmployeeStatus(id, status, actorUserId) {
        const affiliate = await this.prisma.affiliate.findFirst({ where: { id, deletedAt: null } });
        if (!affiliate)
            throw new common_1.NotFoundException(`Sales employee ${id} not found`);
        if (affiliate.status === status)
            return affiliate;
        const updated = await this.prisma.affiliate.update({
            where: { id },
            data: {
                status,
                // An inactive/suspended employee must not accrue new commission.
                isEligibleForCommission: status === client_1.AffiliateStatusEnum.ACTIVE,
                updatedBy: actorUserId ?? null,
            },
        });
        await this.auditService.logEvent({
            action: status === client_1.AffiliateStatusEnum.ACTIVE ? 'affiliate.activated' : 'affiliate.deactivated',
            entityType: 'Affiliate',
            entityId: id,
            oldValue: { status: affiliate.status, isEligibleForCommission: affiliate.isEligibleForCommission },
            newValue: { status: updated.status, isEligibleForCommission: updated.isEligibleForCommission },
            userId: actorUserId,
        });
        return updated;
    }
    // ── Admin dashboard ───────────────────────────────────────────────────────
    /** Stat-card aggregates for the admin affiliate dashboard. */
    async getOverview() {
        const [totalSalesAgg, affiliateSalesAgg, activeEmployees, totalCommissionAgg, pendingCommissionAgg, walletLiabilityAgg, pendingWithdrawalsAgg, paidWithdrawalsAgg,] = await Promise.all([
            this.prisma.order.aggregate({
                where: { deletedAt: null, status: { notIn: ['CANCELLED', 'PENDING_PAYMENT'] } },
                _sum: { netAmount: true },
                _count: true,
            }),
            this.prisma.commission.aggregate({
                where: { status: { notIn: ['CANCELLED'] } },
                _sum: { commissionBaseAmount: true },
                _count: true,
            }),
            this.prisma.affiliate.count({ where: { status: client_1.AffiliateStatusEnum.ACTIVE, deletedAt: null } }),
            this.prisma.commission.aggregate({
                where: { status: { notIn: ['CANCELLED', 'REVERSED'] } },
                _sum: { commissionAmount: true },
            }),
            this.prisma.commission.aggregate({
                where: { status: { in: ['PENDING', 'ELIGIBLE'] } },
                _sum: { commissionAmount: true },
            }),
            this.prisma.wallet.aggregate({ _sum: { availableBalance: true, pendingBalance: true } }),
            this.prisma.withdrawal.aggregate({
                where: { status: { in: ['PENDING', 'SCHEDULED', 'PROCESSING'] } },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.withdrawal.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
                _count: true,
            }),
        ]);
        return {
            totalSales: {
                count: totalSalesAgg._count,
                amount: totalSalesAgg._sum.netAmount ?? 0,
            },
            totalAffiliateSales: {
                count: affiliateSalesAgg._count,
                amount: affiliateSalesAgg._sum.commissionBaseAmount ?? 0,
            },
            activeEmployees,
            totalCommission: totalCommissionAgg._sum.commissionAmount ?? 0,
            pendingCommission: pendingCommissionAgg._sum.commissionAmount ?? 0,
            // Total money we currently owe employees and can be withdrawn right now.
            availableWalletLiability: walletLiabilityAgg._sum.availableBalance ?? 0,
            heldWalletLiability: walletLiabilityAgg._sum.pendingBalance ?? 0,
            pendingWithdrawals: {
                count: pendingWithdrawalsAgg._count,
                amount: pendingWithdrawalsAgg._sum.amount ?? 0,
            },
            paidWithdrawals: {
                count: paidWithdrawalsAgg._count,
                amount: paidWithdrawalsAgg._sum.amount ?? 0,
            },
        };
    }
    /** Guards against a caller passing a code shaped like anything other than EMP-XXXXX. */
    assertCodeShape(code) {
        const normalized = (0, employee_code_util_1.normalizeEmployeeCode)(code);
        if (!employee_code_util_1.EMPLOYEE_CODE_REGEX.test(normalized))
            throw new common_1.BadRequestException(GENERIC_INVALID_MESSAGE);
        return normalized;
    }
};
exports.AffiliateService = AffiliateService;
exports.AffiliateService = AffiliateService = AffiliateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        affiliate_settings_service_1.AffiliateSettingsService])
], AffiliateService);
//# sourceMappingURL=affiliate.service.js.map