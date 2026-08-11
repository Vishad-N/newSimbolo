import { IsString, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ServicePageConfigDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  heroBenefits?: string[];

  @IsOptional()
  @IsArray()
  statsBar?: any[];

  @IsOptional()
  @IsArray()
  servicesList?: any[];

  @IsOptional()
  @IsArray()
  resultMetrics?: any[];
}
