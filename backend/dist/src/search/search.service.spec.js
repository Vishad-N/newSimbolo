"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_service_1 = require("./search.service");
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
        const service = new search_service_1.SearchService(prisma);
        const result = await service.search({ q: 'SEO', entities: ['projects'], page: 1, limit: 10 }, 'user-id');
        expect(result.data[0]).toEqual(expect.objectContaining({ entity: 'projects', title: 'SEO Growth' }));
        expect(prisma.globalSetting.create).toHaveBeenCalled();
    });
});
//# sourceMappingURL=search.service.spec.js.map