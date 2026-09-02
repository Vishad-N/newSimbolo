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
const path = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
const role_constant_1 = require("../common/constants/role.constant");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
const STAFF_ROLES = [
    role_constant_1.UserRole.ADMIN,
    role_constant_1.UserRole.SUPER_ADMIN,
    role_constant_1.UserRole.PROJECT_MANAGER,
    role_constant_1.UserRole.SUPPORT,
    role_constant_1.UserRole.CONTENT_MANAGER,
    role_constant_1.UserRole.MARKETING_MANAGER,
    role_constant_1.UserRole.EDITOR,
];
let DocumentsService = class DocumentsService extends base_service_1.BaseService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        super('DocumentsService');
        this.prisma = prisma;
        this.storageService = storageService;
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
    /** Self-service listing: a client only ever sees their own documents, regardless of query params. */
    async findMyDocuments(userId, category, page = 1, limit = 20) {
        const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
        if (!client)
            throw new common_1.NotFoundException('Client profile not found');
        return this.findAll(client.id, undefined, category, page, limit);
    }
    /**
     * Same as findOne, but scoped to the requester: a client can only fetch a
     * document tied to their own ClientProfile (or one with no client at all is
     * treated as staff-only). Staff roles can fetch any document. Returns 404 (not
     * 403) for a non-owned document so a client can't use this to confirm another
     * client's document ID exists.
     */
    async findOneForRequester(id, requester) {
        const doc = await this.findOne(id);
        const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
        const clientUserId = doc.client?.user?.id;
        if (!isStaff && clientUserId !== requester.sub) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        return doc;
    }
    /**
     * Uploads a real file to storage and registers it as a Document in one step.
     * A client caller always uploads to their OWN ClientProfile — any clientId in
     * the DTO is ignored for non-staff requesters, same ownership rule as reads.
     */
    async uploadDocument(file, dto, requester) {
        if (!file) {
            throw new custom_exceptions_1.BusinessException('No file provided for upload');
        }
        const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
        let clientId = dto.clientId ?? null;
        if (!isStaff) {
            const client = await this.prisma.clientProfile.findFirst({
                where: { userId: requester.sub, deletedAt: null },
            });
            if (!client)
                throw new common_1.NotFoundException('Client profile not found');
            clientId = client.id;
        }
        const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '') || 'bin';
        const storageKey = `documents/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
        const stored = await this.storageService.upload(file, storageKey);
        return this.prisma.document.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                category: dto.category ?? client_1.DocumentCategoryEnum.OTHER,
                fileUrl: stored.url,
                fileSize: file.size,
                mimeType: file.mimetype,
                clientId,
                projectId: dto.projectId ?? null,
                isPublic: false,
                uploadedById: requester.sub ?? null,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
                client: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
            },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map