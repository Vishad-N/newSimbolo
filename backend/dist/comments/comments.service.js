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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const comment_dto_1 = require("./dto/comment.dto");
let CommentsService = class CommentsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('CommentsService');
        this.prisma = prisma;
    }
    async create(dto, senderId) {
        if (dto.entityType === comment_dto_1.CommentEntityType.TASK) {
            const task = await this.prisma.task.findUnique({ where: { id: dto.entityId } });
            if (!task)
                throw new common_1.NotFoundException(`Task ${dto.entityId} not found`);
            return this.prisma.taskComment.create({
                data: {
                    taskId: dto.entityId,
                    senderId,
                    message: dto.message,
                },
                include: {
                    sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                },
            });
        }
        throw new common_1.BadRequestException(`Unsupported entity type: ${dto.entityType}`);
    }
    async findByEntity(entityType, entityId, page = 1, limit = 50) {
        if (entityType === comment_dto_1.CommentEntityType.TASK) {
            const where = { taskId: entityId };
            const [data, total] = await Promise.all([
                this.prisma.taskComment.findMany({
                    where,
                    include: {
                        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'asc' },
                }),
                this.prisma.taskComment.count({ where }),
            ]);
            return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
        }
        throw new common_1.BadRequestException(`Unsupported entity type: ${entityType}`);
    }
    async update(id, dto, requesterId) {
        const comment = await this.prisma.taskComment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException(`Comment ${id} not found`);
        if (comment.senderId !== requesterId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        return this.prisma.taskComment.update({
            where: { id },
            data: { message: dto.message },
            include: {
                sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            },
        });
    }
    async remove(id, requesterId) {
        const comment = await this.prisma.taskComment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException(`Comment ${id} not found`);
        if (comment.senderId !== requesterId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.prisma.taskComment.delete({ where: { id } });
        return { message: 'Comment deleted' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map