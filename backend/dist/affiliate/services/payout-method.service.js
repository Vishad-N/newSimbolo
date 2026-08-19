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
exports.PayoutMethodService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const audit_service_1 = require("../../shared/audit/audit.service");
const razorpayx_provider_1 = require("./razorpayx.provider");
/**
 * Payout destinations for sales employees.
 *
 * Sensitive detail handling: full account numbers and UPI handles are forwarded to
 * RazorpayX to create the Contact + Fund Account, and only a masked representation
 * (plus last4) is persisted. The raw values never touch our database.
 */
let PayoutMethodService = class PayoutMethodService extends base_service_1.BaseService {
    prisma;
    auditService;
    razorpayx;
    constructor(prisma, auditService, razorpayx) {
        super('PayoutMethodService');
        this.prisma = prisma;
        this.auditService = auditService;
        this.razorpayx = razorpayx;
    }
    async list(affiliateId) {
        return this.prisma.employeePayoutMethod.findMany({
            where: { affiliateId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }
    maskAccountNumber(accountNumber) {
        const digits = accountNumber.replace(/\s+/g, '');
        const last4 = digits.slice(-4);
        return { masked: `••••••${last4}`, last4 };
    }
    maskUpi(upiId) {
        const [handle, provider] = upiId.split('@');
        const visible = handle.slice(0, 2);
        return { masked: `${visible}${'•'.repeat(Math.max(handle.length - 2, 2))}@${provider}`, last4: handle.slice(-4) };
    }
    async create(affiliateId, dto, actorUserId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: affiliateId, deletedAt: null },
            include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
        });
        if (!affiliate)
            throw new common_1.NotFoundException('Sales employee profile not found');
        let masked;
        let last4;
        if (dto.type === client_1.PayoutMethodTypeEnum.BANK_ACCOUNT) {
            if (!dto.accountNumber || !dto.ifsc || !dto.accountHolderName) {
                throw new common_1.BadRequestException('accountNumber, ifsc and accountHolderName are required for BANK_ACCOUNT');
            }
            ({ masked, last4 } = this.maskAccountNumber(dto.accountNumber));
            masked = `${dto.ifsc.toUpperCase()} ${masked}`;
        }
        else {
            if (!dto.upiId)
                throw new common_1.BadRequestException('upiId is required for UPI');
            ({ masked, last4 } = this.maskUpi(dto.upiId));
        }
        const fullName = [affiliate.user.firstName, affiliate.user.lastName].filter(Boolean).join(' ') || 'Sales Employee';
        // Reuse an existing RazorpayX contact for this affiliate when one exists.
        const existingWithContact = await this.prisma.employeePayoutMethod.findFirst({
            where: { affiliateId, razorpayContactId: { not: null } },
        });
        const contactId = existingWithContact?.razorpayContactId ??
            (await this.razorpayx.createContact({
                name: fullName,
                email: affiliate.user.email,
                contact: affiliate.user.phone ?? undefined,
                referenceId: affiliate.affiliateCode,
            })).contactId;
        const { fundAccountId } = await this.razorpayx.createFundAccount({
            contactId,
            type: dto.type === client_1.PayoutMethodTypeEnum.BANK_ACCOUNT ? 'bank_account' : 'vpa',
            accountNumber: dto.accountNumber,
            ifsc: dto.ifsc,
            accountHolderName: dto.accountHolderName ?? fullName,
            upiId: dto.upiId,
        });
        const existingCount = await this.prisma.employeePayoutMethod.count({ where: { affiliateId } });
        const shouldBeDefault = dto.isDefault === true || existingCount === 0;
        const created = await this.prisma.$transaction(async (tx) => {
            if (shouldBeDefault) {
                await tx.employeePayoutMethod.updateMany({ where: { affiliateId }, data: { isDefault: false } });
            }
            return tx.employeePayoutMethod.create({
                data: {
                    affiliateId,
                    type: dto.type,
                    isDefault: shouldBeDefault,
                    // Mock mode has no real bank verification round-trip, so the fund account is
                    // usable immediately. In LIVE mode RazorpayX validates the fund account at
                    // creation time, so VERIFIED here reflects a successfully created account.
                    status: client_1.PayoutMethodStatusEnum.VERIFIED,
                    razorpayContactId: contactId,
                    razorpayFundAccountId: fundAccountId,
                    maskedDetails: masked,
                    last4,
                    verifiedAt: new Date(),
                },
            });
        });
        await this.auditService.logEvent({
            action: 'affiliate.payoutMethod.created',
            entityType: 'EmployeePayoutMethod',
            entityId: created.id,
            newValue: { affiliateId, type: dto.type, maskedDetails: masked, isDefault: shouldBeDefault },
            userId: actorUserId,
        });
        return created;
    }
    async update(affiliateId, id, dto, actorUserId) {
        const method = await this.prisma.employeePayoutMethod.findFirst({ where: { id, affiliateId } });
        if (!method)
            throw new common_1.NotFoundException('Payout method not found');
        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.isDefault === true) {
                if (method.status !== client_1.PayoutMethodStatusEnum.VERIFIED) {
                    throw new common_1.BadRequestException('Only a verified payout method can be made default');
                }
                await tx.employeePayoutMethod.updateMany({ where: { affiliateId }, data: { isDefault: false } });
            }
            return tx.employeePayoutMethod.update({
                where: { id },
                data: {
                    ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
                    ...(dto.disabled !== undefined
                        ? {
                            status: dto.disabled ? client_1.PayoutMethodStatusEnum.DISABLED : client_1.PayoutMethodStatusEnum.VERIFIED,
                            ...(dto.disabled ? { isDefault: false } : {}),
                        }
                        : {}),
                },
            });
        });
        await this.auditService.logEvent({
            action: 'affiliate.payoutMethod.updated',
            entityType: 'EmployeePayoutMethod',
            entityId: id,
            oldValue: { isDefault: method.isDefault, status: method.status },
            newValue: { isDefault: updated.isDefault, status: updated.status },
            userId: actorUserId,
        });
        return updated;
    }
    async remove(affiliateId, id, actorUserId) {
        const method = await this.prisma.employeePayoutMethod.findFirst({ where: { id, affiliateId } });
        if (!method)
            throw new common_1.NotFoundException('Payout method not found');
        // A payout method referenced by an in-flight withdrawal must be retained for audit.
        const inFlight = await this.prisma.withdrawal.count({
            where: { payoutMethodId: id, status: { in: ['PENDING', 'SCHEDULED', 'PROCESSING'] } },
        });
        if (inFlight > 0) {
            throw new common_1.BadRequestException('This payout method has withdrawals in progress and cannot be removed');
        }
        const historic = await this.prisma.withdrawal.count({ where: { payoutMethodId: id } });
        if (historic > 0) {
            // Soft-disable instead of destroying payout history.
            await this.prisma.employeePayoutMethod.update({
                where: { id },
                data: { status: client_1.PayoutMethodStatusEnum.DISABLED, isDefault: false },
            });
        }
        else {
            await this.prisma.employeePayoutMethod.delete({ where: { id } });
        }
        await this.auditService.logEvent({
            action: 'affiliate.payoutMethod.removed',
            entityType: 'EmployeePayoutMethod',
            entityId: id,
            oldValue: { affiliateId, type: method.type, maskedDetails: method.maskedDetails },
            userId: actorUserId,
        });
        return { deleted: true };
    }
};
exports.PayoutMethodService = PayoutMethodService;
exports.PayoutMethodService = PayoutMethodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        razorpayx_provider_1.RazorpayXGateway])
], PayoutMethodService);
//# sourceMappingURL=payout-method.service.js.map