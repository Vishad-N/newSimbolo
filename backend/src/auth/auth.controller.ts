import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new client user account' })
  @ApiResponse({ status: 201, description: 'User successfully registered. Verification email sent.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 409, description: 'Email address already exists.' })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, ip, userAgent);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful. Returns JWT tokens.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @ApiResponse({ status: 403, description: 'Account disabled or suspended.' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Rotate and renew access token using active refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens renewed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or revoked refresh token.' })
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(dto, ip, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out current user and revoke token/session' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
        sessionToken: { type: 'string', example: 'hex-session-token' },
      },
    },
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Body('refreshToken') refreshToken?: string,
    @Body('sessionToken') sessionToken?: string,
  ) {
    return this.authService.logout(user.sub, refreshToken, sessionToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Request password reset verification link' })
  @ApiResponse({ status: 200, description: 'Reset instructions sent if account exists.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.forgotPassword(dto, ip, userAgent);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password using verification token from email' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token.' })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.resetPassword(dto, ip, userAgent);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email address and activate user account' })
  @ApiResponse({ status: 200, description: 'Account verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token.' })
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.verifyEmail(dto, ip, userAgent);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Resend email verification link for pending accounts' })
  @ApiResponse({ status: 200, description: 'Verification email resent if account is pending.' })
  async resendVerification(@Body() dto: ResendVerificationDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.resendVerificationEmail(dto, ip, userAgent);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth 2.0 authentication flow' })
  async googleAuth() {
    // Initiates Google OAuth redirection automatically by Passport
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth 2.0 callback URL' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.validateGoogleOAuth(req.user, ip, userAgent);

    // Redirect to frontend with JWT tokens
    const frontendUrl = process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:3000';
    const hasActivePlan = !!result.user.hasActivePlan;
    return res.redirect(`${frontendUrl}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&hasActivePlan=${hasActivePlan}`);
  }
}
