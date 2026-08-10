import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            email: string;
            status: import(".prisma/client").$Enums.UserStatusEnum;
        };
    }>;
    login(dto: LoginDto, req: Request): Promise<{
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
    refreshToken(dto: RefreshTokenDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: JwtPayload, refreshToken?: string, sessionToken?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerification(dto: ResendVerificationDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
}
