import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AiService } from './ai.service';
import { AiGenerationDto } from './dto/ai.dto';
import { AiSearchDto } from './dto/ai-search.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('capabilities')
  @ApiBearerAuth('JWT-auth')
  @Permissions('ai.use')
  @ApiOperation({ summary: 'List available AI content and recommendation capabilities' })
  getCapabilities() {
    return this.aiService.getCapabilities();
  }

  @Post('generate')
  @ApiBearerAuth('JWT-auth')
  @Permissions('ai.use')
  @ApiOperation({ summary: 'Generate AI-assisted content using the configured AI provider abstraction' })
  generate(@Body() dto: AiGenerationDto) {
    return this.aiService.generate(dto);
  }

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Generate AI-assisted search response using Gemini' })
  search(@Body() dto: AiSearchDto) {
    return this.aiService.search(dto);
  }

  @Post('sync-embeddings')
  @ApiBearerAuth('JWT-auth')
  @Permissions('ai.manage')
  @ApiOperation({ summary: 'Queue embedding generation for all existing records' })
  syncEmbeddings() {
    return this.aiService.triggerInitialEmbeddingSync();
  }
}
