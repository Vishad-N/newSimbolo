import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Job } from 'bullmq';
import { BaseService } from '../abstractions/base.service';
import { QueueService } from '../../queues/queue.service';

export interface SendEmailJobData extends Record<string, unknown> {
  to: string;
  subject: string;
  htmlContent: string;
}

@Injectable()
export class EmailService extends BaseService implements OnModuleInit {
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {
    super(EmailService.name);
    this.fromEmail = this.configService.get<string>('email.from', 'noreply@simbolo.ai');
    this.initializeTransporter();
  }

  onModuleInit() {
    this.queueService.registerWorker<SendEmailJobData>('email', this.processEmailJob.bind(this));
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('email.host');
    const port = this.configService.get<number>('email.port', 2525);
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.pass');
    const secure = this.configService.get<boolean>('email.secure', false);
    const hasMockConfig = [host, user, pass].some((value) => value?.toLowerCase().includes('mock'));

    if (host && user && pass && !hasMockConfig) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 5000,
      });
      this.logger.log(`📧 Email transport configured for SMTP host: ${host}:${port} (secure: ${secure})`);
    } else {
      this.logger.warn('📧 SMTP credentials not fully configured. Running EmailService in preview/mock mode.');
    }
  }

  /**
   * Pushes an email to the BullMQ 'email' queue to be processed asynchronously.
   */
  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      const result = await this.queueService.add<SendEmailJobData>('email', 'send-email', {
        to,
        subject,
        htmlContent,
      });
      
      if (!result.queued) {
        this.logger.warn(`Failed to queue email to ${to} (BullMQ disabled)`);
        return false;
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to enqueue email to ${to}:`, (error as Error).stack);
      return false;
    }
  }

  /**
   * BullMQ Job Processor
   * Actually dispatches the email via SMTP.
   */
  private async processEmailJob(job: Job<SendEmailJobData>): Promise<void> {
    const { to, subject, htmlContent } = job.data;
    
    if (this.transporter) {
      await this.transporter.sendMail({
        from: `"The Simbolo Platform" <${this.fromEmail}>`,
        to,
        subject,
        html: htmlContent,
      });
      this.logger.log(`📧 Email sent successfully to ${to} [Subject: ${subject}]`);
    } else {
      this.logger.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      this.logger.debug(`📧 [MOCK EMAIL BODY]\n${htmlContent}`);
    }
  }

  // ── Existing Email Templates ─────────────────────────────────────────

  async sendVerificationEmail(to: string, token: string, frontendUrl?: string): Promise<boolean> {
    const baseUrl = frontendUrl || this.configService.get<string[]>('app.frontendUrls', ['http://localhost:3000'])[0];
    const verificationLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #14B8A6;">Welcome to The Simbolo!</h2>
        <p>Thank you for registering. Please verify your email address to activate your account and access the platform.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verificationLink}" style="background-color: #14B8A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify My Email</a>
        </div>
        <p style="font-size: 13px; color: #666;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${verificationLink}">${verificationLink}</a></p>
        <p style="font-size: 12px; color: #999; margin-top: 30px;">This token expires in 24 hours. If you did not request this, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail(to, 'Verify your email address - The Simbolo', html);
  }

  async sendPasswordResetEmail(to: string, token: string, frontendUrl?: string): Promise<boolean> {
    const baseUrl = frontendUrl || this.configService.get<string[]>('app.frontendUrls', ['http://localhost:3000'])[0];
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #F59E0B;">Password Reset Request</h2>
        <p>We received a request to reset your password for your Simbolo account. Click the button below to choose a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #666;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetLink}">${resetLink}</a></p>
        <p style="font-size: 12px; color: #999; margin-top: 30px;">This token expires in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    return this.sendEmail(to, 'Reset your password - The Simbolo', html);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #10B981;">Welcome aboard, ${name}! 🎉</h2>
        <p>Your Simbolo account is verified and ready. You can now access your digital marketing dashboard, track projects, order services, and collaborate with our team.</p>
        <p>If you have any questions or need assistance getting started, our support team is always here to help.</p>
        <p style="margin-top: 20px;">Best regards,<br/><strong>The Simbolo Team</strong></p>
      </div>
    `;

    return this.sendEmail(to, 'Welcome to The Simbolo Platform!', html);
  }

  async sendInvoiceEmail(
    to: string,
    name: string,
    invoiceNumber: string,
    amount: number,
    dueDate: Date,
    currency = 'INR',
  ): Promise<boolean> {
    const symbol = currency === 'INR' ? '₹' : '$';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #14B8A6;">Invoice Ready — ${invoiceNumber}</h2>
        <p>Hi ${name},</p>
        <p>Your invoice <strong>${invoiceNumber}</strong> for <strong>${symbol}${amount.toLocaleString('en-IN')}</strong> has been generated and is ready for download from your dashboard.</p>
        <div style="background-color: #f8fafc; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p style="margin: 8px 0 0;"><strong>Amount Due:</strong> ${symbol}${amount.toLocaleString('en-IN')}</p>
          <p style="margin: 8px 0 0;"><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-IN')}</p>
        </div>
        <p style="margin-top: 20px;">Best regards,<br/><strong>The Simbolo Billing Team</strong></p>
      </div>
    `;
    return this.sendEmail(to, `Invoice ${invoiceNumber} from The Simbolo`, html);
  }

  async sendSubscriptionRenewalReminder(
    to: string,
    name: string,
    planName: string,
    renewalDate: Date,
    amount: number,
    currency = 'INR',
  ): Promise<boolean> {
    const symbol = currency === 'INR' ? '₹' : '$';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #14B8A6;">Subscription Renewal Reminder</h2>
        <p>Hi ${name},</p>
        <p>Your subscription <strong>${planName}</strong> is due for renewal in 7 days.</p>
        <div style="background-color: #f8fafc; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
          <p style="margin: 8px 0 0;"><strong>Renewal Date:</strong> ${renewalDate.toLocaleDateString('en-IN')}</p>
          <p style="margin: 8px 0 0;"><strong>Amount:</strong> ${symbol}${amount.toLocaleString('en-IN')}</p>
        </div>
        <p>No action required if you wish to continue — your subscription will renew automatically.</p>
        <p>To cancel or change your plan, visit your dashboard before the renewal date.</p>
        <p style="margin-top: 20px;">Best regards,<br/><strong>The Simbolo Billing Team</strong></p>
      </div>
    `;
    return this.sendEmail(to, `Subscription Renewal Reminder: ${planName}`, html);
  }

  // ── Generic Notification Template ─────────────────────────────────────────

  async sendNotificationEmail(to: string, title: string, message: string, deepLink?: string): Promise<boolean> {
    const baseUrl = this.configService.get<string[]>('app.frontendUrls', ['https://app.simbolo.ai'])[0];
    const linkUrl = deepLink ? (deepLink.startsWith('http') ? deepLink : `${baseUrl}${deepLink}`) : baseUrl;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #3B82F6;">${title}</h2>
        <p>${message}</p>
        <div style="margin: 30px 0;">
          <a href="${linkUrl}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Dashboard</a>
        </div>
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
          You received this email because of your notification preferences. 
          To stop receiving these alerts, you can update your preferences in your account settings.
        </p>
      </div>
    `;

    return this.sendEmail(to, title, html);
  }
}
