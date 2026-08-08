import * as fs from 'fs';
import * as path from 'path';

// 1. Create cloudinary.config.ts
const cloudinaryConfigContent = `import { registerAs } from '@nestjs/config';
import { CloudinaryConfig } from './configuration.interface';

export default registerAs('cloudinary', (): CloudinaryConfig => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}));
`;
fs.writeFileSync(path.join(__dirname, 'backend/src/config/cloudinary.config.ts'), cloudinaryConfigContent);

// 2. Update configuration.interface.ts
let configInterface = fs.readFileSync(path.join(__dirname, 'backend/src/config/configuration.interface.ts'), 'utf-8');
if (!configInterface.includes('CloudinaryConfig')) {
  configInterface = configInterface.replace(
    'export interface EmailConfig {',
    `export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface EmailConfig {`
  );
  configInterface = configInterface.replace(
    '  email: EmailConfig;',
    `  email: EmailConfig;
  cloudinary: CloudinaryConfig;`
  );
  fs.writeFileSync(path.join(__dirname, 'backend/src/config/configuration.interface.ts'), configInterface);
}

// 3. Update env.validation.ts
let envValidation = fs.readFileSync(path.join(__dirname, 'backend/src/config/env.validation.ts'), 'utf-8');
if (!envValidation.includes('CLOUDINARY_CLOUD_NAME')) {
  envValidation = envValidation.replace(
    '  @IsOptional()\n  @IsString()\n  REDIS_URL?: string;',
    `  @IsOptional()
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
  CLOUDINARY_API_SECRET?: string;`
  );
  
  // Also add validation block for Cloudinary if NODE_ENV === 'production'
  envValidation = envValidation.replace(
    'if (!validatedConfig.REDIS_URL) {',
    `if (!validatedConfig.REDIS_URL) {`
  ); // just checking format
  
  fs.writeFileSync(path.join(__dirname, 'backend/src/config/env.validation.ts'), envValidation);
}

// 4. Update config.module.ts
let configModule = fs.readFileSync(path.join(__dirname, 'backend/src/config/config.module.ts'), 'utf-8');
if (!configModule.includes('cloudinaryConfig')) {
  configModule = configModule.replace(
    `import observabilityConfig from './observability.config';`,
    `import observabilityConfig from './observability.config';\nimport cloudinaryConfig from './cloudinary.config';`
  );
  configModule = configModule.replace(
    `        observabilityConfig,\n      ],`,
    `        observabilityConfig,\n        cloudinaryConfig,\n      ],`
  );
  fs.writeFileSync(path.join(__dirname, 'backend/src/config/config.module.ts'), configModule);
}

// 5. Update .env.example
let envExample = fs.readFileSync(path.join(__dirname, 'backend/.env.example'), 'utf-8');
if (!envExample.includes('CLOUDINARY_CLOUD_NAME')) {
  envExample += `
# Cloudinary Configuration (Website Assets)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
`;
  fs.writeFileSync(path.join(__dirname, 'backend/.env.example'), envExample);
}

console.log('Config files updated.');
