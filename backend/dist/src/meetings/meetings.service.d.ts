import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { Meeting } from '@prisma/client';
export declare class MeetingsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly meetingInclude;
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
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
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
    findOne(id: string): Promise<Meeting>;
    create(dto: CreateMeetingDto, createdBy?: string): Promise<Meeting>;
    update(id: string, dto: UpdateMeetingDto, updatedBy?: string): Promise<Meeting>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}
