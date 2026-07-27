import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';

@Injectable()
export class PermissionsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(PermissionsService.name);
  }

  async findAll() {
    this.logger.debug('Retrieving all permissions');
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { name: 'asc' }],
    });
  }

  async findByModule(module: string) {
    this.logger.debug(`Retrieving permissions for module: ${module}`);
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const perm = await this.prisma.permission.findUnique({
      where: { id },
    });
    return this.checkEntityExists(perm, 'Permission', id);
  }
}
