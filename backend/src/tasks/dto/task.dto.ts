import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { TaskStatusEnum, TaskPriorityEnum } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Milestone UUID (optional)' })
  @IsOptional()
  @IsUUID('4')
  milestoneId?: string;

  @ApiProperty({ example: 'Create wireframes for homepage', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Create low-fidelity wireframes for the homepage hero and feature sections',
    description: 'Task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Assigned user UUID' })
  @IsOptional()
  @IsUUID('4')
  assignedToId?: string;

  @ApiPropertyOptional({ enum: TaskStatusEnum, default: TaskStatusEnum.TODO, description: 'Task status' })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @ApiPropertyOptional({ enum: TaskPriorityEnum, default: TaskPriorityEnum.MEDIUM, description: 'Task priority' })
  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @ApiPropertyOptional({ example: 8, description: 'Estimated hours to complete' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @ApiPropertyOptional({ example: '2026-08-10T00:00:00.000Z', description: 'Task due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Assigned user UUID' })
  @IsOptional()
  @IsUUID('4')
  assignedToId?: string;

  @ApiPropertyOptional({ enum: TaskStatusEnum, description: 'Task status' })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @ApiPropertyOptional({ enum: TaskPriorityEnum, description: 'Task priority' })
  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @ApiPropertyOptional({ example: 8, description: 'Estimated hours' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @ApiPropertyOptional({ example: 6.5, description: 'Actual hours spent' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHours?: number;

  @ApiPropertyOptional({ example: 75, description: 'Progress percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: '2026-08-10T00:00:00.000Z', description: 'Task due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Milestone UUID' })
  @IsOptional()
  @IsUUID('4')
  milestoneId?: string;
}

export class AddTaskCommentDto {
  @ApiProperty({ example: 'I have completed the wireframes. Please review.', description: 'Comment message' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
