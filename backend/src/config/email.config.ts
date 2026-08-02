import { registerAs } from '@nestjs/config';
import { EmailConfig } from './configuration.interface';

export default registerAs('email', (): EmailConfig => ({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || 'noreply@simbolo.ai',
  secure: process.env.SMTP_SECURE === 'true',
}));
