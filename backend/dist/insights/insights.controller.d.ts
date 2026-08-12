import { InsightQueryDto } from './dto/insight.dto';
import { InsightsService } from './insights.service';
export declare class InsightsController {
    private readonly insightsService;
    constructor(insightsService: InsightsService);
    generate(): Promise<import("./dto/insight.dto").BusinessInsight[]>;
    findAll(query: InsightQueryDto): Promise<{
        data: import("./dto/insight.dto").BusinessInsight[];
        meta: {
            total: number;
        };
    }>;
}
