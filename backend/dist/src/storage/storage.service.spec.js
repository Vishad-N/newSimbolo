"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
describe('StorageService', () => {
    const configService = { get: jest.fn().mockReturnValue('local') };
    const provider = {
        upload: jest.fn(),
        delete: jest.fn(),
        getSignedUrl: jest.fn(),
        health: jest.fn(),
    };
    const s3Provider = {
        upload: jest.fn(),
        delete: jest.fn(),
        getSignedUrl: jest.fn(),
        getPresignedUploadUrl: jest.fn(),
        health: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.MAX_UPLOAD_BYTES = '10';
    });
    it('rejects files above the configured size limit', () => {
        const service = new storage_service_1.StorageService(configService, provider, s3Provider);
        expect(() => service.validateFile({
            size: 11,
            mimetype: 'image/png',
        })).toThrow(common_1.PayloadTooLargeException);
    });
    it('rejects unsupported MIME types', () => {
        const service = new storage_service_1.StorageService(configService, provider, s3Provider);
        expect(() => service.validateFile({
            size: 1,
            mimetype: 'application/x-msdownload',
        })).toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=storage.service.spec.js.map