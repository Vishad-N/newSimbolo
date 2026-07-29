import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from './search.service';

describe('SearchService', () => {
  it('searches selected entities and records user search history', async () => {
    const prisma = {
      project: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            { id: 'project-id', name: 'SEO Growth', description: 'Organic growth', status: 'ACTIVE' },
          ]),
      },
      globalSetting: {
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const service = new SearchService(prisma as unknown as PrismaService);

    const result = await service.search({ q: 'SEO', entities: ['projects'], page: 1, limit: 10 }, 'user-id');

    expect(result.data[0]).toEqual(expect.objectContaining({ entity: 'projects', title: 'SEO Growth' }));
    expect(prisma.globalSetting.create).toHaveBeenCalled();
  });
});
