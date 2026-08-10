import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    findAll(clientId?: string, hostId?: string, upcoming?: boolean, page?: number, limit?: number): Promise<{
        data: ({
            calendarEvent: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                provider: string;
                meetingId: string;
                externalEventId: string;
                syncStatus: string;
                htmlLink: string | null;
            } | null;
            host: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
            client: ({
                user: {
                    email: string;
                    id: string;
                    firstName: string;
                    lastName: string;
                };
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
                state: string | null;
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
            }) | null;
            participants: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                email: string | null;
                id: string;
                userId: string | null;
                status: string;
                meetingId: string;
                joinedAt: Date;
            })[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.MeetingStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            description: string | null;
            title: string;
            timezone: string;
            clientId: string | null;
            startTime: Date;
            agenda: string | null;
            endTime: Date;
            meetUrl: string | null;
            hostId: string;
            meetingNotes: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MeetingStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        title: string;
        timezone: string;
        clientId: string | null;
        startTime: Date;
        agenda: string | null;
        endTime: Date;
        meetUrl: string | null;
        hostId: string;
        meetingNotes: string | null;
    }>;
    create(dto: CreateMeetingDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MeetingStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        title: string;
        timezone: string;
        clientId: string | null;
        startTime: Date;
        agenda: string | null;
        endTime: Date;
        meetUrl: string | null;
        hostId: string;
        meetingNotes: string | null;
    }>;
    update(id: string, dto: UpdateMeetingDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MeetingStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        title: string;
        timezone: string;
        clientId: string | null;
        startTime: Date;
        agenda: string | null;
        endTime: Date;
        meetUrl: string | null;
        hostId: string;
        meetingNotes: string | null;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
