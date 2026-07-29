"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const subscriptions_service_1 = require("./subscriptions.service");
describe('SubscriptionsService', () => {
    let prisma;
    let service;
    beforeEach(() => {
        prisma = {
            subscription: {
                findFirst: jest.fn(),
                update: jest.fn().mockResolvedValue({ id: 'subscription-id' }),
            },
        };
        service = new subscriptions_service_1.SubscriptionsService(prisma, {});
    });
    it('pauses only active subscriptions', async () => {
        prisma.subscription.findFirst.mockResolvedValue({
            id: 'subscription-id',
            status: client_1.SubscriptionStatusEnum.TRIALING,
        });
        await expect(service.pause('subscription-id')).rejects.toBeInstanceOf(common_1.BadRequestException);
        prisma.subscription.findFirst.mockResolvedValue({
            id: 'subscription-id',
            status: client_1.SubscriptionStatusEnum.ACTIVE,
        });
        await service.pause('subscription-id', 'user-id');
        expect(prisma.subscription.update).toHaveBeenCalledWith({
            where: { id: 'subscription-id' },
            data: { status: client_1.SubscriptionStatusEnum.PAUSED, updatedBy: 'user-id' },
        });
    });
    it('resumes only paused subscriptions', async () => {
        prisma.subscription.findFirst.mockResolvedValue({
            id: 'subscription-id',
            status: client_1.SubscriptionStatusEnum.ACTIVE,
        });
        await expect(service.resume('subscription-id')).rejects.toBeInstanceOf(common_1.BadRequestException);
        prisma.subscription.findFirst.mockResolvedValue({
            id: 'subscription-id',
            status: client_1.SubscriptionStatusEnum.PAUSED,
        });
        await service.resume('subscription-id', 'user-id');
        expect(prisma.subscription.update).toHaveBeenCalledWith({
            where: { id: 'subscription-id' },
            data: { status: client_1.SubscriptionStatusEnum.ACTIVE, updatedBy: 'user-id' },
        });
    });
});
//# sourceMappingURL=subscriptions.service.spec.js.map