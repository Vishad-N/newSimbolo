import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { StorageService } from '../storage/storage.service';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
import { Document, DocumentCategoryEnum } from '@prisma/client';
import { UserRole } from '../common/constants/role.constant';
import { BusinessException } from '../common/exceptions/custom.exceptions';

const STAFF_ROLES: string[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.PROJECT_MANAGER,
  UserRole.SUPPORT,
  UserRole.CONTENT_MANAGER,
  UserRole.MARKETING_MANAGER,
  UserRole.EDITOR,
];

@Injectable()
export class DocumentsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {
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

  /** Self-service listing: a client only ever sees their own documents, regardless of query params. */
  async findMyDocuments(userId: string, category?: DocumentCategoryEnum, page = 1, limit = 20) {
    const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client profile not found');
    return this.findAll(client.id, undefined, category, page, limit);
  }

  /**
   * Same as findOne, but scoped to the requester: a client can only fetch a
   * document tied to their own ClientProfile (or one with no client at all is
   * treated as staff-only). Staff roles can fetch any document. Returns 404 (not
   * 403) for a non-owned document so a client can't use this to confirm another
   * client's document ID exists.
   */
  async findOneForRequester(id: string, requester: { sub?: string; role?: string }): Promise<Document> {
    const doc = await this.findOne(id);
    const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
    const clientUserId = (doc as any).client?.user?.id;
    if (!isStaff && clientUserId !== requester.sub) {
      throw new NotFoundException(`Document ${id} not found`);
    }
    return doc;
  }

  /**
   * Uploads a real file to storage and registers it as a Document in one step.
   * A client caller always uploads to their OWN ClientProfile — any clientId in
   * the DTO is ignored for non-staff requesters, same ownership rule as reads.
   */
  async uploadDocument(
    file: Express.Multer.File | undefined,
    dto: UploadDocumentDto,
    requester: { sub?: string; role?: string },
  ): Promise<Document> {
    if (!file) {
      throw new BusinessException('No file provided for upload');
    }

    const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
    let clientId: string | null = dto.clientId ?? null;

    if (!isStaff) {
      const client = await this.prisma.clientProfile.findFirst({
        where: { userId: requester.sub, deletedAt: null },
      });
      if (!client) throw new NotFoundException('Client profile not found');
      clientId = client.id;
    }

    const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '') || 'bin';
    const storageKey = `documents/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
    const stored = await this.storageService.upload(file, storageKey);

    return this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        category: dto.category ?? DocumentCategoryEnum.OTHER,
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
