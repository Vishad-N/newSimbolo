"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
// @ts-ignore
const toStream = require("buffer-to-stream");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    logger = new common_1.Logger(CloudinaryService_1.name);
    /**
     * Uploads a file buffer to Cloudinary
     * @param file The multer file object
     * @param folder The folder in Cloudinary (e.g. "blogs", "services")
     * @returns The Cloudinary upload response
     */
    async uploadImage(file, folder) {
        return new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({
                folder: `simbolo/${folder}`,
                resource_type: 'auto', // Automatically detect image/video/raw
            }, (error, result) => {
                if (error) {
                    this.logger.error(`Failed to upload to Cloudinary: ${error.message}`, error.stack);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Upload result is undefined'));
                }
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
    }
    /**
     * Deletes a file from Cloudinary using its public ID
     * @param publicId The public ID of the resource
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to delete from Cloudinary (publicId: ${publicId})`, error.stack);
            throw error;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map