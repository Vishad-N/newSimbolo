import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { BusinessInsight, InsightQueryDto } from './dto/insight.dto';
export declare class InsightsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateInsights(): Promise<BusinessInsight[]>;
    findInsights(query?: InsightQueryDto): Promise<{
        data: BusinessInsight[];
        meta: {
            total: number;
        };
    }>;
}
