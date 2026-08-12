import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentOrchestrator } from './agent.orchestrator';
import { ChatRequestDto } from './conversation.dto';
import { SessionMemory } from './conversation.memory';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('AI Conversation')
@Controller('ai/chat')
export class ConversationController {
  constructor(
    private readonly orchestrator: AgentOrchestrator,
    private readonly memory: SessionMemory,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to the AI multi-agent system' })
  async chat(@Body() dto: ChatRequestDto) {
    return this.orchestrator.processMessage(dto.sessionId, dto.message, dto.context);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Retrieve chat history' })
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.memory.getSession(sessionId);
  }

  @Get('analytics/metrics')
  @ApiBearerAuth('JWT-auth')
  @Permissions('ai.manage')
  @ApiOperation({ summary: 'Get AI Interaction Analytics' })
  async getAnalytics() {
    const totalConversations = await this.prisma.aiConversation.count();
    const actions = await this.prisma.aiAnalytics.groupBy({
      by: ['actionType'],
      _count: {
        id: true,
      },
    });

    return {
      totalConversations,
      actions,
    };
  }
}
