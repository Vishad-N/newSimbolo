import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { Document, DocumentCategoryEnum } from '@prisma/client';

@Injectable()
export class DocumentsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('DocumentsService');
  }

  async findAll(clientId?: string, projectId?: string, category?: DocumentCategoryEnum, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;
    if (category) where.category = category;

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

  async findOne(id: string): Promise<Document> {
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

  async create(dto: CreateDocumentDto, uploadedById?: string): Promise<Document> {
    return this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        category: dto.category ?? DocumentCategoryEnum.OTHER,
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

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
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

  async trackDownload(id: string): Promise<Document> {
    const doc = await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }

  async softDelete(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: `Document ${id} deleted` };
  }
}
