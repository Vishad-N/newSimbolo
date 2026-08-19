import { PayoutMethodTypeEnum } from '@prisma/client';
/**
 * NOTE: full account numbers / UPI handles are never persisted. The service layer
 * derives `maskedDetails` + `last4` and hands the sensitive values straight to
 * RazorpayX for fund-account creation.
 */
export declare class CreatePayoutMethodDto {
    type: PayoutMethodTypeEnum;
    accountNumber?: string;
    ifsc?: string;
    accountHolderName?: string;
    upiId?: string;
    isDefault?: boolean;
}
export declare class UpdatePayoutMethodDto {
    isDefault?: boolean;
    disabled?: boolean;
}
export declare class PreparePaymentEmployeeDto {
    employeeCode: string;
}
