import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { SearchQueryDto, SearchResultItem } from './dto/search.dto';
export declare class SearchService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(query: SearchQueryDto, userId?: string): Promise<{
        data: SearchResultItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    recentSearches(userId: string): Promise<{
        data: {
            query: string;
            searchedAt: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    private score;
    private contains;
    private recordSearch;
    private searchClients;
    private searchCompanies;
    private searchProjects;
    private searchOrders;
    private searchServices;
    private searchPackages;
    private searchBlogs;
    private searchCaseStudies;
    private searchMedia;
    private searchTickets;
    private searchTeamMembers;
}
