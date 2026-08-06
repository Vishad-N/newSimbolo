"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var S3StorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3StorageProvider = S3StorageProvider_1 = class S3StorageProvider {
    configService;
    s3Client;
    bucketName;
    logger = new common_1.Logger(S3StorageProvider_1.name);
    constructor(configService) {
        this.configService = configService;
        const accountId = this.configService.get('R2_ACCOUNT_ID') || 'demo-account-id';
        const accessKeyId = this.configService.get('R2_ACCESS_KEY_ID') || 'demo-access-key';
        const secretAccessKey = this.configService.get('R2_SECRET_ACCESS_KEY') || 'demo-secret-key';
        const endpoint = this.configService.get('R2_ENDPOINT') || `https://${accountId}.r2.cloudflarestorage.com`;
        this.bucketName = this.configService.get('R2_BUCKET_NAME') || 'simbolo-assets';
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
    }
    async upload(buffer, key, mimeType) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        });
        try {
            await this.s3Client.send(command);
            return {
                storageKey: key,
                url: `s3://${this.bucketName}/${key}`,
                provider: 'cloudflare-r2',
            };
        }
        catch (error) {
            this.logger.error(`Failed to upload ${key} to R2`, error);
            throw error;
        }
    }
    async delete(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            await this.s3Client.send(command);
        }
        catch (error) {
            this.logger.error(`Failed to delete ${key} from R2`, error);
            throw error;
        }
    }
    async getSignedUrl(key, expiresInSeconds = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: expiresInSeconds });
        }
        catch (error) {
            this.logger.error(`Failed to generate presigned URL for ${key}`, error);
            throw error;
        }
    }
    async getPresignedUploadUrl(key, mimeType, expiresInSeconds = 3600) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: mimeType,
        });
        try {
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: expiresInSeconds });
        }
        catch (error) {
            this.logger.error(`Failed to generate presigned upload URL for ${key}`, error);
            throw error;
        }
    }
    async health() {
        try {
            if (!this.configService.get('R2_ACCOUNT_ID'))
                return 'configured';
            return 'up';
        }
        catch (error) {
            return 'down';
        }
    }
};
exports.S3StorageProvider = S3StorageProvider;
exports.S3StorageProvider = S3StorageProvider = S3StorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageProvider);
//# sourceMappingURL=s3.provider.js.map