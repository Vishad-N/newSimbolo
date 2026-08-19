import { EmployeePayoutMethod } from '@prisma/client';
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
export declare class PayoutMethodService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    private readonly razorpayx;
    constructor(prisma: PrismaService, auditService: AuditService, razorpayx: RazorpayXGateway);
    list(affiliateId: string): Promise<EmployeePayoutMethod[]>;
    private maskAccountNumber;
    private maskUpi;
    create(affiliateId: string, dto: CreatePayoutMethodDto, actorUserId?: string): Promise<EmployeePayoutMethod>;
    update(affiliateId: string, id: string, dto: UpdatePayoutMethodDto, actorUserId?: string): Promise<EmployeePayoutMethod>;
    remove(affiliateId: string, id: string, actorUserId?: string): Promise<{
        deleted: boolean;
    }>;
}
