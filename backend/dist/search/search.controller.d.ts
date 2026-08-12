import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { SearchQueryDto } from './dto/search.dto';
import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: SearchQueryDto, user: JwtPayload): Promise<{
        data: import("./dto/search.dto").SearchResultItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    recent(user: JwtPayload): Promise<{
        data: {
            query: string;
            searchedAt: string;
        }[];
        meta: {
            total: number;
        };
    }>;
}
