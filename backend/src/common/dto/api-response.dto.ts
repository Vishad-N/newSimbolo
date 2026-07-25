import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true, description: 'Indicates whether the request was successful' })
  success: boolean;

  @ApiProperty({ example: 'Operation successful', description: 'Human-readable summary of the result' })
  message: string;

  @ApiProperty({ description: 'The payload returned by the operation' })
  data: T;

  @ApiProperty({ example: {}, description: 'Additional metadata such as pagination or execution timing' })
  meta?: Record<string, any>;
}
