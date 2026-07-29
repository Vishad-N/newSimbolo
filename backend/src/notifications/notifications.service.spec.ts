import { NotificationChannelEnum, NotificationTypeEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

type NotificationsPrismaMock = {
  notificationPreference: {
    findUnique: jest.Mock;
  };
  notification: {
    create: jest.Mock;
  };
};

describe('NotificationsService', () => {
  it('suppresses in-app notifications when the user preference disables project alerts', async () => {
    const prisma: NotificationsPrismaMock = {
      notificationPreference: {
        findUnique: jest.fn().mockResolvedValue({ userId: 'user-id', inAppProjectAlerts: false }),
      },
      notification: {
        create: jest.fn(),
      },
    };
    const service = new NotificationsService(prisma as unknown as PrismaService);

    await expect(
      service.sendNotification({
        userId: 'user-id',
        type: NotificationTypeEnum.PROJECT,
        channel: NotificationChannelEnum.IN_APP,
        title: 'Project update',
        message: 'A milestone moved forward.',
      }),
    ).resolves.toBeNull();

    expect(prisma.notification.create).not.toHaveBeenCalled();
  });
});
