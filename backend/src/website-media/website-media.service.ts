import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../shared/cloudinary/cloudinary.service';
import { Media } from '@prisma/client';
import { BusinessException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class WebsiteMediaService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {
    super('WebsiteMediaService');
  }

  async uploadFile(file: Express.Multer.File, folder: string, uploaderId?: string): Promise<Media> {
    if (!file) {
      throw new BusinessException('No file provided for upload');
    }

    try {
      const result = await this.cloudinary.uploadImage(file, folder);

      const media = await this.prisma.media.create({
        data: {
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          folder: result.folder || folder,
          filename: result.original_filename || file.originalname,
          format: result.format || 'unknown',
          resourceType: result.resource_type,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          uploadedById: uploaderId || null,
        },
      });

      this.logger.log(`Uploaded website media asset "${media.filename}" (ID: ${media.id})`);
      return media;
    } catch (error) {
      this.logger.error(`Failed to upload to Cloudinary: ${error.message}`, error.stack);
      throw new BusinessException('Failed to upload file to Cloudinary');
    }
  }

  async getAssets(folder?: string): Promise<Media[]> {
    const where = folder ? { folder } : {};
    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async getAssetById(id: string): Promise<Media> {
    const asset = await this.prisma.media.findUnique({
      where: { id },
    });
    return this.checkEntityExists(asset, 'Media', id);
  }

  async deleteAsset(id: string): Promise<{ success: boolean }> {
    const asset = await this.getAssetById(id);
    await this.cloudinary.deleteImage(asset.publicId);

    await this.prisma.media.delete({ where: { id } });
    this.logger.log(`Deleted website media asset ID: ${id}`);
    return { success: true };
  }
}
