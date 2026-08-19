import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeePayoutMethod, PayoutMethodStatusEnum, PayoutMethodTypeEnum } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { CreatePayoutMethodDto, UpdatePayoutMethodDto } from '../dto/create-payout-method.dto';
import { RazorpayXGateway } from './razorpayx.provider';

/**
 * Payout destinations for sales employees.
 *
 * Sensitive detail handling: full account numbers and UPI handles are forwarded to
 * RazorpayX to create the Contact + Fund Account, and only a masked representation
 * (plus last4) is persisted. The raw values never touch our database.
 */
@Injectable()
export class PayoutMethodService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly razorpayx: RazorpayXGateway,
  ) {
    super('PayoutMethodService');
  }

  async list(affiliateId: string): Promise<EmployeePayoutMethod[]> {
    return this.prisma.employeePayoutMethod.findMany({
      where: { affiliateId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  private maskAccountNumber(accountNumber: string): { masked: string; last4: string } {
    const digits = accountNumber.replace(/\s+/g, '');
    const last4 = digits.slice(-4);
    return { masked: `••••••${last4}`, last4 };
  }

  private maskUpi(upiId: string): { masked: string; last4: string } {
    const [handle, provider] = upiId.split('@');
    const visible = handle.slice(0, 2);
    return { masked: `${visible}${'•'.repeat(Math.max(handle.length - 2, 2))}@${provider}`, last4: handle.slice(-4) };
  }

  async create(
    affiliateId: string,
    dto: CreatePayoutMethodDto,
    actorUserId?: string,
  ): Promise<EmployeePayoutMethod> {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, deletedAt: null },
      include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
    });
    if (!affiliate) throw new NotFoundException('Sales employee profile not found');

    let masked: string;
    let last4: string;

    if (dto.type === PayoutMethodTypeEnum.BANK_ACCOUNT) {
      if (!dto.accountNumber || !dto.ifsc || !dto.accountHolderName) {
        throw new BadRequestException('accountNumber, ifsc and accountHolderName are required for BANK_ACCOUNT');
      }
      ({ masked, last4 } = this.maskAccountNumber(dto.accountNumber));
      masked = `${dto.ifsc.toUpperCase()} ${masked}`;
    } else {
      if (!dto.upiId) throw new BadRequestException('upiId is required for UPI');
      ({ masked, last4 } = this.maskUpi(dto.upiId));
    }

    const fullName = [affiliate.user.firstName, affiliate.user.lastName].filter(Boolean).join(' ') || 'Sales Employee';

    // Reuse an existing RazorpayX contact for this affiliate when one exists.
    const existingWithContact = await this.prisma.employeePayoutMethod.findFirst({
      where: { affiliateId, razorpayContactId: { not: null } },
    });

    const contactId =
      existingWithContact?.razorpayContactId ??
      (
        await this.razorpayx.createContact({
          name: fullName,
          email: affiliate.user.email,
          contact: (affiliate.user as any).phone ?? undefined,
          referenceId: affiliate.affiliateCode,
        })
      ).contactId;

    const { fundAccountId } = await this.razorpayx.createFundAccount({
      contactId,
      type: dto.type === PayoutMethodTypeEnum.BANK_ACCOUNT ? 'bank_account' : 'vpa',
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
          status: PayoutMethodStatusEnum.VERIFIED,
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

  async update(
    affiliateId: string,
    id: string,
    dto: UpdatePayoutMethodDto,
    actorUserId?: string,
  ): Promise<EmployeePayoutMethod> {
    const method = await this.prisma.employeePayoutMethod.findFirst({ where: { id, affiliateId } });
    if (!method) throw new NotFoundException('Payout method not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.isDefault === true) {
        if (method.status !== PayoutMethodStatusEnum.VERIFIED) {
          throw new BadRequestException('Only a verified payout method can be made default');
        }
        await tx.employeePayoutMethod.updateMany({ where: { affiliateId }, data: { isDefault: false } });
      }
      return tx.employeePayoutMethod.update({
        where: { id },
        data: {
          ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
          ...(dto.disabled !== undefined
            ? {
                status: dto.disabled ? PayoutMethodStatusEnum.DISABLED : PayoutMethodStatusEnum.VERIFIED,
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

  async remove(affiliateId: string, id: string, actorUserId?: string): Promise<{ deleted: boolean }> {
    const method = await this.prisma.employeePayoutMethod.findFirst({ where: { id, affiliateId } });
    if (!method) throw new NotFoundException('Payout method not found');

    // A payout method referenced by an in-flight withdrawal must be retained for audit.
    const inFlight = await this.prisma.withdrawal.count({
      where: { payoutMethodId: id, status: { in: ['PENDING', 'SCHEDULED', 'PROCESSING'] } },
    });
    if (inFlight > 0) {
      throw new BadRequestException('This payout method has withdrawals in progress and cannot be removed');
    }

    const historic = await this.prisma.withdrawal.count({ where: { payoutMethodId: id } });
    if (historic > 0) {
      // Soft-disable instead of destroying payout history.
      await this.prisma.employeePayoutMethod.update({
        where: { id },
        data: { status: PayoutMethodStatusEnum.DISABLED, isDefault: false },
      });
    } else {
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
}
