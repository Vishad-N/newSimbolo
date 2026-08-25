import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { BusinessException } from '../common/exceptions/custom.exceptions';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: any;
  let storageService: { upload: jest.Mock };

  beforeEach(() => {
    prisma = {
      document: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn(), update: jest.fn(), create: jest.fn() },
      clientProfile: { findFirst: jest.fn() },
    };
    storageService = { upload: jest.fn() };
    service = new DocumentsService(prisma as unknown as PrismaService, storageService as unknown as StorageService);
  });

  describe('findMyDocuments', () => {
    it('throws if the requester has no client profile', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue(null);
      await expect(service.findMyDocuments('user-1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it("scopes the listing to the requester's own clientId, ignoring anything else", async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.document.findMany.mockResolvedValue([]);
      prisma.document.count.mockResolvedValue(0);

      await service.findMyDocuments('user-1');

      expect(prisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { deletedAt: null, clientId: 'client-1' } }),
      );
    });
  });

  describe('findOneForRequester', () => {
    const doc = { id: 'doc-1', client: { user: { id: 'owner-user-1' } } };

    it('returns the document for its owning client', async () => {
      prisma.document.findFirst.mockResolvedValue(doc);
      await expect(service.findOneForRequester('doc-1', { sub: 'owner-user-1', role: 'CLIENT' })).resolves.toBe(doc);
    });

    it('hides the document (404, not 403) from a different client', async () => {
      prisma.document.findFirst.mockResolvedValue(doc);
      await expect(
        service.findOneForRequester('doc-1', { sub: 'someone-else', role: 'CLIENT' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lets staff roles access any document', async () => {
      prisma.document.findFirst.mockResolvedValue(doc);
      await expect(
        service.findOneForRequester('doc-1', { sub: 'some-admin', role: 'ADMIN' }),
      ).resolves.toBe(doc);
    });

    it('hides a document with no client attached from a non-staff requester', async () => {
      prisma.document.findFirst.mockResolvedValue({ id: 'doc-2', client: null });
      await expect(
        service.findOneForRequester('doc-2', { sub: 'user-1', role: 'CLIENT' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('uploadDocument', () => {
    const file = { originalname: 'contract.pdf', mimetype: 'application/pdf', size: 1024 } as any;

    it('rejects when no file is provided', async () => {
      await expect(
        service.uploadDocument(undefined, { title: 'X' } as any, { sub: 'user-1', role: 'CLIENT' }),
      ).rejects.toBeInstanceOf(BusinessException);
    });

    it('forces a client caller onto their own ClientProfile, ignoring any clientId they pass', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'own-client-1' });
      storageService.upload.mockResolvedValue({ url: 'https://cdn/x.pdf', storageKey: 'documents/x.pdf', provider: 'r2' });
      prisma.document.create.mockResolvedValue({ id: 'doc-1' });

      await service.uploadDocument(
        file,
        { title: 'Contract', clientId: 'someone-elses-client' } as any,
        { sub: 'user-1', role: 'CLIENT' },
      );

      expect(prisma.document.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ clientId: 'own-client-1' }) }),
      );
    });

    it('throws if a client caller has no ClientProfile yet', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue(null);
      await expect(
        service.uploadDocument(file, { title: 'X' } as any, { sub: 'user-1', role: 'CLIENT' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lets a staff caller upload to an arbitrary clientId', async () => {
      storageService.upload.mockResolvedValue({ url: 'https://cdn/x.pdf', storageKey: 'documents/x.pdf', provider: 'r2' });
      prisma.document.create.mockResolvedValue({ id: 'doc-1' });

      await service.uploadDocument(
        file,
        { title: 'Contract', clientId: 'chosen-client' } as any,
        { sub: 'admin-1', role: 'ADMIN' },
      );

      expect(prisma.clientProfile.findFirst).not.toHaveBeenCalled();
      expect(prisma.document.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ clientId: 'chosen-client' }) }),
      );
    });

    it('uploads the file to storage and stores the returned URL/size/mimeType', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'own-client-1' });
      storageService.upload.mockResolvedValue({ url: 'https://cdn/contract.pdf', storageKey: 'documents/x.pdf', provider: 'r2' });
      prisma.document.create.mockResolvedValue({ id: 'doc-1' });

      await service.uploadDocument(file, { title: 'Contract' } as any, { sub: 'user-1', role: 'CLIENT' });

      expect(storageService.upload).toHaveBeenCalledWith(file, expect.stringMatching(/^documents\/.+\.pdf$/));
      expect(prisma.document.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fileUrl: 'https://cdn/contract.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            uploadedById: 'user-1',
          }),
        }),
      );
    });
  });
});
