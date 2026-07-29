import { BadRequestException } from '@nestjs/common';
import { SubscriptionStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../shared/email/email.service';
import { SubscriptionsService } from './subscriptions.service';

type SubscriptionsPrismaMock = {
  subscription: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe('SubscriptionsService', () => {
  let prisma: SubscriptionsPrismaMock;
  let service: SubscriptionsService;

  beforeEach(() => {
    prisma = {
      subscription: {
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue({ id: 'subscription-id' }),
      },
    };
    service = new SubscriptionsService(prisma as unknown as PrismaService, {} as unknown as EmailService);
  });

  it('pauses only active subscriptions', async () => {
    prisma.subscription.findFirst.mockResolvedValue({
      id: 'subscription-id',
      status: SubscriptionStatusEnum.TRIALING,
    });

    await expect(service.pause('subscription-id')).rejects.toBeInstanceOf(BadRequestException);

    prisma.subscription.findFirst.mockResolvedValue({
      id: 'subscription-id',
      status: SubscriptionStatusEnum.ACTIVE,
    });

    await service.pause('subscription-id', 'user-id');

    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: 'subscription-id' },
      data: { status: SubscriptionStatusEnum.PAUSED, updatedBy: 'user-id' },
    });
  });

  it('resumes only paused subscriptions', async () => {
    prisma.subscription.findFirst.mockResolvedValue({
      id: 'subscription-id',
      status: SubscriptionStatusEnum.ACTIVE,
    });

    await expect(service.resume('subscription-id')).rejects.toBeInstanceOf(BadRequestException);

    prisma.subscription.findFirst.mockResolvedValue({
      id: 'subscription-id',
      status: SubscriptionStatusEnum.PAUSED,
    });

    await service.resume('subscription-id', 'user-id');

    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: 'subscription-id' },
      data: { status: SubscriptionStatusEnum.ACTIVE, updatedBy: 'user-id' },
    });
  });
});
