import { ConfigService } from '@nestjs/config';
import { BaseService } from '../abstractions/base.service';
export declare class EmailService extends BaseService {
    private readonly configService;
    private transporter;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean>;
    sendVerificationEmail(to: string, token: string, frontendUrl?: string): Promise<boolean>;
    sendPasswordResetEmail(to: string, token: string, frontendUrl?: string): Promise<boolean>;
    sendWelcomeEmail(to: string, name: string): Promise<boolean>;
    sendLoginAlertEmail(to: string, ip: string, userAgent: string, timestamp: Date): Promise<boolean>;
    sendInvoiceEmail(to: string, name: string, invoiceNumber: string, amount: number, dueDate: Date, currency?: string): Promise<boolean>;
    sendPaymentConfirmationEmail(to: string, name: string, amount: number, transactionId: string, currency?: string): Promise<boolean>;
    sendProjectCreatedEmail(to: string, name: string, projectName: string, projectId: string): Promise<boolean>;
    sendMeetingReminderEmail(to: string, name: string, meetingTitle: string, startTime: Date, meetUrl?: string): Promise<boolean>;
    sendTicketUpdateEmail(to: string, name: string, ticketNumber: string, newStatus: string): Promise<boolean>;
    sendSubscriptionRenewalReminder(to: string, name: string, planName: string, renewalDate: Date, amount: number, currency?: string): Promise<boolean>;
}
