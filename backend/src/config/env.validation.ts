import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, validateSync, IsOptional } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  API_PORT: number;

  @IsString()
  DATABASE_URL: string;

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
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }
  
  // In production, we MUST have Google OAuth secrets configured if we support it.
  if (validatedConfig.NODE_ENV === Environment.Production) {
    if (!validatedConfig.GOOGLE_CLIENT_ID || !validatedConfig.GOOGLE_CLIENT_SECRET || !validatedConfig.GOOGLE_CALLBACK_URL) {
      throw new Error(`Environment validation failed: Google OAuth credentials are required in production.`);
    }
    if (!validatedConfig.REDIS_URL) {
      throw new Error(`Environment validation failed: REDIS_URL is required in production.`);
    }
  }

  return validatedConfig;
}
