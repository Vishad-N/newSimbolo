import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateCommentDto, UpdateCommentDto, CommentEntityType } from './dto/comment.dto';

@Injectable()
export class CommentsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('CommentsService');
  }

  async create(dto: CreateCommentDto, senderId: string) {
    if (dto.entityType === CommentEntityType.TASK) {
      const task = await this.prisma.task.findUnique({ where: { id: dto.entityId } });
      if (!task) throw new NotFoundException(`Task ${dto.entityId} not found`);

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

    throw new BadRequestException(`Unsupported entity type: ${dto.entityType}`);
  }

  async findByEntity(entityType: CommentEntityType, entityId: string, page = 1, limit = 50) {
    if (entityType === CommentEntityType.TASK) {
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

    throw new BadRequestException(`Unsupported entity type: ${entityType}`);
  }

  async update(id: string, dto: UpdateCommentDto, requesterId: string) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);
    if (comment.senderId !== requesterId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.taskComment.update({
      where: { id },
      data: { message: dto.message },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });
  }

  async remove(id: string, requesterId: string) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);
    if (comment.senderId !== requesterId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.taskComment.delete({ where: { id } });
    return { message: 'Comment deleted' };
  }
}
