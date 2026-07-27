import { CmsService } from '../cms.service';
import { UpdatePageSectionDto } from '../dto/update-page-section.dto';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
export declare class HomepageController {
    private readonly cmsService;
    private readonly category;
    constructor(cmsService: CmsService);
    getHomepage(): Promise<Record<string, any>>;
    getSection(sectionKey: string): Promise<any>;
    updateMultiple(sections: Record<string, any>, user: JwtPayload): Promise<Record<string, any>>;
    updateSection(dto: UpdatePageSectionDto, user: JwtPayload): Promise<any>;
    deleteSection(sectionKey: string): Promise<{
        success: boolean;
    }>;
}
