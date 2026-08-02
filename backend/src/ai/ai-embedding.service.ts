import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueService } from '../queues/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface EmbeddingJob extends Record<string, unknown> {
  entityType: 'Service' | 'Package' | 'User' | 'Blog' | 'CaseStudy' | 'Testimonial';
  entityId: string;
  textToEmbed: string;
}

@Injectable()
export class AiEmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(AiEmbeddingService.name);
  private genAI: GoogleGenerativeAI;
  
  constructor(
    private readonly queueService: QueueService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  onModuleInit() {
    this.queueService.registerWorker<EmbeddingJob>('ai', async (job) => {
      await this.processEmbeddingJob(job.data);
    });
  }

  async queueEmbeddingGeneration(entityType: EmbeddingJob['entityType'], entityId: string, textToEmbed: string) {
    return this.queueService.add<EmbeddingJob>('ai', `embed-${entityType}-${entityId}`, {
      entityType,
      entityId,
      textToEmbed
    });
  }

  public async getEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  private async processEmbeddingJob(data: EmbeddingJob) {
    this.logger.log(`Generating embedding for ${data.entityType} ${data.entityId}`);
    try {
      const embedding = await this.getEmbedding(data.textToEmbed);
      
      const tableNameMap: Record<string, string> = {
        'Service': 'Service',
        'Package': 'Package',
        'User': 'User',
        'Blog': 'Blog',
        'CaseStudy': 'CaseStudy',
        'Testimonial': 'Testimonial',
      };
      
      const tableName = tableNameMap[data.entityType];
      if (!tableName) throw new Error(`Unknown entity type ${data.entityType}`);

      const vectorString = `[${embedding.join(',')}]`;
      await this.prisma.$executeRawUnsafe(
        `UPDATE "${tableName}" SET embedding = $1::vector WHERE id = $2`, 
        vectorString, 
        data.entityId
      );
      
      this.logger.log(`Successfully embedded ${data.entityType} ${data.entityId}`);
    } catch (error: any) {
      this.logger.error(`Failed to generate embedding for ${data.entityType} ${data.entityId}: ${error.message}`);
      throw error;
    }
  }
}
