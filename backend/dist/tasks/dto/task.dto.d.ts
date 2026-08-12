import { TaskStatusEnum, TaskPriorityEnum } from '@prisma/client';
export declare class CreateTaskDto {
    projectId: string;
    milestoneId?: string;
    title: string;
    description?: string;
    assignedToId?: string;
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    estimatedHours?: number;
    dueDate?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    assignedToId?: string;
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    estimatedHours?: number;
    actualHours?: number;
    progress?: number;
    dueDate?: string;
    milestoneId?: string;
}
export declare class AddTaskCommentDto {
    message: string;
}
