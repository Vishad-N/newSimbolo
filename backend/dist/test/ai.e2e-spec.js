"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('Phase 7 AI Endpoints Verification (e2e)', () => {
    let app;
    let prisma;
    let authToken;
    let adminToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        // Mock Authentication Setup (Assuming valid JWT signing mechanism exists)
        // authToken = ... (Generate mock user token)
        // adminToken = ... (Generate mock admin token)
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Phase 2 — AI Search Endpoint (/api/v1/ai/search)', () => {
        const endpoint = '/ai/search';
        it('should return valid structured JSON for a normal query', async () => {
            const response = await request(app.getHttpServer())
                .post(endpoint)
                .send({ query: 'I need marketing for my restaurant' })
                .expect(201);
            expect(response.body).toHaveProperty('summary');
            expect(response.body).toHaveProperty('matchPercentage');
            expect(response.body).toHaveProperty('recommendedService');
            expect(response.body).toHaveProperty('recommendedPackage');
        });
        it('should reject empty queries', async () => {
            await request(app.getHttpServer())
                .post(endpoint)
                .send({ query: '' })
                .expect(400);
        });
        it('should mitigate XSS payloads', async () => {
            const response = await request(app.getHttpServer())
                .post(endpoint)
                .send({ query: '<script>alert("XSS")</script>' })
                .expect(201);
            // AI provider should process this as literal text, not execute it
            expect(response.body).toHaveProperty('summary');
        });
        it('should mitigate SQL injection attempts', async () => {
            const response = await request(app.getHttpServer())
                .post(endpoint)
                .send({ query: "marketing'; DROP TABLE users;--" })
                .expect(201);
            expect(response.body).toHaveProperty('summary');
        });
    });
    describe('Phase 5 — Conversation Endpoints (/api/v1/ai/chat)', () => {
        const chatEndpoint = '/ai/chat';
        let testSessionId = 'test-session-' + Date.now();
        it('should create an anonymous session and return an initial intent', async () => {
            const response = await request(app.getHttpServer())
                .post(chatEndpoint)
                .send({ sessionId: testSessionId, message: 'I need a website' })
                .expect(201);
            expect(response.body).toHaveProperty('intent');
            expect(response.body).toHaveProperty('content');
        });
        it('should update session memory with budget context', async () => {
            const response = await request(app.getHttpServer())
                .post(chatEndpoint)
                .send({ sessionId: testSessionId, message: 'My budget is 5000' })
                .expect(201);
            expect(['BUDGET_PLANNING', 'SEARCH']).toContain(response.body.intent);
        });
        it('should retrieve conversation history accurately', async () => {
            const response = await request(app.getHttpServer())
                .get(`${chatEndpoint}/${testSessionId}`)
                .expect(200);
            expect(response.body.history.length).toBeGreaterThanOrEqual(2);
            expect(response.body.metadata.budget).toBeDefined();
        });
    });
    describe('Phase 14 — Security & Auth Protection', () => {
        it('should reject unauthorized access to sync-embeddings', async () => {
            await request(app.getHttpServer())
                .post('/ai/sync-embeddings')
                .expect(401);
        });
        it('should reject unauthorized access to analytics', async () => {
            await request(app.getHttpServer())
                .get('/ai/chat/analytics/metrics')
                .expect(401);
        });
    });
});
//# sourceMappingURL=ai.e2e-spec.js.map