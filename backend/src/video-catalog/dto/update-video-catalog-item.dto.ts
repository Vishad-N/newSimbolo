import { PartialType } from '@nestjs/swagger';
import { CreateVideoCatalogItemDto } from './create-video-catalog-item.dto';

export class UpdateVideoCatalogItemDto extends PartialType(CreateVideoCatalogItemDto) {}
