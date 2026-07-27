export interface AppConfig {
  nodeEnv: string;
  port: number;
  prefix: string;
  version: string;
  frontendUrls: string[];
}

export interface DatabaseConfig {
  url: string;
  poolSize: number;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  googleClientId?: string;
  googleClientSecret?: string;
  googleCallbackUrl?: string;
}

export interface StorageConfig {
  provider: string;
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
  cdnUrl: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  storage: StorageConfig;
  email: EmailConfig;
}
