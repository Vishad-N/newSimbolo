import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { TestimonialStatusEnum } from '@prisma/client';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Sarah Jenkins', description: 'Client name' })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiPropertyOptional({ example: 'VP of Marketing', description: 'Client job title' })
  @IsOptional()
  @IsString()
  clientTitle?: string;

  @ApiPropertyOptional({ example: 'Acme Corp', description: 'Company name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: 'The Simbolo completely transformed our inbound lead pipeline...',
    description: 'Testimonial quote text',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ example: 5, default: 5, description: 'Star rating from 1 to 5' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ enum: TestimonialStatusEnum, default: TestimonialStatusEnum.APPROVED })
  @IsOptional()
  @IsEnum(TestimonialStatusEnum)
  status?: TestimonialStatusEnum;

  @ApiPropertyOptional({ example: false, default: false, description: 'Highlight on homepage slider' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true, default: true, description: 'Verified buyer status' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: '/uploads/sarah.jpg', description: 'Avatar image URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=123', description: 'Video review URL' })
  @IsOptional()
  @IsString()
  videoReviewUrl?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'ClientProfile UUID' })
  @IsOptional()
  @IsUUID('4')
  clientId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudy UUID' })
  @IsOptional()
  @IsUUID('4')
  caseStudyId?: string | null;
}
