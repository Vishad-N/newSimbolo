"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('AppController (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(prisma_service_1.PrismaService)
            .useValue({
            $connect: jest.fn().mockResolvedValue(undefined),
            $disconnect: jest.fn().mockResolvedValue(undefined),
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
            onModuleInit: jest.fn().mockResolvedValue(undefined),
            onModuleDestroy: jest.fn().mockResolvedValue(undefined),
        })
            .compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.enableVersioning({
            type: common_1.VersioningType.URI,
            defaultVersion: '1',
        });
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/api/v1/health (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/health')
            .expect(200)
            .expect((res) => {
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message');
            expect(res.body.data).toHaveProperty('status', 'ok');
            expect(res.body.data).toHaveProperty('uptime');
            expect(res.body.data).toHaveProperty('timestamp');
            expect(res.body.data).toHaveProperty('database');
            expect(res.body.data.database).toHaveProperty('status', 'up');
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map