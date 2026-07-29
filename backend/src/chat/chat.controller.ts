import {
  Controller,
  Get,
  Post,
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
import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  createConversation(@Body() dto: CreateConversationDto, @Request() req: any) {
    return this.chatService.createConversation(dto, req.user?.sub);
  }

  @Get('conversations')
  @ApiOperation({ summary: "Get current user's conversations" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyConversations(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.chatService.findUserConversations(req.user?.sub, page, limit);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation detail (participants, project/ticket binding)' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.chatService.findOne(id, req.user?.sub);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get paginated message history for a conversation' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.chatService.getMessages(id, req.user?.sub, page, limit);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message (REST fallback when WebSocket not available)' })
  sendMessage(@Param('id', ParseUUIDPipe) conversationId: string, @Body() dto: SendMessageDto, @Request() req: any) {
    return this.chatService.sendMessage({ ...dto, conversationId }, req.user?.sub);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark conversation as read' })
  markAsRead(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.chatService.markAsRead(id, req.user?.sub);
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Soft delete own message' })
  @HttpCode(HttpStatus.OK)
  deleteMessage(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.chatService.softDeleteMessage(id, req.user?.sub);
  }
}
