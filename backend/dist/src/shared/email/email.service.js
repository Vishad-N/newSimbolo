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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const base_service_1 = require("../abstractions/base.service");
let EmailService = EmailService_1 = class EmailService extends base_service_1.BaseService {
    configService;
    transporter = null;
    fromEmail;
    constructor(configService) {
        super(EmailService_1.name);
        this.configService = configService;
        this.fromEmail = this.configService.get('email.from', 'noreply@simbolo.ai');
        this.initializeTransporter();
    }
    initializeTransporter() {
        const host = this.configService.get('email.host');
        const port = this.configService.get('email.port', 2525);
        const user = this.configService.get('email.user');
        const pass = this.configService.get('email.pass');
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                auth: { user, pass },
            });
            this.logger.log(`📧 Email transport configured for SMTP host: ${host}:${port}`);
        }
        else {
            this.logger.warn('📧 SMTP credentials not fully configured. Running EmailService in preview/mock mode.');
        }
    }
    async sendEmail(to, subject, htmlContent) {
        try {
            if (this.transporter) {
                await this.transporter.sendMail({
                    from: `"The Simbolo Platform" <${this.fromEmail}>`,
                    to,
                    subject,
                    html: htmlContent,
                });
                this.logger.log(`📧 Email sent successfully to ${to} [Subject: ${subject}]`);
                return true;
            }
            else {
                this.logger.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
                this.logger.debug(`📧 [MOCK EMAIL BODY]\n${htmlContent}`);
                return true;
            }
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}:`, error.stack);
            return false;
        }
    }
    async sendVerificationEmail(to, token, frontendUrl) {
        const baseUrl = frontendUrl || this.configService.get('app.frontendUrls', ['http://localhost:3000'])[0];
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
    async sendPasswordResetEmail(to, token, frontendUrl) {
        const baseUrl = frontendUrl || this.configService.get('app.frontendUrls', ['http://localhost:3000'])[0];
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
    async sendWelcomeEmail(to, name) {
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
    async sendLoginAlertEmail(to, ip, userAgent, timestamp) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #3B82F6;">New Login Detected</h2>
        <p>We noticed a new sign-in to your Simbolo account:</p>
        <ul style="background-color: #f8fafc; padding: 15px 30px; border-radius: 6px; list-style: none;">
          <li><strong>Time:</strong> ${timestamp.toUTCString()}</li>
          <li><strong>IP Address:</strong> ${ip || 'Unknown'}</li>
          <li><strong>Device/Browser:</strong> ${userAgent || 'Unknown'}</li>
        </ul>
        <p style="font-size: 13px; color: #666;">If this was you, no action is needed. If you do not recognize this activity, please change your password immediately and revoke active sessions in your profile.</p>
      </div>
    `;
        return this.sendEmail(to, 'Security Alert: New login to your account', html);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map