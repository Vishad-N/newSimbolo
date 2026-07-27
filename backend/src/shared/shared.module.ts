import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { AuditModule } from './audit/audit.module';
import { EmailModule } from './email/email.module';

@Global()
@Module({
  imports: [LoggerModule, AuditModule, EmailModule],
  exports: [LoggerModule, AuditModule, EmailModule],
})
export class SharedModule {}
