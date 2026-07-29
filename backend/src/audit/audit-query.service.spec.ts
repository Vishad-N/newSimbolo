import { PrismaService } from '../prisma/prisma.service';
import { AuditQueryService } from './audit-query.service';

describe('AuditQueryService', () => {
  it('applies filters and pagination to audit logs', async () => {
    const prisma = {
      auditLog: {
        findMany: jest.fn().mockResolvedValue([{ action: 'LOGIN', entityType: 'USER' }]),
        count: jest.fn().mockResolvedValue(1),
      },
    };
    const service = new AuditQueryService(prisma as unknown as PrismaService);

    const result = await service.findAll({ action: 'login', page: 1, limit: 10 });

    expect(result.meta.total).toBe(1);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });
});
