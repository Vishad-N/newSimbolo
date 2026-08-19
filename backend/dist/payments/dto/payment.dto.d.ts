export declare class CreatePaymentOrderDto {
    orderId: string;
    currency?: string;
    /**
     * Optional sales-employee attribution code. It is re-validated server-side here —
     * a prior /checkout/affiliate/validate call is never trusted, and no "already
     * validated" flag from the client is accepted. An invalid code aborts the request
     * before any gateway call is made.
     */
    employeeCode?: string;
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
