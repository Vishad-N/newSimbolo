import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { AuditModule } from './audit/audit.module';
import { EmailModule } from './email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Global()
@Module({
  imports: [LoggerModule, AuditModule, EmailModule, CloudinaryModule],
  exports: [LoggerModule, AuditModule, EmailModule, CloudinaryModule],
})
export class SharedModule {}
