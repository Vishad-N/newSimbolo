import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({ description: 'The unique session ID of the anonymous or authenticated user' })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'The user message content' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Optional context overrides or current page context', required: false })
  @IsOptional()
  context?: Record<string, any>;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'The orchestrator determined intent' })
  intent: string;

  @ApiProperty({ description: 'The actual response content' })
  content: string;

  @ApiProperty({ description: 'Recommended actions or quick replies' })
  recommendations?: string[];

  @ApiProperty({ description: 'Structured JSON data related to the intent', required: false })
  data?: Record<string, any>;
}
