import { Prisma, Withdrawal, WithdrawalStatusEnum } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto';
import { RazorpayXGateway } from './razorpayx.provider';
import { WalletService } from './wallet.service';
export declare class WithdrawalService extends BaseService {
    private readonly prisma;
    private readonly walletService;
    private readonly razorpayx;
    private readonly auditService;
    private readonly notifications;
    constructor(prisma: PrismaService, walletService: WalletService, razorpayx: RazorpayXGateway, auditService: AuditService, notifications: NotificationsService);
    requestWithdrawal(affiliateId: string, dto: RequestWithdrawalDto, actorUserId?: string): Promise<Withdrawal>;
    private static readonly ADMIN_WITHDRAWAL_INCLUDE;
    /** Flattens the nested Prisma row into the shape the admin withdrawals table renders. */
    private toAdminRow;
    list(params: {
        affiliateId?: string;
        status?: WithdrawalStatusEnum;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            affiliateId: string;
            employeeName: string;
            employeeCode: string;
            amount: number;
            status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
            requestedAt: Date;
            scheduledAt: Date | null;
            processedAt: Date | null;
            payoutMethod: string | null;
            razorpayPayoutId: string | null;
            failureReason: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, scopeAffiliateId?: string): Promise<{
        id: string;
        affiliateId: string;
        employeeName: string;
        employeeCode: string;
        amount: number;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        payoutMethod: string | null;
        razorpayPayoutId: string | null;
        failureReason: string | null;
    }>;
    /** PENDING -> SCHEDULED. Funds stay held; the sweep or an admin then processes it. */
    approve(id: string, actorUserId?: string): Promise<Withdrawal>;
    /**
     * Initiates the actual RazorpayX payout.
     *
     * Ordering matters: the withdrawal is flipped to PROCESSING BEFORE the gateway
     * call, so that a crash mid-call leaves the row in a state that can only be
     * resolved by a webhook or an explicit admin retry — never silently re-payable.
     * The idempotency key is derived from the withdrawal id, so a retried gateway
     * call for the same withdrawal cannot disburse twice.
     */
    process(id: string, actorUserId?: string): Promise<Withdrawal>;
    /** Retries a FAILED withdrawal by re-reserving funds and re-initiating the payout. */
    retry(id: string, actorUserId?: string): Promise<Withdrawal>;
    /** Cancels a still-held withdrawal and returns the funds to the available balance. */
    cancel(id: string, reason: string, actorUserId?: string): Promise<Withdrawal>;
    findByRazorpayPayoutId(payoutId: string): Promise<({
        affiliate: {
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        amount: number;
        affiliateId: string;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }) | null>;
    markPaidFromWebhook(withdrawalId: string, payoutId: string, notifyUserId: string, amount: number): Promise<{
        debited: boolean;
    }>;
    markFailedFromWebhook(withdrawalId: string, reason: string, notifyUserId: string, amount: number): Promise<{
        released: boolean;
    }>;
    private notifyFailure;
}
