import { PartialType } from '@nestjs/swagger';
import { CreateSeoPageDto } from './create-seo-page.dto';

export class UpdateSeoPageDto extends PartialType(CreateSeoPageDto) {}
