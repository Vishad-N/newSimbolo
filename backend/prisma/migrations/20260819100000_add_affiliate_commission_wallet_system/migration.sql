-- CreateEnum
CREATE TYPE "AffiliateStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CommissionStatusEnum" AS ENUM ('PENDING', 'ELIGIBLE', 'CREDITED', 'REVERSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionCalculationBasisEnum" AS ENUM ('SUBTOTAL', 'SUBTOTAL_AFTER_DISCOUNT', 'TAXABLE_AMOUNT', 'GRAND_TOTAL');

-- CreateEnum
CREATE TYPE "WalletTransactionTypeEnum" AS ENUM ('COMMISSION_CREDIT', 'COMMISSION_REVERSAL', 'WITHDRAWAL_HOLD', 'WITHDRAWAL_RELEASE', 'WITHDRAWAL_DEBIT', 'ADMIN_CREDIT', 'ADMIN_DEBIT', 'PAYOUT_REVERSAL');

-- CreateEnum
CREATE TYPE "WithdrawalStatusEnum" AS ENUM ('PENDING', 'SCHEDULED', 'PROCESSING', 'PAID', 'FAILED', 'REVERSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutMethodTypeEnum" AS ENUM ('BANK_ACCOUNT', 'UPI');

-- CreateEnum
CREATE TYPE "PayoutMethodStatusEnum" AS ENUM ('PENDING', 'VERIFIED', 'DISABLED');

-- AlterTable "affiliates": add new columns, convert status TEXT -> AffiliateStatusEnum
ALTER TABLE "affiliates" ADD COLUMN "commissionBasisDefault" "CommissionCalculationBasisEnum";
ALTER TABLE "affiliates" ADD COLUMN "isEligibleForCommission" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "affiliates" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "affiliates" ALTER COLUMN "status" TYPE "AffiliateStatusEnum" USING (
  CASE
    WHEN "status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED') THEN "status"::"AffiliateStatusEnum"
    ELSE 'ACTIVE'::"AffiliateStatusEnum"
  END
);
ALTER TABLE "affiliates" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable "commissions": rename columns, add new columns, convert status TEXT -> CommissionStatusEnum
ALTER TABLE "commissions" RENAME COLUMN "amount" TO "commissionAmount";
ALTER TABLE "commissions" RENAME COLUMN "percentage" TO "commissionRate";

ALTER TABLE "commissions" ADD COLUMN "paymentId" UUID;
ALTER TABLE "commissions" ADD COLUMN "employeeCodeSnapshot" TEXT NOT NULL DEFAULT '';
ALTER TABLE "commissions" ADD COLUMN "commissionBaseAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "commissions" ADD COLUMN "calculationBasis" "CommissionCalculationBasisEnum" NOT NULL DEFAULT 'SUBTOTAL_AFTER_DISCOUNT';
ALTER TABLE "commissions" ADD COLUMN "eligibleAt" TIMESTAMP(3);
ALTER TABLE "commissions" ADD COLUMN "creditedAt" TIMESTAMP(3);
ALTER TABLE "commissions" ADD COLUMN "reversedAt" TIMESTAMP(3);
ALTER TABLE "commissions" ADD COLUMN "reversedAmount" DOUBLE PRECISION;
ALTER TABLE "commissions" ADD COLUMN "metadata" JSONB;

ALTER TABLE "commissions" ALTER COLUMN "employeeCodeSnapshot" DROP DEFAULT;
ALTER TABLE "commissions" ALTER COLUMN "commissionBaseAmount" DROP DEFAULT;

ALTER TABLE "commissions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "commissions" ALTER COLUMN "status" TYPE "CommissionStatusEnum" USING (
  CASE
    WHEN "status" IN ('PENDING', 'ELIGIBLE', 'CREDITED', 'REVERSED', 'CANCELLED') THEN "status"::"CommissionStatusEnum"
    ELSE 'PENDING'::"CommissionStatusEnum"
  END
);
ALTER TABLE "commissions" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "affiliateId" UUID NOT NULL,
    "availableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lifetimeEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lifetimeWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "type" "WalletTransactionTypeEnum" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balanceBefore" DOUBLE PRECISION NOT NULL,
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "referenceType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" UUID NOT NULL,
    "affiliateId" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "WithdrawalStatusEnum" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "razorpayPayoutId" TEXT,
    "razorpayContactId" TEXT,
    "razorpayFundAccountId" TEXT,
    "payoutMethodId" UUID,
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_payout_methods" (
    "id" UUID NOT NULL,
    "affiliateId" UUID NOT NULL,
    "type" "PayoutMethodTypeEnum" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "PayoutMethodStatusEnum" NOT NULL DEFAULT 'PENDING',
    "razorpayContactId" TEXT,
    "razorpayFundAccountId" TEXT,
    "maskedDetails" TEXT NOT NULL,
    "last4" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_payout_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_settings" (
    "id" UUID NOT NULL,
    "defaultCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "commissionCalculationBasis" "CommissionCalculationBasisEnum" NOT NULL DEFAULT 'SUBTOTAL_AFTER_DISCOUNT',
    "commissionHoldPeriodDays" INTEGER NOT NULL DEFAULT 7,
    "minimumWithdrawalAmount" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
    "maximumWithdrawalAmount" DOUBLE PRECISION NOT NULL DEFAULT 200000.0,
    "paydayFrequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "paydayDayOfWeek" INTEGER DEFAULT 5,
    "paydayCutoffTime" TEXT DEFAULT '17:00',
    "payoutAutoProcessingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "selfReferralAllowed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "affiliate_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliates_status_idx" ON "affiliates"("status");

-- CreateIndex
CREATE INDEX "commissions_paymentId_idx" ON "commissions"("paymentId");

-- CreateIndex
CREATE INDEX "commissions_status_idx" ON "commissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "commissions_orderId_affiliateId_key" ON "commissions"("orderId", "affiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_affiliateId_key" ON "wallets"("affiliateId");

-- CreateIndex
CREATE INDEX "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");

-- CreateIndex
CREATE INDEX "wallet_transactions_referenceType_referenceId_idx" ON "wallet_transactions"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "wallet_transactions_type_idx" ON "wallet_transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawals_razorpayPayoutId_key" ON "withdrawals"("razorpayPayoutId");

-- CreateIndex
CREATE INDEX "withdrawals_affiliateId_idx" ON "withdrawals"("affiliateId");

-- CreateIndex
CREATE INDEX "withdrawals_walletId_idx" ON "withdrawals"("walletId");

-- CreateIndex
CREATE INDEX "withdrawals_status_idx" ON "withdrawals"("status");

-- CreateIndex
CREATE INDEX "employee_payout_methods_affiliateId_idx" ON "employee_payout_methods"("affiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_eventId_key" ON "webhook_events"("eventId");

-- CreateIndex
CREATE INDEX "webhook_events_provider_idx" ON "webhook_events"("provider");

-- CreateIndex
CREATE INDEX "webhook_events_eventType_idx" ON "webhook_events"("eventType");

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_payoutMethodId_fkey" FOREIGN KEY ("payoutMethodId") REFERENCES "employee_payout_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payout_methods" ADD CONSTRAINT "employee_payout_methods_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed a single default AffiliateSettings row (singleton pattern; application code always reads/updates the first row)
INSERT INTO "affiliate_settings" ("id", "updatedAt") VALUES (gen_random_uuid(), CURRENT_TIMESTAMP);
