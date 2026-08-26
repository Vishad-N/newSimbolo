import { InvoiceStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../shared/email/email.service';
import { StorageService } from '../storage/storage.service';
import { InvoicesService } from './invoices.service';
import { TaxService } from './tax.service';

type InvoicesPrismaMock = {
  clientProfile: {
    findFirst: jest.Mock;
  };
  invoice: {
    findFirst: jest.Mock;
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
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => ({
          id: 'invoice-id',
          ...data,
        })),
      },
      timeline: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const taxService = new TaxService();

    const service = new InvoicesService(
      prisma as unknown as PrismaService,
      {} as unknown as EmailService,
      taxService,
      {} as unknown as StorageService,
    );

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

  it("taxes each line item at its own gstRate, not a single invoice-wide rate", async () => {
    const prisma: InvoicesPrismaMock = {
      clientProfile: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'client-id',
          user: { firstName: 'Asha', lastName: 'Mehta' },
          company: null,
        }),
      },
      invoice: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => ({
          id: 'invoice-id',
          ...data,
        })),
      },
      timeline: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    const taxService = new TaxService();

    const service = new InvoicesService(
      prisma as unknown as PrismaService,
      {} as unknown as EmailService,
      taxService,
      {} as unknown as StorageService,
    );

    await service.create({
      clientId: 'client-id',
      dueDate: '2026-08-31T00:00:00.000Z',
      currency: 'INR',
      items: [
        { name: 'Zero-rated export service', quantity: 1, unitPrice: 10000, gstRate: 0 },
        { name: 'Standard SEO retainer', quantity: 1, unitPrice: 10000, gstRate: 18 },
      ],
    });

    const createdItems = (prisma.invoice.create.mock.calls[0][0] as any).data.items.create;
    expect(createdItems[0]).toMatchObject({ gstRate: 0, totalAmount: 10000 });
    expect(createdItems[1]).toMatchObject({ gstRate: 18, totalAmount: 11800 });
  });
});
