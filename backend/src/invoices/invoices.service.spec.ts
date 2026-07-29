import { InvoiceStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../shared/email/email.service';
import { InvoicesService } from './invoices.service';

type InvoicesPrismaMock = {
  clientProfile: {
    findFirst: jest.Mock;
  };
  invoice: {
    create: jest.Mock;
  };
  timeline: {
    create: jest.Mock;
  };
};

describe('InvoicesService', () => {
  it('computes subtotal, tax, and total amount when creating invoices', async () => {
    const prisma: InvoicesPrismaMock = {
      clientProfile: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'client-id',
          user: { firstName: 'Asha', lastName: 'Mehta' },
          company: null,
        }),
      },
      invoice: {
        create: jest.fn().mockImplementation(({ data }) => ({
          id: 'invoice-id',
          ...data,
        })),
      },
      timeline: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const service = new InvoicesService(prisma as unknown as PrismaService, {} as unknown as EmailService);

    await service.create({
      clientId: 'client-id',
      dueDate: '2026-08-31T00:00:00.000Z',
      taxPercentage: 18,
      currency: 'INR',
      items: [
        { name: 'SEO', quantity: 2, unitPrice: 10000 },
        { name: 'Content', quantity: 1, unitPrice: 5000 },
      ],
    });

    expect(prisma.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: InvoiceStatusEnum.DRAFT,
        subtotal: 25000,
        taxAmount: 4500,
        totalAmount: 29500,
        currency: 'INR',
      }),
      include: expect.objectContaining({}),
    });
  });
});
