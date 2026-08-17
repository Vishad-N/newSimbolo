import { MediaTypeEnum } from '@prisma/client';
export declare class MediaFilterDto {
    mediaType?: MediaTypeEnum;
    folderId?: string;
    search?: string;
}
