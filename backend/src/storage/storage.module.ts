import { Global, Module } from '@nestjs/common';
import { LocalStorageProvider } from './storage.provider';
import { S3StorageProvider } from './s3.provider';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [StorageService, LocalStorageProvider, S3StorageProvider],
  exports: [StorageService],
})
export class StorageModule {}
