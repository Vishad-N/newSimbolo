import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly logger;
    /**
     * Uploads a file buffer to Cloudinary
     * @param file The multer file object
     * @param folder The folder in Cloudinary (e.g. "blogs", "services")
     * @returns The Cloudinary upload response
     */
    uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse>;
    /**
     * Deletes a file from Cloudinary using its public ID
     * @param publicId The public ID of the resource
     */
    deleteImage(publicId: string): Promise<any>;
}
