import { PrismaService } from '../../prisma/prisma.service';

export abstract class BaseRepository<TDelegate extends { findMany: any; findUnique: any; create: any; update: any }> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly delegate: TDelegate,
  ) {}

  async findMany(args?: any) {
    return this.delegate.findMany(args);
  }

  async findUnique(args: any) {
    return this.delegate.findUnique(args);
  }

  async create(args: any) {
    return this.delegate.create(args);
  }

  async update(args: any) {
    return this.delegate.update(args);
  }
}
