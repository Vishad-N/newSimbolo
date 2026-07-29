import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { SearchQueryDto } from './dto/search.dto';
import { SearchService } from './search.service';

@ApiTags('Search')
@ApiBearerAuth('JWT-auth')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Permissions('dashboard.view')
  @ApiOperation({
    summary:
      'Enterprise-wide ranked search across clients, projects, orders, content, media, tickets, and team members',
  })
  search(@Query() query: SearchQueryDto, @CurrentUser() user: JwtPayload) {
    return this.searchService.search(query, user?.sub);
  }

  @Get('recent')
  @Permissions('dashboard.view')
  @ApiOperation({ summary: 'Recent searches for the current user' })
  recent(@CurrentUser() user: JwtPayload) {
    return this.searchService.recentSearches(user.sub);
  }
}
