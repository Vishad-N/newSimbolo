import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
// @ts-ignore
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  /**
   * Uploads a file buffer to Cloudinary
   * @param file The multer file object
   * @param folder The folder in Cloudinary (e.g. "blogs", "services")
   * @returns The Cloudinary upload response
   */
  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `simbolo/${folder}`,
          resource_type: 'auto', // Automatically detect image/video/raw
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Failed to upload to Cloudinary: ${error.message}`, error.stack);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Upload result is undefined'));
          }
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  /**
   * Deletes a file from Cloudinary using its public ID
   * @param publicId The public ID of the resource
   */
  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete from Cloudinary (publicId: ${publicId})`, error.stack);
      throw error;
    }
  }
}
