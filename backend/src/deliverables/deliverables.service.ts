import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateDeliverableDto, UpdateDeliverableDto } from './dto/deliverable.dto';
import { Deliverable, DeliverableStatusEnum } from '@prisma/client';

@Injectable()
export class DeliverablesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('DeliverablesService');
  }

  private readonly deliverableInclude = {
    project: { select: { id: true, name: true, clientId: true } },
    mediaAsset: { select: { id: true, cdnUrl: true, fileName: true, mimeType: true, sizeBytes: true } },
    versionHistory: {
      include: { mediaAsset: { select: { id: true, cdnUrl: true, fileName: true } } },
      orderBy: { versionNumber: 'asc' as const },
    },
  };

  async findAll(projectId: string, status?: DeliverableStatusEnum) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    const where: any = { projectId, deletedAt: null };
    if (status) where.status = status;

    return this.prisma.deliverable.findMany({
      where,
      include: this.deliverableInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Deliverable> {
    const deliverable = await this.prisma.deliverable.findFirst({
      where: { id, deletedAt: null },
      include: this.deliverableInclude,
    });
    return this.checkEntityExists(deliverable, 'Deliverable', id);
  }

  async create(dto: CreateDeliverableDto, createdBy?: string): Promise<Deliverable> {
    const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${dto.projectId} not found`);

    const deliverable = await this.prisma.deliverable.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description ?? null,
        mediaAssetId: dto.mediaAssetId ?? null,
        status: DeliverableStatusEnum.PENDING,
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

  async update(id: string, dto: UpdateDeliverableDto, updatedBy?: string): Promise<Deliverable> {
    const existing = (await this.findOne(id)) as any;

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

    const nowSubmitted =
      dto.status === DeliverableStatusEnum.SUBMITTED && existing.status !== DeliverableStatusEnum.SUBMITTED;
    const nowApproved =
      dto.status === DeliverableStatusEnum.APPROVED && existing.status !== DeliverableStatusEnum.APPROVED;

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

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.deliverable.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy ?? null },
    });
    return { message: `Deliverable ${id} removed` };
  }
}
