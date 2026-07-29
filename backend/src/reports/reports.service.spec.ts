import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from './dto/report.dto';
import { ReportsService } from './reports.service';

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
    const service = new ReportsService(prisma as unknown as PrismaService);

    const report = await service.generate({ type: ReportType.REVENUE });

    expect(report.rows).toHaveLength(2);
    expect(report.totals).toEqual({ totalRevenue: 3000, totalPayments: 2 });
  });
});
