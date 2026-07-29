import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AiService } from './ai.service';
import { AiGenerationDto } from './dto/ai.dto';

@ApiTags('AI')
@ApiBearerAuth('JWT-auth')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('capabilities')
  @Permissions('ai.use')
  @ApiOperation({ summary: 'List available AI content and recommendation capabilities' })
  getCapabilities() {
    return this.aiService.getCapabilities();
  }

  @Post('generate')
  @Permissions('ai.use')
  @ApiOperation({ summary: 'Generate AI-assisted content using the configured AI provider abstraction' })
  generate(@Body() dto: AiGenerationDto) {
    return this.aiService.generate(dto);
  }
}
