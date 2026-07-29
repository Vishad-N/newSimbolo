"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const notifications_service_1 = require("./notifications.service");
describe('NotificationsService', () => {
    it('suppresses in-app notifications when the user preference disables project alerts', async () => {
        const prisma = {
            notificationPreference: {
                findUnique: jest.fn().mockResolvedValue({ userId: 'user-id', inAppProjectAlerts: false }),
            },
            notification: {
                create: jest.fn(),
            },
        };
        const service = new notifications_service_1.NotificationsService(prisma);
        await expect(service.sendNotification({
            userId: 'user-id',
            type: client_1.NotificationTypeEnum.PROJECT,
            channel: client_1.NotificationChannelEnum.IN_APP,
            title: 'Project update',
            message: 'A milestone moved forward.',
        })).resolves.toBeNull();
        expect(prisma.notification.create).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=notifications.service.spec.js.map