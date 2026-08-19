import { plainToInstance, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl, ValidationError, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsNumber()
  PORT?: number;

  @IsOptional()
  @IsNumber()
  API_PORT?: number;

  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  DIRECT_URL?: string;

  @IsString()
  FRONTEND_URLS: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsOptional()
  @IsString()
  GOOGLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  GOOGLE_CLIENT_SECRET?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  GOOGLE_CALLBACK_URL?: string;

  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsOptional()
  @IsString()
  CLOUDINARY_CLOUD_NAME?: string;

  @IsOptional()
  @IsString()
  CLOUDINARY_API_KEY?: string;

  @IsOptional()
  @IsString()
  CLOUDINARY_API_SECRET?: string;

  @IsOptional()
  @IsString()
  GEMINI_API_KEY?: string;

  @IsOptional()
  @IsString()
  RAZORPAY_KEY_ID?: string;

  @IsOptional()
  @IsString()
  RAZORPAY_KEY_SECRET?: string;

  @IsOptional()
  @IsString()
  RAZORPAY_WEBHOOK_SECRET?: string;

  @IsOptional()
  @IsString()
  RAZORPAYX_KEY_ID?: string;

  @IsOptional()
  @IsString()
  RAZORPAYX_KEY_SECRET?: string;

  @IsOptional()
  @IsString()
  RAZORPAYX_ACCOUNT_NUMBER?: string;

  @IsOptional()
  @IsString()
  RAZORPAYX_WEBHOOK_SECRET?: string;

  @IsOptional()
  @IsString()
  SMTP_HOST?: string;

  @IsOptional()
  @IsNumber()
  SMTP_PORT?: number;

  @IsOptional()
  @IsString()
  SMTP_USER?: string;

  @IsOptional()
  @IsString()
  SMTP_PASSWORD?: string;

  @IsOptional()
  @IsString()
  SMTP_PASS?: string;

  @IsOptional()
  @IsString()
  SMTP_FROM?: string;

  @IsOptional()
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsBoolean()
  GOOGLE_OAUTH_ENABLED?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsBoolean()
  GEMINI_ENABLED?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsBoolean()
  RAZORPAY_ENABLED?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsBoolean()
  EMAIL_ENABLED?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsBoolean()
  CLOUDINARY_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  STORAGE_PROVIDER?: string;

  @IsOptional()
  @IsString()
  R2_ACCOUNT_ID?: string;

  @IsOptional()
  @IsString()
  R2_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  R2_SECRET_ACCESS_KEY?: string;

  @IsOptional()
  @IsString()
  R2_BUCKET_NAME?: string;
}

export function validate(config: Record<string, unknown>) {
  const normalizedConfig = normalizeFeatureFlags(applyRuntimeDefaults(config));
  const validatedConfig = plainToInstance(EnvironmentVariables, normalizedConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${formatValidationErrors(errors)}`);
  }

  if (validatedConfig.NODE_ENV === Environment.Production) {
    validateProductionConfig(validatedConfig);
  }

  return validatedConfig;
}

function applyRuntimeDefaults(config: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...config };

  if (!normalized.PORT && normalized.API_PORT) {
    normalized.PORT = normalized.API_PORT;
    process.env.PORT = String(normalized.API_PORT);
  }

  if (!normalized.DIRECT_URL && typeof normalized.DATABASE_URL === 'string' && normalized.DATABASE_URL) {
    normalized.DIRECT_URL = normalized.DATABASE_URL;
    process.env.DIRECT_URL = normalized.DATABASE_URL;
  }

  return normalized;
}

function validateProductionConfig(config: EnvironmentVariables): void {
  const missingVariables: string[] = [];

  requireValue(config.PORT || config.API_PORT, 'PORT', missingVariables);
  requireValue(config.DATABASE_URL, 'DATABASE_URL', missingVariables);
  requireValue(config.DIRECT_URL, 'DIRECT_URL', missingVariables);
  requireValue(config.FRONTEND_URLS, 'FRONTEND_URLS', missingVariables);
  requireSecret(config.JWT_SECRET, 'JWT_SECRET', missingVariables);
  requireSecret(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET', missingVariables);

  if (
    isIntegrationEnabled(config.GOOGLE_OAUTH_ENABLED, [
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_CALLBACK_URL,
    ])
  ) {
    requireValue(config.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID', missingVariables);
    requireSecret(config.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET', missingVariables);
    requireValue(config.GOOGLE_CALLBACK_URL, 'GOOGLE_CALLBACK_URL', missingVariables);
  }

  if (isIntegrationEnabled(config.GEMINI_ENABLED, [config.GEMINI_API_KEY])) {
    requireSecret(config.GEMINI_API_KEY, 'GEMINI_API_KEY', missingVariables);
  }

  if (isIntegrationEnabled(config.RAZORPAY_ENABLED, [config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET])) {
    requireValue(config.RAZORPAY_KEY_ID, 'RAZORPAY_KEY_ID', missingVariables);
    requireSecret(config.RAZORPAY_KEY_SECRET, 'RAZORPAY_KEY_SECRET', missingVariables);
  }

  if (
    isIntegrationEnabled(config.EMAIL_ENABLED, [
      config.SMTP_HOST,
      config.SMTP_USER,
      config.SMTP_PASSWORD,
      config.SMTP_PASS,
    ])
  ) {
    requireValue(config.SMTP_HOST, 'SMTP_HOST', missingVariables);
    requireValue(config.SMTP_PORT, 'SMTP_PORT', missingVariables);
    requireValue(config.SMTP_USER, 'SMTP_USER', missingVariables);
    requireCredential(config.SMTP_PASSWORD || config.SMTP_PASS, 'SMTP_PASSWORD', missingVariables);
  }

  if (
    isIntegrationEnabled(config.CLOUDINARY_ENABLED, [
      config.CLOUDINARY_CLOUD_NAME,
      config.CLOUDINARY_API_KEY,
      config.CLOUDINARY_API_SECRET,
    ])
  ) {
    requireValue(config.CLOUDINARY_CLOUD_NAME, 'CLOUDINARY_CLOUD_NAME', missingVariables);
    requireValue(config.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY', missingVariables);
    requireSecret(config.CLOUDINARY_API_SECRET, 'CLOUDINARY_API_SECRET', missingVariables);
  }

  if (config.STORAGE_PROVIDER === 'r2') {
    requireValue(config.R2_ACCOUNT_ID, 'R2_ACCOUNT_ID', missingVariables);
    requireValue(config.R2_ACCESS_KEY_ID, 'R2_ACCESS_KEY_ID', missingVariables);
    requireSecret(config.R2_SECRET_ACCESS_KEY, 'R2_SECRET_ACCESS_KEY', missingVariables);
    requireValue(config.R2_BUCKET_NAME, 'R2_BUCKET_NAME', missingVariables);
  }

  if (missingVariables.length > 0) {
    throw new Error(`Environment validation failed: ${missingVariables.join('; ')}`);
  }
}

function requireValue(value: unknown, name: string, missingVariables: string[]): void {
  if (value === undefined || value === null || value === '') {
    missingVariables.push(`Missing required environment variable: ${name}`);
  }
}

function requireSecret(value: unknown, name: string, missingVariables: string[]): void {
  requireValue(value, name, missingVariables);
  if (typeof value !== 'string') return;

  const normalized = value.toLowerCase();
  if (
    value.length < 16 ||
    normalized.includes('change-me') ||
    normalized.includes('mock') ||
    normalized.includes('your-')
  ) {
    missingVariables.push(`${name} must be a non-placeholder secret with at least 16 characters`);
  }
}

function requireCredential(value: unknown, name: string, missingVariables: string[]): void {
  requireValue(value, name, missingVariables);
  if (typeof value !== 'string') return;

  const normalized = value.toLowerCase();
  if (normalized.includes('change-me') || normalized.includes('mock') || normalized.includes('your-')) {
    missingVariables.push(`${name} must be a non-placeholder credential`);
  }
}

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return Boolean(value);

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return Boolean(value);
}

function isIntegrationEnabled(flag: boolean | undefined, values: Array<unknown>): boolean {
  if (flag !== undefined) return flag;
  return values.some((value) => typeof value === 'string' && value.trim().length > 0);
}

function normalizeFeatureFlags(config: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...config };
  for (const key of [
    'GOOGLE_OAUTH_ENABLED',
    'GEMINI_ENABLED',
    'RAZORPAY_ENABLED',
    'EMAIL_ENABLED',
    'CLOUDINARY_ENABLED',
  ]) {
    normalized[key] = parseOptionalBoolean(normalized[key]);
  }
  return normalized;
}

function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .flatMap((error) => {
      const constraints = Object.values(error.constraints || {});
      if (constraints.length === 0) {
        return [`Invalid environment variable: ${error.property}`];
      }

      return constraints.map((constraint) => `Invalid environment variable: ${error.property} (${constraint})`);
    })
    .join('; ');
}
