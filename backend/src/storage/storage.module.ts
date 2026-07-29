import { Global, Module } from '@nestjs/common';
import { LocalStorageProvider } from './storage.provider';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [StorageService, LocalStorageProvider],
  exports: [StorageService],
})
export class StorageModule {}
