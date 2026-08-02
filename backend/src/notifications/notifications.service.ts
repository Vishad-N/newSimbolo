import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class NotificationsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {
    super('NotificationsService');
  }

  /**
   * Central notification dispatch — creates an in-app notification record.
   * Checks user preferences before creating.
   * WebSocket emission handled by ChatGateway where applicable.
   */
  async sendNotification(options: SendNotificationOptions) {
    const {
      userId,
      type = NotificationTypeEnum.SYSTEM,
      title,
      message,
      deepLink,
      channel = NotificationChannelEnum.IN_APP,
    } = options;

    // Check preferences
    const preferences = await this.prisma.notificationPreference.findUnique({ where: { userId } });
    if (preferences && channel === NotificationChannelEnum.IN_APP && !preferences.inAppProjectAlerts) {
      // Respect user opt-out (still log for auditing)
      this.logger.log(`🔕 Notification suppressed for user ${userId} (preference opt-out)`);
      return null;
    }

    const notification = await this.prisma.notification.create({
      data: { userId, type, channel, title, message, deepLink: deepLink ?? null },
    });

    this.logger.log(`🔔 Notification sent to user ${userId}: ${title}`);

    // Bridge: Trigger email if user wants order updates (we map most system alerts to this for now)
    const shouldSendEmail = !preferences || preferences.emailOrderUpdates;
    if (shouldSendEmail) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user?.email) {
        // Send email asynchronously in the background
        this.emailService.sendNotificationEmail(user.email, title, message, deepLink).catch((err) => {
          this.logger.error(`Failed to bridge notification to email for ${userId}: ${err.message}`);
        });
      }
    }

    return notification;
  }

  async sendBulkNotification(
    userIds: string[],
    type: NotificationTypeEnum,
    title: string,
    message: string,
    deepLink?: string,
  ) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        channel: NotificationChannelEnum.IN_APP,
        title,
        message,
        deepLink: deepLink ?? null,
      })),
    });
    return notifications;
  }

  // ── Typed notification helpers ─────────────────────────────────

  async notifyPaymentReceived(userId: string, amount: number, currency = 'INR') {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.INVOICE,
      title: 'Payment Received',
      message: `Your payment of ${currency === 'INR' ? '₹' : '$'}${amount.toLocaleString('en-IN')} has been received successfully.`,
      deepLink: '/dashboard/payments',
    });
  }

  async notifyInvoiceGenerated(userId: string, invoiceNumber: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.INVOICE,
      title: 'Invoice Generated',
      message: `Invoice ${invoiceNumber} has been generated and is ready for download.`,
      deepLink: '/dashboard/invoices',
    });
  }

  async notifyNewMessage(userId: string, conversationId: string, senderName: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.PROJECT,
      title: 'New Message',
      message: `You have a new message from ${senderName}.`,
      deepLink: `/dashboard/chat/${conversationId}`,
    });
  }

  async notifyProjectAssigned(userId: string, projectName: string, projectId: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.PROJECT,
      title: 'Project Assigned',
      message: `You have been assigned to the project: "${projectName}".`,
      deepLink: `/dashboard/projects/${projectId}`,
    });
  }

  async notifyDeliverableUploaded(userId: string, deliverableTitle: string, projectId: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.PROJECT,
      title: 'Deliverable Uploaded',
      message: `A new deliverable "${deliverableTitle}" has been uploaded for your review.`,
      deepLink: `/dashboard/projects/${projectId}/deliverables`,
    });
  }

  async notifyMilestoneCompleted(userId: string, milestoneName: string, projectId: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.PROJECT,
      title: 'Milestone Completed',
      message: `Milestone "${milestoneName}" has been marked as completed.`,
      deepLink: `/dashboard/projects/${projectId}`,
    });
  }

  async notifyMeetingScheduled(userId: string, meetingTitle: string, startTime: Date) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.MEETING,
      title: 'Meeting Scheduled',
      message: `Meeting "${meetingTitle}" has been scheduled for ${startTime.toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' } as any)}.`,
      deepLink: '/dashboard/meetings',
    });
  }

  async notifyTicketUpdated(userId: string, ticketNumber: string, newStatus: string) {
    return this.sendNotification({
      userId,
      type: NotificationTypeEnum.SUPPORT,
      title: 'Support Ticket Updated',
      message: `Your ticket ${ticketNumber} has been updated to: ${newStatus}.`,
      deepLink: '/dashboard/support',
    });
  }

  // ── Retrieval endpoints ─────────────────────────────────────────

  async findUserNotifications(userId: string, page = 1, limit = 20) {
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

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false, deletedAt: null },
    });
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false, deletedAt: null },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'All notifications marked as read' };
  }

  async softDelete(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return this.prisma.notification.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ── Preferences ─────────────────────────────────────────────────

  async getPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({ where: { userId } });
    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({ data: { userId } });
    }
    return prefs;
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });
  }
}
