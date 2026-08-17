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
exports.TaxService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
let TaxService = class TaxService extends base_service_1.BaseService {
    constructor() {
        super('TaxService');
    }
    calculateTax(params) {
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
        const resultItems = params.items.map((item) => {
            const discount = item.discount || 0;
            const baseTotal = item.quantity * item.unitPrice;
            const taxableAmount = baseTotal - discount;
            let cgstAmount = 0;
            let sgstAmount = 0;
            let igstAmount = 0;
            const taxAmount = (taxableAmount * item.gstRate) / 100;
            if (isInterState) {
                igstAmount = taxAmount;
            }
            else {
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
};
exports.TaxService = TaxService;
exports.TaxService = TaxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TaxService);
//# sourceMappingURL=tax.service.js.map