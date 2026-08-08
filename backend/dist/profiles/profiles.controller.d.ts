import { ProfilesService } from './profiles.service';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getClientProfile(user: JwtPayload): Promise<{
        company: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            slug: string;
            gstNumber: string | null;
            billingAddress: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            logoUrl: string | null;
            logoMediaId: string | null;
            primaryContactId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        agencyId: string | null;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        gstNumber: string | null;
        billingAddress: string | null;
        timezone: string;
        companyId: string | null;
        accountManagerId: string | null;
        notes: string | null;
    }>;
    updateClientProfile(user: JwtPayload, dto: UpdateClientProfileDto): Promise<{
        company: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            slug: string;
            gstNumber: string | null;
            billingAddress: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            logoUrl: string | null;
            logoMediaId: string | null;
            primaryContactId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        agencyId: string | null;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        gstNumber: string | null;
        billingAddress: string | null;
        timezone: string;
        companyId: string | null;
        accountManagerId: string | null;
        notes: string | null;
    }>;
}
