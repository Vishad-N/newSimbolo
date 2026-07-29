"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const report_dto_1 = require("./dto/report.dto");
const reports_service_1 = require("./reports.service");
describe('ReportsService', () => {
    it('generates a revenue report with totals', async () => {
        const prisma = {
            payment: {
                findMany: jest.fn().mockResolvedValue([
                    {
                        paymentNumber: 'PAY-1',
                        amount: 1000,
                        currency: 'INR',
                        gatewayProvider: 'RAZORPAY',
                        paidAt: new Date('2026-07-01T00:00:00.000Z'),
                        order: { orderNumber: 'ORD-1' },
                    },
                    {
                        paymentNumber: 'PAY-2',
                        amount: 2000,
                        currency: 'INR',
                        gatewayProvider: 'RAZORPAY',
                        paidAt: new Date('2026-07-02T00:00:00.000Z'),
                        order: { orderNumber: 'ORD-2' },
                    },
                ]),
            },
        };
        const service = new reports_service_1.ReportsService(prisma);
        const report = await service.generate({ type: report_dto_1.ReportType.REVENUE });
        expect(report.rows).toHaveLength(2);
        expect(report.totals).toEqual({ totalRevenue: 3000, totalPayments: 2 });
    });
});
//# sourceMappingURL=reports.service.spec.js.map