import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { SendMessageDto, CreateConversationDto } from './dto/chat.dto';

@Injectable()
export class ChatService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ChatService');
  }

  private readonly conversationInclude = {
    participants: {
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    },
    project: { select: { id: true, name: true, status: true } },
    supportTicket: { select: { id: true, ticketNumber: true, subject: true } },
  };

  async findUserConversations(userId: string, page = 1, limit = 20) {
    const where = {
      participants: { some: { userId } },
    };

    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          ...this.conversationInclude,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { firstName: true, lastName: true } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, requesterId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: this.conversationInclude,
    });
    if (!conversation) throw new NotFoundException(`Conversation ${id} not found`);

    // Access control: only participants can view
    const isParticipant = conversation.participants.some((p) => p.userId === requesterId);
    if (!isParticipant) throw new ForbiddenException('You are not a participant in this conversation');

    return conversation;
  }

  /**
   * Conversations are otherwise freeform (any participants, created explicitly),
   * but a client has no way to know which staff member to pick. This gets-or-
   * creates the one SUPPORT_ROOM conversation between a client and their assigned
   * account manager — or, if none is assigned, every SUPER_ADMIN — so "Messages"
   * always has somewhere real to send to.
   */
  async getOrCreateSupportConversation(clientUserId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { type: 'SUPPORT_ROOM', participants: { some: { userId: clientUserId } } },
      include: this.conversationInclude,
      orderBy: { createdAt: 'desc' },
    });
    if (existing) return existing;

    const clientProfile = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });

    const staffIds: string[] = [];
    if (clientProfile?.accountManagerId) {
      staffIds.push(clientProfile.accountManagerId);
    } else {
      const admins = await this.prisma.user.findMany({
        where: { role: { slug: 'SUPER_ADMIN' }, deletedAt: null },
        select: { id: true },
        take: 3,
      });
      staffIds.push(...admins.map((admin) => admin.id));
    }

    const participantIds = [...new Set([clientUserId, ...staffIds])];

    return this.prisma.conversation.create({
      data: {
        title: 'Support',
        type: 'SUPPORT_ROOM',
        participants: { create: participantIds.map((userId) => ({ userId })) },
      },
      include: this.conversationInclude,
    });
  }

  /** Admin-facing: every SUPPORT_ROOM conversation, not just ones the requester participates in. */
  async findAllSupportConversations(page = 1, limit = 20) {
    const where = { type: 'SUPPORT_ROOM' };

    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          ...this.conversationInclude,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { firstName: true, lastName: true } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /** Lets a staff member with chat.manage open (and thereby join) a support conversation they weren't originally added to — a shared-inbox style "claim". */
  async adminJoinSupportConversation(conversationId: string, staffUserId: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException(`Conversation ${conversationId} not found`);
    if (conversation.type !== 'SUPPORT_ROOM') {
      throw new ForbiddenException('Only support conversations can be joined this way');
    }

    await this.prisma.participant.upsert({
      where: { conversationId_userId: { conversationId, userId: staffUserId } },
      create: { conversationId, userId: staffUserId },
      update: {},
    });

    return this.findOne(conversationId, staffUserId);
  }

  async createConversation(dto: CreateConversationDto, creatorId: string) {
    // Ensure creator is in participant list
    const allParticipants = [...new Set([...dto.participantIds, creatorId])];

    const conversation = await this.prisma.conversation.create({
      data: {
        title: dto.title ?? null,
        type: dto.projectId ? 'PROJECT_ROOM' : dto.supportTicketId ? 'SUPPORT_ROOM' : 'DIRECT',
        projectId: dto.projectId ?? null,
        supportTicketId: dto.supportTicketId ?? null,
        participants: {
          create: allParticipants.map((userId) => ({ userId })),
        },
      },
      include: this.conversationInclude,
    });

    return conversation;
  }

  async getMessages(conversationId: string, requesterId: string, page = 1, limit = 50) {
    // Verify participant access
    await this.findOne(conversationId, requesterId);

    const where = { conversationId, deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          attachments: {
            include: { mediaAsset: { select: { id: true, cdnUrl: true, mimeType: true, originalName: true } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async sendMessage(dto: SendMessageDto, senderId: string) {
    // Verify sender is participant
    await this.findOne(dto.conversationId, senderId);

    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        senderId,
        conversationId: dto.conversationId,
        attachments: dto.attachmentIds?.length
          ? {
              create: dto.attachmentIds.map((mediaAssetId) => ({ mediaAssetId })),
            }
          : undefined,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        attachments: { include: { mediaAsset: { select: { id: true, cdnUrl: true, originalName: true } } } },
      },
    });

    // Update conversation's updatedAt for ordering
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.findOne(conversationId, userId);

    await this.prisma.participant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    });

    return { marked: true };
  }

  async softDeleteMessage(messageId: string, requesterId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException(`Message ${messageId} not found`);
    if (message.senderId !== requesterId) {
      throw new ForbiddenException('You can only delete your own messages');
    }
    return this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date(), content: '[Message deleted]' },
    });
  }

  async addParticipant(conversationId: string, userId: string, requesterId: string) {
    await this.findOne(conversationId, requesterId);
    return this.prisma.participant.upsert({
      where: { conversationId_userId: { conversationId, userId } },
      create: { conversationId, userId },
      update: {},
    });
  }
}
