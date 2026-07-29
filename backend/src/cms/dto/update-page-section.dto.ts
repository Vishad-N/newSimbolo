import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePageSectionDto {
  @ApiProperty({ example: 'hero', description: 'Section identifier key (e.g. hero, stats, cta, mission)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sectionKey!: string;

  @ApiProperty({
    example: { title: 'AI Marketing', subtitle: 'Grow faster' },
    description: 'JSON structure or JSON string containing section content',
  })
  @IsNotEmpty()
  content!: any;

  @ApiPropertyOptional({
    example: 'Main top hero section banner',
    description: 'Optional description of section purpose',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
