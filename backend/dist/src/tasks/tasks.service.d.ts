import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import { Task, TaskStatusEnum } from '@prisma/client';
export declare class TasksService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly taskInclude;
    findAll(projectId: string, status?: TaskStatusEnum, assignedToId?: string): Promise<({
        _count: {
            attachments: number;
            comments: number;
        };
        assignee: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        } | null;
        milestone: {
            id: string;
            status: import(".prisma/client").$Enums.MilestoneStatusEnum;
            title: string;
        } | null;
        comments: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            senderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TaskStatusEnum;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.TaskPriorityEnum;
        description: string | null;
        title: string;
        progress: number;
        assignedToId: string | null;
        projectId: string;
        estimatedHours: number | null;
        actualHours: number | null;
        dueDate: Date | null;
        milestoneId: string | null;
    })[]>;
    findOne(id: string): Promise<Task>;
    create(dto: CreateTaskDto, createdBy?: string): Promise<Task>;
    update(id: string, dto: UpdateTaskDto, updatedBy?: string): Promise<Task>;
    addComment(taskId: string, dto: AddTaskCommentDto, senderId: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
