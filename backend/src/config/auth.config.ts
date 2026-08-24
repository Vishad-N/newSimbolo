import { randomBytes } from 'crypto';
import { registerAs } from '@nestjs/config';
import { AuthConfig } from './configuration.interface';

// Production boot already fails fast if JWT_SECRET/JWT_REFRESH_SECRET are missing
// or look like placeholders (see env.validation.ts). This fallback exists only for
// local dev convenience when NODE_ENV isn't 'production' — it's generated fresh per
// process instead of a fixed string, so it can never be the same known secret two
// environments (or an attacker reading this public repo) could both end up using.
const devFallbackSecret = () => randomBytes(32).toString('hex');

export default registerAs('auth', (): AuthConfig => ({
  jwtSecret: process.env.JWT_SECRET || devFallbackSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || devFallbackSecret(),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
}));
