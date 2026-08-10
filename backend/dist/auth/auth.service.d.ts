import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { AuditService } from '../shared/audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
export declare class AuthService extends BaseService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    private readonly auditService;
    private readonly sessionsService;
    private readonly bcryptRounds;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly jwtRefreshSecret;
    private readonly jwtRefreshExpiresIn;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService, auditService: AuditService, sessionsService: SessionsService);
    register(dto: RegisterDto, ip?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            email: string;
            status: import(".prisma/client").$Enums.UserStatusEnum;
        };
    }>;
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        sessionToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            status: "ACTIVE" | "PENDING_VERIFICATION";
            role: string;
            permissions: string[];
            organizationId: string | null;
        };
    }>;
    refreshToken(dto: RefreshTokenDto, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string, sessionToken?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, ip?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, ip?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto, ip?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerificationEmail(dto: ResendVerificationDto, ip?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateGoogleOAuth(profile: any, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        sessionToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            avatarUrl: any;
            status: any;
            role: any;
            permissions: any;
            hasActivePlan: boolean;
        };
    }>;
    private generateTokens;
}
