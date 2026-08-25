import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      document: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
      clientProfile: { findFirst: jest.fn() },
    };
    service = new DocumentsService(prisma as unknown as PrismaService);
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
});
