import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './storage.provider';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  const configService = { get: jest.fn().mockReturnValue('local') };
  const provider = {
    upload: jest.fn(),
    delete: jest.fn(),
    getSignedUrl: jest.fn(),
    health: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MAX_UPLOAD_BYTES = '10';
  });

  it('rejects files above the configured size limit', () => {
    const service = new StorageService(
      configService as unknown as ConfigService,
      provider as unknown as LocalStorageProvider,
    );

    expect(() =>
      service.validateFile({
        size: 11,
        mimetype: 'image/png',
      } as Express.Multer.File),
    ).toThrow(PayloadTooLargeException);
  });

  it('rejects unsupported MIME types', () => {
    const service = new StorageService(
      configService as unknown as ConfigService,
      provider as unknown as LocalStorageProvider,
    );

    expect(() =>
      service.validateFile({
        size: 1,
        mimetype: 'application/x-msdownload',
      } as Express.Multer.File),
    ).toThrow(BadRequestException);
  });
});
