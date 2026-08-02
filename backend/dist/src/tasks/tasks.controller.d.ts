import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import { TaskStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
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
        progress: number;
        description: string | null;
        title: string;
        assignedToId: string | null;
        projectId: string;
        estimatedHours: number | null;
        actualHours: number | null;
        dueDate: Date | null;
        milestoneId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TaskStatusEnum;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.TaskPriorityEnum;
        progress: number;
        description: string | null;
        title: string;
        assignedToId: string | null;
        projectId: string;
        estimatedHours: number | null;
        actualHours: number | null;
        dueDate: Date | null;
        milestoneId: string | null;
    }>;
    create(dto: CreateTaskDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TaskStatusEnum;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.TaskPriorityEnum;
        progress: number;
        description: string | null;
        title: string;
        assignedToId: string | null;
        projectId: string;
        estimatedHours: number | null;
        actualHours: number | null;
        dueDate: Date | null;
        milestoneId: string | null;
    }>;
    update(id: string, dto: UpdateTaskDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TaskStatusEnum;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        priority: import(".prisma/client").$Enums.TaskPriorityEnum;
        progress: number;
        description: string | null;
        title: string;
        assignedToId: string | null;
        projectId: string;
        estimatedHours: number | null;
        actualHours: number | null;
        dueDate: Date | null;
        milestoneId: string | null;
    }>;
    addComment(id: string, dto: AddTaskCommentDto, user: JwtPayload): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
