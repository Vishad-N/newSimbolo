import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  intentDetected?: string;
  createdAt?: string;
}

export interface SessionMemoryData {
  sessionId: string;
  userId?: string;
  history: ChatMessage[];
  metadata: {
    budget?: string;
    industry?: string;
    preferredServices?: string[];
    goals?: string[];
    [key: string]: any;
  };
}

@Injectable()
export class SessionMemory {
  private readonly logger = new Logger(SessionMemory.name);
  
  constructor(
    private readonly cacheService: CacheService,
    private readonly prisma: PrismaService,
  ) {}

  async getSession(sessionId: string, userId?: string): Promise<SessionMemoryData> {
    const cacheKey = `ai:session:${sessionId}`;
    let session = await this.cacheService.get<SessionMemoryData>(cacheKey);
    
    if (!session) {
      const dbConversation = await this.prisma.aiConversation.findFirst({
        where: { sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      
      if (dbConversation) {
        session = {
          sessionId: dbConversation.sessionId,
          userId: dbConversation.userId || userId,
          history: dbConversation.messages.map(m => ({
            role: m.role as any,
            content: m.content,
            intentDetected: m.intentDetected || undefined,
            createdAt: m.createdAt.toISOString()
          })),
          metadata: (dbConversation.metadata as any) || {}
        };
      } else {
        session = {
          sessionId,
          userId,
          history: [],
          metadata: {}
        };
      }
      
      await this.saveSessionToCache(session);
    }
    
    if (userId && session.userId !== userId) {
      session.userId = userId;
      await this.saveSessionToCache(session);
    }

    return session;
  }

  async saveSessionToCache(session: SessionMemoryData) {
    const cacheKey = `ai:session:${session.sessionId}`;
    await this.cacheService.set(cacheKey, session, 86400); // 24 hours
  }

  async appendMessage(sessionId: string, message: ChatMessage, metadataUpdates?: Record<string, any>) {
    const session = await this.getSession(sessionId);
    session.history.push(message);
    
    if (metadataUpdates) {
      session.metadata = { ...session.metadata, ...metadataUpdates };
    }
    
    await this.saveSessionToCache(session);
    
    this.persistSession(session).catch(e => {
      this.logger.error(`Failed to persist session to DB: ${e.message}`);
    });
    
    return session;
  }
  
  async updateMetadata(sessionId: string, metadataUpdates: Record<string, any>) {
    const session = await this.getSession(sessionId);
    session.metadata = { ...session.metadata, ...metadataUpdates };
    await this.saveSessionToCache(session);
    this.persistSession(session).catch(() => {});
  }

  private async persistSession(session: SessionMemoryData) {
    let dbConversation = await this.prisma.aiConversation.findFirst({
      where: { sessionId: session.sessionId }
    });

    if (!dbConversation) {
      dbConversation = await this.prisma.aiConversation.create({
        data: {
          sessionId: session.sessionId,
          userId: session.userId,
          metadata: session.metadata as any,
          title: 'AI Consultation'
        }
      });
    } else {
      dbConversation = await this.prisma.aiConversation.update({
        where: { id: dbConversation.id },
        data: {
          userId: session.userId,
          metadata: session.metadata as any
        }
      });
    }

    const lastMessage = session.history[session.history.length - 1];
    if (lastMessage && !lastMessage.createdAt) { // Only insert if not already from DB
      await this.prisma.aiMessage.create({
        data: {
          conversationId: dbConversation.id,
          role: lastMessage.role,
          content: lastMessage.content,
          intentDetected: lastMessage.intentDetected
        }
      });
      lastMessage.createdAt = new Date().toISOString(); // mark as persisted
    }
  }
}
