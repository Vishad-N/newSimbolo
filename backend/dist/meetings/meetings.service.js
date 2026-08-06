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
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let MeetingsService = class MeetingsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('MeetingsService');
        this.prisma = prisma;
    }
    meetingInclude = {
        host: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        client: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
        participants: {
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        },
        calendarEvent: true,
    };
    async findAll(clientId, hostId, upcoming = false, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (clientId)
            where.clientId = clientId;
        if (hostId)
            where.hostId = hostId;
        if (upcoming)
            where.startTime = { gte: new Date() };
        const [data, total] = await Promise.all([
            this.prisma.meeting.findMany({
                where,
                include: this.meetingInclude,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { startTime: 'asc' },
            }),
            this.prisma.meeting.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const meeting = await this.prisma.meeting.findFirst({
            where: { id, deletedAt: null },
            include: this.meetingInclude,
        });
        return this.checkEntityExists(meeting, 'Meeting', id);
    }
    async create(dto, createdBy) {
        const host = await this.prisma.user.findUnique({ where: { id: dto.hostId } });
        if (!host)
            throw new common_1.NotFoundException(`Host user ${dto.hostId} not found`);
        const meeting = await this.prisma.meeting.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                agenda: dto.agenda ?? null,
                startTime: new Date(dto.startTime),
                endTime: new Date(dto.endTime),
                timezone: dto.timezone ?? 'Asia/Kolkata',
                meetUrl: dto.meetUrl ?? null,
                hostId: dto.hostId,
                clientId: dto.clientId ?? null,
                createdBy: createdBy ?? null,
            },
            include: this.meetingInclude,
        });
        // Add participants
        if (dto.participantIds && dto.participantIds.length > 0) {
            await this.prisma.meetingParticipant.createMany({
                data: dto.participantIds.map((userId) => ({
                    meetingId: meeting.id,
                    userId,
                    status: 'INVITED',
                })),
                skipDuplicates: true,
            });
        }
        // Log activity
        if (dto.clientId) {
            await this.prisma.timeline.create({
                data: {
                    title: `Meeting "${meeting.title}" scheduled`,
                    description: `Meeting scheduled for ${new Date(dto.startTime).toLocaleDateString()}`,
                    eventType: 'MEETING_SCHEDULED',
                    clientId: dto.clientId,
                    meetingId: meeting.id,
                },
            });
        }
        return meeting;
    }
    async update(id, dto, updatedBy) {
        await this.findOne(id);
        return this.prisma.meeting.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.agenda !== undefined && { agenda: dto.agenda }),
                ...(dto.meetingNotes !== undefined && { meetingNotes: dto.meetingNotes }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.startTime !== undefined && { startTime: new Date(dto.startTime) }),
                ...(dto.endTime !== undefined && { endTime: new Date(dto.endTime) }),
                ...(dto.meetUrl !== undefined && { meetUrl: dto.meetUrl }),
                updatedBy: updatedBy ?? null,
            },
            include: this.meetingInclude,
        });
    }
    async softDelete(id, deletedBy) {
        await this.findOne(id);
        await this.prisma.meeting.update({
            where: { id },
            data: { deletedAt: new Date(), status: client_1.MeetingStatusEnum.CANCELLED, updatedBy: deletedBy ?? null },
        });
        return { message: `Meeting ${id} cancelled` };
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map