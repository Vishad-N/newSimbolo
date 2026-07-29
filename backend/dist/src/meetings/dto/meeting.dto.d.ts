import { MeetingStatusEnum } from '@prisma/client';
export declare class CreateMeetingDto {
    title: string;
    description?: string;
    agenda?: string;
    startTime: string;
    endTime: string;
    timezone?: string;
    meetUrl?: string;
    hostId: string;
    clientId?: string;
    participantIds?: string[];
}
export declare class UpdateMeetingDto {
    title?: string;
    description?: string;
    agenda?: string;
    meetingNotes?: string;
    status?: MeetingStatusEnum;
    startTime?: string;
    endTime?: string;
    meetUrl?: string;
}
