import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferencesDto } from './dto/notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any, page: number, limit: number): Promise<{
        data: {
            message: string;
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import(".prisma/client").$Enums.NotificationTypeEnum;
            title: string;
            isRead: boolean;
            channel: import(".prisma/client").$Enums.NotificationChannelEnum;
            readAt: Date | null;
            deepLink: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    getPreferences(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        emailOrderUpdates: boolean;
        emailMarketing: boolean;
        inAppProjectAlerts: boolean;
        smsUrgentAlerts: boolean;
    }>;
    updatePreferences(req: any, dto: UpdateNotificationPreferencesDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        emailOrderUpdates: boolean;
        emailMarketing: boolean;
        inAppProjectAlerts: boolean;
        smsUrgentAlerts: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    markAsRead(id: string, req: any): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.NotificationTypeEnum;
        title: string;
        isRead: boolean;
        channel: import(".prisma/client").$Enums.NotificationChannelEnum;
        readAt: Date | null;
        deepLink: string | null;
    }>;
    softDelete(id: string, req: any): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.NotificationTypeEnum;
        title: string;
        isRead: boolean;
        channel: import(".prisma/client").$Enums.NotificationChannelEnum;
        readAt: Date | null;
        deepLink: string | null;
    }>;
}
