import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(UsersService.name);
  }

  // Foundation scaffolding - business CRUD methods will be implemented in Phase 5
  async findByEmail(email: string) {
    this.logger.debug(`Searching user by email: ${email}`);
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    this.logger.debug(`Searching user by id: ${id}`);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return this.checkEntityExists(user, 'User', id);
  }
}
