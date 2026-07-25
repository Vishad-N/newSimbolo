import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';
import storageConfig from './storage.config';
import emailConfig from './email.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, authConfig, storageConfig, emailConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
