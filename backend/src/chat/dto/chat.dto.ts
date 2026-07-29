import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'Conversation ID to send message to', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ description: 'Message text content', example: 'Please review the attached deliverable' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Media asset IDs to attach', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  attachmentIds?: string[];
}

export class CreateConversationDto {
  @ApiPropertyOptional({ description: 'Conversation title', example: 'SEO Project Discussion' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Project ID to bind conversation to', example: 'uuid' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Support ticket ID to bind conversation to', example: 'uuid' })
  @IsOptional()
  @IsString()
  supportTicketId?: string;

  @ApiProperty({ description: 'User IDs to add as participants', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds: string[];
}
