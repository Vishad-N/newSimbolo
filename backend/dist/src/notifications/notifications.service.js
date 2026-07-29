"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let NotificationsService = class NotificationsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('NotificationsService');
        this.prisma = prisma;
    }
    /**
     * Central notification dispatch — creates an in-app notification record.
     * Checks user preferences before creating.
     * WebSocket emission handled by ChatGateway where applicable.
     */
    async sendNotification(options) {
        const { userId, type = client_1.NotificationTypeEnum.SYSTEM, title, message, deepLink, channel = client_1.NotificationChannelEnum.IN_APP, } = options;
        // Check preferences
        const preferences = await this.prisma.notificationPreference.findUnique({ where: { userId } });
        if (preferences && channel === client_1.NotificationChannelEnum.IN_APP && !preferences.inAppProjectAlerts) {
            // Respect user opt-out (still log for auditing)
            this.logger.log(`🔕 Notification suppressed for user ${userId} (preference opt-out)`);
            return null;
        }
        const notification = await this.prisma.notification.create({
            data: { userId, type, channel, title, message, deepLink: deepLink ?? null },
        });
        this.logger.log(`🔔 Notification sent to user ${userId}: ${title}`);
        return notification;
    }
    async sendBulkNotification(userIds, type, title, message, deepLink) {
        const notifications = await this.prisma.notification.createMany({
            data: userIds.map((userId) => ({
                userId,
                type,
                channel: client_1.NotificationChannelEnum.IN_APP,
                title,
                message,
                deepLink: deepLink ?? null,
            })),
        });
        return notifications;
    }
    // ── Typed notification helpers ─────────────────────────────────
    async notifyPaymentReceived(userId, amount, currency = 'INR') {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.INVOICE,
            title: 'Payment Received',
            message: `Your payment of ${currency === 'INR' ? '₹' : '$'}${amount.toLocaleString('en-IN')} has been received successfully.`,
            deepLink: '/dashboard/payments',
        });
    }
    async notifyInvoiceGenerated(userId, invoiceNumber) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.INVOICE,
            title: 'Invoice Generated',
            message: `Invoice ${invoiceNumber} has been generated and is ready for download.`,
            deepLink: '/dashboard/invoices',
        });
    }
    async notifyNewMessage(userId, conversationId, senderName) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.PROJECT,
            title: 'New Message',
            message: `You have a new message from ${senderName}.`,
            deepLink: `/dashboard/chat/${conversationId}`,
        });
    }
    async notifyProjectAssigned(userId, projectName, projectId) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.PROJECT,
            title: 'Project Assigned',
            message: `You have been assigned to the project: "${projectName}".`,
            deepLink: `/dashboard/projects/${projectId}`,
        });
    }
    async notifyDeliverableUploaded(userId, deliverableTitle, projectId) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.PROJECT,
            title: 'Deliverable Uploaded',
            message: `A new deliverable "${deliverableTitle}" has been uploaded for your review.`,
            deepLink: `/dashboard/projects/${projectId}/deliverables`,
        });
    }
    async notifyMilestoneCompleted(userId, milestoneName, projectId) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.PROJECT,
            title: 'Milestone Completed',
            message: `Milestone "${milestoneName}" has been marked as completed.`,
            deepLink: `/dashboard/projects/${projectId}`,
        });
    }
    async notifyMeetingScheduled(userId, meetingTitle, startTime) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.MEETING,
            title: 'Meeting Scheduled',
            message: `Meeting "${meetingTitle}" has been scheduled for ${startTime.toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}.`,
            deepLink: '/dashboard/meetings',
        });
    }
    async notifyTicketUpdated(userId, ticketNumber, newStatus) {
        return this.sendNotification({
            userId,
            type: client_1.NotificationTypeEnum.SUPPORT,
            title: 'Support Ticket Updated',
            message: `Your ticket ${ticketNumber} has been updated to: ${newStatus}.`,
            deepLink: '/dashboard/support',
        });
    }
    // ── Retrieval endpoints ─────────────────────────────────────────
    async findUserNotifications(userId, page = 1, limit = 20) {
        const where = { userId, deletedAt: null };
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false, deletedAt: null },
        });
        return { count };
    }
    async markAsRead(id, userId) {
        const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
        if (!notification)
            throw new common_1.NotFoundException(`Notification ${id} not found`);
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false, deletedAt: null },
            data: { isRead: true, readAt: new Date() },
        });
        return { message: 'All notifications marked as read' };
    }
    async softDelete(id, userId) {
        const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
        if (!notification)
            throw new common_1.NotFoundException(`Notification ${id} not found`);
        return this.prisma.notification.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    // ── Preferences ─────────────────────────────────────────────────
    async getPreferences(userId) {
        let prefs = await this.prisma.notificationPreference.findUnique({ where: { userId } });
        if (!prefs) {
            prefs = await this.prisma.notificationPreference.create({ data: { userId } });
        }
        return prefs;
    }
    async updatePreferences(userId, dto) {
        return this.prisma.notificationPreference.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: { ...dto },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map