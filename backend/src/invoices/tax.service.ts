import { Injectable } from '@nestjs/common';
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
    gstRate: number; // e.g., 18
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

@Injectable()
export class TaxService extends BaseService {
  constructor() {
    super('TaxService');
  }

  calculateTax(params: TaxCalculationParams): TaxCalculationResult {
    // Rule: if customerStateCode is present and different from supplierStateCode, it's Inter-State (IGST)
    // If not, it's Intra-State (CGST + SGST).
    // Note: Export logic or B2C unregistered out-of-state can be handled by providing proper customer state code.
    const isInterState = params.customerStateCode ? params.customerStateCode !== params.supplierStateCode : false; // defaults to intra-state if no customer state code is given (assuming walk-in/local unregistered).

    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalTax = 0;
    let totalAmount = 0;

    const resultItems: TaxLineItemResult[] = params.items.map((item) => {
      const discount = item.discount || 0;
      const baseTotal = item.quantity * item.unitPrice;
      const taxableAmount = baseTotal - discount;

      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      const taxAmount = (taxableAmount * item.gstRate) / 100;

      if (isInterState) {
        igstAmount = taxAmount;
      } else {
        cgstAmount = taxAmount / 2;
        sgstAmount = taxAmount / 2;
      }

      const itemTotalAmount = taxableAmount + taxAmount;

      subtotal += taxableAmount;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
      totalIgst += igstAmount;
      totalTax += taxAmount;
      totalAmount += itemTotalAmount;

      return {
        description: item.description,
        sacCode: item.sacCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount,
        taxableAmount,
        gstRate: item.gstRate,
        cgstAmount,
        sgstAmount,
        igstAmount,
        totalAmount: itemTotalAmount,
      };
    });

    return {
      items: resultItems,
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      totalAmount,
      isInterState,
    };
  }
}
