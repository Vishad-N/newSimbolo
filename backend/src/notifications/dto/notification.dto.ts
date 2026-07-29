import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional({ description: 'Receive email notifications for order updates', example: true })
  @IsOptional()
  @IsBoolean()
  emailOrderUpdates?: boolean;

  @ApiPropertyOptional({ description: 'Receive marketing emails', example: false })
  @IsOptional()
  @IsBoolean()
  emailMarketing?: boolean;

  @ApiPropertyOptional({ description: 'Receive in-app project alerts', example: true })
  @IsOptional()
  @IsBoolean()
  inAppProjectAlerts?: boolean;

  @ApiPropertyOptional({ description: 'Receive SMS for urgent alerts', example: false })
  @IsOptional()
  @IsBoolean()
  smsUrgentAlerts?: boolean;
}
