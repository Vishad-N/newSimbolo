import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, CommentEntityType } from './dto/comment.dto';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment on a task or entity' })
  create(@Body() dto: CreateCommentDto, @Request() req: any) {
    return this.commentsService.create(dto, req.user?.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List comments for an entity' })
  @ApiQuery({ name: 'entityType', required: true, enum: CommentEntityType })
  @ApiQuery({ name: 'entityId', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByEntity(
    @Query('entityType') entityType: CommentEntityType,
    @Query('entityId') entityId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.commentsService.findByEntity(entityType, entityId, page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit own comment' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCommentDto, @Request() req: any) {
    return this.commentsService.update(id, dto, req.user?.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete own comment' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.commentsService.remove(id, req.user?.sub);
  }
}
