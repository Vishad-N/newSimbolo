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
}
