export declare class CreatePaymentOrderDto {
    orderId: string;
    currency?: string;
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
