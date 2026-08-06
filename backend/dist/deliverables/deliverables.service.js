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
exports.DeliverablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let DeliverablesService = class DeliverablesService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('DeliverablesService');
        this.prisma = prisma;
    }
    deliverableInclude = {
        project: { select: { id: true, name: true, clientId: true } },
        mediaAsset: { select: { id: true, cdnUrl: true, fileName: true, mimeType: true, sizeBytes: true } },
        versionHistory: {
            include: { mediaAsset: { select: { id: true, cdnUrl: true, fileName: true } } },
            orderBy: { versionNumber: 'asc' },
        },
    };
    async findAll(projectId, status) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        const where = { projectId, deletedAt: null };
        if (status)
            where.status = status;
        return this.prisma.deliverable.findMany({
            where,
            include: this.deliverableInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const deliverable = await this.prisma.deliverable.findFirst({
            where: { id, deletedAt: null },
            include: this.deliverableInclude,
        });
        return this.checkEntityExists(deliverable, 'Deliverable', id);
    }
    async create(dto, createdBy) {
        const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${dto.projectId} not found`);
        const deliverable = await this.prisma.deliverable.create({
            data: {
                projectId: dto.projectId,
                title: dto.title,
                description: dto.description ?? null,
                mediaAssetId: dto.mediaAssetId ?? null,
                status: client_1.DeliverableStatusEnum.PENDING,
                version: 1,
                createdBy: createdBy ?? null,
            },
            include: this.deliverableInclude,
        });
        await this.prisma.timeline.create({
            data: {
                title: `Deliverable "${deliverable.title}" added`,
                description: `New deliverable created`,
                eventType: 'DELIVERABLE_UPLOADED',
                projectId: dto.projectId,
                clientId: project.clientId,
                deliverableId: deliverable.id,
            },
        });
        return deliverable;
    }
    async update(id, dto, updatedBy) {
        const existing = (await this.findOne(id));
        // Create a new version if mediaAsset is being updated
        if (dto.mediaAssetId && dto.mediaAssetId !== existing.mediaAssetId) {
            await this.prisma.deliverableVersion.create({
                data: {
                    deliverableId: id,
                    versionNumber: existing.version,
                    mediaAssetId: existing.mediaAssetId ?? dto.mediaAssetId,
                    notes: dto.revisionNotes ?? null,
                },
            });
        }
        const nowSubmitted = dto.status === client_1.DeliverableStatusEnum.SUBMITTED && existing.status !== client_1.DeliverableStatusEnum.SUBMITTED;
        const nowApproved = dto.status === client_1.DeliverableStatusEnum.APPROVED && existing.status !== client_1.DeliverableStatusEnum.APPROVED;
        const updated = await this.prisma.deliverable.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.revisionNotes !== undefined && { revisionNotes: dto.revisionNotes }),
                ...(dto.clientFeedback !== undefined && { clientFeedback: dto.clientFeedback }),
                ...(dto.mediaAssetId !== undefined && {
                    mediaAssetId: dto.mediaAssetId,
                    version: { increment: 1 },
                }),
                ...(nowSubmitted && { submittedAt: new Date() }),
                ...(nowApproved && { approvedAt: new Date() }),
                updatedBy: updatedBy ?? null,
            },
            include: this.deliverableInclude,
        });
        if (nowSubmitted || nowApproved) {
            await this.prisma.timeline.create({
                data: {
                    title: nowApproved
                        ? `Deliverable "${existing.title}" approved`
                        : `Deliverable "${existing.title}" submitted for review`,
                    description: nowApproved ? `Client approved the deliverable` : `Deliverable submitted for client review`,
                    eventType: nowApproved ? 'DELIVERABLE_APPROVED' : 'DELIVERABLE_SUBMITTED',
                    projectId: existing.project.id,
                    clientId: existing.project.clientId,
                    deliverableId: id,
                },
            });
        }
        return updated;
    }
    async softDelete(id, deletedBy) {
        await this.findOne(id);
        await this.prisma.deliverable.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy ?? null },
        });
        return { message: `Deliverable ${id} removed` };
    }
};
exports.DeliverablesService = DeliverablesService;
exports.DeliverablesService = DeliverablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliverablesService);
//# sourceMappingURL=deliverables.service.js.map