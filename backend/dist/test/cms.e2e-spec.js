"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('CMS & Content Modules (e2e)', () => {
    let app;
    const mockPrisma = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
        onModuleInit: jest.fn().mockResolvedValue(undefined),
        onModuleDestroy: jest.fn().mockResolvedValue(undefined),
        globalSetting: {
            findMany: jest.fn().mockResolvedValue([
                {
                    key: 'homepage_hero',
                    value: JSON.stringify({ title: 'AI-Powered Digital Marketing' }),
                    description: 'Homepage hero',
                },
            ]),
            findUnique: jest.fn().mockResolvedValue({
                key: 'homepage_content',
                value: JSON.stringify({ hero: { title: 'AI-Powered Digital Marketing' } }),
                description: 'Homepage content',
            }),
            upsert: jest.fn(),
        },
        service: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789ab',
                    name: 'Search Engine Optimization',
                    slug: 'seo',
                    shortDescription: 'AI SEO services',
                    basePrice: 499.0,
                },
            ]),
        },
        package: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789ac',
                    name: 'Pro SEO',
                    slug: 'pro-seo',
                    basePrice: 999.0,
                    billingInterval: 'monthly',
                },
            ]),
        },
        blog: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789ad',
                    title: 'Future of AI Marketing',
                    slug: 'future-of-ai-marketing',
                    status: 'PUBLISHED',
                },
            ]),
        },
        caseStudy: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789ae',
                    title: '300% ROI for E-Commerce Brand',
                    slug: '300-roi-ecommerce',
                    status: 'PUBLISHED',
                },
            ]),
        },
        portfolioProject: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789af',
                    title: 'TechCorp Website Redesign',
                    slug: 'techcorp-website',
                    clientName: 'TechCorp',
                },
            ]),
        },
        testimonial: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789b0',
                    clientName: 'John Doe',
                    content: 'The Simbolo transformed our digital presence!',
                    rating: 5,
                },
            ]),
        },
        fAQ: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789b1',
                    question: 'What is The Simbolo?',
                    answer: 'An AI-powered Digital Marketing Platform.',
                },
            ]),
        },
        sEOPage: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 'c0a80123-4567-89ab-cdef-0123456789b2',
                    path: '/services',
                    metaTitle: 'Services | The Simbolo',
                },
            ]),
        },
    };
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(prisma_service_1.PrismaService)
            .useValue(mockPrisma)
            .compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.enableVersioning({
            type: common_1.VersioningType.URI,
            defaultVersion: '1',
        });
        // Apply the same global interceptors as main.ts so responses are wrapped in ApiResponseDto
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/api/v1/cms/homepage (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/cms/homepage')
            .expect(200)
            .expect((res) => {
            expect(res.body.data).toHaveProperty('hero');
            expect(res.body.data.hero).toHaveProperty('title', 'AI-Powered Digital Marketing');
        });
    });
    it('/api/v1/services (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/services')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('slug', 'seo');
        });
    });
    it('/api/v1/packages (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/packages')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('name', 'Pro SEO');
        });
    });
    it('/api/v1/blogs (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/blogs')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('slug', 'future-of-ai-marketing');
        });
    });
    it('/api/v1/case-studies (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/case-studies')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('slug', '300-roi-ecommerce');
        });
    });
    it('/api/v1/portfolio (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/portfolio')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('clientName', 'TechCorp');
        });
    });
    it('/api/v1/testimonials (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/testimonials')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('rating', 5);
        });
    });
    it('/api/v1/faqs (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/faqs')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('question');
        });
    });
    it('/api/v1/seo (GET)', () => {
        return supertest(app.getHttpServer())
            .get('/api/v1/seo')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('path', '/services');
        });
    });
});
//# sourceMappingURL=cms.e2e-spec.js.map