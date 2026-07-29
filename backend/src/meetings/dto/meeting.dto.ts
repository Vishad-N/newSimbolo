import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MeetingStatusEnum } from '@prisma/client';

export class CreateMeetingDto {
  @ApiProperty({ example: 'Project Kickoff – Acme Corp', description: 'Meeting title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ description: 'Meeting description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '1. Introductions\n2. Project scope review\n3. Timeline alignment',
    description: 'Meeting agenda',
  })
  @IsOptional()
  @IsString()
  agenda?: string;

  @ApiProperty({ example: '2026-08-05T10:00:00.000Z', description: 'Meeting start time (ISO 8601)' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2026-08-05T11:00:00.000Z', description: 'Meeting end time (ISO 8601)' })
  @IsDateString()
  endTime!: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', default: 'Asia/Kolkata', description: 'Timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'https://meet.google.com/abc-defg-hij', description: 'Video meeting URL' })
  @IsOptional()
  @IsString()
  meetUrl?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Host user UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  hostId!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' })
  @IsOptional()
  @IsUUID('4')
  clientId?: string;

  @ApiPropertyOptional({ description: 'Participant user UUIDs to invite', type: [String] })
  @IsOptional()
  participantIds?: string[];
}

export class UpdateMeetingDto {
  @ApiPropertyOptional({ description: 'Meeting title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Meeting description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Meeting agenda' })
  @IsOptional()
  @IsString()
  agenda?: string;

  @ApiPropertyOptional({ description: 'Meeting notes (recorded after meeting)' })
  @IsOptional()
  @IsString()
  meetingNotes?: string;

  @ApiPropertyOptional({ enum: MeetingStatusEnum, description: 'Meeting status' })
  @IsOptional()
  @IsEnum(MeetingStatusEnum)
  status?: MeetingStatusEnum;

  @ApiPropertyOptional({ description: 'Meeting start time (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'Meeting end time (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Video meeting URL' })
  @IsOptional()
  @IsString()
  meetUrl?: string;
}
