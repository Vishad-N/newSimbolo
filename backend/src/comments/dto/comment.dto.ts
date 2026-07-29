import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum CommentEntityType {
  TASK = 'TASK',
}

export class CreateCommentDto {
  @ApiProperty({ enum: CommentEntityType, description: 'Entity type the comment belongs to' })
  @IsEnum(CommentEntityType)
  entityType: CommentEntityType;

  @ApiProperty({ description: 'Entity ID (task ID, etc.)', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Comment message text', example: 'Please revise the keyword strategy section.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateCommentDto {
  @ApiProperty({ description: 'Updated comment message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
