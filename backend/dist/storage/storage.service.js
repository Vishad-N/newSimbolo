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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_service_1 = require("../shared/abstractions/base.service");
const storage_provider_1 = require("./storage.provider");
const s3_provider_1 = require("./s3.provider");
const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/', 'text/'];
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/zip',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
let StorageService = class StorageService extends base_service_1.BaseService {
    configService;
    localStorageProvider;
    s3StorageProvider;
    maxFileSizeBytes;
    constructor(configService, localStorageProvider, s3StorageProvider) {
        super('StorageService');
        this.configService = configService;
        this.localStorageProvider = localStorageProvider;
        this.s3StorageProvider = s3StorageProvider;
        this.maxFileSizeBytes = parseInt(process.env.MAX_UPLOAD_BYTES || `${25 * 1024 * 1024}`, 10);
    }
    async upload(file, storageKey) {
        this.validateFile(file);
        const provider = this.getProvider();
        const buffer = file.buffer ?? Buffer.alloc(0);
        return provider.upload(buffer, storageKey, file.mimetype);
    }
    async delete(storageKey) {
        await this.getProvider().delete(storageKey);
    }
    async getSignedUrl(storageKey, expiresInSeconds) {
        return this.getProvider().getSignedUrl(storageKey, expiresInSeconds);
    }
    async getPresignedUploadUrl(storageKey, mimeType, expiresInSeconds) {
        const provider = this.getProvider();
        if ('getPresignedUploadUrl' in provider) {
            return provider.getPresignedUploadUrl(storageKey, mimeType, expiresInSeconds);
        }
        // Fallback for local
        return `/uploads/presigned/${storageKey}`;
    }
    async health() {
        return this.getProvider().health();
    }
    validateFile(file) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        if (file.size > this.maxFileSizeBytes) {
            throw new common_1.PayloadTooLargeException(`File exceeds ${this.maxFileSizeBytes} bytes`);
        }
        const validMime = ALLOWED_MIME_TYPES.includes(file.mimetype) ||
            ALLOWED_MIME_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix));
        if (!validMime)
            throw new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }
    getProvider() {
        const provider = this.configService.get('storage.provider', 'local');
        if (provider === 's3' || provider === 'r2')
            return this.s3StorageProvider;
        return this.localStorageProvider;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        storage_provider_1.LocalStorageProvider,
        s3_provider_1.S3StorageProvider])
], StorageService);
//# sourceMappingURL=storage.service.js.map