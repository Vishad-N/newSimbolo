import { BaseService } from '../shared/abstractions/base.service';
export interface TaxCalculationParams {
    supplierStateCode: string;
    customerStateCode?: string;
    items: {
        sacCode?: string;
        description: string;
        quantity: number;
        unitPrice: number;
        discount?: number;
        gstRate: number;
    }[];
}
export interface TaxLineItemResult {
    description: string;
    sacCode?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxableAmount: number;
    gstRate: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalAmount: number;
}
export interface TaxCalculationResult {
    items: TaxLineItemResult[];
    subtotal: number;
    totalCgst: number;
    totalSgst: number;
    totalIgst: number;
    totalTax: number;
    totalAmount: number;
    isInterState: boolean;
}
export declare class TaxService extends BaseService {
    constructor();
    calculateTax(params: TaxCalculationParams): TaxCalculationResult;
}
