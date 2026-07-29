import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { Meeting, MeetingStatusEnum } from '@prisma/client';

@Injectable()
export class MeetingsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('MeetingsService');
  }

  private readonly meetingInclude = {
    host: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
    client: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
    participants: {
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    },
    calendarEvent: true,
  };

  async findAll(clientId?: string, hostId?: string, upcoming = false, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (hostId) where.hostId = hostId;
    if (upcoming) where.startTime = { gte: new Date() };

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

  async findOne(id: string): Promise<Meeting> {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, deletedAt: null },
      include: this.meetingInclude,
    });
    return this.checkEntityExists(meeting, 'Meeting', id);
  }

  async create(dto: CreateMeetingDto, createdBy?: string): Promise<Meeting> {
    const host = await this.prisma.user.findUnique({ where: { id: dto.hostId } });
    if (!host) throw new NotFoundException(`Host user ${dto.hostId} not found`);

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

  async update(id: string, dto: UpdateMeetingDto, updatedBy?: string): Promise<Meeting> {
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

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.meeting.update({
      where: { id },
      data: { deletedAt: new Date(), status: MeetingStatusEnum.CANCELLED, updatedBy: deletedBy ?? null },
    });
    return { message: `Meeting ${id} cancelled` };
  }
}
