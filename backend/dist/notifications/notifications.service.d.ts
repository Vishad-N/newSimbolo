import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { UpdateNotificationPreferencesDto } from './dto/notification.dto';
import { NotificationTypeEnum, NotificationChannelEnum } from '@prisma/client';
export interface SendNotificationOptions {
    userId: string;
    type?: NotificationTypeEnum;
    channel?: NotificationChannelEnum;
    title: string;
    message: string;
    deepLink?: string;
}
export declare class NotificationsService extends BaseService {
    private readonly prisma;
    private readonly emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    /**
     * Central notification dispatch — creates an in-app notification record.
     * Checks user preferences before creating.
     * WebSocket emission handled by ChatGateway where applicable.
     */
    sendNotification(options: SendNotificationOptions): Promise<{
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
    } | null>;
    sendBulkNotification(userIds: string[], type: NotificationTypeEnum, title: string, message: string, deepLink?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyPaymentReceived(userId: string, amount: number, currency?: string): Promise<{
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
    } | null>;
    notifyInvoiceGenerated(userId: string, invoiceNumber: string): Promise<{
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
    } | null>;
    notifyNewMessage(userId: string, conversationId: string, senderName: string): Promise<{
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
    } | null>;
    notifyProjectAssigned(userId: string, projectName: string, projectId: string): Promise<{
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
    } | null>;
    notifyDeliverableUploaded(userId: string, deliverableTitle: string, projectId: string): Promise<{
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
    } | null>;
    notifyMilestoneCompleted(userId: string, milestoneName: string, projectId: string): Promise<{
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
    } | null>;
    notifyMeetingScheduled(userId: string, meetingTitle: string, startTime: Date): Promise<{
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
    } | null>;
    notifyTicketUpdated(userId: string, ticketNumber: string, newStatus: string): Promise<{
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
    } | null>;
    findUserNotifications(userId: string, page?: number, limit?: number): Promise<{
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
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
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
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    softDelete(id: string, userId: string): Promise<{
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
    getPreferences(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        emailOrderUpdates: boolean;
        emailMarketing: boolean;
        inAppProjectAlerts: boolean;
        smsUrgentAlerts: boolean;
    }>;
    updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        emailOrderUpdates: boolean;
        emailMarketing: boolean;
        inAppProjectAlerts: boolean;
        smsUrgentAlerts: boolean;
    }>;
}
