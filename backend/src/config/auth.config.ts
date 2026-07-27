import { registerAs } from '@nestjs/config';
import { AuthConfig } from './configuration.interface';

export default registerAs('auth', (): AuthConfig => ({
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-me',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
}));
