import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AiSearchDto {
  @ApiProperty({
    description: 'The natural language query from the user to search for services and experts',
    example: 'I need a restaurant website with SEO',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  query: string;
}
