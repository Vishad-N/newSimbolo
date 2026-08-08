import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';

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
  @IsBoolean()
  GOOGLE_OAUTH_ENABLED?: boolean;

  @IsOptional()
  @IsBoolean()
  GEMINI_ENABLED?: boolean;

  @IsOptional()
  @IsBoolean()
  RAZORPAY_ENABLED?: boolean;

  @IsOptional()
  @IsBoolean()
  EMAIL_ENABLED?: boolean;

  @IsOptional()
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
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }
  
  if (validatedConfig.NODE_ENV === Environment.Production) {
    validateProductionConfig(validatedConfig);
  }

  return validatedConfig;
}

function validateProductionConfig(config: EnvironmentVariables): void {
  const missingVariables: string[] = [];

  requireValue(config.PORT, 'PORT', missingVariables);
  requireValue(config.DATABASE_URL, 'DATABASE_URL', missingVariables);
  requireValue(config.DIRECT_URL, 'DIRECT_URL', missingVariables);
  requireValue(config.REDIS_URL, 'REDIS_URL', missingVariables);
  requireValue(config.FRONTEND_URLS, 'FRONTEND_URLS', missingVariables);
  requireSecret(config.JWT_SECRET, 'JWT_SECRET', missingVariables);
  requireSecret(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET', missingVariables);

  if (config.GOOGLE_OAUTH_ENABLED !== false) {
    requireValue(config.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID', missingVariables);
    requireSecret(config.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET', missingVariables);
    requireValue(config.GOOGLE_CALLBACK_URL, 'GOOGLE_CALLBACK_URL', missingVariables);
  }

  if (config.GEMINI_ENABLED !== false) {
    requireSecret(config.GEMINI_API_KEY, 'GEMINI_API_KEY', missingVariables);
  }

  if (config.RAZORPAY_ENABLED !== false) {
    requireValue(config.RAZORPAY_KEY_ID, 'RAZORPAY_KEY_ID', missingVariables);
    requireSecret(config.RAZORPAY_KEY_SECRET, 'RAZORPAY_KEY_SECRET', missingVariables);
  }

  if (config.EMAIL_ENABLED !== false) {
    requireValue(config.SMTP_HOST, 'SMTP_HOST', missingVariables);
    requireValue(config.SMTP_PORT, 'SMTP_PORT', missingVariables);
    requireValue(config.SMTP_USER, 'SMTP_USER', missingVariables);
    requireSecret(config.SMTP_PASSWORD || config.SMTP_PASS, 'SMTP_PASSWORD', missingVariables);
  }

  if (config.CLOUDINARY_ENABLED !== false) {
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
    throw new Error(`Environment validation failed: ${missingVariables.join(', ')}`);
  }
}

function requireValue(value: unknown, name: string, missingVariables: string[]): void {
  if (value === undefined || value === null || value === '') {
    missingVariables.push(`${name} is required in production`);
  }
}

function requireSecret(value: unknown, name: string, missingVariables: string[]): void {
  requireValue(value, name, missingVariables);
  if (typeof value !== 'string') return;

  const normalized = value.toLowerCase();
  if (value.length < 16 || normalized.includes('change-me') || normalized.includes('mock') || normalized.includes('your-')) {
    missingVariables.push(`${name} must be a non-placeholder secret with at least 16 characters`);
  }
}
