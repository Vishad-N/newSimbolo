"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const invoices_service_1 = require("./invoices.service");
describe('InvoicesService', () => {
    it('computes subtotal, tax, and total amount when creating invoices', async () => {
        const prisma = {
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
        const service = new invoices_service_1.InvoicesService(prisma, {});
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
                status: client_1.InvoiceStatusEnum.DRAFT,
                subtotal: 25000,
                taxAmount: 4500,
                totalAmount: 29500,
                currency: 'INR',
            }),
            include: expect.objectContaining({}),
        });
    });
});
//# sourceMappingURL=invoices.service.spec.js.map