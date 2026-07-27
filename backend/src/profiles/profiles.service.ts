import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditService } from '../shared/audit/audit.service';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';

@Injectable()
export class ProfilesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    super(ProfilesService.name);
  }

  async getClientProfile(userId: string) {
    this.logger.debug(`Retrieving client profile for user: ${userId}`);
    let profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        company: true,
      },
    });

    if (!profile) {
      profile = await this.prisma.clientProfile.create({
        data: {
          userId,
        },
        include: { company: true },
      });
    }

    return profile;
  }

  async updateClientProfile(userId: string, dto: UpdateClientProfileDto) {
    this.logger.debug(`Updating client profile for user: ${userId}`);
    const existing = await this.getClientProfile(userId);

    const updated = await this.prisma.clientProfile.update({
      where: { userId },
      data: {
        ...dto,
        updatedBy: userId,
      },
      include: { company: true },
    });

    await this.auditService.logEvent({
      userId,
      action: 'CLIENT_PROFILE_UPDATED',
      entityType: 'ClientProfile',
      entityId: existing.id,
      oldValue: { gstNumber: existing.gstNumber, billingAddress: existing.billingAddress },
      newValue: dto,
    });

    return updated;
  }
}
