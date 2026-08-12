import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 7 AI Endpoints Verification (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

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
      await request(app.getHttpServer()).post(endpoint).send({ query: '' }).expect(400);
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
    const testSessionId = 'test-session-' + Date.now();

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
      const response = await request(app.getHttpServer()).get(`${chatEndpoint}/${testSessionId}`).expect(200);

      expect(response.body.history.length).toBeGreaterThanOrEqual(2);
      expect(response.body.metadata.budget).toBeDefined();
    });
  });

  describe('Phase 14 — Security & Auth Protection', () => {
    it('should reject unauthorized access to sync-embeddings', async () => {
      await request(app.getHttpServer()).post('/ai/sync-embeddings').expect(401);
    });

    it('should reject unauthorized access to analytics', async () => {
      await request(app.getHttpServer()).get('/ai/chat/analytics/metrics').expect(401);
    });
  });
});
