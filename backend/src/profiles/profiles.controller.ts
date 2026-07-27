import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('User Profiles Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('client')
  @ApiOperation({ summary: 'Get current user client dashboard profile' })
  @ApiResponse({ status: 200, description: 'Client profile retrieved successfully.' })
  async getClientProfile(@CurrentUser() user: JwtPayload) {
    return this.profilesService.getClientProfile(user.sub);
  }

  @Put('client')
  @ApiOperation({ summary: 'Update current user client dashboard profile' })
  @ApiResponse({ status: 200, description: 'Client profile updated successfully.' })
  async updateClientProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateClientProfileDto) {
    return this.profilesService.updateClientProfile(user.sub, dto);
  }
}
