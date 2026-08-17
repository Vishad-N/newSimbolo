import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../abstractions/base.service';
import { QueueService } from '../../queues/queue.service';
export interface SendEmailJobData extends Record<string, unknown> {
    to: string;
    subject: string;
    htmlContent: string;
}
export declare class EmailService extends BaseService implements OnModuleInit {
    private readonly configService;
    private readonly queueService;
    private transporter;
    private readonly fromEmail;
    constructor(configService: ConfigService, queueService: QueueService);
    onModuleInit(): void;
    private initializeTransporter;
    /**
     * Pushes an email to the BullMQ 'email' queue to be processed asynchronously.
     */
    sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean>;
    /**
     * BullMQ Job Processor
     * Actually dispatches the email via SMTP.
     */
    private processEmailJob;
    sendVerificationEmail(to: string, token: string, frontendUrl?: string): Promise<boolean>;
    sendPasswordResetEmail(to: string, token: string, frontendUrl?: string): Promise<boolean>;
    sendWelcomeEmail(to: string, name: string): Promise<boolean>;
    sendInvoiceEmail(to: string, name: string, invoiceNumber: string, amount: number, dueDate: Date, currency?: string): Promise<boolean>;
    sendSubscriptionRenewalReminder(to: string, name: string, planName: string, renewalDate: Date, amount: number, currency?: string): Promise<boolean>;
    sendNotificationEmail(to: string, title: string, message: string, deepLink?: string): Promise<boolean>;
}
