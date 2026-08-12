"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let DocumentsService = class DocumentsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('DocumentsService');
        this.prisma = prisma;
    }
    async findAll(clientId, projectId, category, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (clientId)
            where.clientId = clientId;
        if (projectId)
            where.projectId = projectId;
        if (category)
            where.category = category;
        const [data, total] = await Promise.all([
            this.prisma.document.findMany({
                where,
                include: {
                    uploadedBy: { select: { id: true, firstName: true, lastName: true } },
                    client: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
                    project: { select: { id: true, name: true } },
                    company: { select: { id: true, name: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.document.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const doc = await this.prisma.document.findFirst({
            where: { id, deletedAt: null },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                client: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
                project: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
        return this.checkEntityExists(doc, 'Document', id);
    }
    async create(dto, uploadedById) {
        return this.prisma.document.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                category: dto.category ?? client_1.DocumentCategoryEnum.OTHER,
                fileUrl: dto.fileUrl,
                fileSize: dto.fileSize ?? null,
                mimeType: dto.mimeType ?? null,
                clientId: dto.clientId ?? null,
                projectId: dto.projectId ?? null,
                companyId: dto.companyId ?? null,
                isPublic: dto.isPublic ?? false,
                uploadedById: uploadedById ?? null,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.document.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.category !== undefined && { category: dto.category }),
                ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async trackDownload(id) {
        const doc = await this.findOne(id);
        return this.prisma.document.update({
            where: { id },
            data: { downloadCount: { increment: 1 } },
        });
    }
    async softDelete(id) {
        await this.findOne(id);
        await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: `Document ${id} deleted` };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map